import '@storagehub/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';
import {
  StorageHubClient,
  initWasm,
  FileManager,
  ReplicationLevel,
} from '@storagehub-sdk/core';
import { createReadStream, createWriteStream, statSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { TypeRegistry } from '@polkadot/types';
import type { AccountId20, H256 } from '@polkadot/types/interfaces';
import {
  MspClient,
} from '@storagehub-sdk/msp-client';
import type { DownloadResult } from '@storagehub-sdk/msp-client';
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';


async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();

  // --- viem setup ---
  // Define DataHaven chain, as expected by viem
  const chain = defineChain({
    id: 55931,
    name: 'DataHaven Testnet',
    nativeCurrency: { name: 'Mock', symbol: 'MOCK', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://services.datahaven-testnet.network/testnet'] },
    },
  });

  // Define account from a private key
  const account = privateKeyToAccount('INSERT_PRIVATE_KEY_HERE' as `0x${string}`);

  // Create a wallet client using the defined chain, account, and RPC URL
  const walletClient = createWalletClient({
    chain,
    account,
    transport: http('https://services.datahaven-testnet.network/testnet'),
  });

  // Create a public client using the defined chain and RPC URL
  const publicClient = createPublicClient({
    chain,
    transport: http('https://services.datahaven-testnet.network/testnet'),
  });

  // --- Polkadot.js API setup ---
  const provider = new WsProvider('wss://services.datahaven-testnet.network/testnet');
  const polkadotApi: ApiPromise = await ApiPromise.create({
    provider,
    typesBundle: types,
    noInitWarn: true,
  });

  // --- Bucket creating logic ---
  const baseUrl = 'https://deo-dh-backend.testnet.datahaven-infra.network/';
  const httpConfig = { baseUrl: baseUrl };

  // Setup session provider for MSP authentication
  let sessionToken: string | undefined;
  const sessionProvider = async () =>
    sessionToken ? ({ token: sessionToken, user: { address: account.address } } as const) : undefined;

  // Connect to MSP Client
  const mspClient = await MspClient.connect(httpConfig, sessionProvider);

  // Check MSP Health Status
  const mspHealth = await mspClient.info.getHealth();
  console.log('MSP service health:', mspHealth);

  // Initialize StorageHub Client
  const storageHubClient = new StorageHubClient({
    rpcUrl: 'https://services.datahaven-testnet.network/testnet',
    chain: chain,
    walletClient: walletClient,
    filesystemContractAddress:
      '0x0000000000000000000000000000000000000404' as `0x${string}`,
  });

  // Derive bucket ID
  const bucketName = 'INSERT_BUCKET_NAME_HERE';
  const address = account.address;
  const bucketId = (await storageHubClient.deriveBucketId(
    address,
    bucketName
  )) as string;
  console.log('Derived bucket ID: ', bucketId);

  // Check that the bucket doesn't exist yet
  const bucketBeforeCreation = await polkadotApi.query.providers.buckets(
    bucketId
  );
  console.log(
    'Bucket before creation is empty: ',
    bucketBeforeCreation.isEmpty
  );

  // Get basic MSP information from the MSP including its ID
  const mspInfo = await mspClient.info.getInfo();
  const mspId = mspInfo.mspId as `0x${string}`;
  console.log('MSP ID:', mspId);

  // Choose one of the value props retrieved from the MSP
  const valueProps = await mspClient.info.getValuePropositions();
  if (!Array.isArray(valueProps) || valueProps.length === 0) {
    throw new Error('No value props available from this MSP.');
  }

  // For simplicity, this selects the first valueProp in the list
  const valueProp = valueProps[0];
  console.log('Chosen value prop: ', valueProp);

  // Get the ID of the chosen value prop
  const valuePropId = valueProp.id as `0x${string}`;
  console.log('Chosen value prop id: ', valuePropId);

  // Define if bucket should be private or public
  const isPrivate = false;

  // Create bucket on chain
  const txHash: `0x${string}` | undefined = await storageHubClient.createBucket(
    mspId as `0x${string}`,
    bucketName,
    isPrivate,
    valuePropId
  );
  console.log('createBucket() txHash:', txHash);
  if (!txHash) {
    throw new Error('createBucket() did not return a transaction hash');
  }

  // Wait for transaction receipt
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log('Bucket creation receipt:', receipt);
  if (receipt.status !== 'success') {
    throw new Error(`Bucket creation failed: ${txHash}`);
  }

  const bucketAfterCreation = await polkadotApi.query.providers.buckets(
    bucketId
  );
  console.log('Bucket after creation exists', !bucketAfterCreation.isEmpty);

  // Unwrap bucket in order to read its data
  const bucketData = bucketAfterCreation.unwrap();
  console.log('Bucket data:', bucketData);

  // Check if the retrieved bucket's MSP ID matches the initial MSP ID you retrieved
  console.log(
    'Bucket mspId matches initial mspId:',
    bucketData.mspId.toString() === mspId
  );
  // Check if the retrieved bucket's userId (owner address) matches the initial address you used to create the bucket
  console.log(
    'Bucket userId matches initial bucket owner address:',
    bucketData.userId.toString() === address
  );

  // Next section code here  

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
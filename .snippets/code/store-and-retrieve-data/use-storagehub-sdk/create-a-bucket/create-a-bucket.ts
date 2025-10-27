import '@storagehub/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';
import {
  HttpClientConfig,
  StorageHubClient,
  initWasm,
} from '@storagehub-sdk/core';
import {
  HealthStatus,
  InfoResponse,
  MspClient,
  ValueProp,
} from '@storagehub-sdk/msp-client';
import {
  Chain,
  PublicClient,
  WalletClient,
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
  const chain: Chain = defineChain({
    id: 1283,
    name: 'DataHaven Stagenet',
    nativeCurrency: { name: 'Have', symbol: 'HAVE', decimals: 18 },
    rpcUrls: {
      default: { http: ['TODO'] },
    },
  });

  // Define account from a private key
  const account = privateKeyToAccount('INSERT_PRIVATE_KEY' as `0x${string}`);

  // Create a wallet client using the defined chain, account, and RPC URL
  const walletClient: WalletClient = createWalletClient({
    chain,
    account,
    transport: http('TODO'),
  });

  // Create a public client using the defined chain and RPC URL
  const publicClient: PublicClient = createPublicClient({
    chain,
    transport: http('TODO'),
  });

  // --- Polkadot.js API setup ---
  const provider = new WsProvider('TODO');
  const polkadotApi: ApiPromise = await ApiPromise.create({
    provider,
    typesBundle: types,
    noInitWarn: true,
  });

  // --- Bucket creating logic ---
  // --8<-- [start:connect-msp-client]
  const baseUrl = 'TODO';
  const httpConfig: HttpClientConfig = { baseUrl: baseUrl };

  // Connect to MSP Client
  const mspClient = await MspClient.connect(httpConfig);

  // Check MSP Health Status
  const mspHealth: HealthStatus = await mspClient.info.getHealth();
  console.log('MSP service health:', mspHealth);
  // --8<-- [end:connect-msp-client]

  // --8<-- [start:storagehub-client]
  // Initialize StorageHub Client
  const storageHubClient = new StorageHubClient({
    rpcUrl: 'TODO',
    chain: chain,
    walletClient: walletClient,
    filesystemContractAddress:
      '0x0000000000000000000000000000000000000404' as `0x${string}`,
  });
  // --8<-- [end:storagehub-client]

  // --8<-- [start:derive-bucket]
  // Derive bucket ID
  const bucketName = 'init-bucket';
  const address = account.address;
  const bucketId = (await storageHubClient.deriveBucketId(
    address,
    bucketName
  )) as string;
  console.log('Derived bucket ID: ', bucketId);
  // --8<-- [end:derive-bucket]

  // --8<-- [start:check-bucket]
  // Check that the bucket doesn't exist yet
  const bucketBeforeCreation = await polkadotApi.query.providers.buckets(
    bucketId
  );
  console.log(
    'Bucket before creation is empty: ',
    bucketBeforeCreation.isEmpty
  );
  // --8<-- [end:check-bucket]

  // --8<-- [start:get-msp-params]
  // Get basic MSP information from the MSP including its ID
  const mspInfo: InfoResponse = await mspClient.info.getInfo();
  const mspId = mspInfo.mspId as `0x${string}`;
  console.log('MSP ID:', mspId);

  // Choose one of the value props retrieved from the MSP
  const valueProps: ValueProp[] = await mspClient.info.getValuePropositions();
  if (!Array.isArray(valueProps) || valueProps.length === 0) {
    throw new Error('No value props available from this MSP.');
  }

  // For simplicity, this selects the first valueProp in the list
  const valueProp = valueProps[0];
  console.log('Chosen value prop: ', valueProp);

  // Get the ID of the chosen value prop
  const valuePropId = valueProp.id as `0x${string}`;
  console.log('Chosen value prop id: ', valuePropId);
  // --8<-- [end:get-msp-params]

  // --8<-- [start:create-bucket]
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
  // --8<-- [end:create-bucket]

  // --8<-- [start:verify-bucket]
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
  // --8<-- [end:verify-bucket]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();

// --8<-- [start:imports]
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
// --8<-- [end:imports]

async function run() {
  // --8<-- [start:initialize-clients]
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();

  // --- viem setup ---
  // Define DataHaven chain, as expected by viem
  const chain: Chain = defineChain({
    id: 1288,
    name: 'DataHaven Testnet',
    nativeCurrency: { name: 'Have', symbol: 'HAVE', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://services.datahaven-testnet.network/testnet'] },
    },
  });

  // Define account from a private key
  const account = privateKeyToAccount('INSERT_PRIVATE_KEY' as `0x${string}`);
  const address = account.address;

  // Create a wallet client using the defined chain, account, and RPC URL
  const walletClient: WalletClient = createWalletClient({
    chain,
    account,
    transport: http('https://services.datahaven-testnet.network/testnet'),
  });

  // Create a public client using the defined chain and RPC URL
  const publicClient: PublicClient = createPublicClient({
    chain,
    transport: http('https://services.datahaven-testnet.network/testnet'),
  });

  // --- Polkadot.js API setup ---
  const provider = new WsProvider(
    'wss://services.datahaven-testnet.network/testnet'
  );
  const polkadotApi: ApiPromise = await ApiPromise.create({
    provider,
    typesBundle: types,
    noInitWarn: true,
  });
  // --8<-- [end:initialize-clients]

  // --- Bucket creating logic ---
  // --8<-- [start:connect-msp-client]
  const baseUrl = 'https://deo-dh-backend.testnet.datahaven-infra.network/';
  const httpConfig: HttpClientConfig = { baseUrl: baseUrl };
  // A temporary authentication token obtained after Sign-In with Ethereum (SIWE).
  // If not yet authenticated, this will remain undefined and the client will operate in read-only mode.
  // Authentication is not required for creating a bucket, but is required for file uploads and bucket management.
  let sessionToken: string | undefined = undefined;
  const sessionProvider = async () =>
    sessionToken
      ? ({ token: sessionToken, user: { address: address } } as const)
      : undefined;
  const mspClient = await MspClient.connect(httpConfig, sessionProvider);

  // Check MSP Health Status
  const mspHealth: HealthStatus = await mspClient.info.getHealth();
  console.log('MSP service health:', mspHealth);

  // Trigger the SIWE (Sign-In with Ethereum) flow.
  // This prompts the connected wallet to sign an EIP-4361 message,
  // which the MSP backend verifies to issue a JWT session token
  const siweSession = await mspClient.auth.SIWE(walletClient);
  console.log('SIWE Session:', siweSession);
  // Store the obtained session token for future authenticated requests
  sessionToken = (siweSession as { token: string }).token;

  // --8<-- [end:connect-msp-client]

  // --8<-- [start:storagehub-client]
  // Initialize StorageHub Client
  const storageHubClient = new StorageHubClient({
    rpcUrl: 'https://services.datahaven-testnet.network/testnet',
    chain: chain,
    walletClient: walletClient,
    filesystemContractAddress:
      '0x0000000000000000000000000000000000000404' as `0x${string}`,
  });
  // --8<-- [end:storagehub-client]

  // --8<-- [start:derive-bucket]
  // Derive bucket ID
  const bucketName = 'init-bucket';

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

// --8<-- [start:imports]
import '@storagehub/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';
import {
  HttpClientConfig,
  StorageHubClient,
  initWasm,
} from '@storagehub-sdk/core';
import { HealthStatus, MspClient, FileInfo } from '@storagehub-sdk/msp-client';
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
    id: 55931,
    name: 'DataHaven Testnet',
    nativeCurrency: { name: 'Mock', symbol: 'MOCK', decimals: 18 },
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

  // Initialize StorageHub Client
  const storageHubClient = new StorageHubClient({
    rpcUrl: 'https://services.datahaven-testnet.network/testnet',
    chain: chain,
    walletClient: walletClient,
    filesystemContractAddress:
      '0x0000000000000000000000000000000000000404' as `0x${string}`,
  });
  // --8<-- [end:initialize-clients]

  // --8<-- [start:connect-msp-client]
  const baseUrl = 'https://deo-dh-backend.testnet.datahaven-infra.network/';
  const httpConfig: HttpClientConfig = { baseUrl: baseUrl };
  // A temporary authentication token obtained after Sign-In with Ethereum (SIWE).
  // If not yet authenticated, this will remain undefined and the client will operate in read-only mode.
  // Authentication is not required for deleting a file or bucket, but is required for file uploads and bucket management.
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

  // --8<-- [start:request-file-deletion]

  const bucketId = 'INSERT_BUCKET_ID'; // `0x${string}`
  const fileKey = 'INSERT_FILE_KEY'; // `0x${string}`
  // If not in hex already convert it with .toHex()

  // Get file info before deletion
  const fileInfo: FileInfo = await mspClient.files.getFileInfo(
    bucketId,
    fileKey
  );
  console.log('File info before deletion:', fileInfo);

  let formattedFileInfo: any = fileInfo;
  ['fileKey', 'fingerprint', 'bucketId'].forEach(
    (k) => (formattedFileInfo[k] = '0x' + formattedFileInfo[k])
  );

  console.log('Formatted file info for deletion:', formattedFileInfo);

  // Request file deletion
  const txHashRequestDeleteFile: `0x${string}` =
    await storageHubClient.requestDeleteFile(formattedFileInfo);
  console.log('requestDeleteFile() txHash:', txHashRequestDeleteFile);

  // Wait for delete file transaction receipt
  const receiptRequestDeleteFile = await publicClient.waitForTransactionReceipt(
    {
      hash: txHashRequestDeleteFile,
    }
  );
  console.log('File deletion receipt:', receiptRequestDeleteFile);
  if (receiptRequestDeleteFile.status !== 'success') {
    throw new Error(`File deletion failed: ${txHashRequestDeleteFile}`);
  }

  console.log(
    `File with key ${fileKey} deleted successfully from bucket ${bucketId}`
  );
  // --8<-- [end:request-file-deletion]

  // --8<-- [start:delete-bucket]

  // Delete bucket
  const txHashDeleteBucket: `0x${string}` | undefined =
    await storageHubClient.deleteBucket(bucketId as `0x${string}`);
  console.log('deleteBucket() txHash:', txHashDeleteBucket);
  if (!txHashDeleteBucket) {
    throw new Error('deleteBucket() did not return a transaction hash');
  }

  // Wait for transaction
  const receiptDeleteBucket = await publicClient.waitForTransactionReceipt({
    hash: txHashDeleteBucket,
  });
  console.log('Bucket deletion receipt:', receiptDeleteBucket);
  if (receiptDeleteBucket.status !== 'success') {
    throw new Error(`Bucket deletion failed: ${txHashDeleteBucket}`);
  }
  // --8<-- [end:delete-bucket]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();

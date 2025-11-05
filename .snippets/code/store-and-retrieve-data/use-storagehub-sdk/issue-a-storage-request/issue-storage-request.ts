// --8<-- [start:imports]
import '@storagehub/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';
import {
  FileManager,
  HttpClientConfig,
  ReplicationLevel,
  StorageHubClient,
  initWasm,
} from '@storagehub-sdk/core';
import { HealthStatus, MspClient } from '@storagehub-sdk/msp-client';
import { createReadStream, statSync } from 'node:fs';
import { Readable } from 'node:stream';
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

  // --- Initialize MSP client ---
  // Base URL of the MSP backend you want to interact with.
  const baseUrl = 'https://deo-dh-backend.testnet.datahaven-infra.network/';

  // Configuration for the HTTP client used by the SDK internally.
  const httpConfig: HttpClientConfig = { baseUrl: baseUrl };

  // A temporary authentication token obtained after Sign-In with Ethereum (SIWE).
  // If not yet authenticated, this will remain undefined and the client will operate in read-only mode.
  // Authentication is not required for issuing storage requests, but is needed for other operations like bucket management.
  let sessionToken: string | undefined = undefined;

  // Provides the SDK with session data when available.
  // This callback is automatically invoked by the MSP Client whenever it needs to authenticate a request.
  const sessionProvider = async () =>
    sessionToken
      ? ({ token: sessionToken, user: { address: address } } as const)
      : undefined;

  // Create an instance of the MSP Client and establish connection with the backend.
  const mspClient = await MspClient.connect(httpConfig, sessionProvider);

  // Check MSP Health Status
  const mspHealth: HealthStatus = await mspClient.info.getHealth();
  console.log('MSP service health:', mspHealth);

  // --- Initialize StorageHub client ---
  const storageHubClient = new StorageHubClient({
    rpcUrl: 'https://services.datahaven-testnet.network/testnet',
    chain: chain,
    walletClient: walletClient,
    filesystemContractAddress:
      '0x0000000000000000000000000000000000000404' as `0x${string}`,
  });
  // --8<-- [end:initialize-clients]

  // --- Issue storage request logic ---
  // --8<-- [start:initialize-file-manager]
  // Specify the file name of the file to be uploaded
  const fileName = 'INSERT_FILE_NAME'; // Example: filename.jpeg

  // Specify the file path of the file to be uploaded relative to the location of your index.ts file
  const filePath = new URL(`./files/${fileName}`, import.meta.url).pathname;
  const fileSize = statSync(filePath).size;

  // Initialize a FileManager instance with file metadata and a readable stream.
  // The stream converts the local file into a Web-compatible ReadableStream,
  // which the SDK uses to handle file uploads to the network
  const fileManager = new FileManager({
    size: fileSize,
    stream: () =>
      Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>,
  });
  // --8<-- [end:initialize-file-manager]

  // --8<-- [start:create-fingerprint]
  const fingerprint = await fileManager.getFingerprint();
  // --8<-- [end:create-fingerprint]

  // --8<-- [start:issue-storage-request]
  // Add your bucket ID here from the bucket you created earlier
  // Example (32byte hash): 0xdd2148ff63c15826ab42953a9d214770e6c8a73b22b83d28819a1777ab9d1322
  const bucketId = 'INSERT_BUCKET_ID';

  // Get file details
  const fileSizeBigInt = BigInt(fileManager.getFileSize());
  console.log(`File size: ${fileSizeBigInt} bytes`);
  console.log(`Fingerprint: ${fingerprint.toHex()}`);

  // Get MSP info
  const { mspId, multiaddresses } = await mspClient.info.getInfo();
  if (!multiaddresses?.length) {
    throw new Error('MSP multiaddresses are missing');
  }

  const peerIds: string[] = extractPeerIDs(multiaddresses);
  if (peerIds.length === 0) {
    throw new Error('MSP multiaddresses had no /p2p/<peerId> segment');
  }

  function extractPeerIDs(multiaddresses: string[]): string[] {
    return (multiaddresses ?? [])
      .map((addr) => addr.split('/p2p/').pop())
      .filter((id): id is string => !!id);
  }

  // Choose replication level - defines the redundancy policy for the storage request.
  // Custom level allows specifying exact number of replicas
  const replicationLevel = ReplicationLevel.Custom;

  // Choose number of replicas - how many additional replicas to request beyond original copy
  const replicas = 1;

  // Issue storage request
  const txHash: `0x${string}` | undefined =
    await storageHubClient.issueStorageRequest(
      bucketId as `0x${string}`,
      fileName,
      fingerprint.toHex() as `0x${string}`,
      fileSizeBigInt,
      mspId as `0x${string}`,
      peerIds,
      replicationLevel,
      replicas
    );
  console.log('issueStorageRequest() txHash:', txHash);
  if (!txHash) {
    throw new Error('issueStorageRequest() did not return a transaction hash');
  }

  // Wait for storage request transaction receipt
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log('Storage request receipt:', receipt);
  if (receipt.status !== 'success') {
    throw new Error(`Storage request failed: ${txHash}`);
  }
  // --8<-- [end:issue-storage-request]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();

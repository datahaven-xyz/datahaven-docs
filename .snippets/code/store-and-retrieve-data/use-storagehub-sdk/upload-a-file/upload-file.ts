// --8<-- [start:imports]
import '@storagehub/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';
import {
  FileManager,
  HttpClientConfig,
  initWasm,
} from '@storagehub-sdk/core';
import {
  AuthStatus,
  HealthStatus,
  MspClient,
} from '@storagehub-sdk/msp-client';
import { createReadStream, statSync } from 'node:fs';
import { Readable } from 'node:stream';
import {
  Chain,
  WalletClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
// --8<-- [end:imports]

async function run() {
  // --8<-- [start:initialize-and-setup]
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

  // --- Polkadot.js API setup ---
  const provider = new WsProvider('TODO');
  const polkadotApi: ApiPromise = await ApiPromise.create({
    provider,
    typesBundle: types,
    noInitWarn: true,
  });

  // --- Connect to MSP Client and authenticate account ---
  const baseUrl = 'TODO';
  const httpConfig: HttpClientConfig = { baseUrl: baseUrl };
  const mspClient = await MspClient.connect(httpConfig, polkadotApi);

  // Check MSP Health Status
  const mspHealth: HealthStatus = await mspClient.info.getHealth();
  console.log('MSP service health:', mspHealth);

  // Check if the user is already authenticated with the MSP
  const auth: AuthStatus = await mspClient.auth.getAuthStatus();
  console.log('MSP Auth Status:', auth.status);

  // If not authenticated, trigger the SIWE (Sign-In with Ethereum) flow.
  // This prompts the connected wallet to sign an EIP-4361 message,
  // which the MSP backend verifies to issue a JWT session token
  if (auth.status !== 'Authenticated') {
    await mspClient.auth.SIWE(walletClient);
    console.log('User authenticated with MSP via SIWE');
  }

  // --- File Manager setup ---
  const ownerAccount = 'INSERT_ACCOUNT_AS_HEX_STRING';
  const bucketId = 'INSERT_BUCKET_ID';
  const fileKey = 'INSERT_FILE_KEY_AS_HEX_STRING';
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
  // --8<-- [end:initialize-and-setup]

  // --- Upload file logic ---
  // --8<-- [start:upload-file]
  // Retrieve the file as a binary Blob to prepare it for upload
  const fileBlob = await fileManager.getFileBlob();

  // Upload file to MSP
  const uploadReceipt = await mspClient.files.uploadFile(
    bucketId,
    fileKey,
    fileBlob,
    ownerAccount,
    fileName
  );

  console.log('File upload receipt:', uploadReceipt);
  // --8<-- [end:upload-file]

  // --8<-- [start:verify-upload]
  if (uploadReceipt.status !== 'upload_successful') {
    throw new Error('File upload to MSP failed');
  }
  // --8<-- [end:verify-upload]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();


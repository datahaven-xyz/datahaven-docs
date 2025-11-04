// --8<-- [start:imports]
import '@storagehub/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';
import {
  HttpClientConfig,
  initWasm,
} from '@storagehub-sdk/core';
import {
  AuthStatus,
  DownloadResult,
  HealthStatus,
  MspClient,
} from '@storagehub-sdk/msp-client';
import { createWriteStream } from 'node:fs';
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
  // --8<-- [end:initialize-and-setup]

  // --- Retrieve data logic ---
  // --8<-- [start:download-file]
  const fileKey = 'INSERT_FILE_KEY_AS_HEX';

  const downloadResponse: DownloadResult = await mspClient.files.downloadFile(
    fileKey
  );

  // Check if the download response was successful
  if (downloadResponse.status !== 200) {
    throw new Error(`Download failed with status: ${downloadResponse.status}`);
  }
  // --8<-- [end:download-file]

  // --8<-- [start:save-download]
  // Define the local path where the downloaded file will be saved
  // Here it is resolved relative to the current module’s URL.
  const downloadPath = new URL(
    '../../files/filename_downloaded.png',
    import.meta.url
  ).pathname;

  // Create a writable stream to the target file path
  // This stream will receive binary data chunks and write them to disk.
  const writeStream = createWriteStream(downloadPath);

  // Convert the Web ReadableStream into a Node.js-readable stream
  const readableStream = Readable.fromWeb(downloadResponse.stream as any);

  // Pipe the readable (input) stream into the writable (output) stream
  // This transfers the file data chunk by chunk and closes the write stream automatically
  // when finished.
  readableStream.pipe(writeStream);

  console.log('Downloaded file saved to:', downloadPath);
  // --8<-- [end:save-download]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();

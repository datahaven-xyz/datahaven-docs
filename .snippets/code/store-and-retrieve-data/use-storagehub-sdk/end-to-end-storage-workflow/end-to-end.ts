// index.ts

import '@storagehub/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';
import {
  FileManager,
  ReplicationLevel,
  StorageHubClient,
  initWasm,
  HttpClientConfig,
} from '@storagehub-sdk/core';
import {
  MspClient,
  HealthStatus,
  DownloadResult,
  type UserInfo,
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
import { TypeRegistry } from '@polkadot/types';
import type { AccountId20, H256 } from '@polkadot/types/interfaces';
import { createReadStream, statSync, createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';

async function run() {
  await initWasm();

  // --- viem setup ---
  const chain: Chain = defineChain({
    id: 1283,
    name: 'DataHaven Stagenet',
    nativeCurrency: { name: 'Have', symbol: 'HAVE', decimals: 18 },
    rpcUrls: { default: { http: ['TODO'] } },
  });

  const account = privateKeyToAccount('INSERT_PRIVATE_KEY' as `0x${string}`);

  const walletClient: WalletClient = createWalletClient({
    chain,
    account,
    transport: http('TODO'),
  });

  const publicClient: PublicClient = createPublicClient({
    chain,
    transport: http('TODO'),
  });

  // --- Substrate API ---
  const provider = new WsProvider('TODO');
  const substrateApi: ApiPromise = await ApiPromise.create({
    provider,
    typesBundle: types,
    noInitWarn: true,
  });

  // --- MSP client (new auth flow: sessionProvider) ---
  const baseUrl = 'TODO';
  const httpCfg: HttpClientConfig = { baseUrl };

  // Cache for the short-lived JWT; sessionProvider will read this.
  let sessionToken: string | undefined;

  // Supplies auth to MSP calls. If this flow doesn’t need auth, this can return undefined.
  const sessionProvider = async () => {
    const addr = walletClient?.account?.address;
    return sessionToken && addr
      ? ({ token: sessionToken, user: { address: addr } } as const)
      : undefined;
  };

  const mspClient = await MspClient.connect(httpCfg, sessionProvider);

  // Optional: confirm MSP health
  const mspHealth: HealthStatus = await mspClient.info.getHealth();
  console.log('MSP service health:', mspHealth);

  // StorageHub EVM client
  const storageHubClient = new StorageHubClient({
    rpcUrl: 'TODO',
    chain,
    walletClient,
    filesystemContractAddress: '0x0000000000000000000000000000000000000404' as `0x${string}`,
  });

  // --- Inputs from previous steps ---
  const bucketId = '0xTODO' as `0x${string}`; // Replace with your bucket ID
  const fileName = 'filename.png';

  // === Issue a Storage Request ===
  const filePath = new URL(`./files/${fileName}`, import.meta.url).pathname;
  const fileSize = statSync(filePath).size;
  const fileManager = new FileManager({
    size: fileSize,
    stream: () => Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>,
  });

  const fingerprint = await fileManager.getFingerprint();
  console.log(`File size: ${fileSize} bytes`);
  console.log(`Fingerprint: ${fingerprint.toHex()}`);

  const { mspId, multiaddresses } = await mspClient.info.getInfo();
  if (!multiaddresses?.length) {
    throw new Error('MSP multiaddresses are missing');
  }
  const peerIds = (multiaddresses ?? [])
    .map((addr) => addr.split('/p2p/').pop())
    .filter((id): id is string => !!id);
  if (peerIds.length === 0) {
    throw new Error('MSP multiaddresses had no /p2p/<peerId> segment');
  }

  const replicationLevel = ReplicationLevel.Custom;
  const replicas = 1;
  const txHash: `0x${string}` | undefined = await storageHubClient.issueStorageRequest(
    bucketId,
    fileName,
    fingerprint.toHex() as `0x${string}`,
    BigInt(fileSize),
    mspId as `0x${string}`,
    peerIds,
    replicationLevel,
    replicas
  );
  console.log('issueStorageRequest() txHash:', txHash);
  if (!txHash) {
    throw new Error('issueStorageRequest() did not return a transaction hash');
  }
  const issueReceipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  if (issueReceipt.status !== 'success') {
    throw new Error(`Storage request failed: ${txHash}`);
  }

  // === Verify if Storage Request is On-Chain ===
  const registry = new TypeRegistry();
  const owner = registry.createType('AccountId20', account.address) as AccountId20;
  const bucketIdH256 = registry.createType('H256', bucketId) as H256;
  const fileKey = await fileManager.computeFileKey(owner, bucketIdH256, fileName);
  console.log('Computed file key:', fileKey.toHex());

  const storageRequest = await substrateApi.query.fileSystem.storageRequests(fileKey);
  if (!storageRequest.isSome) {
    throw new Error('Storage request not found on chain');
  }
  const storageRequestData = storageRequest.unwrap();
  console.log('Storage request data:', storageRequestData);
  console.log('Storage request bucketId:', storageRequestData.bucketId.toString());
  console.log(
    'Storage request fingerprint should be the same as initial fingerprint',
    storageRequestData.fingerprint.toString() === fingerprint.toString()
  );

  // === Authenticate with SIWE and JWT (new flow) ===
  const authenticateUser = async (): Promise<UserInfo> => {
    const siweSession = await mspClient.auth.SIWE(walletClient);
    console.log('SIWE Session:', siweSession);

    sessionToken = (siweSession as { token?: string }).token;
    if (!sessionToken) throw new Error('SIWE did not return a session token');

    const profile: UserInfo = await mspClient.auth.getProfile();
    console.log('Authenticated user profile:', profile);
    return profile;
  };

  await authenticateUser();

  // === Upload Your First File ===
  const fileBlob = await fileManager.getFileBlob();
  const uploadReceipt = await mspClient.files.uploadFile(
    bucketId,
    fileKey.toHex(),
    fileBlob,
    account.address,
    fileName
  );
  console.log('File upload receipt:', uploadReceipt);
  if (uploadReceipt.status !== 'upload_successful') {
    throw new Error('File upload to MSP failed');
  }

  // === Retrieve Your Data ===
  const downloadResponse: DownloadResult = await mspClient.files.downloadFile(
    fileKey.toHex()
  );
  if (downloadResponse.status !== 200) {
    throw new Error(`Download failed with status: ${downloadResponse.status}`);
  }
  const downloadPath = new URL('../../files/filename_downloaded.png', import.meta.url).pathname;
  const writeStream = createWriteStream(downloadPath);
  const readableStream = Readable.fromWeb(downloadResponse.stream as any);
  readableStream.pipe(writeStream);
  console.log('Downloaded file saved to:', downloadPath);

  await substrateApi.disconnect();
}

await run();

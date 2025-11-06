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
  const account = privateKeyToAccount('INSERT_PRIVATE_KEY' as `0x${string}`);

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

  // --- File fingerprinting (hello.jpg) ---
  const fileName = 'hello.jpg';
  const filePath = path.join(process.cwd(), fileName);
  if (!existsSync(filePath)) {
    throw new Error(`Could not find ${fileName} at ${filePath}`);
  }
  const fileSize = statSync(filePath).size;
  console.log(`Using file path: ${filePath}`);
  const fileManager = new FileManager({
    size: fileSize,
    stream: () => Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>,
  });
  const fingerprint = await fileManager.getFingerprint();
  console.log(`File size: ${fileSize} bytes`);
  console.log(`Fingerprint: ${fingerprint.toHex()}`);

    // --- Issue storage request for the file ---
    const { mspId: infoMspId, multiaddresses } = await mspClient.info.getInfo();
    if (!multiaddresses?.length) {
      throw new Error('MSP multiaddresses are missing');
    }
  
    function extractPeerIDs(multiaddresses: string[]): string[] {
      return (multiaddresses ?? [])
        .map((addr) => addr.split('/p2p/').pop())
        .filter((id): id is string => !!id);
    }
  
    const peerIds: string[] = extractPeerIDs(multiaddresses);
    if (peerIds.length === 0) {
      throw new Error('MSP multiaddresses had no /p2p/<peerId> segment');
    }
  
    const replicationLevel = ReplicationLevel.Custom;
    const replicas = 1;
    const fileSizeBigInt = BigInt(fileManager.getFileSize());
  
    const storageTxHash: `0x${string}` | undefined = await storageHubClient.issueStorageRequest(
      bucketId as `0x${string}`,
      fileName,
      fingerprint.toHex() as `0x${string}`,
      fileSizeBigInt,
      (infoMspId ?? mspId) as `0x${string}`,
      peerIds,
      replicationLevel,
      replicas
    );
    console.log('issueStorageRequest() txHash:', storageTxHash);
    if (!storageTxHash) {
      throw new Error('issueStorageRequest() did not return a transaction hash');
    }
  
    const storageReceipt = await publicClient.waitForTransactionReceipt({ hash: storageTxHash });
    if (storageReceipt.status !== 'success') {
      throw new Error(`Storage request failed: ${storageTxHash}`);
    }

    // --- Compute file key (owner, bucketId, fileName) ---
    const registry = new TypeRegistry();
    const owner = registry.createType('AccountId20', account.address) as AccountId20;
    const bucketIdH256 = registry.createType('H256', bucketId) as H256;
    const fileKey = await fileManager.computeFileKey(owner, bucketIdH256, fileName);
    console.log('Computed file key:', fileKey.toHex());

    // --- Verify storage request on chain ---
    const storageRequest = await polkadotApi.query.fileSystem.storageRequests(fileKey);
    if (!storageRequest.isSome) {
        throw new Error('Storage request not found on chain');
    }

    // Read storage request data
    const storageRequestData = storageRequest.unwrap();
    console.log('Storage request data:', storageRequestData);
    console.log('Storage request bucketId:', storageRequestData.bucketId.toString());
    console.log(
        'Storage request fingerprint should be the same as initial fingerprint',
        storageRequestData.fingerprint.toString() === fingerprint.toString()
    );

    // Trigger the SIWE (Sign-In with Ethereum) flow.
    // This prompts the connected wallet to sign an EIP-4361 message,
    // which the MSP backend verifies to issue a JWT session token
    const siweSession = await mspClient.auth.SIWE(walletClient);
    console.log('SIWE Session:', siweSession);
    // Store the obtained session token for future authenticated requests
    sessionToken = (siweSession as { token: string }).token;

    // --- Upload file to MSP ---
    const fileBlob = await fileManager.getFileBlob();
    const uploadReceipt = await mspClient.files.uploadFile(
        bucketId,
        fileKey.toHex(),
        fileBlob,
        address,
        fileName
    );
    console.log('File upload receipt:', uploadReceipt);
    if (uploadReceipt.status !== 'upload_successful') {
        throw new Error('File upload to MSP failed');
    }

    // Must be authenticated to download files
    const downloadResponse: DownloadResult = await mspClient.files.downloadFile(
      fileKey.toHex()
    );

    // Check if the download response was successful
    if (downloadResponse.status !== 200) {
      throw new Error(`Download failed with status: ${downloadResponse.status}`);
    }

    // Sanitize the filename to prevent path traversal attacks
    // Extract only the base filename without any directory separators
    const sanitizedFileName = path.basename(fileName);

    // Define the local path where the downloaded file will be saved
    // Here it is resolved relative to the current module's URL.
    const downloadPath = new URL(
      `../../files/${sanitizedFileName}_downloaded.jpg`, // make sure the file extension matches the original file
      import.meta.url
    ).pathname;

    // Ensure the directory exists before writing the file
    const downloadDir = path.dirname(downloadPath);
    mkdirSync(downloadDir, { recursive: true });

    // Create a writable stream to the target file path
    // This stream will receive binary data chunks and write them to disk.
    const writeStream = createWriteStream(downloadPath);

    // Convert the Web ReadableStream into a Node.js-readable stream
    const readableStream = Readable.fromWeb(downloadResponse.stream as any);

    // Pipe the readable (input) stream into the writable (output) stream
    // This transfers the file data chunk by chunk and closes the write stream automatically
    // when finished.
    readableStream.pipe(writeStream);

    // Wait for the write stream to finish before proceeding
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    console.log('Downloaded file saved to:', downloadPath);

    // Disconnect the Polkadot API at the very end
    await polkadotApi.disconnect();
}

await run();
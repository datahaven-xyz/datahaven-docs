// Prior section code here

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

// Next section code here
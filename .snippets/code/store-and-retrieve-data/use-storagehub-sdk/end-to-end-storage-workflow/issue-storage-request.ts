import { createReadStream, statSync } from 'node:fs';
import { Readable } from 'node:stream';
import { FileManager, ReplicationLevel } from '@storagehub-sdk/core';

// Assumes the following are available in scope from prior setup:
// - storageHubClient, publicClient, mspClient
// - bucketId: `0x${string}` and fileName: string

// Initialize FileManager for the target file
const filePath = new URL(`./files/${fileName}`, import.meta.url).pathname;
const fileSize = statSync(filePath).size;
const fileManager = new FileManager({
  size: fileSize,
  stream: () =>
    Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>,
});

// Compute fingerprint once
const fingerprint = await fileManager.getFingerprint();
console.log(`File size: ${fileSize} bytes`);
console.log(`Fingerprint: ${fingerprint.toHex()}`);

// Gather MSP details
const { mspId, multiaddresses } = await mspClient.info.getInfo();
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

// Define redundancy policy
const replicationLevel = ReplicationLevel.Custom;
const replicas = 1;

// Issue Storage Request
const txHash: `0x${string}` | undefined =
  await storageHubClient.issueStorageRequest(
    bucketId as `0x${string}`,
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

// Wait for transaction finality
const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
if (receipt.status !== 'success') {
  throw new Error(`Storage request failed: ${txHash}`);
}

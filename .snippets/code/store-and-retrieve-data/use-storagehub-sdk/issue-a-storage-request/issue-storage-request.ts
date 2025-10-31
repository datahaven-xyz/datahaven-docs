import { ReplicationLevel } from '@storagehub-sdk/core';

// Get file details
const fingerprint = await fileManager.getFingerprint();
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

// Choose replication level - defines the redundancy policy for the storage request
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
const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
if (receipt.status !== 'success') {
  throw new Error(`Storage request failed: ${txHash}`);
}

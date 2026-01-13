// --8<-- [start:imports]
import { FileManager, initWasm, ReplicationLevel } from '@storagehub-sdk/core';
import {
  polkadotApi,
  storageHubClient,
  publicClient,
  account,
} from './services/clientService';
import { statSync, createReadStream } from 'fs';
import { Readable } from 'stream';
import { getMspInfo } from './services/mspService';
import { TypeRegistry } from '@polkadot/types';
import { AccountId20, H256 } from '@polkadot/types/interfaces';
// --8<-- [end:imports]

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();

  // --8<-- [start:init-setup]
  // Add your bucket ID here from the bucket you created earlier
  // Example (32byte hash):
  // 0xdd2148ff63c15826ab42953a9d214770e6c8a73b22b83d28819a1777ab9d1322
  const bucketId = 'INSERT_BUCKET_ID';

  // Specify the file name of the file to be uploaded
  const fileName = 'INSERT_FILE_NAME'; // Example: filename.jpeg
  const filePath = new URL(`./files/${fileName}`, import.meta.url).pathname;
  // --8<-- [end:init-setup]

  // --- File Manipulation ---

  // --8<-- [start:init-filemanager]
  // Step 1: Initialize FileManager
  const fileSize = statSync(filePath).size;
  const fileManager = new FileManager({
    size: fileSize,
    stream: () =>
      Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>,
  });
  // --8<-- [end:init-filemanager]

  // --8<-- [start:create-fingerprint-and-params]
  // Step 2: Create Fingerprint and Remaining Storage Request Parameters

  // Get file details

  const fingerprint = await fileManager.getFingerprint();
  console.log(`Fingerprint: ${fingerprint.toHex()}`);

  const fileSizeBigInt = BigInt(fileManager.getFileSize());
  console.log(`File size: ${fileSize} bytes`);

  // Get MSP details

  // Fetch MSP details from the backend (includes its on-chain ID and libp2p addresses)
  const { mspId, multiaddresses } = await getMspInfo();
  // Ensure the MSP exposes at least one multiaddress (required to reach it over libp2p)
  if (!multiaddresses?.length) {
    throw new Error('MSP multiaddresses are missing');
  }
  // Extract the MSP’s libp2p peer IDs from the multiaddresses
  // Each address should contain a `/p2p/<peerId>` segment
  const peerIds: string[] = extractPeerIDs(multiaddresses);
  // Validate that at least one valid peer ID was found
  if (peerIds.length === 0) {
    throw new Error('MSP multiaddresses had no /p2p/<peerId> segment');
  }

  // Extracts libp2p peer IDs from a list of multiaddresses.
  // A multiaddress commonly ends with `/p2p/<peerId>`, so this function
  // splits on that delimiter and returns the trailing segment when present.
  function extractPeerIDs(multiaddresses: string[]): string[] {
    return (multiaddresses ?? [])
      .map((addr) => addr.split('/p2p/').pop())
      .filter((id): id is string => !!id);
  }

  // Set the redundancy policy for this request.
  // Custom replication allows the client to specify an exact replica count.
  const replicationLevel = ReplicationLevel.Custom;
  const replicas = 1;
  // --8<-- [end:create-fingerprint-and-params]

  // --8<-- [start:issue-storage-request]
  // Step 3: Issue Storage Request
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

  // Wait for storage request transaction
  // Don't proceed until receipt is confirmed on chain
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  if (receipt.status !== 'success') {
    throw new Error(`Storage request failed: ${txHash}`);
  }
  console.log('issueStorageRequest() txReceipt:', receipt);
  // --8<-- [end:issue-storage-request]

  // --8<-- [start:compute-file-key]
  // Step 4: Compute the File Key
  const registry = new TypeRegistry();
  const owner = registry.createType(
    'AccountId20',
    account.address
  ) as AccountId20;
  const bucketIdH256 = registry.createType('H256', bucketId) as H256;
  const fileKey = await fileManager.computeFileKey(
    owner,
    bucketIdH256,
    fileName
  );
  // --8<-- [end:compute-file-key]

  // --8<-- [start:retrieve-storage-request-data]
  // Step 5: Retrieve Storage Request Data
  const storageRequest = await polkadotApi.query.fileSystem.storageRequests(
    fileKey
  );
  if (!storageRequest.isSome) {
    throw new Error('Storage request not found on chain');
  }
  // --8<-- [end:retrieve-storage-request-data]

  // --8<-- [start:read-storage-request-data]
  // Step 6: Read the storage request data
  const storageRequestData = storageRequest.unwrap().toHuman();
  console.log('Storage request data:', storageRequestData);
  // --8<-- [end:read-storage-request-data]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();

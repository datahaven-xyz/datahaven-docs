// --8<-- [start:imports]
import { createReadStream, statSync } from 'node:fs';
import { Readable } from 'node:stream';
import { FileManager, ReplicationLevel } from '@storagehub-sdk/core';
import { TypeRegistry } from '@polkadot/types';
import { AccountId20, H256 } from '@polkadot/types/interfaces';
import {
  walletClient,
  address,
  publicClient,
  polkadotApi,
  account,
  chain,
} from '../services/clientService.js';
import {
  mspClient,
  getMspInfo,
  authenticateUser,
} from '../services/mspService.js';
import { PalletFileSystemStorageRequestMetadata } from '@polkadot/types/lookup';
import { toHex } from 'viem';
import fileSystemAbi from '../abis/FileSystemABI.json' with { type: 'json' };
import { NETWORK } from '../config/networks.js';
// --8<-- [end:imports]

// --8<-- [start:upload-file-full]
export async function uploadFile(
  bucketId: string,
  filePath: string,
  fileName: string
) {
  //   ISSUE STORAGE REQUEST

  // --8<-- [start:initialize-file-manager]
  // Set up FileManager
  const fileSize = statSync(filePath).size;
  const fileManager = new FileManager({
    size: fileSize,
    stream: () =>
      Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>,
  });
  // --8<-- [end:initialize-file-manager]

  // --8<-- [start:define-storage-request-parameters]
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
  // Extract the MSP's libp2p peer IDs from the multiaddresses
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
  // --8<-- [end:define-storage-request-parameters]

  // --8<-- [start:issue-storage-request]
  // Issue storage request by calling the FileSystem precompile directly
  const txHash = await walletClient.writeContract({
    account,
    address: NETWORK.filesystemContractAddress,
    abi: fileSystemAbi,
    functionName: 'issueStorageRequest',
    args: [
      bucketId as `0x${string}`,
      toHex(fileName),
      fingerprint.toHex() as `0x${string}`,
      fileSizeBigInt,
      mspId as `0x${string}`,
      peerIds.map((id) => toHex(id)),
      replicationLevel,
      replicas,
    ],
    chain: chain,
  });
  console.log('issueStorageRequest() txHash:', txHash);
  if (!txHash) {
    throw new Error('issueStorageRequest() did not return a transaction hash');
  }

  // Wait for storage request transaction
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  if (receipt.status !== 'success') {
    throw new Error(`Storage request failed: ${txHash}`);
  }
  console.log('issueStorageRequest() txReceipt:', receipt);
  // --8<-- [end:issue-storage-request]

  //   VERIFY STORAGE REQUEST ON CHAIN

  // --8<-- [start:compute-file-key]
  // Compute file key
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

  // --8<-- [start:verify-storage-request]
  // Verify storage request on chain
  const storageRequest = await polkadotApi.query.fileSystem.storageRequests(
    fileKey
  );
  if (!storageRequest.isSome) {
    throw new Error('Storage request not found on chain');
  }
  // --8<-- [end:verify-storage-request]

  // --8<-- [start:read-storage-request]
  // Read the storage request data
  const storageRequestData = storageRequest.unwrap().toHuman();
  console.log('Storage request data:', storageRequestData);
  console.log(
    'Storage request bucketId matches initial bucketId:',
    storageRequestData.bucketId === bucketId
  );
  console.log(
    'Storage request fingerprint matches initial fingerprint',
    storageRequestData.fingerprint === fingerprint.toString()
  );
  // --8<-- [end:read-storage-request]

  //   UPLOAD FILE TO MSP

  // --8<-- [start:authenticate]
  // Authenticate bucket owner address with MSP prior to uploading file
  const authProfile = await authenticateUser();
  console.log('Authenticated user profile:', authProfile);
  // --8<-- [end:authenticate]

  // --8<-- [start:upload-file]
  // Upload file to MSP
  const uploadReceipt = await mspClient.files.uploadFile(
    bucketId,
    fileKey.toHex(),
    await fileManager.getFileBlob(),
    address,
    fileName
  );
  console.log('File upload receipt:', uploadReceipt);

  if (uploadReceipt.status !== 'upload_successful') {
    throw new Error('File upload to MSP failed');
  }
  // --8<-- [end:upload-file]

  return { fileKey, uploadReceipt };
}
// --8<-- [end:upload-file-full]

// --8<-- [start:wait-for-msp-confirm-on-chain]
export async function waitForMSPConfirmOnChain(fileKey: string) {
  const maxAttempts = 20;
  const delayMs = 2000;

  for (let i = 0; i < maxAttempts; i++) {
    console.log(
      `Check if storage request has been confirmed by the MSP on-chain, attempt ${
        i + 1
      } of ${maxAttempts}...`
    );

    const req = await polkadotApi.query.fileSystem.storageRequests(fileKey);
    if (req.isNone) {
      throw new Error(
        `StorageRequest for ${fileKey} no longer exists on-chain.`
      );
    }
    const data: PalletFileSystemStorageRequestMetadata = req.unwrap();
    // MSP confirmation
    const mspStatus = data.mspStatus;
    console.log(`MSP confirmation status: ${mspStatus.type}`);

    const mspConfirmed =
      mspStatus.isAcceptedNewFile || mspStatus.isAcceptedExistingFile;

    if (mspConfirmed) {
      console.log('Storage request confirmed by MSP on-chain');
      return;
    }

    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error('Timed out waiting for MSP confirmation on-chain');
}
// --8<-- [end:wait-for-msp-confirm-on-chain]

// --8<-- [start:wait-for-backend-file-ready]
export async function waitForBackendFileReady(
  bucketId: string,
  fileKey: string
) {
  // wait up to 12 minutes (144 attempts x 5 seconds)
  // around 11 minutes is the amount of time BSPs have to reach the required replication level
  const maxAttempts = 144;
  const delayMs = 5000;

  for (let i = 0; i < maxAttempts; i++) {
    console.log(
      `Checking for file in MSP backend, attempt ${i + 1} of ${maxAttempts}...`
    );
    try {
      const fileInfo = await mspClient.files.getFileInfo(bucketId, fileKey);

      if (fileInfo.status === 'ready') {
        console.log('File found in MSP backend:', fileInfo);
        return fileInfo; // or `return;` if you prefer
      } else if (fileInfo.status === 'revoked') {
        throw new Error('File upload was cancelled by user');
      } else if (fileInfo.status === 'rejected') {
        throw new Error('File upload was rejected by MSP');
      } else if (fileInfo.status === 'expired') {
        throw new Error(
          'Storage request expired: the required number of BSP replicas was not achieved within the deadline'
        );
      }

      // For any other status (e.g. "pending"), just keep waiting
      console.log(`File status is "${fileInfo.status}", waiting...`);
    } catch (error: any) {
      if (error?.status === 404 || error?.body?.error === 'Not found: Record') {
        console.log(
          'File not yet indexed in MSP backend (404 Not Found). Waiting before retry...'
        );
      } else {
        console.log('Unexpected error while fetching file from MSP:', error);
        throw error;
      }
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error('Timed out waiting for MSP backend to mark file as ready');
}
// --8<-- [end:wait-for-backend-file-ready]

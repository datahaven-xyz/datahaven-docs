// --8<-- [start:imports]
import {
  walletClient,
  address,
  publicClient,
  account,
  chain,
} from '../services/clientService.js';
import { mspClient } from '../services/mspService.js';
import { FileInfo } from '@storagehub-sdk/core';
import { FileListResponse } from '@storagehub-sdk/msp-client';
import { toHex, hexToBytes } from 'viem';
import fileSystemAbi from '../abis/FileSystemABI.json' with { type: 'json' };
import { NETWORK } from '../config/networks.js';
// --8<-- [end:imports]

// --8<-- [start:get-bucket-files-msp]
export async function getBucketFilesFromMSP(
  bucketId: string
): Promise<FileListResponse> {
  const files: FileListResponse = await mspClient.buckets.getFiles(bucketId);
  return files;
}
// --8<-- [end:get-bucket-files-msp]

// --8<-- [start:request-file-deletion]
export async function requestDeleteFile(
  bucketId: string,
  fileKey: string
): Promise<boolean> {
  // Get file info before deletion
  const fileInfo: FileInfo = await mspClient.files.getFileInfo(
    bucketId,
    fileKey
  );
  console.log('File info:', fileInfo);

  // Build the signed intention for file deletion
  // The contract expects a FileOperationIntention struct { fileKey: bytes32, operation: uint8 }
  // FileOperation.Delete = 0
  const fileOperation = 0; // FileOperation.Delete
  const fileKeyBytes = hexToBytes(fileInfo.fileKey);
  const rawMessage = new Uint8Array([...fileKeyBytes, fileOperation]);

  // Sign the raw 33-byte message (32-byte fileKey + 1-byte operation) using EIP-191 personal_sign
  const signature = await walletClient.signMessage({
    account,
    message: { raw: rawMessage },
  });

  const signedIntention = {
    fileKey: fileInfo.fileKey,
    operation: fileOperation,
  };

  // Request file deletion by calling the FileSystem precompile directly
  const txHashRequestDeleteFile = await walletClient.writeContract({
    account,
    address: NETWORK.filesystemContractAddress,
    abi: fileSystemAbi,
    functionName: 'requestDeleteFile',
    args: [
      signedIntention,
      signature,
      fileInfo.bucketId,
      toHex(fileInfo.location),
      fileInfo.size,
      fileInfo.fingerprint,
    ],
    chain: chain,
  });
  console.log('requestDeleteFile() txHash:', txHashRequestDeleteFile);

  // Wait for delete file transaction receipt
  const receiptRequestDeleteFile = await publicClient.waitForTransactionReceipt(
    {
      hash: txHashRequestDeleteFile,
    }
  );
  console.log('requestDeleteFile() txReceipt:', receiptRequestDeleteFile);
  if (receiptRequestDeleteFile.status !== 'success') {
    throw new Error(`File deletion failed: ${txHashRequestDeleteFile}`);
  }

  console.log(
    `File with key ${fileKey} deleted successfully from bucket ${bucketId}`
  );
  return true;
}
// --8<-- [end:request-file-deletion]

// --8<-- [start:get-pending-file-deletion-requests-count]
export async function getPendingFileDeletionRequestsCount(
  user?: `0x${string}`
): Promise<number> {
  // Query the number of pending file deletion requests for a user
  // Defaults to the current account address if no user is provided
  const targetAddress = user ?? address;

  const count = (await publicClient.readContract({
    address: NETWORK.filesystemContractAddress,
    abi: fileSystemAbi,
    functionName: 'getPendingFileDeletionRequestsCount',
    args: [targetAddress],
  })) as number;
  console.log(`Pending file deletion requests for ${targetAddress}: ${count}`);

  return count;
}
// --8<-- [end:get-pending-file-deletion-requests-count]

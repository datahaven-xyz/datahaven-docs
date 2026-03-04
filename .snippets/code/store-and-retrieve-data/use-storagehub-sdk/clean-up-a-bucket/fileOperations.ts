// --8<-- [start:imports]
import { storageHubClient, publicClient } from '../services/clientService.js';
import { mspClient } from '../services/mspService.js';
import { FileInfo } from '@storagehub-sdk/core';
import { FileListResponse, FileTree } from '@storagehub-sdk/msp-client';
// --8<-- [end:imports]

// --8<-- [start:request-file-deletion]
export async function requestDeleteFile(bucketId: `0x${string}`, fileKey: `0x${string}`): Promise<boolean> {
  // Get file info before deletion
  const fileInfo: FileInfo = await mspClient.files.getFileInfo(bucketId, fileKey);
  console.log('File info:', fileInfo);

  // Request file deletion
  const txHashRequestDeleteFile: `0x${string}` = await storageHubClient.requestDeleteFile(fileInfo);
  console.log('requestDeleteFile() txHash:', txHashRequestDeleteFile);

  // Wait for delete file transaction receipt
  const receiptRequestDeleteFile = await publicClient.waitForTransactionReceipt({
    hash: txHashRequestDeleteFile,
  });
  console.log('requestDeleteFile() txReceipt:', receiptRequestDeleteFile);
  if (receiptRequestDeleteFile.status !== 'success') {
    throw new Error(`File deletion request failed: ${txHashRequestDeleteFile}`);
  }

  console.log(`Deletion request transaction for file with key ${fileKey} succeeded for bucket ${bucketId}`);
  return true;
}
// --8<-- [end:request-file-deletion]

// --8<-- [start:get-bucket-files-msp]
export async function getBucketFilesFromMSP(bucketId: `0x${string}`): Promise<FileListResponse> {
  const files: FileListResponse = await mspClient.buckets.getFiles(bucketId);
  return files;
}
// --8<-- [end:get-bucket-files-msp]

// --8<-- [start:delete-all-files-in-bucket]
export async function deleteAllFilesInBucket(bucketId: `0x${string}`): Promise<FileListResponse> {
  const fileList = await getBucketFilesFromMSP(bucketId);

  // Recursively collect all file keys from the tree (folders can contain nested files)
  function collectFileKeys(entries: FileTree[]): `0x${string}`[] {
    const keys: `0x${string}`[] = [];
    for (const entry of entries) {
      if (entry.type === 'file') {
        keys.push(entry.fileKey);
      } else {
        keys.push(...collectFileKeys(entry.children));
      }
    }
    return keys;
  }

  const fileKeys = collectFileKeys(fileList.files);

  if (fileKeys.length === 0) {
    console.log(`No files found in bucket ${bucketId}. Nothing to delete.`);
    return fileList;
  }

  console.log(`Found ${fileKeys.length} file(s) in bucket ${bucketId}. Deleting all...`);

  for (const fileKey of fileKeys) {
    console.log(`Deleting file with key: ${fileKey}`);
    await requestDeleteFile(bucketId, fileKey);
  }

  console.log(`All ${fileKeys.length} file(s) deletion requests submitted for bucket ${bucketId}.`);
  return fileList;
}
// --8<-- [end:delete-all-files-in-bucket]

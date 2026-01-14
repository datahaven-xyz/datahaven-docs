import { storageHubClient, publicClient } from '../services/clientService.js';
import { mspClient } from '../services/mspService.js';
import { FileInfo } from '@storagehub-sdk/core';
import { FileListResponse } from '@storagehub-sdk/msp-client';

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

  // Request file deletion
  const txHashRequestDeleteFile: `0x${string}` =
    await storageHubClient.requestDeleteFile(fileInfo);
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

// --8<-- [start:imports]
import { storageHubClient, publicClient } from '../services/clientService.js';
import { mspClient } from '../services/mspService.js';
import { FileInfo } from '@storagehub-sdk/core';
// --8<-- [end:imports]

// --8<-- [start:request-file-deletion]
export async function requestDeleteFile(
  bucketId: `0x${string}`,
  fileKey: `0x${string}`,
): Promise<boolean> {
  // Get file info before deletion
  const fileInfo: FileInfo = await mspClient.files.getFileInfo(
    bucketId,
    fileKey,
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
    },
  );
  console.log('requestDeleteFile() txReceipt:', receiptRequestDeleteFile);
  if (receiptRequestDeleteFile.status !== 'success') {
    throw new Error(`File deletion request failed: ${txHashRequestDeleteFile}`);
  }

  console.log(
    `File with key ${fileKey} from bucket ${bucketId} deletion request successfully submitted`,
  );
  return true;
}
// --8<-- [end:request-file-deletion]

// --8<-- [start:wait-for-file-deletion]
export async function waitForFileDeletion(
  bucketId: `0x${string}`,
  fileKey: `0x${string}`,
): Promise<void> {
  const maxAttempts = 30;
  const delayMs = 5000;
  for (let i = 0; i < maxAttempts; i++) {
    console.log(
      `Waiting for file deletion confirmation, attempt ${i + 1} of ${maxAttempts}...`,
    );
    try {
      const fileInfo = await mspClient.files.getFileInfo(bucketId, fileKey);
      // File still exists — log its status and keep polling
      console.log(
        `File still exists in MSP backend (status: "${fileInfo.status}"). Waiting...`,
      );
    } catch (error: any) {
      if (error?.status === 404 || error?.body?.error === 'Not found: Record') {
        // 404 means the file is gone — deletion confirmed
        console.log(
          'File not found in MSP backend (404). File deletion confirmed!',
        );
        return;
      }
      // Unexpected error — rethrow
      throw error;
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error('Timed out waiting for MSP backend to confirm file deletion');
}
// --8<-- [end:wait-for-file-deletion]

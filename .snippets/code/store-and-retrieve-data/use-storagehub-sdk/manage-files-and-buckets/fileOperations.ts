import { storageHubClient, publicClient } from '../services/clientService.js';
import { mspClient } from '../services/mspService.js';
import { FileInfo } from '@storagehub-sdk/msp-client';

export async function requestDeleteFile(
  bucketId: string,
  fileKey: string
): Promise<boolean> {
  // Get file info before deletion
  const fileInfo: FileInfo = await mspClient.files.getFileInfo(
    bucketId,
    fileKey
  );
  console.log('File info before deletion:', fileInfo);

  let formattedFileInfo: any = fileInfo;
  ['fileKey', 'fingerprint', 'bucketId'].forEach(
    (k) => (formattedFileInfo[k] = '0x' + formattedFileInfo[k])
  );
  console.log('Formatted file info for deletion:', formattedFileInfo);

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

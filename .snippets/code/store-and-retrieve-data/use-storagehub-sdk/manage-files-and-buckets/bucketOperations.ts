// --8<-- [start:imports]
import { Bucket, FileListResponse } from '@storagehub-sdk/msp-client';
import { storageHubClient, publicClient } from '../services/clientService.js';
import { mspClient } from '../services/mspService.js';
// --8<-- [end:imports]

// --8<-- [start:get-buckets-msp]
export async function getBucketsFromMSP(): Promise<Bucket[]> {
  const buckets: Bucket[] = await mspClient.buckets.listBuckets();
  return buckets;
}
// --8<-- [end:get-buckets-msp]

// --8<-- [start:wait-for-backend-bucket-empty]
export async function waitForBackendBucketEmpty(bucketId: string) {
  const maxAttempts = 144; // 12 minutes total (144 * 5s)
  const delayMs = 5000;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const bucketFiles: FileListResponse =
        await mspClient.buckets.getFiles(bucketId);

      if (bucketFiles.files.length === 0) {
        console.log('Bucket is empty in MSP backend:', bucketFiles);
        return;
      }
      console.log(
        `Checking MSP backend for empty bucket... ${bucketFiles.files.length} file(s) remaining. ` +
          `Attempt ${i + 1}/${maxAttempts}`,
      );
    } catch (error: any) {
      if (error.status === 404 || error.body.error === 'Not found: Record') {
        console.log(`Bucket not found in MSP backend (404).`);
        throw new Error(`Bucket ${bucketId} not found in MSP backend`);
      } else {
        console.log('Unexpected error while fetching bucket from MSP:', error);
        throw error;
      }
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error(`Bucket ${bucketId} not empty in MSP backend after waiting`);
}
// --8<-- [end:wait-for-backend-bucket-empty]

// --8<-- [start:delete-bucket]
export async function deleteBucket(bucketId: string): Promise<boolean> {
  const txHash: `0x${string}` | undefined = await storageHubClient.deleteBucket(
    bucketId as `0x${string}`,
  );
  console.log('deleteBucket() txHash:', txHash);
  if (!txHash) {
    throw new Error('deleteBucket() did not return a transaction hash');
  }

  // Wait for transaction
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log('deleteBucket() txReceipt:', receipt);
  if (receipt.status !== 'success') {
    throw new Error(`Bucket deletion failed: ${txHash}`);
  }

  return true;
}
// --8<-- [end:delete-bucket]

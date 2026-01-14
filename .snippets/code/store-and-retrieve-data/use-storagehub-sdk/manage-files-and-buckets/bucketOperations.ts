// --8<-- [start:imports]
import { Bucket } from '@storagehub-sdk/msp-client';
import { storageHubClient, publicClient } from '../services/clientService.js';
import { mspClient } from '../services/mspService.js';
// --8<-- [end:imports]

// --8<-- [start:get-buckets-msp]
export async function getBucketsFromMSP(): Promise<Bucket[]> {
  const buckets: Bucket[] = await mspClient.buckets.listBuckets();
  return buckets;
}
// --8<-- [end:get-buckets-msp]

// --8<-- [start:delete-bucket]
export async function deleteBucket(bucketId: string): Promise<boolean> {
  const txHash: `0x${string}` | undefined = await storageHubClient.deleteBucket(
    bucketId as `0x${string}`
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

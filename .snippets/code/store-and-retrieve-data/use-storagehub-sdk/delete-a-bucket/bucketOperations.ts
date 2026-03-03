// --8<-- [start:imports]
import { Bucket } from '@storagehub-sdk/msp-client';
import { storageHubClient, publicClient } from '../services/clientService.js';
import { mspClient } from '../services/mspService.js';
// --8<-- [end:imports]

// --8<-- [start:get-bucket-from-msp]
export async function getBucketFromMSP(
  bucketId: `0x${string}`,
): Promise<Bucket> {
  const bucket: Bucket = await mspClient.buckets.getBucket(bucketId);
  return bucket;
}
// --8<-- [end:get-bucket-from-msp]

// --8<-- [start:delete-bucket]
export async function deleteBucket(bucketId: `0x${string}`): Promise<boolean> {
  const txHash: `0x${string}` | undefined =
    await storageHubClient.deleteBucket(bucketId);
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

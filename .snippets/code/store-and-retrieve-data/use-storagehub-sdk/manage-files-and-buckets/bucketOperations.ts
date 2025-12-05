import { storageHubClient, publicClient } from '../services/clientService.js';

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

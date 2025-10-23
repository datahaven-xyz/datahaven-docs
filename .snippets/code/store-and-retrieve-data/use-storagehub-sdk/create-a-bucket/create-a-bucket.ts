// Create bucket on chain
const txHash: `0x${string}` | undefined = await storageHubClient.createBucket(
  mspId as `0x${string}`,
  bucketName,
  isPrivate,
  valuePropId
);
console.log('createBucket() txHash:', txHash);
if (!txHash) {
  throw new Error('createBucket() did not return a transaction hash');
}

// Wait for transaction receipt
const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
console.log('Bucket creation receipt:', receipt);
if (receipt.status !== 'success') {
  throw new Error(`Bucket creation failed: ${txHash}`);
}

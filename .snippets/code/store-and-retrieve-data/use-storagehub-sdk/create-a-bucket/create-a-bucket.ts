const txHashBucket = await storageHubClient.createBucket(
  mspId,
  bucketName,
  isPrivate,
  valuePropId
);
console.log('Bucket created in tx:', txHashBucket);

const receiptBucket = await publicClient.waitForTransactionReceipt({
  hash: txHashBucket,
});
if (receiptBucket.status !== 'success') {
  throw new Error(`Create bucket transaction failed: ${txHashBucket}`);
}
console.log('Bucket created receipt:', receiptBucket);

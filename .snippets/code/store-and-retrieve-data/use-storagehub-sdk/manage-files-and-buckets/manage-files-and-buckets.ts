// --8<-- [start:request-file-deletion]

const run = async () => {
  // Request file deletion
  const txHash: `0x${string}` = await storageHubClient.requestDeleteFile(
    bucketId as `0x${string}`,
    fileKey.toHex()
  );
  console.log('deleteFile() txHash:', txHash);

  // Wait for delete file transaction receipt
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  if (receipt.status !== 'success') {
    throw new Error(`File deletion failed: ${txHash}`);
  }

  console.log(
    `File with key ${fileKey.toHex()} deleted successfully from bucket ${bucketId}`
  );
};

run().catch((e) => {
  console.error(e);
});

// --8<-- [end:request-file-deletion]

// --8<-- [start:delete-bucket]
// Delete bucket
const txHash: `0x${string}` | undefined = await storageHubClient.deleteBucket(
  bucketId as `0x${string}`
);
console.log('deleteBucket() txHash:', txHash);
if (!txHash) {
  throw new Error('deleteBucket() did not return a transaction hash');
}

// Wait for transaction
const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
console.log('Bucket deletion receipt:', receipt);
if (receipt.status !== 'success') {
  throw new Error(`Bucket deletion failed: ${txHash}`);
}
// --8<-- [end:delete-bucket]

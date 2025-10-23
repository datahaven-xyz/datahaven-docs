const bucketAfterCreation = await polkadotApi.query.providers.buckets(bucketId);
console.log('Bucket after creation exists', !bucketAfterCreation.isEmpty);

// Unwrap bucket in order to read its data
const bucketData = bucketAfterCreation.unwrap();
console.log('Bucket data:', bucketData);

// Check if the retrieved bucket's MSP ID matches the initial MSP ID you retrieved
console.log(
  'Bucket mspId matches initial mspId:',
  bucketData.mspId.toString() === mspId
);
// Check if the retrieved bucket's userId (owner address) matches the initial address you used to create the bucket
console.log(
  'Bucket userId matches initial bucket owner address:',
  bucketData.userId.toString() === address
);

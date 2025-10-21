const bucketAfterCreation = await substrateApi.query.providers.buckets(
  bucketId
);
console.log('Bucket after creation exists', !bucketAfterCreation.isEmpty);

// Unwrap bucket in order to read its data
const bucketData = bucketAfterCreation.unwrap();
console.log('Bucket data:', bucketData);
// Check if the retrieved bucket's MSP ID matches the initial MSP ID you retrieved
console.log(
  'Bucket mspId matches initial mspId',
  bucketData.mspId.toString() === mspId
);

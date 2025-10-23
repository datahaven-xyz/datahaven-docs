const bucketBeforeCreation = await polkadotApi.query.providers.buckets(
  bucketId
);
console.log('Bucket before creation is empty', bucketBeforeCreation.isEmpty);

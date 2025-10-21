const bucketName = 'init-bucket';
const bucketId = (await storageHubClient.deriveBucketId(
  address,
  bucketName
)) as string;
console.log('Derived bucket Id: ', bucketId);

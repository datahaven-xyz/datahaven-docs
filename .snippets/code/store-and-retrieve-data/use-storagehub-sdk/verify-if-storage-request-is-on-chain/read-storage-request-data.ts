// Read the storage request data
const storageRequestData = storageRequest.unwrap();
console.log('Storage request data:', storageRequestData);
console.log(
  'Storage request bucketId:',
  storageRequestData.bucketId.toString()
);
console.log(
  'Storage request fingerprint should be the same as initial fingerprint',
  storageRequestData.fingerprint.toString() === fingerprint.toString()
);

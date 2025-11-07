// Prior section code here

// --- Compute file key (owner, bucketId, fileName) ---
const registry = new TypeRegistry();
const owner = registry.createType('AccountId20', account.address) as AccountId20;
const bucketIdH256 = registry.createType('H256', bucketId) as H256;
const fileKey = await fileManager.computeFileKey(owner, bucketIdH256, fileName);
console.log('Computed file key:', fileKey.toHex());

// --- Verify storage request on chain ---
const storageRequest = await polkadotApi.query.fileSystem.storageRequests(fileKey);
if (!storageRequest.isSome) {
  throw new Error('Storage request not found on chain');
}

// Read storage request data
const storageRequestData = storageRequest.unwrap();
console.log('Storage request data:', storageRequestData);
console.log('Storage request bucketId:', storageRequestData.bucketId.toString());
console.log(
  'Storage request fingerprint should be the same as initial fingerprint',
  storageRequestData.fingerprint.toString() === fingerprint.toString()
);

// Next section code here 
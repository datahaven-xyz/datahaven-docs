import { TypeRegistry } from '@polkadot/types';
import type { AccountId20, H256 } from '@polkadot/types/interfaces';

// Assumes the following are available in scope:
// - account.address, bucketId, fileName, fileManager, substrateApi

// Compute file key deterministically from owner + bucketId + fileName
const registry = new TypeRegistry();
const owner = registry.createType(
  'AccountId20',
  account.address
) as AccountId20;
const bucketIdH256 = registry.createType('H256', bucketId) as H256;
const fileKey = await fileManager.computeFileKey(owner, bucketIdH256, fileName);
console.log('Computed file key:', fileKey.toHex());

// Retrieve storage request from chain
const storageRequest = await substrateApi.query.fileSystem.storageRequests(
  fileKey
);
if (!storageRequest.isSome) {
  throw new Error('Storage request not found on chain');
}

// Unwrap and inspect core fields
const storageRequestData = storageRequest.unwrap();
console.log('Storage request data:', storageRequestData);
console.log(
  'Storage request bucketId:',
  storageRequestData.bucketId.toString()
);
console.log(
  'Storage request fingerprint should be the same as initial fingerprint',
  storageRequestData.fingerprint.toString() ===
    (await fileManager.getFingerprint()).toString()
);

// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import { authenticateUser } from './services/mspService.js';
import {
  getBucketFromMSP,
  deleteBucket,
} from './operations/bucketOperations.js';
// --8<-- [end:imports]

async function run() {
  // Initialize WASM
  await initWasm();

  // --8<-- [start:init-setup]
  const bucketId = 'INSERT_BUCKET_ID'; // `0x${string}`
  // --8<-- [end:init-setup]

  // --8<-- [start:authenticate]
  // Authenticate
  const authProfile = await authenticateUser();
  console.log('Authenticated user profile:', authProfile);
  // --8<-- [end:authenticate]

  // --8<-- [start:get-bucket-info]
  // Get bucket info from the MSP
  const bucket = await getBucketFromMSP(bucketId);
  console.log('Bucket:', bucket);

  if (!bucket) {
    throw new Error(`Bucket not found: ${bucketId}`);
  }
  // --8<-- [end:get-bucket-info]

  // --8<-- [start:delete-bucket]
  // Delete bucket (only if empty)
  if (bucket.fileCount === 0) {
    const isBucketDeletionSuccessful = await deleteBucket(bucketId);
    console.log('Bucket deletion successful:', isBucketDeletionSuccessful);
  } else {
    console.log(
      `Bucket has ${bucket.fileCount} file(s). Delete all files before deleting the bucket.`,
    );
  }
  // --8<-- [end:delete-bucket]

  await polkadotApi.disconnect();
}

run();

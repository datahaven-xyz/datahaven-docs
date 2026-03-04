// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import { authenticateUser } from './services/mspService.js';
import { deleteAllFilesInBucket } from './operations/fileOperations.js';
import {
  deleteBucket,
  getBucketsFromMSP,
  waitForBackendBucketEmpty,
} from './operations/bucketOperations.js';
import { Bucket } from '@storagehub-sdk/msp-client';
// --8<-- [end:imports]

async function run() {
  // Initialize WASM
  await initWasm();

  console.log('🧹 Starting Clean Up Bucket Script...');

  // --8<-- [start:authenticate]
  // Authenticate with MSP
  const authProfile = await authenticateUser();
  console.log('Authenticated user profile:', authProfile);
  // --8<-- [end:authenticate]

  // --8<-- [start:get-buckets]
  // Fetch all user buckets
  const buckets = await getBucketsFromMSP();
  console.log(`Found ${buckets.length} bucket(s):`, buckets);

  if (buckets.length === 0) {
    throw new Error('No buckets found. Nothing to clean up.');
  }

  // Pick the first bucket or pick a specific by ID if needed
  const bucket: Bucket = buckets[0];
  console.log(
    `Selected bucket: "${bucket.name}" (ID: ${bucket.bucketId}, Files: ${bucket.fileCount})`,
  );
  // --8<-- [end:get-buckets]

  // --8<-- [start:delete-all-files]
  // Delete all files in the bucket
  const fileList = await deleteAllFilesInBucket(bucket.bucketId);
  console.log('Files before deletion:', JSON.stringify(fileList, null, 2));
  // --8<-- [end:delete-all-files]

  // --8<-- [start:wait-for-bucket-empty]
  // Wait for the bucket to be confirmed empty in the backend
  if (fileList.files.length > 0) {
    await waitForBackendBucketEmpty(bucket.bucketId);
  }
  // --8<-- [end:wait-for-bucket-empty]

  // --8<-- [start:delete-bucket]
  // Delete the empty bucket
  const isBucketDeletionSuccessful = await deleteBucket(bucket.bucketId);
  console.log('Bucket deletion successful:', isBucketDeletionSuccessful);
  // --8<-- [end:delete-bucket]

  console.log('🧹 Clean Up Bucket Script Completed Successfully.');

  await polkadotApi.disconnect();
}

run();

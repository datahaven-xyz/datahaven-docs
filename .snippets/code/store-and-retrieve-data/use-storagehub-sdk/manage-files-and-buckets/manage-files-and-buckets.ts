// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import { authenticateUser } from './services/mspService.js';
import {
  getBucketFilesFromMSP,
  requestDeleteFile,
} from './operations/fileOperations.js';
import {
  deleteBucket,
  getBucketsFromMSP,
  waitForBackendBucketEmpty,
} from './operations/bucketOperations.js';
// --8<-- [end:imports]

async function run() {
  // Initialize WASM
  await initWasm();

  // --8<-- [start:init-setup]
  const bucketId = 'INSERT_BUCKET_ID'; // `0x${string}`
  const fileKey = 'INSERT_FILE_KEY'; // `0x${string}`
  // If not in hex already, convert it with .toHex()
  // --8<-- [end:init-setup]

  // --8<-- [start:authenticate]
  // Authenticate
  const authProfile = await authenticateUser();
  console.log('Authenticated user profile:', authProfile);
  // --8<-- [end:authenticate]

  // --8<-- [start:get-buckets-msp]
  // Get buckets from MSP
  const buckets = await getBucketsFromMSP();
  console.log('Buckets in MSP:', buckets);
  // --8<-- [end:get-buckets-msp]

  // --8<-- [start:get-bucket-files-msp]
  // Get bucket files from MSP
  const files = await getBucketFilesFromMSP(bucketId);
  console.log(`Files in bucket with ID ${bucketId}:`);
  console.log(JSON.stringify(files, null, 2)); // --8<-- [end:get-bucket-files-msp]

  // --8<-- [start:request-file-deletion]
  // Request file deletion
  const isDeletionRequestSuccessful = await requestDeleteFile(
    bucketId,
    fileKey,
  );
  console.log(
    'File deletion request submitted successfully:',
    isDeletionRequestSuccessful,
  );
  // --8<-- [end:request-file-deletion]

  // --8<-- [start:wait-for-backend-bucket-empty]
  // Wait for backend to process deletion and verify bucket is empty
  await waitForBackendBucketEmpty(bucketId);
  // --8<-- [end:wait-for-backend-bucket-empty]

  // --8<-- [start:delete-bucket]
  // Delete bucket
  const isBucketDeletionSuccessful = await deleteBucket(bucketId);
  console.log('Bucket deletion successful:', isBucketDeletionSuccessful);
  // --8<-- [end:delete-bucket]

  await polkadotApi.disconnect();
}

run();

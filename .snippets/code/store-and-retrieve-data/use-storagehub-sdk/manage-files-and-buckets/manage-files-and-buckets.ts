// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import { authenticateUser } from './services/mspService.js';
import { requestDeleteFile } from './operations/fileOperations.js';
import { deleteBucket } from './operations/bucketOperations.js';
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

  // --8<-- [start:request-file-deletion]
  // Request file deletion
  const isDeletionRequestSuccessful = await requestDeleteFile(
    bucketId,
    fileKey
  );
  console.log(
    'File deletion request submitted succesfully:',
    isDeletionRequestSuccessful
  );
  // --8<-- [end:request-file-deletion]

  // --8<-- [start:delete-bucket]
  const IsBucketDeletionSuccessful = await deleteBucket(bucketId);
  console.log('Bucket deletion successful:', IsBucketDeletionSuccessful);
  // --8<-- [end:delete-bucket]

  await polkadotApi.disconnect();
}

run();

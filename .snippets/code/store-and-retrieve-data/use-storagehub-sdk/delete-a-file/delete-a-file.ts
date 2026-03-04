// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import { authenticateUser } from './services/mspService.js';
import { requestDeleteFile, waitForFileDeletion } from './operations/fileOperations.js';
// --8<-- [end:imports]

async function run() {
  // Initialize WASM
  await initWasm();

  // --8<-- [start:init-setup]
  const bucketId = 'INSERT_BUCKET_ID'; // `0x${string}`
  const fileKey = 'INSERT_FILE_KEY'; // `0x${string}`
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
    fileKey,
  );
  console.log(
    'File deletion request submitted successfully:',
    isDeletionRequestSuccessful,
  );
  // --8<-- [end:request-file-deletion]

  // --8<-- [start:wait-for-file-deletion]
  // Wait for file deletion to be confirmed by the MSP backend
  await waitForFileDeletion(bucketId, fileKey);
  // --8<-- [end:wait-for-file-deletion]

  await polkadotApi.disconnect();
}

run();

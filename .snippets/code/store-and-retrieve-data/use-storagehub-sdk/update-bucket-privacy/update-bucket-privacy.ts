// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import {
  updateBucketPrivacy,
  verifyBucketCreation,
} from './operations/bucketOperations.js';
// --8<-- [end:imports]

async function run() {
  await initWasm();

  const bucketId = 'INSERT_BUCKET_ID'; // `0x${string}`

  // --8<-- [start:update-privacy]
  // Update bucket privacy to private
  await updateBucketPrivacy(bucketId, true);
  // --8<-- [end:update-privacy]

  // --8<-- [start:verify-privacy]
  // Verify the privacy was updated on chain
  const bucketDataAfterUpdate = await verifyBucketCreation(bucketId);
  console.log('Bucket data after setting private:', bucketDataAfterUpdate);
  console.log(`Privacy after update: ${bucketDataAfterUpdate.private}\n`);
  // --8<-- [end:verify-privacy]

  await polkadotApi.disconnect();
}

await run();

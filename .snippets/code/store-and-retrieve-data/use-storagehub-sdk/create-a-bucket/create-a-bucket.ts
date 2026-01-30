// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import {
  createBucket,
  verifyBucketCreation,
  waitForBackendBucketReady,
} from './operations/bucketOperations.js';
import { HealthStatus } from '@storagehub-sdk/msp-client';
import { mspClient } from './services/mspService.js';
// --8<-- [end:imports]

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();

  // --- Bucket creating logic ---

  // --8<-- [start:check-msp-health]
  // Check MSP Health Status
  const mspHealth: HealthStatus = await mspClient.info.getHealth();
  console.log('MSP Health Status:', mspHealth);
  // --8<-- [end:check-msp-health]

  // --8<-- [start:create-bucket]
  // Create a bucket
  const bucketName = 'init-bucket';
  const { bucketId, txReceipt } = await createBucket(bucketName);
  console.log(`Created Bucket ID: ${bucketId}`);
  console.log(`createBucket() txReceipt: ${txReceipt}`);
  // --8<-- [end:create-bucket]

  // --8<-- [start:verify-bucket]
  // Verify bucket exists on chain
  const bucketData = await verifyBucketCreation(bucketId);
  console.log('Bucket data:', bucketData);
  // --8<-- [end:verify-bucket]

  // --8<-- [start:wait-bucket]
  // Wait until indexer/backend knows about the bucket
  await waitForBackendBucketReady(bucketId);
  // --8<-- [end:wait-bucket]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();

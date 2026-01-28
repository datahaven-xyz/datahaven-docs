import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import { createBucket } from './operations/bucketOperations.js';

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();

  // --- Bucket creating logic ---
  // Create a bucket
  const bucketName = 'init-bucket';
  const { bucketId, txReceipt } = await createBucket(bucketName);
  console.log(`Created Bucket ID: ${bucketId}`);
  console.log(`createBucket() txReceipt: ${txReceipt}`);

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();

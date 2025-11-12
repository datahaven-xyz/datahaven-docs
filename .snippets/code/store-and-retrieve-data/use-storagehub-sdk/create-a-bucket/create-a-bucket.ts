// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { HealthStatus, InfoResponse } from '@storagehub-sdk/msp-client';
import {
  address,
  polkadotApi,
  publicClient,
  storageHubClient,
} from './services/clientService.js';
import { getValueProps, mspClient } from './services/mspService.js';
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

  // --8<-- [start:derive-bucket]
  // Derive bucket ID
  const bucketName = 'init-bucket';
  const bucketId = (await storageHubClient.deriveBucketId(
    address,
    bucketName
  )) as string;
  console.log('Derived bucket ID: ', bucketId);
  // --8<-- [end:derive-bucket]

  // --8<-- [start:check-bucket]
  // Check that the bucket doesn't exist yet
  const bucketBeforeCreation = await polkadotApi.query.providers.buckets(
    bucketId
  );
  console.log(
    'Bucket before creation is empty: ',
    bucketBeforeCreation.isEmpty
  );
  // --8<-- [end:check-bucket]

  // --8<-- [start:get-msp-params]
  // Get basic MSP information from the MSP including its ID
  const mspInfo: InfoResponse = await mspClient.info.getInfo();
  const mspId = mspInfo.mspId as `0x${string}`;
  console.log('MSP ID:', mspId);

  // Choose one of the value props retrieved from the MSP through the helper function
  const valuePropId: `0x${string}` = await getValueProps();
  console.log('Chosen value prop ID: ', valuePropId);

  // --8<-- [end:get-msp-params]

  // --8<-- [start:create-bucket]
  // Define if bucket should be private or public
  const isPrivate = false;

  // Create bucket on chain
  const txHash: `0x${string}` | undefined = await storageHubClient.createBucket(
    mspId as `0x${string}`,
    bucketName,
    isPrivate,
    valuePropId
  );
  console.log('createBucket() txHash:', txHash);
  if (!txHash) {
    throw new Error('createBucket() did not return a transaction hash');
  }

  // Wait for transaction receipt
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log('Bucket creation receipt:', receipt);
  if (receipt.status !== 'success') {
    throw new Error(`Bucket creation failed: ${txHash}`);
  }
  // --8<-- [end:create-bucket]

  // --8<-- [start:verify-bucket]
  const bucketAfterCreation = await polkadotApi.query.providers.buckets(
    bucketId
  );
  console.log('Bucket after creation exists', !bucketAfterCreation.isEmpty);

  // Unwrap bucket in order to read its data
  const bucketData = bucketAfterCreation.unwrap();
  console.log('Bucket data:', bucketData);

  // Check if the retrieved bucket's MSP ID matches the initial MSP ID you retrieved
  console.log(
    'Bucket mspId matches initial mspId:',
    bucketData.mspId.toString() === mspId
  );
  // Check if the retrieved bucket's userId (owner address) matches the initial address you used to create the bucket
  console.log(
    'Bucket userId matches initial bucket owner address:',
    bucketData.userId.toString() === address
  );
  // --8<-- [end:verify-bucket]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();

// --8<-- [start:imports]
import {
  storageHubClient,
  address,
  publicClient,
  polkadotApi,
} from '../services/clientService.js';
import {
  getMspInfo,
  getValueProps,
  mspClient,
} from '../services/mspService.js';
// --8<-- [end:imports]

// --8<-- [start:create-bucket]
export async function createBucket(bucketName: string) {
  // Get basic MSP information from the MSP including its ID
  const { mspId } = await getMspInfo();

  // Choose one of the value props retrieved from the MSP through the helper function
  const valuePropId = await getValueProps();
  console.log(`Value Prop ID: ${valuePropId}`);

  // Derive bucket ID
  const bucketId = (await storageHubClient.deriveBucketId(
    address,
    bucketName
  )) as string;
  console.log(`Derived bucket ID: ${bucketId}`);

  // Check that the bucket doesn't exist yet
  const bucketBeforeCreation = await polkadotApi.query.providers.buckets(
    bucketId
  );
  console.log('Bucket before creation is empty', bucketBeforeCreation.isEmpty);
  if (!bucketBeforeCreation.isEmpty) {
    throw new Error(`Bucket already exists: ${bucketId}`);
  }

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
  const txReceipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  if (txReceipt.status !== 'success') {
    throw new Error(`Bucket creation failed: ${txHash}`);
  }

  return { bucketId, txReceipt };
}
// --8<-- [end:create-bucket]

// --8<-- [start:verify-bucket]
// Verify bucket creation on chain and return bucket data
export async function verifyBucketCreation(bucketId: string) {
  const { mspId } = await getMspInfo();

  const bucket = await polkadotApi.query.providers.buckets(bucketId);
  if (bucket.isEmpty) {
    throw new Error('Bucket not found on chain after creation');
  }

  const bucketData = bucket.unwrap().toHuman();
  console.log(
    'Bucket userId matches initial bucket owner address',
    bucketData.userId === address
  );
  console.log(
    `Bucket MSPId matches initial MSPId: ${bucketData.mspId === mspId}`
  );
  return bucketData;
}
// --8<-- [end:verify-bucket]

// --8<-- [start:wait-for-indexer]
export async function waitForIndexer(bucketId: string) {
  const maxAttempts = 10;
  const delayMs = 2000;

  for (let i = 0; i < maxAttempts; i++) {
    console.log(
      `Checking for bucket in MSP backend, attempt ${
        i + 1
      } of ${maxAttempts}...`
    );
    try {
      const bucket = await mspClient.buckets.getBucket(bucketId);

      if (bucket) {
        console.log('Bucket found in MSP backend:', bucket);
        return;
      }
    } catch (error: any) {
      if (error.status === 404 || error.body.error === 'Not found: Record') {
        console.log(`Bucket not found in MSP backend yet (404).`);
      } else {
        console.log('Unexpected error while fetching bucket from MSP:', error);
        throw error;
      }
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error(`Bucket ${bucketId} not found in MSP backend after waiting`);
}
// --8<-- [end:wait-for-indexer]

import { createPublicClient, http, PublicClient } from 'viem';

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

// Create a public client using defined chain and RPC url in order to wait for transaction receipt
const publicClient: PublicClient = createPublicClient({
  chain, // reuse chain definition from "Initialize StorageHub Client" step
  transport: http('TODO'),
});

// Wait for transaction receipt
const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
console.log('Bucket creation receipt:', receipt);
if (receipt.status !== 'success') {
  throw new Error(`Bucket creation failed: ${txHash}`);
}

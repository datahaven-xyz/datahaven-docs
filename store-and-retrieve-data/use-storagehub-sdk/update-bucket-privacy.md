---
title: Update Bucket Privacy
description: Learn how to toggle a bucket's privacy setting on DataHaven by calling the FileSystem Precompile's updateBucketPrivacy function directly.
categories: Store Data, Smart Contract
---

# Update Bucket Privacy

Every bucket on DataHaven is created with a privacy flag that controls whether its contents are publicly visible or access-restricted. This guide shows you how to change that flag after the bucket already exists by calling the `updateBucketPrivacy` function on the [FileSystem Precompile](https://github.com/Moonsong-Labs/storage-hub/blob/main/precompiles/pallet-file-system/FileSystem.sol#L7){target=\_blank} directly via `walletClient.writeContract`.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- [A bucket created](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} with the ID handy
- The [`FileSystemABI.json`](https://github.com/Moonsong-Labs/storage-hub/blob/main/precompiles/pallet-file-system/FileSystem.sol#L7){target=\_blank} file placed in an `abis/` folder in your project root (e.g., `src/abis/FileSystemABI.json`). You can obtain the ABI by compiling the Solidity interface or extracting it from the precompile repository

## Initialize the Script Entry Point

Create an `index.ts` file if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you'll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/update-bucket-privacy/update-bucket-privacy.ts:imports'

async function run() {
  await initWasm();

  const bucketId = 'INSERT_BUCKET_ID'; // `0x${string}`

  // **PLACEHOLDER FOR STEP 1: UPDATE BUCKET PRIVACY**
  // **PLACEHOLDER FOR STEP 2: VERIFY PRIVACY CHANGE**

  await polkadotApi.disconnect();
}

await run();
```

## Add the Update Bucket Privacy Helper

Create a `bucketOperations.ts` file within your `operations` folder (or add to an existing one). This helper calls `walletClient.writeContract` with `functionName: 'updateBucketPrivacy'`, passing the bucket ID and a boolean `isPrivate` flag. Setting `isPrivate` to `true` makes the bucket private; `false` makes it public again.

```ts title="operations/bucketOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/update-bucket-privacy/bucketOperations.ts:imports'

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/update-bucket-privacy/bucketOperations.ts:update-bucket-privacy'
```

## Update the Bucket Privacy

Replace the placeholder `// **PLACEHOLDER FOR STEP 1: UPDATE BUCKET PRIVACY**` with the following code:

```ts title="index.ts // **PLACEHOLDER FOR STEP 1: UPDATE BUCKET PRIVACY**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/update-bucket-privacy/update-bucket-privacy.ts:update-privacy'
```

If you run the script, you should see the transaction hash and receipt confirming the update:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/update-bucket-privacy/output-01.html'

## Verify the Privacy Change On-Chain

To confirm the privacy setting was actually updated, query the on-chain bucket data and check the `private` field. Add the following `verifyBucketCreation` helper to your `bucketOperations.ts` file:

```ts title="operations/bucketOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/update-bucket-privacy/bucketOperations.ts:verify-bucket'
```

Replace the placeholder `// **PLACEHOLDER FOR STEP 2: VERIFY PRIVACY CHANGE**` with the following code:

```ts title="index.ts // **PLACEHOLDER FOR STEP 2: VERIFY PRIVACY CHANGE**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/update-bucket-privacy/update-bucket-privacy.ts:verify-privacy'
```

Upon successful verification, the bucket data should now show `private: true`:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/update-bucket-privacy/output-02.html'

??? code "View complete `bucketOperations.ts`"

    ```ts title="operations/bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/update-bucket-privacy/bucketOperations.ts'
    ```

??? code "View complete `index.ts`"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/update-bucket-privacy/update-bucket-privacy.ts'
    ```

## Next Steps

<div class="grid cards" markdown>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/" markdown>:material-arrow-right:

    **Manage Files and Buckets**

    Learn how to get file info, request file removal from the network, and how to delete buckets.

    </a>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **Build a Data Workflow End-to-End**

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    </a>

</div>

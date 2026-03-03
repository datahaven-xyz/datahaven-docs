---
title: Delete a Bucket via SDK
description: Learn how to delete an empty bucket from DataHaven using the StorageHub SDK, including a safety check to verify the bucket has no remaining files.
categories: Store Data, StorageHub SDK
---

# Delete a Bucket

This guide shows how to delete a bucket from DataHaven using the StorageHub SDK. A bucket can only be deleted when it is empty — all files stored in the bucket must be deleted first. Bucket deletion is an on-chain transaction that permanently removes the bucket from the network.

You will fetch the bucket's metadata from your Main Storage Provider (MSP) to verify it contains no files, then submit the deletion transaction.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'
- [All files deleted](/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/){target=\_blank} from the bucket you want to remove

!!! note
    A bucket must be empty before it can be deleted. If the bucket still contains files, the on-chain transaction will revert.

## Initialize the Script Entry Point

First, create an `index.ts` file if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you'll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide.

The `index.ts` snippet below also imports `bucketOperations.ts`, which is not in your project yet—that's expected, as you'll create it later in this guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:imports'

async function run() {
  // Initialize WASM
  await initWasm();

  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:init-setup'

  // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**
  // **PLACEHOLDER FOR STEP 2: GET BUCKET INFO**
  // **PLACEHOLDER FOR STEP 3: DELETE BUCKET**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

run();
```

## Authenticate

Before any bucket operations, authenticate with the MSP. The `authenticateUser` helper signs a SIWE message and returns a session token that authorizes your requests. Add the following code to use the `authenticateUser` helper method you've already implemented in `mspService.ts`:

```ts title='index.ts // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:authenticate'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:imports'

      async function run() {
      // Initialize WASM
      await initWasm();

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:init-setup'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:authenticate'

      // **PLACEHOLDER FOR STEP 2: GET BUCKET INFO**
      // **PLACEHOLDER FOR STEP 3: DELETE BUCKET**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    run();
    ```

## Get Bucket Info

To verify that a bucket is empty before deleting it, create a helper method called `getBucketFromMSP` in a separate `bucketOperations.ts` file. This method fetches a single bucket's metadata — including its file count — from the MSP. Then, update the `index.ts` file accordingly to execute that logic.

### Add Method to Get Bucket Info

1. Create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

    ```bash
    mkdir operations
    ```

2. Create a new file within the `operations` folder called `bucketOperations.ts`.

3. Add the following code:

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/bucketOperations.ts:imports'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/bucketOperations.ts:get-bucket-from-msp'

    // Add other helper methods here
    ```

### Call the Get Bucket Info Helper Method

Update `index.ts` with the following code to trigger the `getBucketFromMSP` helper method you just implemented:

```ts title='index.ts  // **PLACEHOLDER FOR STEP 2: GET BUCKET INFO**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:get-bucket-info'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:init-setup'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:authenticate'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:get-bucket-info'

      // **PLACEHOLDER FOR STEP 3: DELETE BUCKET**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    run();
    ```

## Delete the Bucket

To delete a bucket, create a helper method called `deleteBucket` in your `bucketOperations.ts` file and then update the `index.ts` file accordingly, to execute that logic.

!!! note
    A bucket can only be deleted if all its files have already been deleted. Use the `mspClient.buckets.getFiles()` method by passing a `bucketId` as a parameter to check all the files currently stored in that bucket.

### Add Method to Delete Bucket

Add the following code to your `bucketOperations.ts` file:

```ts title="bucketOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/bucketOperations.ts:delete-bucket'
```

### Call the Delete Bucket Helper Method

Update `index.ts` with the following code to trigger the `deleteBucket` helper method you just implemented:

```ts title='index.ts  // **PLACEHOLDER FOR STEP 3: DELETE BUCKET**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts:delete-bucket'
```

If you run the script with the bucket deletion code, the response should include:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/output-01.html'

??? code "View complete `index.ts`"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/delete-a-bucket.ts'
    ```

??? code "View complete `bucketOperations.ts`"

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/bucketOperations.ts'
    ```

## Next Steps

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/" markdown>:material-arrow-right:

    **Delete a File**

    Learn how to request the deletion of a file stored on the DataHaven network.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/" markdown>:material-arrow-right:

    **Clean Up a Bucket**

    Delete all files and remove a bucket in a single workflow.

    </a>

</div>

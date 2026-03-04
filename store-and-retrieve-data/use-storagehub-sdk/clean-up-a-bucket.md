---
title: Clean Up a Bucket via SDK
description: Learn how to use the StorageHub SDK to dynamically delete all files in a bucket, wait for processing, then delete the bucket itself.
categories: Store Data, StorageHub SDK
---

# Clean Up a Bucket

This tutorial walks through the full end-to-end cleanup workflow for a DataHaven bucket using the StorageHub SDK. You will dynamically discover all files in a bucket, delete them one by one, wait for the network to process the deletions, and then delete the bucket itself. The `deleteAllFilesInBucket` helper method handles multi-file deletion automatically by iterating through every file in the bucket.

Periodically cleaning up unused buckets is important for cost management, as buckets and files incur ongoing storage fees on the network.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'
- [Multiple files uploaded](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/){target=\_blank} to DataHaven

## Initialize the Script Entry Point

First, create an `index.ts` file if you have not already. Its `run` method will orchestrate all the logic in this tutorial, and you will replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide.

The `index.ts` snippet below also imports `bucketOperations.ts` and `fileOperations.ts`, which are not in your project yet—that is expected, as you will create them later in this tutorial.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:imports'

async function run() {
  // Initialize WASM
  await initWasm();

  console.log('🧹 Starting Clean Up Bucket Script...');

  // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**
  // **PLACEHOLDER FOR STEP 2: GET BUCKETS**
  // **PLACEHOLDER FOR STEP 3: DELETE ALL FILES**
  // **PLACEHOLDER FOR STEP 4: WAIT FOR BUCKET EMPTY**
  // **PLACEHOLDER FOR STEP 5: DELETE BUCKET**

  console.log('🧹 Clean Up Bucket Script Completed Successfully.');

  await polkadotApi.disconnect();
}

run();
```

## Authenticate

Before any file operations, authenticate with the MSP. The `authenticateUser` helper signs a SIWE message and returns a session token that authorizes your uploads, updates, and deletions. Add the following code to use the `authenticateUser` helper method you have already implemented in `mspService.ts`:

```ts title='index.ts // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:authenticate'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      console.log('🧹 Starting Clean Up Bucket Script...');

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:authenticate'

      // **PLACEHOLDER FOR STEP 2: GET BUCKETS**
      // **PLACEHOLDER FOR STEP 3: DELETE ALL FILES**
      // **PLACEHOLDER FOR STEP 4: WAIT FOR BUCKET EMPTY**
      // **PLACEHOLDER FOR STEP 5: DELETE BUCKET**

      console.log('🧹 Clean Up Bucket Script Completed Successfully.');

      await polkadotApi.disconnect();
    }

    run();
    ```

## Get Buckets From MSP

To fetch your buckets stored in a specific MSP, create a helper method called `getBucketsFromMSP` in a separate `bucketOperations.ts` file and then update the `index.ts` file accordingly, to execute that logic.

### Add Method to Get Buckets From MSP

1. Create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

    ```bash
    mkdir operations
    ```

2. Create a new file within the `operations` folder called `bucketOperations.ts`.

3. Add the following code:

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/bucketOperations.ts:imports'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/bucketOperations.ts:get-buckets-msp'

    // Add other helper methods here
    ```

### Call the Get Buckets From MSP Helper Method

Update `index.ts` with the following code to trigger the `getBucketsFromMSP` helper method you just implemented. This step also selects the first bucket from the list to use for the remaining operations:

```ts title='index.ts  // **PLACEHOLDER FOR STEP 2: GET BUCKETS**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:get-buckets'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      console.log('🧹 Starting Clean Up Bucket Script...');

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:authenticate'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:get-buckets'

      // **PLACEHOLDER FOR STEP 3: DELETE ALL FILES**
      // **PLACEHOLDER FOR STEP 4: WAIT FOR BUCKET EMPTY**
      // **PLACEHOLDER FOR STEP 5: DELETE BUCKET**

      console.log('🧹 Clean Up Bucket Script Completed Successfully.');

      await polkadotApi.disconnect();
    }

    run();
    ```

If you run the script with the code above, the full response should look like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/output-01.html'

## Delete All Files in the Bucket

To delete all files in a bucket, you need two helper methods in your `fileOperations.ts` file: `requestDeleteFile` handles the on-chain deletion of a single file, and `deleteAllFilesInBucket` recursively discovers every file in the bucket's file tree and deletes them one by one. Each file deletion is an individual on-chain transaction, so they are processed sequentially.

It is important to note that files are not removed instantly. When a deletion request succeeds, the file is marked for deletion on-chain, but both the MSP and all BSPs storing it still have it in their Merkle Patricia Forests until they pass the mandatory storage proof challenge. After that, the Fishermen nodes automatically update the Merkle Patricia Forest roots to remove the file.

### Add Methods to Delete All Files

1. Create a new file within the `operations` folder called `fileOperations.ts`.

2. Add the code below to implement the following helper methods:
    - **`requestDeleteFile`** - Fetches a file's metadata from the MSP and submits the on-chain deletion transaction
    - **`getBucketFilesFromMSP`** - Retrieves the file list for a given bucket
    - **`deleteAllFilesInBucket`** - Recursively collects all file keys from the file tree and calls `requestDeleteFile` for each file sequentially

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/fileOperations.ts:imports'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/fileOperations.ts:request-file-deletion'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/fileOperations.ts:get-bucket-files-msp'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/fileOperations.ts:delete-all-files-in-bucket'
    ```

The `deleteAllFilesInBucket` method works as follows:

1. Calls `getBucketFilesFromMSP` to fetch the file list for the given bucket.
2. Recursively traverses the file tree using `collectFileKeys`, which handles nested folder structures.
3. Iterates sequentially over each file key, calling `requestDeleteFile` for each one.
4. Returns the original file list so downstream steps can check whether files existed.

### Call the Delete All Files Helper Method

Update `index.ts` with the following code to trigger the `deleteAllFilesInBucket` helper method you just implemented:

```ts title='index.ts  // **PLACEHOLDER FOR STEP 3: DELETE ALL FILES**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:delete-all-files'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      console.log('🧹 Starting Clean Up Bucket Script...');

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:authenticate'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:get-buckets'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:delete-all-files'

      // **PLACEHOLDER FOR STEP 4: WAIT FOR BUCKET EMPTY**
      // **PLACEHOLDER FOR STEP 5: DELETE BUCKET**

      console.log('🧹 Clean Up Bucket Script Completed Successfully.');

      await polkadotApi.disconnect();
    }

    run();
    ```

??? code "View complete `fileOperations.ts` up until this point"

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/fileOperations.ts'
    ```

If you run the script with the code above, the full response should look like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/output-02.html'

## Wait for Backend to Return Empty Bucket

Right after your files' deletions are requested, your script will immediately try to delete the bucket. At this point, the files might not have been fully removed, or if they have been, DataHaven's indexer may not have processed those blocks yet. Until the indexer catches up, the MSP backend will not show up-to-date data, so any bucket deletion attempt will fail.

To avoid that race condition, you will add a polling helper that waits for the indexer to acknowledge your bucket is empty before continuing.

1. Add the following code in your `bucketOperations.ts` file:

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/bucketOperations.ts:wait-for-backend-bucket-empty'
    ```

    ??? code "View complete `bucketOperations.ts` up until this point"

        ```ts title="bucketOperations.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/bucketOperations.ts:imports'

        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/bucketOperations.ts:get-buckets-msp'

        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/bucketOperations.ts:wait-for-backend-bucket-empty'

        // Add other helper methods here
        ```

2. Update the `index.ts` file to trigger the helper method you just implemented:

    ```ts title="index.ts // **PLACEHOLDER FOR STEP 4: WAIT FOR BUCKET EMPTY**"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:wait-for-bucket-empty'
    ```

    The response should look something like this:

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/output-03.html'

    ??? code "View complete `index.ts` up until this point"

        ```ts title="index.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:imports'

        async function run() {
        // Initialize WASM
        await initWasm();

        console.log('🧹 Starting Clean Up Bucket Script...');

        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:authenticate'

        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:get-buckets'

        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:delete-all-files'

        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:wait-for-bucket-empty'

        // **PLACEHOLDER FOR STEP 5: DELETE BUCKET**

        console.log('🧹 Clean Up Bucket Script Completed Successfully.');

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
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/bucketOperations.ts:delete-bucket'
```

### Call the Delete Bucket Helper Method

Update `index.ts` with the following code to trigger the `deleteBucket` helper method you just implemented:

```ts title="index.ts  // **PLACEHOLDER FOR STEP 5: DELETE BUCKET**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts:delete-bucket'
```

If you run the script with the bucket deletion code, the response should include:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/output-04.html'

??? code "View complete `index.ts`"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/clean-up-a-bucket.ts'
    ```

??? code "View complete `bucketOperations.ts`"

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/bucketOperations.ts'
    ```

??? code "View complete `fileOperations.ts`"

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/fileOperations.ts'
    ```

## Next Steps

<div class="grid cards" markdown>

-  <a href="/how-it-works/data-and-provider-model/data-flow-and-lifecycle/" markdown>:material-arrow-right:

    **Data Flow and Lifecycle**

    Follow data on a step-by-step journey through DataHaven.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **Build a Data Workflow End-to-End**

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    </a>

</div>

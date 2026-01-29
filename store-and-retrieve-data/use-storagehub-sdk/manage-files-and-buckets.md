---
title: Manage Files and Buckets
description: Guide on how to use the StorageHub SDK to remove your file from the network and how to delete your bucket.
---

# Manage Files and Buckets

This guide explains how to manage your storage resources on DataHaven using the StorageHub SDK. You will learn how to fetch all the buckets you have stored within a specific MSP, fetch all the files within a specific bucket in a specific MSP, request the removal of a file from the network, and delete buckets. It's important to periodically review and clean up unused data to avoid unnecessary costs, as buckets and files incur ongoing storage fees.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'
- [A file uploaded](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/){target=\_blank} to DataHaven, along with the [file key](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/#compute-the-file-key){target=\_blank}

## Initialize the Script Entry Point

First, create an `index.ts` file if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you’ll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide.

The `index.ts` snippet below also imports `bucketOperations.ts` and `fileOperations.ts`, which are not in your project yet—that's expected, as you'll create them later in this guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:imports'

async function run() {
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:init-setup'

  // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**
  // --- Data fetching logic ---
  // **PLACEHOLDER FOR STEP 2: GET YOUR BUCKETS**
  // **PLACEHOLDER FOR STEP 3: GET YOUR BUCKET FILES**
  // --- Data deleting logic ---
  // **PLACEHOLDER FOR STEP 4: REQUEST FILE DELETION**
  // **PLACEHOLDER FOR STEP 5: WAIT FOR BACKEND TO RETURN EMPTY BUCKET**
  // **PLACEHOLDER FOR STEP 6: DELETE A BUCKET**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Authenticate

Before any file operations, authenticate with the MSP. The `authenticateUser` helper signs a SIWE message and returns a session token that authorizes your uploads, updates, and deletions. Add the following code to use the `authenticateUser` helper method you've already implemented in `mspService.ts`:

```ts title='index.ts // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:authenticate'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:imports'

      async function run() {
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:init-setup'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:authenticate'

      // --- Data fetching logic ---
      // **PLACEHOLDER FOR STEP 2: GET YOUR BUCKETS**
      // **PLACEHOLDER FOR STEP 3: GET YOUR BUCKET FILES**
      // --- Data deleting logic ---
      // **PLACEHOLDER FOR STEP 4: REQUEST FILE DELETION**
      // **PLACEHOLDER FOR STEP 5: WAIT FOR BACKEND TO RETURN EMPTY BUCKET**
      // **PLACEHOLDER FOR STEP 6: DELETE A BUCKET**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    await run();
    ```

## Get Buckets From MSP

To fetch your buckets stored in a specific MSP, create a helper method called `getBucketsFromMSP` in a separate `bucketOperations.ts` file and then update the `index.ts` file accordingly, in order to execute that logic.

### Add Method to Get Buckets From MSP

1. Create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

    ```bash
    mkdir operations
    ```

2. Create a new file within the `operations` folder called `bucketOperations.ts`.

3. Add the following code:

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/bucketOperations.ts:imports'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/bucketOperations.ts:get-buckets-msp'

    // Add other helper methods here
    ```

### Call the Get Buckets From MSP Helper Method

Update `index.ts` with the following code to trigger the `getBucketsFromMSP` helper method you just implemented:

```ts title='index.ts  // **PLACEHOLDER FOR STEP 2: GET YOUR BUCKETS**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:get-buckets-msp'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:imports'

    async function run() {
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:init-setup'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:authenticate'

      // --- Data fetching logic ---

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:get-buckets-msp'

      // **PLACEHOLDER FOR STEP 3: GET YOUR BUCKET FILES**
      // --- Data deleting logic ---
      // **PLACEHOLDER FOR STEP 4: REQUEST FILE DELETION**
      // **PLACEHOLDER FOR STEP 5: WAIT FOR BACKEND TO RETURN EMPTY BUCKET**
      // **PLACEHOLDER FOR STEP 6: DELETE A BUCKET**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    await run();
    ```

If you run the script with the code above, the full response should look like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/output-01.html'


## Get Bucket Files From MSP

To fetch your files from a specific bucket stored in a specific MSP, create a helper method called `getBucketFilesFromMSP` in a separate `fileOperations.ts` file and then update the `index.ts` file accordingly, in order to execute that logic.

### Add Method to Get Bucket Files From MSP

1. Create a new file within the `operations` folder called `fileOperations.ts`.

2. Add the following code:

```ts title="fileOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/fileOperations.ts:imports'

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/fileOperations.ts:get-bucket-files-msp'

// Add other helper methods here
```

### Call the Get Bucket Files From MSP Helper Method

Update `index.ts` with the following code to trigger the `getBucketFilesFromMSP` helper method you just implemented:

```ts title='index.ts  // **PLACEHOLDER FOR STEP 3: GET YOUR BUCKET FILES**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:get-bucket-files-msp'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:imports'

    async function run() {
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:init-setup'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:authenticate'

      // --- Data fetching logic ---

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:get-buckets-msp'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:get-bucket-files-msp'

      // --- Data deleting logic ---
      // **PLACEHOLDER FOR STEP 4: REQUEST FILE DELETION**
      // **PLACEHOLDER FOR STEP 5: WAIT FOR BACKEND TO RETURN EMPTY BUCKET**
      // **PLACEHOLDER FOR STEP 6: DELETE A BUCKET**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    await run();
    ```

If you run the script with the code above, the response should look like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/output-02.html'

## Request File Deletion

To request file deletion, create a helper method called `requestDeleteFile` in your `fileOperations.ts` file and then update the `index.ts` file accordingly, in order to execute that logic. First, fetch the file’s metadata from the MSP and then submit a deletion request using the StorageHub SDK.

It’s important to note that files are not removed instantly. When a deletion request succeeds, the file is marked for deletion on-chain, but both the MSP and all BSPs storing it still have it in their Merkle Patricia Forests until they pass the mandatory storage proof challenge. After that, the runtime automatically updates the Merkle Patricia Forest roots to remove the file.

### Add Method to Request File Deletion

Add the following code:

```ts title="fileOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/fileOperations.ts:request-file-deletion'
```

### Call the Request File Deletion Helper Method

Update `index.ts` with the following code to trigger the `requestDeleteFile` helper method you just implemented:

```ts title='index.ts  // **PLACEHOLDER FOR STEP 4: REQUEST FILE DELETION**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:request-file-deletion'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:imports'

    async function run() {
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:init-setup'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:authenticate'

      // --- Data fetching logic ---

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:get-buckets-msp'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:get-bucket-files-msp'

      // --- Data deleting logic ---

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:request-file-deletion'

      // **PLACEHOLDER FOR STEP 5: WAIT FOR BACKEND TO RETURN EMPTY BUCKET**
      // **PLACEHOLDER FOR STEP 6: DELETE A BUCKET**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    await run();
    ```

    !!! note
        After a file is uploaded to a Main Storage Provider (MSP), the network allows a 10-minute window for Backup Storage Providers (BSPs) to replicate the file to the required count. Within this time window, the deletion of a file cannot be requested. If the replication target is not met within this window, the request transitions to `expired` even though the upload to the MSP succeeded.

If you run the script with the code above, the full response should look like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/output-03.html'

## Wait for Backend to Return Empty Bucket

Right after your file's deletion is requested, your script will immediately try to delete the bucket your file was in. At this point, the file might not have been deleted, or if it has been, DataHaven’s indexer may not have processed that block yet. Until the indexer catches up, the MSP backend won't show up-to-date data, so any bucket deletion attempt will fail.
To avoid that race condition, you’ll add a small polling helper that waits for the indexer to acknowledge your bucket is empty before continuing.

1. Add the following code in your `bucketOperations.ts` file:
    
    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/bucketOperations.ts:wait-for-backend-bucket-empty'
    ```

??? code "View complete `bucketOperations.ts` up until this point"

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/bucketOperations.ts:imports'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/bucketOperations.ts:get-buckets-msp'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/bucketOperations.ts:wait-for-backend-bucket-empty'

    // Add other helper methods here
    ```

2. Update the `index.ts` file to trigger the helper method you just implemented:

    ```ts title="index.ts // **PLACEHOLDER FOR STEP 5: WAIT FOR BACKEND TO RETURN EMPTY BUCKET**"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:wait-for-backend-bucket-empty'
    ```

    The response should look something like this:

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/output-04.html'

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:imports'

    async function run() {
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:init-setup'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:authenticate'

      // --- Data fetching logic ---

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:get-buckets-msp'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:get-bucket-files-msp'

      // --- Data deleting logic ---

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:request-file-deletion'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:wait-for-backend-bucket-empty'

      // **PLACEHOLDER FOR STEP 6: DELETE A BUCKET**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    await run();
    ```

## Delete a Bucket

To delete a bucket, create a helper method called `deleteBucket` in your `bucketOperations.ts` file and then update the `index.ts` file accordingly, to execute that logic.

!!! note
    A bucket can only be deleted if all its files have already been deleted. Use the `mspClient.buckets.getFiles()` method by passing a `bucketId` as a parameter to check all the files currently stored in that bucket.

### Add Method to Delete Bucket

Create a new file within the `operations` folder called `bucketOperations.ts` and add the following code:

```ts title="bucketOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/bucketOperations.ts:delete-bucket'
```

### Call the Delete Bucket Helper Method

Update `index.ts` with the following code to trigger the  `deleteBucket` helper method you just implemented:

```ts title="index.ts  // **PLACEHOLDER FOR STEP 6: DELETE BUCKET**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:delete-bucket'
```

If you run the script with the bucket deletion code, the response should include:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/output-05.html'

??? code "View complete `index.ts`"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts'
    ```

??? code "View complete `bucketOperations.ts`"

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/bucketOperations.ts'
    ```

??? code "View complete `fileOperations.ts`"

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/fileOperations.ts'
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
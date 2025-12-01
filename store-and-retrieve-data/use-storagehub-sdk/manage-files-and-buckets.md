---
title: Manage Files and Buckets
description: Guide on how to use the StorageHub SDK to remove your file from the network and how to delete your bucket.
---

# Manage Files and Buckets

This guide explains how to manage your storage resources on DataHaven using the StorageHub SDK. You will learn how to request the removal of a file from the network and how to delete buckets. It's important to periodically review and clean up unused data to avoid unnecessary costs, as buckets and files incur ongoing storage fees.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'
- [A file uploaded](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/){target=\_blank} to DataHaven, along with the [file key](/store-and-retrieve-data/use-storagehub-sdk/verify-storage-request-registration/#compute-the-file-key){target=\_blank}

## Initialize the Script Entry Point

First, create an `index.ts` file, if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you’ll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started Guide](/store-and-retrieve-data/use-storagehub-sdk/get-started). The `index.ts` snippet below also imports `fileOperations.ts` and `bucketOperations.ts`, which are not in your project yet. That’s expected, as you’ll create it later in this guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:imports'

async function run() {
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:init-setup'

  // --- Data deletion logic ---
  // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**
  // **PLACEHOLDER FOR STEP 2: REQUEST FILE DELETION**
  // **PLACEHOLDER FOR STEP 3: DELETE A BUCKET**

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

    // --- Data deletion logic ---
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:authenticate'
    // **PLACEHOLDER FOR STEP 2: REQUEST FILE DELETION**
    // **PLACEHOLDER FOR STEP 3: DELETE A BUCKET**

    // Disconnect the Polkadot API at the very end
    await polkadotApi.disconnect();
    }

    await run();
    ```

## Request File Deletion

To request file deletion, you are going to create a helper method called `requestDeleteFile` in a separate `fileOperations.ts` file and you are going to update the `index.ts` file accordingly, in order to execute that logic. First, you’ll fetch the file’s metadata from the MSP, format it for on-chain compatibility, and then submit a deletion request using the StorageHub SDK.

It’s important to note that files are not removed instantly. When a deletion request succeeds, the file is marked for deletion on-chain, but both the MSP and all BSPs storing that file still have the file inside their Merkle Patricia Forests until they pass the mandatory storage proof challenge. After that, the runtime automatically updates their Merkle Patricia Forest roots to remove the file.

### Create Request File Deletion Helper Method

To create the `requestDeleteFile` helper method, first make sure, if you haven't already in the previous guide, to create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

```bash
mkdir operations
```

Then, create a new file within the `operations` folder called `fileOperations.ts` and add the following code:

```ts title="fileOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/fileOperations.ts'
```

### Use Request File Deletion Helper Method

Update `index.ts` with the following code to trigger the `requestDeleteFile` helper method you just implemented:

```ts title='index.ts  // **PLACEHOLDER FOR STEP 2: REQUEST FILE DELETION**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:request-file-deletion'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:imports'

    async function run() {
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:init-setup'

    // --- Data deletion logic ---
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:authenticate'
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:request-file-deletion'
    // **PLACEHOLDER FOR STEP 3: DELETE A BUCKET**

    // Disconnect the Polkadot API at the very end
    await polkadotApi.disconnect();
    }

    await run();
    ```

If you run the script with the code above, the `fileInfo` and `formattedFileInfo` should look like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/output-01.html'

And the final response should include:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/output-02.html'

## Delete a Bucket

To delete a bucket, you are going to create a helper method called `deleteBucket` in a separate `bucketOperations.ts` file and you are going to update the `index.ts` file accordingly, in order to execute that logic.

!!! note
    A bucket can only be deleted if all its files have already been deleted. Use the `mspClient.buckets.getFiles()` method by passing a `bucketId` as a parameter to check all the files currently stored in that bucket.

### Create Delete Bucket Helper Method

Create a new file within the `operations` folder called `bucketOperations.ts` and add the following code:

```ts title="bucketOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/bucketOperations.ts'
```

### Use Delete Bucket Helper Method

Finally, update `index.ts` with the following code to trigger the  `deleteBucket` helper method you just implemented:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:delete-bucket'
```

??? code "View complete `index.ts`"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts'
    ```

If you run the script with the bucket deletion code, the response should include:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/output-03.html'

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

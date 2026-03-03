---
title: Delete a File via SDK
description: Learn how to use the StorageHub SDK to request the deletion of a file from DataHaven by submitting an on-chain deletion transaction.
categories: Store Data, StorageHub SDK
---

# Delete a File

This guide shows how to request the deletion of a single file from DataHaven using the StorageHub SDK. File deletion is a privileged operation that requires Sign-In with Ethereum (SIWE) authentication before it can be submitted.

It is important to note that files are not removed instantly. When a deletion request succeeds, the file is marked for deletion on-chain, but both the MSP and all BSPs storing it still have it in their Merkle Patricia Forests until they pass the mandatory storage proof challenge. After that, Fishermen nodes automatically update the Merkle Patricia Forest roots to remove the file.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'
- [A file uploaded](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/){target=\_blank} to DataHaven, along with the [file key](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/#compute-the-file-key){target=\_blank}

## Initialize the Script Entry Point

First, create an `index.ts` file if you have not already. Its `run` method will orchestrate all the logic in this guide, and you will replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide.

The `index.ts` snippet below also imports `fileOperations.ts`, which is not in your project yet—that is expected, as you will create it later in this guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:imports'

async function run() {
  // Initialize WASM
  await initWasm();

  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:init-setup'

  // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**
  // **PLACEHOLDER FOR STEP 2: REQUEST FILE DELETION**
  // **PLACEHOLDER FOR STEP 3: WAIT FOR FILE DELETION**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

run();
```

## Authenticate

Before any file operations, authenticate with the MSP. The `authenticateUser` helper signs a SIWE message and returns a session token that authorizes your uploads, updates, and deletions. Add the following code to use the `authenticateUser` helper method you have already implemented in `mspService.ts`:

```ts title='index.ts // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:authenticate'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:init-setup'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:authenticate'

      // **PLACEHOLDER FOR STEP 2: REQUEST FILE DELETION**
      // **PLACEHOLDER FOR STEP 3: WAIT FOR FILE DELETION**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    run();
    ```

## Request File Deletion

To request file deletion, create a helper method called `requestDeleteFile` in a `fileOperations.ts` file and then update the `index.ts` file accordingly to execute that logic. The helper first fetches the file's metadata from the MSP and then submits a deletion request using the StorageHub SDK.

### Add Method to Request File Deletion

1. Create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

    ```bash
    mkdir operations
    ```

2. Create a new file within the `operations` folder called `fileOperations.ts`.

3. Add the following code:

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/fileOperations.ts:imports'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/fileOperations.ts:request-file-deletion'
    ```

### Call the Request File Deletion Helper Method

1. Update `index.ts` with the following code to trigger the `requestDeleteFile` helper method you just implemented:

    !!! note
        After a file is uploaded to a Main Storage Provider (MSP), the network allows an 11-minute window for Backup Storage Providers (BSPs) to replicate the file to the required count. Within this time window, the deletion of a file cannot be requested. If the replication target is not met within this window, the request transitions to `expired` even though the upload to the MSP succeeded.

    ```ts title='index.ts // **PLACEHOLDER FOR STEP 2: REQUEST FILE DELETION**'
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:request-file-deletion'
    ```

    The deletion request should be fulfilled by one of the network's Fishermen nodes in less than one minute.

    ??? code "View complete `index.ts`"

        ```ts title="index.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:imports'

        async function run() {
          // Initialize WASM
          await initWasm();

          --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:init-setup'

          --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:authenticate'

          --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:request-file-deletion'

          // **PLACEHOLDER FOR STEP 3: WAIT FOR FILE DELETION**

          // Disconnect the Polkadot API at the very end
          await polkadotApi.disconnect();
        }

        run();
        ```

2. Run the script:

    ```bash
    ts-node index.ts
    ```

    Upon a successful file deletion request, you will see output similar to:

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/output-01.html'

## Wait for Backend Before Proceeding

After a file deletion request succeeds on-chain, there is a short window during which DataHaven's indexer has not yet processed the deletion. Until the indexer catches up, the MSP backend may still return the file's metadata. To avoid that race condition, you can add a small polling helper that waits until the MSP backend confirms the file has been removed.

### Add Method to Wait for File Deletion

1. Add the following code to your `fileOperations.ts` file:

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/fileOperations.ts:wait-for-file-deletion'
    ```

### Call the Wait for File Deletion Helper Method

1. Update `index.ts` with the following code to trigger the `waitForFileDeletion` helper method you just implemented:

    ```ts title='index.ts // **PLACEHOLDER FOR STEP 3: WAIT FOR FILE DELETION**'
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:wait-for-file-deletion'
    ```

    The response should look something like this:

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/output-02.html'

??? code "View complete `index.ts`"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:init-setup'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:authenticate'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:request-file-deletion'

      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/delete-a-file.ts:wait-for-file-deletion'

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    run();
    ```

??? code "View complete `fileOperations.ts`"

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/delete-a-file/fileOperations.ts'
    ```

## Next Steps

<div class="grid cards" markdown>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/delete-a-bucket/" markdown>:material-arrow-right:

    **Delete a Bucket**

    Learn how to remove an empty bucket from DataHaven after all its files have been deleted.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/clean-up-a-bucket/" markdown>:material-arrow-right:

    **Clean Up a Bucket**

    Remove all files from a bucket and prepare it for deletion.

    </a>

</div>

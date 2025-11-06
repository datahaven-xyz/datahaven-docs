---
title: Manage Files and Buckets
description: Guide on how to use the StorageHub SDK to remove your file from the network and how to delete your bucket.
---

# Manage Files and Buckets

This guide explains how to manage your storage resources on DataHaven using the StorageHub SDK. You will learn how to request the removal of a file from the network and how to delete buckets. It's important to periodically review and clean up unused data to avoid unnecessary costs, since buckets and files come with continuous storage fees.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'
- [A file uploaded](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/){target=\_blank} to DataHaven, along with the [file key](/store-and-retrieve-data/use-storagehub-sdk/verify-storage-request-registration/#compute-the-file-key){target=\_blank}

## Install Dependencies

=== "pnpm"

    ```bash { .break-spaces }
    pnpm add @storagehub-sdk/core @storagehub-sdk/msp-client @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
    ```

=== "yarn"

    ```bash { .break-spaces }
    yarn add @storagehub-sdk/core @storagehub-sdk/msp-client @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
    ```

=== "npm"

    ```bash { .break-spaces }
    npm install @storagehub-sdk/core @storagehub-sdk/msp-client @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
    ```

## Initialize Clients and Authenticate MSP Client

First, you'll need to set up the necessary clients to connect to the DataHaven network, which runs on a dual-protocol architecture (Substrate for core logic and EVM for compatibility).

If you've already followed the [Upload a File](/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/){target=\_blank} guide, your clients may already be initialized and your MSP client authenticated. In that case, review the placeholders at the bottom of the following snippet to see where you'll add logic in this guide, then skip ahead to [Download Your File from MSP Client](#download-your-file-from-msp-client).

Create an `index.ts` and add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:imports'

async function run() {
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:initialize-and-setup'

  // --- Data deletion logic ---
  // **PLACEHOLDER FOR STEP 1: REQUEST FILE DELETION**
  // **PLACEHOLDER FOR STEP 2: DELETE A BUCKET**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Request file deletion

Add the code bellow to remove a specific file from the DataHaven network. You’ll first fetch the file’s metadata from the MSP, format it for on-chain compatibility, and then submit a deletion request using the StorageHub SDK.

```ts 
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:request-file-deletion'
```

If you run the script with the code above, the `fileInfo` and `formattedFileInfo` should look like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/output-01.html'


And the final response should include:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/output-02.html'


## Delete a Bucket

To delete your bucket, add the following code:


!!! note
    A bucket can only be deleted if the files in that bucket have already been deleted. Use the `mspClient.buckets.getFiles()` method by passing a `bucketId` as a param to check all the files currently stored in that bucket.

```ts 
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:delete-bucket'
```

If you run the script with the bucket deletion code, the response should include:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/output-03.html'

## Next Steps

<div class="grid cards" markdown>

-   __Handle Payments and Track Costs__

    ---

    Check the current costs you are paying out to each MSP for all your uploaded files and created buckets.

    [:octicons-arrow-right-24: Issue a Storage Request](/store-and-retrieve-data/manage-and-optimize-your-data/handle-payments-and-track-costs)

-   __Build a Data Workflow End-to-End__

    ---

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    [:octicons-arrow-right-24: End-to-End Storage Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow)

</div>
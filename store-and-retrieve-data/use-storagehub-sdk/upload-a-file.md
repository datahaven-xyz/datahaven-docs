---
title: Upload a File
description: This guide walks you through preparing your local file for upload and confirming your MSP has successfully accepted it for ingestion and replication.
---

# Upload a File

Once your bucket is ready and the storage request has been successfully recorded on-chain, it's time to upload your file's bytes to your selected Main Storage Provider (MSP), linking the data to your on-chain request.

This guide walks you through preparing your local file for upload and confirming your MSP has successfully accepted it for ingestion and replication.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'
- [A bucket created](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} with the ID handy
- A [confirmed on-chain storage request](/store-and-retrieve-data/use-storagehub-sdk/verify-storage-request-registration/){target=\_blank}, along with the file key and file name

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

## Initialize Clients and File Manager and Authenticate MSP Client

First, you'll need to set up the necessary clients to connect to the DataHaven network, which runs on a dual-protocol architecture (Substrate for core logic and EVM for compatibility).

If you've already followed the [Issue a Storage Request](/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/){target=\_blank} guide, your clients and the File Manager may already be initialized, and your MSP client authenticated. In that case, review the placeholders at the bottom of the following snippet to see where you'll add logic in this guide, then skip ahead to [Upload File to MSP](#upload-file-to-msp).

Create an `index.ts` and add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-file.ts:imports'

async function run() {
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-file.ts:initialize-and-setup'

  // --- Upload file logic ---
  // **PLACEHOLDER FOR STEP 1: UPLOAD FILE TO MSP**
  // **PLACEHOLDER FOR STEP 2: VERIFY SUCCESSFUL UPLOAD**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Upload File to MSP

Add the following code to trigger the file upload to the connected MSP:

```ts title="// **PLACEHOLDER FOR STEP 1: UPLOAD FILE TO MSP**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-file.ts:upload-file'
```

## Verify File Upload

Check the receipt status to verify the file upload was successful:

```ts title="// **PLACEHOLDER FOR STEP 2: VERIFY SUCCESSFUL UPLOAD**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-file.ts:verify-upload'
```

Run the script:

```bash
ts-node index.ts
```

Upon a successful file upload, the transaction hash will be output:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-01.html'


??? code "View complete script"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-file.ts'
    ```

## Next Steps

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/" markdown>:material-arrow-right: 
    
    **Retrieve Your Data**

    Once your file is successfully uploaded, retrieve it from the Main Storage Provider (MSP) using the StorageHub SDK and save it locally.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **Build a Data Workflow End-to-End**

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    </a>

</div>

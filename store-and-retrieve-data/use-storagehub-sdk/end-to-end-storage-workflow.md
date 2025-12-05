---
title: End-to-End Storage Workflow
description: This step-by-step tutorial follows the full DataHaven storage workflow to store and retrieve data from the network using StorageHub SDK.
---

# End-to-End Storage Workflow

This tutorial will cover the end-to-end process of creating a bucket, uploading a file, and retrieving it, in a step-by-step format.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- A file to upload to DataHaven (any file type is accepted; the current testnet file size limit is {{ networks.testnet.file_size_limit }}).

## Project Structure

This project organizes scripts, client setup, and different types of operations for easy development and deployment. 

The following sections will build on the already established helper methods from the `services` folder, so it's important to start here with already properly configured clients (as mentioned in the [Prerequisites](#prerequisites) section).

```
datahaven-project/
├── package.json
├── tsconfig.json
└── src/
    ├── files/
    │   └── helloworld.txt
    ├── operations/
    │   ├── fileOperations.ts
    │   └── bucketOperations.ts
    ├── services/
    │   ├── clientService.ts
    │   └── mspService.ts
    └── index.ts
```

## Initialize the Script Entry Point


First, create an `index.ts` file if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you’ll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide.

The `index.ts` snippet below also imports `bucketOperations.ts` and `fileOperations.ts`, which are not in your project yet—that's expected, as you'll create them later in this guide. All their imports are included right away so feel free to comment out the imports you don't need until you get to the step that implements that logic.

Add the following code to your `index.ts` file:

```ts title="src/index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:imports'

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();
  
  // --- End-to-end storage flow ---
  // **PLACEHOLDER FOR STEP 1: CHECK MSP HEALTH**
  // **PLACEHOLDER FOR STEP 2: CREATE BUCKET**
  // **PLACEHOLDER FOR STEP 3: VERIFY BUCKET**
  // **PLACEHOLDER FOR STEP 4: WAIT FOR BACKEND TO HAVE BUCKET**
  // **PLACEHOLDER FOR STEP 5: UPLOAD FILE**
  // **PLACEHOLDER FOR STEP 6: WAIT FOR BACKEND TO HAVE FILE**
  // **PLACEHOLDER FOR STEP 7: DOWNLOAD FILE**
  // **PLACEHOLDER FOR STEP 8: VERIFY FILE**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Check MSP Health

Since you are already connected to the MSP client, check its health status before creating a bucket.

1. Replace the placeholder `// **PLACEHOLDER FOR STEP 1: CHECK MSP HEALTH**` with the following code:

    ```ts title="src/index.ts // **PLACEHOLDER FOR STEP 1: CHECK MSP HEALTH**"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:check-msp-health'
    ```

2. Check the health status by running the script:

    ```bash
    ts-node index.ts
    ```

    The response should return a **`healthy`** status, like this:

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/output-01.html'

## Create a Bucket

Buckets group your files under a specific Main Storage Provider (MSP) and value proposition that describes what the storage fees under that MSP are going to look like. 

In the following code, you will pull the MSP’s details/value proposition to prepare for bucket creation. Then you will derive the bucket ID, confirm it doesn’t exist already, submit a `createBucket` transaction, wait for confirmation, and finally query the chain to verify that the new bucket’s MSP and owner address match the account address that you are using. 

To do all this, you are going to: 

1. Create a `getValueProps` helper method within `mspService.ts`.
2. Create a `createBucket` helper method within `bucketOperations.ts`.
3. Update the `index.ts` file to trigger the logic you've implemented.

Go through the in-depth instructions as follows:

1. Add the following helper method to your `mspService.ts` file to fetch `valueProps` from the MSP Client:

    ```ts title="src/services/mspService.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/msp-service-with-value-props.ts:msp-value-props'
    ```

2. Add the `getValueProps` method to the export statement at the bottom of the `mspService.ts` file.

    ```ts title="mspService.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/msp-service-with-value-props.ts:exports'
    ```

    ??? code "View complete `mspService.ts` file"

        ```ts title="src/services/mspService.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/msp-service-with-value-props.ts'
        ```

3. Next, make sure to create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

    ```bash
    mkdir operations
    ```

4. Then, create a new file within the `operations` folder called `bucketOperations.ts`.

5. Add the following code:

    ```ts title="src/operations/bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/bucketOperations.ts:imports'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/bucketOperations.ts:create-bucket'
    ```

    The `createBucket` helper handles the full lifecycle of a bucket-creation transaction:  

    - It fetches the MSP ID and selects a value prop (required to create a bucket).  
    - It derives a deterministic bucket ID from your wallet address and chosen bucket name.  
    - Before sending any on-chain transaction, it checks whether the bucket already exists to prevent accidental overwrites.  

    Once the check passes, the `createBucket` extrinsic is called via the StorageHub client, returning the `bucketId` and `txReceipt`. 
    
6. Now that you've extracted all the bucket-creation logic into its own method, update the `index.ts` file.

    Replace the placeholder `// **PLACEHOLDER FOR STEP 2: CREATE BUCKET**` with the following code:

    ```ts title="src/index.ts // **PLACEHOLDER FOR STEP 2: CREATE BUCKET**"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:create-bucket'
    ```

    !!! note
        You can also get a list of all your created buckets within a certain MSP using the `mspClient.buckets.listBuckets()` function. Make sure you are authenticated before triggering this function.

    If you run the script multiple times, use a new `bucketName` to avoid a revert, or modify the logic to use your existing bucket in later steps.

## Check if Bucket is On-Chain

The last step is to verify that the bucket was created successfully on-chain and to confirm its stored data. Just like with the `createBucket` method you can extract all the bucket verification logic into its own `verifyBucketCreation` method. 

1. Add the following code in your `bucketOperations.ts` file:
    
    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/bucketOperations.ts:verify-bucket'
    ```

2. Update the `index.ts` file to trigger the helper method you just implemented:

    ```ts title="index.ts // **PLACEHOLDER FOR STEP 3: VERIFY BUCKET**"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:verify-bucket'
    ```

    The response should look something like this:

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/output-03.html'

??? code "View complete `index.ts` file up until now"

    ```ts title="src/index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:imports'

    async function run() {
    // For anything from @storagehub-sdk/core to work, initWasm() is required
    // on top of the file
    await initWasm();
    
    // --- End-to-end storage flow ---
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:check-msp-health'
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:create-a-bucket'
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:verify-bucket'
    // **PLACEHOLDER FOR STEP 4: WAIT FOR BACKEND TO HAVE BUCKET**
    // **PLACEHOLDER FOR STEP 5: UPLOAD FILE**
    // **PLACEHOLDER FOR STEP 6: DOWNLOAD FILE**
    // **PLACEHOLDER FOR STEP 7: VERIFY FILE**

    // Disconnect the Polkadot API at the very end
    await polkadotApi.disconnect();
    }

    await run();
    ```

You’ve successfully created a bucket and verified it has successfully been created on-chain.

## Wait for Backend to Have Bucket

Right after a bucket is created, your script will immediately try to upload a file. At this point, the bucket exists on-chain, but DataHaven’s indexer may not have processed the block yet. Until the indexer catches up, the MSP backend can’t resolve the new bucket ID, so any upload attempt will fail.
To avoid that race condition, you’ll add a small polling helper that waits for the indexer to acknowledge the bucket before continuing.

1. Add the following code in your `bucketOperations.ts` file:
    
    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/bucketOperations.ts:wait-for-backend-bucket-ready'
    ```

2. Update the `index.ts` file to trigger the helper method you just implemented:

    ```ts title="index.ts // **PLACEHOLDER FOR STEP 4: WAIT FOR BACKEND TO HAVE BUCKET**"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:wait-for-backend-bucket-ready'
    ```

    The response should look something like this:

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/output-01.html'

??? code "View complete `bucketOperations.ts`"

     ```ts title="src/operations/bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/bucketOperations.ts'
    ```

## Upload a File

Ensure your file is ready to upload. In this demonstration, a `.txt` file named `helloworld.txt` is stored in the `files` folder as an example, i.e., `/src/files`. 

In this section you will learn how to upload a file to DataHaven by following a three-step flow: 

1. **Issue a Storage Request**: Register your intent to store a file in your bucket and set its replication policy. Initialize `FileManager`, compute the file’s fingerprint, fetch MSP info (and extract peer IDs), choose a replication level and replica count, then call `issueStorageRequest`.
2. **Verify If Storage Request Is On-Chain**: Derive the deterministic file key, query on-chain state, and confirm the request exists and matches your local fingerprint and bucket.
3. **Upload a File**: Send the file bytes to the MSP, linked to your storage request. Confirm that the upload receipt indicates a successful upload.

All three of these steps will be handled within the `uploadFile` helper method as part of the `fileOperations.ts` file. After that, you will update the `index.ts` file accordingly to trigger this new logic.

### Add Method to Upload File

Create a new file within the `operations` folder called `fileOperations.ts` and add the following code:

```ts title="operations/fileOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/fileOperations.ts:imports'

  // Add helper methods here

```

To implement the `uploadFile` helper method, add the following code to the `fileOperations.ts` file:

```ts title="operations/fileOperations.ts // Add helper methods here"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/fileOperations.ts:upload-file-helper'
```

### Call the Upload File Helper Method

Replace the placeholder `// **PLACEHOLDER FOR STEP 5: UPLOAD FILE**` with the following code:

```ts title="src/index.ts // **PLACEHOLDER FOR STEP 5: UPLOAD FILE**"
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:upload-file'
```

After a successful file upload the logs should look something like:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-05.html'

??? code "View complete `index.ts` up until this point"

    ```ts title="src/index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:imports'

    async function run() {
      // For anything from @storagehub-sdk/core to work, initWasm() is required
      // on top of the file
      await initWasm();
    
      // --- End-to-end storage flow ---
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:check-msp-health'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:create-bucket'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:verify-bucket'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:wait-for-backend-bucket-ready'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:upload-file'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:wait-for-backend-file-ready'
      // **PLACEHOLDER FOR STEP 7: DOWNLOAD FILE**
      // **PLACEHOLDER FOR STEP 8: VERIFY FILE**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    await run();
    ```

## Wait for Backend to Have File

In this step you wire in two small helper methods:

1. **`waitForMSPConfirmOnChain`**: Polls the DataHaven runtime until the MSP has confirmed the storage request on-chain. 
2. **`waitForBackendFileReady`**: Polls the MSP backend using `mspClient.files.getFileInfo(bucketId, fileKey)` until the file metadata becomes available. 

Once both checks pass, you know the file is committed on-chain and the MSP backend is ready to serve it, so the subsequent download call won’t randomly fail with a `404` while the system is still syncing.

1. Add the following code in your `fileOperations.ts` file:
    
    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/fileOperations.ts:wait-for-msp-confirm-on-chain'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/fileOperations.ts:wait-for-backend-file-ready'
    ```

2. Update the `index.ts` file to trigger the helper method you just implemented:

    ```ts title="index.ts // **PLACEHOLDER FOR STEP 6: WAIT FOR BACKEND TO HAVE FILE**"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:wait-for-msp-confirm-on-chain'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:wait-for-backend-file-ready'
    ```

    The response should look something like this:

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/output-02.html'

## Download and Save File

Download the file by its deterministic key from the MSP and save it locally.

### Add Method to Download File

To create the `downloadFile` helper method, add the following code:

```ts title="src/operations/fileOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/fileOperations.ts:download-file'
```

### Call the Download File Helper Method

Replace the placeholder `// **PLACEHOLDER FOR STEP 7: DOWNLOAD FILE**` with the following code:

```ts title="src/index.ts // **PLACEHOLDER FOR STEP 7: DOWNLOAD FILE**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:download-data'
```

??? code "View complete `index.ts` file up until this point"

    ```ts title="src/index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:imports'

    async function run() {
      // For anything from @storagehub-sdk/core to work, initWasm() is required
      // on top of the file
      await initWasm();
    
      // --- End-to-end storage flow ---
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:check-msp-health'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:create-bucket'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:verify-bucket'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:wait-for-backend-bucket-ready'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:upload-file'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:wait-for-backend-file-ready'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts:download-data'
      // **PLACEHOLDER FOR STEP 8: VERIFY FILE**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    await run();
    ```

Upon a successful file download, you'll see output similar to:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/output-01.html'

## Verify Downloaded File

Verify that the downloaded file exactly matches the file you've uploaded.

### Add Method to Verify Download

Implement the `verifyDownload` helper method logic to your `fileOperations.ts` file, by adding the following code:

```ts title="src/operations/fileOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/fileOperations.ts:verify-download'
```

### Call the Verify Download Helper Method

Replace the placeholder `// **PLACEHOLDER FOR STEP 8: VERIFY FILE**` with the following code:

```ts title="src/index.ts // **PLACEHOLDER FOR STEP 8: VERIFY FILE**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:verify-download'
```

## Putting It All Together

The code containing the complete series of steps from creating a bucket to retrieving the data is available below. As a reminder, before running the full script, ensure you have the following:

- Tokens to pay for the storage request on your account
- A file to upload, such as `helloworld.txt`

??? code "View complete `src/index.ts` script"

    ```ts title="src/index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end-storage-workflow.ts'
    ```

??? code "View complete `src/operations/fileOperations.ts`"

    ```ts title="src/operations/fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/fileOperations.ts'
    ```

??? code "View complete `src/operations/bucketOperations.ts`"

    ```ts title="src/operations/bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts'
    ```

### Notes on Data Safety

Uploading a file does not guarantee network-wide replication. Files are considered secured by DataHaven only after replication to a Backup Storage Provider (BSP) is complete. Tooling to surface replication status is in active development.

## Next Steps

<div class="grid cards" markdown>

-  <a href="/how-it-works/data-and-provider-model/data-flow-and-lifecycle/" markdown>:material-arrow-right: 
    
    **Data Flow and Lifecycle**

    End-to-end overview of how data moves through the DataHaven network.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/faqs-and-troubleshooting/" markdown>:material-arrow-right:

    **FAQs and Troubleshooting**

    Answers to commonly asked questions about DataHaven and using StorageHub SDK.

    </a>

</div>

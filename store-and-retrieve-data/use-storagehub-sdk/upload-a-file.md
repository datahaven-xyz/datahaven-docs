---
title: Upload a File
description: Guide on how to turn your local file into a fully registered and persisted asset in DataHaven.
---

# Upload a File

This guide covers the full path from a local file to a registered asset inside a bucket on DataHaven. This path can be divided into three major steps:

1. **Issue a Storage Request**: Register your intent to store a file in your bucket and set its replication policy. Initialize `FileManager`, compute the file’s fingerprint, fetch MSP info (and extract peer IDs), choose a replication level and replica count, then call `issueStorageRequest`.
2. **Verify If Storage Request Is On-Chain**: Derive the deterministic file key, query on-chain state, and confirm the request exists and matches your local fingerprint and bucket.
3. **Upload a File**: Send the file bytes to the MSP, linked to your storage request. Confirm that the upload receipt indicates a successful upload.

These steps form the core workflow for any application that places data into DataHaven.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- [A bucket created](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} with the ID handy
- A file to upload to DataHaven (any file type is accepted; the current testnet file size limit is {{ networks.testnet.file_size_limit }}).

## Initialize the Script Entry Point

First, create an `index.ts` file, if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you’ll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started Guide](/store-and-retrieve-data/use-storagehub-sdk/get-started). The `index.ts` snippet below also imports `fileOperations.ts`, which is not in your project yet. That’s expected, as you’ll create it later in this guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-a-file.ts:imports'

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();
  
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-a-file.ts:init-setup'

  // --- File upload logic ---
  // **PLACEHOLDER: ADD UPLOAD FILE HELPER METHOD**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Add Method to Upload File

Because of the `uploadFile` method's complexity, you will be adding pieces of its logic step by step. Before that, you need to prepare the file and the method's imports, by following these steps:

1. Create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

    ```bash
    mkdir operations
    ```

2. Create a new file within the `operations` folder called `fileOperations.ts`

3. Add the following code:

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:imports'

    export async function uploadFile(
    bucketId: string,
    filePath: string,
    fileName: string
    ) {
    // ISSUE STORAGE REQUEST
    // **PLACEHOLDER FOR STEP 1: INITIALIZE FILE MANAGER**
    // **PLACEHOLDER FOR STEP 2: CREATE FINGERPRINT**
    // **PLACEHOLDER FOR STEP 3: ISSUE STORAGE REQUEST**
    // VERIFY STORAGE REQUEST ON-CHAIN
    // **PLACEHOLDER FOR STEP 4: COMPUTE FILE KEY**
    // **PLACEHOLDER FOR STEP 5: RETRIEVE STORAGE REQUEST DATA**
    // **PLACEHOLDER FOR STEP 6: READ STORAGE REQUEST DATA**
    // UPLOAD FILE
    // **PLACEHOLDER FOR STEP 7: AUTHENTICATE**
    // **PLACEHOLDER FOR STEP 8: UPLOAD FILE TO MSP**

    return { fileKey, uploadReceipt };
    }
    ```

## Issue a Storage Request

A storage request is the instruction that tells DataHaven—through your chosen Main Storage Provider (MSP)—to persist a specific file in a bucket with the redundancy policy you select.

In this section of the guide, you’ll go from a local file to a confirmed on-chain transaction: initialize a File Manager, derive the file’s fingerprint, fetch MSP details (including peer IDs), choose a replication level, and issue the storage request. When the transaction is finalized, you’ll have a transaction hash and an on-chain record of the request you can verify in the next section of this guide.

### Initialize File Manager

To initialize the File Manager, add the following code to your `fileOperations.ts` file:

```ts title="fileOperations.ts // **PLACEHOLDER FOR STEP 1: INITIALIZE FILE MANAGER**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:initialize-file-manager'
```

### Define Storage Request Parameters

To issue a storage request, you must create the `fingerprint` of your file from the File Manager, `fileSize` (in `BigInt` format), `mspId`, `peerId` (extracted from `multiaddresses`), `replicationLevel`, `replicas`, as well as have the `bucketId` and `fileName` handy from before. Add the following code to create all of these:

```ts title="fileOperations.ts // **PLACEHOLDER FOR STEP 2: CREATE FINGERPRINT**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:define-storage-request-parameters'
```

### Issue Storage Request

Issue the storage request by adding the following code:

```ts title="fileOperations.ts // **PLACEHOLDER FOR STEP 3: ISSUE STORAGE REQUEST**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:issue-storage-request'
```

Upon a successful storage request, the output will look something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-01.html'

??? code "View complete `fileOperations.ts` up until this point"

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:imports'
    export async function uploadFile(
    bucketId: string,
    filePath: string,
    fileName: string
    ) {

        // ISSUE STORAGE REQUEST
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:initialize-file-manager'
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:define-storage-request-parameters'
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:issue-storage-request'
        // VERIFY STORAGE REQUEST ON-CHAIN
        // **PLACEHOLDER FOR STEP 4: COMPUTE FILE KEY **
        // **PLACEHOLDER FOR STEP 5: RETRIEVE STORAGE REQUEST DATA **
        // **PLACEHOLDER FOR STEP 6: READ STORAGE REQUEST DATA**
        // UPLOAD FILE
        // **PLACEHOLDER FOR STEP 7: AUTHENTICATE **
        // **PLACEHOLDER FOR STEP 8: UPLOAD FILE TO MSP **

    return { fileKey, uploadReceipt };
    }
    ```

## Verify Storage Request Registration

Use this section of the guide to confirm that a file's storage request has been successfully recorded on-chain. You'll learn how to derive the deterministic file key and query the on-chain storage requests via the Polkadot.js API. A successful check confirms that the request exists and that core fields, such as the bucket ID and content fingerprint, match your local values. If no record is found, the transaction may not have been finalized yet, or one of the inputs used to compute the file key may not exactly match what was used when the request was issued.

### Compute the File Key

To compute the deterministic file key, derive it from the owner (`AccountId20`), bucket ID, and file name:

```ts title="fileOperations.ts // **PLACEHOLDER FOR STEP 4: COMPUTE THE FILE KEY**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:compute-file-key'
```

### Retrieve Storage Request Data

To retrieve storage request data, query `fileSystem.storageRequests` and pass in the computed file key:

```ts title="fileOperations.ts // **PLACEHOLDER FOR STEP 5: RETRIEVE STORAGE REQUEST DATA**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:verify-storage-request'
```

### Read Storage Request Data

To read storage request data, it first must be unwrapped as follows:

```ts title="fileOperations.ts // **PLACEHOLDER FOR STEP 6: READ STORAGE REQUEST DATA**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:read-storage-request'
```

Upon successful storage request verification, you'll see a message like:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-02.html'

??? code "View complete `fileOperations.ts` up until now"

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:imports'
    export async function uploadFile(
    bucketId: string,
    filePath: string,
    fileName: string
    ) {

    // ISSUE STORAGE REQUEST
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:initialize-file-manager'
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:define-storage-request-parameters'
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:issue-storage-request'
    // VERIFY STORAGE REQUEST ON-CHAIN
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:compute-file-key'
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:verify-storage-request'
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:read-storage-request'
    // UPLOAD FILE
    // **PLACEHOLDER FOR STEP 7: AUTHENTICATE **
    // **PLACEHOLDER FOR STEP 8: UPLOAD FILE TO MSP **

    return { fileKey, uploadReceipt };
    }
    ```

## Upload a File

Once your bucket is ready and the storage request has been successfully recorded on-chain, it's time to upload your file's bytes to your selected Main Storage Provider (MSP), linking the data to your on-chain request.

This guide walks you through preparing your local file for upload and confirming your MSP has successfully accepted it for ingestion and replication.

### Authenticate

Before any file operations, authenticate with the MSP. The `authenticateUser` helper signs a SIWE message and returns a session token that authorizes your uploads, updates, and deletions. Add the following code to use the `authenticateUser` helper method you've already implemented in `mspService.ts`:

```ts title="fileOperations.ts // **PLACEHOLDER FOR STEP 7: AUTHENTICATE**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:authenticate'
```

### Upload File to MSP

Add the following code to trigger the file upload to the connected MSP and to verify if it was successful:

```ts title="fileOperations.ts // **PLACEHOLDER FOR STEP 8: UPLOAD FILE TO MSP**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:upload-file'
```

!!! note
    To check your currently active payment streams (amount of fees you are being billed) within a certain MSP use the `mspClient.info.getPaymentStreams` method. Make sure you are authenticated prior to triggering this function.

Upon a successful file upload, the transaction receipt will look like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-03.html'

??? code "View complete `fileOperations.ts`"

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts'
    ```

## Call the Upload File Helper Method

Replace the placeholder `// **PLACEHOLDER: ADD UPLOAD FILE HELPER METHOD**` with the following code:

```ts title="index.ts // **PLACEHOLDER: ADD UPLOAD FILE HELPER METHOD**"
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-a-file.ts:upload-file'
```

Run the script:

```bash
ts-node index.ts
```

Now that you have completed `fileOperations.ts` and `index.ts`, the final output when running the `index.ts` script should be:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-04.html'

??? code "View complete `index.ts`"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-a-file.ts'
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
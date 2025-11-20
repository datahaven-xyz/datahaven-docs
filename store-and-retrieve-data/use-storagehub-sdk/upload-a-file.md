---
title: Upload a File
description: Go through the path from having a local file to having a fully registered and persisted asset in DataHaven. Learn how to issue a storage request, verify it on-chain, and upload the file to your Main Storage Provider.
---

# Upload a File

In this guide, you will learn how to upload a file to DataHaven by following a three-step flow: issue a storage request on-chain, verify that the request appears on-chain, and transfer the file bytes to the selected Main Storage Provider (MSP). 

This guide covers the full path from a local file to a registered asset inside a bucket. It sets up the required SDK clients, creates the on-chain request with a deterministic file key, confirms the request through the Polkadot.js API, and hands the file to the MSP for ingestion and replication. These steps form the core workflow for any application that places data into DataHaven.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- [A bucket created](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} with the ID handy
- A file to upload to DataHaven (any file type is accepted; the current TestNet file size limit is 5 MB).

## Initialize the Script Entry Point

First, create an `index.ts` file and add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-a-file.ts:imports'

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();
  
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-a-file.ts:init-setup'

  // --- File upload logic ---
  // **PLACEHOLDER : ADD UPLOAD FILE HELPER METHOD**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Create Upload File Helper Method

In order to create the `uploadFile` helper method, first make sure, if you haven't already in the previous guide, to create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

```bash
mkdir operations
```

Then, create a new file within the `operations` folder called `fileOperations.ts` and add the following code:

```ts title="fileOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:imports'
export async function uploadFile(
  bucketId: string,
  filePath: string,
  fileName: string
  ) {

  // ISSUE STORAGE REQUEST
  // **PLACEHOLDER FOR STEP 2: INITIALIZE FILE MANAGER**
  // **PLACEHOLDER FOR STEP 3: CREATE FINGERPRINT**
  // **PLACEHOLDER FOR STEP 4: ISSUE STORAGE REQUEST**
  // VERIFY STORAGE REQUEST ON-CHAIN
  // **PLACEHOLDER FOR STEP 5: COMPUTE FILE KEY **
  // **PLACEHOLDER FOR STEP 6: RETRIEVE STORAGE REQUEST DATA **
  // **PLACEHOLDER FOR STEP 7: READ STORAGE REQUEST DATA**
  // UPLOAD FILE
  // **PLACEHOLDER FOR STEP 8: AUTHENTICATE **
  // **PLACEHOLDER FOR STEP 9: UPLOAD FILE TO MSP **

  return { fileKey, uploadReceipt };
  }
```

## Issue a Storage Request

A storage request is the instruction that tells DataHaven—through your chosen Main Storage Provider (MSP)—to persist a specific file in a bucket with the redundancy policy you select.

In this section of the guide, you’ll go from a local file to a confirmed on-chain transaction: initialize a File Manager, derive the file’s fingerprint, fetch MSP details (including peer IDs), choose a replication level, and issue the storage request. When the transaction is finalized, you’ll have a transaction hash and an on-chain record of the request you can verify in the next section of this guide.

### Initialize File Manager

To initialize the File Manager, add the following code to your file:

```ts title="// **PLACEHOLDER FOR STEP 2: INITIALIZE FILE MANAGER**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:initialize-file-manager'
```

### Define Storage Request Parameters

To issue a storage request, you must create the `fingerprint` of your file from the File Manager, `fileSize` (in `BigInt` format), `mspId`, `peerId` (extracted from `multiaddresses`), `replicationLevel`, `replicas`, as well as have the `bucketId` and `fileName` handy from before. Add the following code to create all of these:

```ts title="// **PLACEHOLDER FOR STEP 3: CREATE FINGERPRINT**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:define-storage-request-parameters'
```

### Issue Storage Request

Issue the storage request by adding the following code:

```ts title="// **PLACEHOLDER FOR STEP 4: ISSUE STORAGE REQUEST**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:issue-storage-request'
```

Run the script:

```bash
ts-node index.ts
```

Upon a successful storage request, the transaction hash will be output:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-01.html'

And upon a successful storage request, the transaction receipt will be output:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-02.html'

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
        // **PLACEHOLDER FOR STEP 5: COMPUTE FILE KEY **
        // **PLACEHOLDER FOR STEP 6: RETRIEVE STORAGE REQUEST DATA **
        // **PLACEHOLDER FOR STEP 7: READ STORAGE REQUEST DATA**
        // UPLOAD FILE
        // **PLACEHOLDER FOR STEP 8: AUTHENTICATE **
        // **PLACEHOLDER FOR STEP 9: UPLOAD FILE TO MSP **

    return { fileKey, uploadReceipt };
    }
    ```

## Verify Storage Request Registration

Use this section of the guide to confirm that a file's storage request has been successfully recorded on-chain. You'll learn how to derive the deterministic file key and query the on-chain storage requests via the Polkadot.js API. A successful check confirms that the request exists and that core fields, such as the bucket ID and content fingerprint, match your local values. If no record is found, the transaction may not have been finalized yet, or one of the inputs used to compute the file key may not exactly match what was used when the request was issued.

### Compute the File Key

To compute the deterministic file key, derive it from the owner (`AccountId20`), bucket ID, and file name:

```ts title="// **PLACEHOLDER FOR STEP 5: COMPUTE THE FILE KEY**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:compute-file-key'
```

### Retrieve Storage Request Data

To retrieve storage request data, query `fileSystem.storageRequests` and pass in the computed file key:

```ts title="// **PLACEHOLDER FOR STEP 6: RETRIEVE STORAGE REQUEST DATA**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:verify-storage-request'
```

### Read Storage Request Data

To read storage request data, it first must be unwrapped as follows:

```ts title="// **PLACEHOLDER FOR STEP 7: READ STORAGE REQUEST DATA**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:read-storage-request'
```

Run the script:

```bash
ts-node index.ts
```

Upon successful verification, you'll see a message like:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-03.html'

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
    // **PLACEHOLDER FOR STEP 8: AUTHENTICATE **
    // **PLACEHOLDER FOR STEP 9: UPLOAD FILE TO MSP **

    return { fileKey, uploadReceipt };
    }
    ```

## Upload a File

Once your bucket is ready and the storage request has been successfully recorded on-chain, it's time to upload your file's bytes to your selected Main Storage Provider (MSP), linking the data to your on-chain request.

This guide walks you through preparing your local file for upload and confirming your MSP has successfully accepted it for ingestion and replication.

### Authenticate


```ts title="// **PLACEHOLDER FOR STEP 8: AUTHENTICATE**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:authenticate'
```

### Upload File to MSP

Add the following code to trigger the file upload to the connected MSP and to verify if it was successful:

```ts title="// **PLACEHOLDER FOR STEP 9: UPLOAD FILE TO MSP**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts:upload-file'
```

!!! note
    To check your currently active payment streams (amount of fees you are being billed) within a certain MSP use the `mspClient.info.getPaymentStreams` method. Make sure you are authenticated prior to triggering this function.

Run the script:

```bash
ts-node index.ts
```

Upon a successful file upload, the transaction receipt will be output:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-04.html'

Now that you have completed `fileOperations.ts` and `index.ts`, the final output when running the `index.ts` script should be:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-05.html'

??? code "View complete `fileOperations.ts`"

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/fileOperations.ts'
    ```
    
## Use Upload File Helper Method

Replace the placeholder `// **PLACEHOLDER FOR STEP 1: ADD UPLOAD FILE HELPER METHOD**` with the following code:

```ts title="index.ts"
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/upload-a-file.ts:upload-file'
```

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
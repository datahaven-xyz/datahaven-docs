---
title: File Manipulation
description: Learn about file manipulation in DataHaven, including File Manager, fingerprint, file key, and storage requests via the StorageHub SDK.
categories: StorageHub SDK, Store Data, Smart Contract
toggle:
  group: file-manipulation
  variant: sc
  label: SC
---

# File Manipulation via Smart Contracts

The purpose of this guide is to help you create a mental model of what pieces of data you need to extract from the file you intend to upload to DataHaven and how to retrieve it from the network. In this guide, you learn how to initialize the File Manager from your file, create the fingerprint and file key, issue a storage request, and retrieve the data for that request.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- [A bucket created](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} with the ID handy
- A file to upload to DataHaven (any file type is accepted; the current testnet file size limit is {{ networks.testnet.file_size_limit }})
- [The FileSystem Precompile's ABI](/store-and-retrieve-data/use-storagehub-sdk/get-started/#set-up-the-smart-contract-path-optional) handy

## Initialize the Script Entry Point

First, create an `index.ts` file if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you'll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/file-manipulation/file-manipulation.ts:imports'

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();

  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/file-manipulation/file-manipulation.ts:init-setup'

  // --- File Manipulation ---
  // **PLACEHOLDER FOR STEP 1: INITIALIZE FILE MANAGER**
  // **PLACEHOLDER FOR STEP 2: CREATE FINGERPRINT AND REMAINING STORAGE REQUEST PARAMETERS**
  // **PLACEHOLDER FOR STEP 3: ISSUE STORAGE REQUEST**
  // **PLACEHOLDER FOR STEP 4: COMPUTE THE FILE KEY**
  // **PLACEHOLDER FOR STEP 5: RETRIEVE STORAGE REQUEST DATA**
  // **PLACEHOLDER FOR STEP 6: READ STORAGE REQUEST DATA**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Initialize File Manager

To initialize the File Manager, add the following code to your `index.ts` file:

```ts title="index.ts // **PLACEHOLDER FOR STEP 1: INITIALIZE FILE MANAGER**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file-sc/fileOperations.ts:initialize-file-manager'
```

## Create Fingerprint and Remaining Storage Request Parameters

To issue a storage request, you need to prepare the following:

- `fingerprint` of your file (from `FileManager`)
- `fileSize` in `BigInt` format
- `mspId` of the target MSP
- `peerId` extracted from the MSP's multiaddresses
- `replicationLevel` that defines how redundancy is applied
- `replicas` indicating how many copies to request
- `bucketId` created earlier (already passed as a parameter in `uploadFile` method)
- `fileName` you plan to store (already passed as a parameter in `uploadFile` method)

Add the following code to gather these values:

```ts title="index.ts // **PLACEHOLDER FOR STEP 2: CREATE FINGERPRINT AND REMAINING STORAGE REQUEST PARAMETERS**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file-sc/fileOperations.ts:define-storage-request-parameters'
```

## Issue Storage Request

Issue the storage request by adding the following code:

!!! note
    After issuing a storage request, it is crucial to wait for the transaction receipt, as shown in the code below. If writing custom storage-request-creation logic, make sure to include that step; otherwise, you will fetch storage request data before it is available.


```ts title="index.ts // **PLACEHOLDER FOR STEP 3: ISSUE STORAGE REQUEST**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file-sc/fileOperations.ts:issue-storage-request'
```

Upon a successful storage request, the output will look something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/output-01.html'

## Compute the File Key

To compute the deterministic file key, derive it from the owner (`AccountId20`), bucket ID, and file name:

```ts title="index.ts // **PLACEHOLDER FOR STEP 4: COMPUTE THE FILE KEY**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file-sc/fileOperations.ts:compute-file-key'
```

## Retrieve Storage Request Data

To retrieve storage request data, query `fileSystem.storageRequests` and pass in the computed file key:

```ts title="index.ts // **PLACEHOLDER FOR STEP 5: RETRIEVE STORAGE REQUEST DATA**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file-sc/fileOperations.ts:verify-storage-request'
```

## Read Storage Request Data

To read storage request data, it must first be unwrapped as follows:

```ts title="index.ts // **PLACEHOLDER FOR STEP 6: READ STORAGE REQUEST DATA**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-a-file-sc/fileOperations.ts:read-storage-request'
```

Upon successful storage request verification, you'll see a message like:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/file-manipulation/output-01.html'

??? code "View complete `index.ts`"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/file-manipulation/file-manipulation.ts'
    ```

Now you've successfully learned how to manipulate the file you intend to upload to the DataHaven network by using the StorageHub SDK and the FileSystem Precompile.

## Next Steps

<div class="grid cards" markdown>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/" markdown>:material-arrow-right:

    **Manage Files and Buckets**

    Learn how to get file info, request file removal from the network, and how to delete buckets.

    </a>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/" markdown>:material-arrow-right:

    **Upload a File**

    Once your storage request is confirmed, use the StorageHub SDK to upload a file to the network.

    </a>

</div>

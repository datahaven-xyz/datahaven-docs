---
title: Verify a Storage Request
description: This guide shows how to verify a file's storage request on-chain by deriving its file key and querying storage requests with the Polkadot.js API.
---

# Verify Storage Request Registration

Use this guide to confirm that a file's storage request has been successfully recorded on-chain. You'll learn how to derive the deterministic file key and query the on-chain storage requests via the Polkadot.js API. A successful check confirms that the request exists and that core fields, such as the bucket ID and content fingerprint, match your local values. If no record is found, the transaction may not have been finalized yet, or one of the inputs used to compute the file key may not exactly match what was used when the request was issued.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- [A bucket created](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} with the ID handy
- [A storage request issued](/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/){target=\_blank} along with the address of the account that issued the request, the file name, and the fingerprint of the file. 

## Install Dependencies

=== "pnpm"

    ```bash { .break-spaces }
    pnpm add @storagehub-sdk/core @storagehub/types-bundle @polkadot/api @polkadot/types @storagehub/api-augment
    ```

=== "yarn"

    ```bash { .break-spaces }
    yarn add @storagehub-sdk/core @storagehub/types-bundle @polkadot/api @polkadot/types @storagehub/api-augment
    ```

=== "npm"

    ```bash { .break-spaces }
    npm install @storagehub-sdk/core @storagehub/types-bundle @polkadot/api @polkadot/types @storagehub/api-augment
    ```

## Initialize Polkadot.js and File Manager

First, you'll need to set up the Polkadot.js API to connect to the DataHaven network, which allows you to read data from the underlying Substrate node. You'll also need to initialize a File Manager instance to compute the file key required to retrieve storage request data.

If you've already followed the [Issue a Storage Request](/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/){target=\_blank} guide, the Polkadot.js API and File Manager may already be initialized. In that case, review the placeholders at the bottom of the following snippet to see where you'll add logic in this guide, then skip ahead to [Compute the File Key](#compute-the-file-key).

Create an `index.ts` and add the following code:

!!! note
    The code below uses **DataHaven Testnet** configuration values, which include the **Chain ID**, **RPC URL**, **WSS URL**, **MSP URL**, and **token metadata**. If you’re running a **local devnet**, make sure to replace these with your local configuration parameters. You can find all the relevant **local devnet values** in the [Quick Start Guide](/store-and-retrieve-data/quick-start).

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-storage-request-registration/verify-storage-request.ts:imports'

async function run() {
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-storage-request-registration/verify-storage-request.ts:initialize-and-setup'

  // --- Verify storage request logic ---
  // **PLACEHOLDER FOR STEP 1: COMPUTE THE FILE KEY**
  // **PLACEHOLDER FOR STEP 2: RETRIEVE STORAGE REQUEST DATA**
  // **PLACEHOLDER FOR STEP 3: READ STORAGE REQUEST DATA**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Compute the File Key

To compute the deterministic file key, derive it from the owner (`AccountId20`), bucket ID, and file name:

```ts title="// **PLACEHOLDER FOR STEP 1: COMPUTE THE FILE KEY**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-storage-request-registration/verify-storage-request.ts:compute-file-key'
```

## Retrieve Storage Request Data

To retrieve storage request data, query `fileSystem.storageRequests` and pass in the computed file key:

```ts title="// **PLACEHOLDER FOR STEP 2: RETRIEVE STORAGE REQUEST DATA**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-storage-request-registration/verify-storage-request.ts:verify-storage-request'
```

## Read Storage Request Data

To read storage request data, it first must be unwrapped as follows:

```ts title="// **PLACEHOLDER FOR STEP 3: READ STORAGE REQUEST DATA**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-storage-request-registration/verify-storage-request.ts:read-storage-request'
```

Run the script:

```bash
ts-node index.ts
```

Upon successful verification, you'll see a message like:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-storage-request-registration/output-01.html'

??? code "View complete script"
    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-storage-request-registration/verify-storage-request.ts'
    ```

## Next Steps

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/" markdown>:material-arrow-right: 
    
    **Upload Your First File**

    Once your storage request is confirmed, use the StorageHub SDK to upload your file to the network. 

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **Build a Data Workflow End-to-End**

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    </a>

</div>

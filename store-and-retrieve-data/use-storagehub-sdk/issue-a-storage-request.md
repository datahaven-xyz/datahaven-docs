---
title: Issue a Storage Request
description: A storage request directs DataHaven to store a file and anchor proof of it on-chain. Learn how to issue a storage request using the StorageHub SDK.
---

# Issue a Storage Request

A storage request is the instruction that tells DataHaven—through your chosen Main Storage Provider (MSP)—to persist a specific file in a bucket with the redundancy policy you select.

In this guide, you’ll go from a local file to a confirmed on-chain transaction: initialize a File Manager, derive the file’s fingerprint, fetch MSP details (including peer IDs), choose a replication level, and issue the storage request. When the transaction is finalized, you’ll have a transaction hash and an on-chain record of the request you can verify in the follow-up guide.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- [A bucket created](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} with the ID handy
- A file to upload to DataHaven (any file type is accepted; the current TestNet file size limit is 2 GB).

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

## Initialize Clients

First, you'll need to set up the necessary clients to connect to the DataHaven network, which runs on a dual-protocol architecture (Substrate for core logic and EVM for compatibility).

If you’ve already followed the [Create a Bucket](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} guide, your clients may already be initialized. Review the placeholders at the bottom of the following snippet to see where you'll add logic in this guide, then skip ahead to [Initialize File Manager](#initialize-file-manager).

Create an `index.ts` and add the following code:

!!! note
    The code below uses **DataHaven Testnet** configuration values, which include the **Chain ID**, **RPC URL**, **WSS URL**, **MSP URL**, and **token metadata**. If you’re running a **local devnet**, make sure to replace these with your local configuration parameters. You can find all the relevant **local devnet values** in the [Starter Kit](/store-and-retrieve-data/starter-kit).

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/issue-storage-request.ts:imports'

async function run() {
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/issue-storage-request.ts:initialize-clients'

  // --- Issue storage request logic ---
  // **PLACEHOLDER FOR STEP 1: INITIALIZE FILE MANAGER**
  // **PLACEHOLDER FOR STEP 2: CREATE FINGERPRINT**
  // **PLACEHOLDER FOR STEP 3: ISSUE STORAGE REQUEST**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/initialize-clients-summary.md'

- **`mspClient`**: Used to connect to the MSP client.
- **`storageHubClient`**: Used to connect to the StorageHub client.

## Initialize File Manager

To initialize the File Manager, add the following code to your file:

```ts title="// **PLACEHOLDER FOR STEP 1: INITIALIZE FILE MANAGER**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/issue-storage-request.ts:initialize-file-manager'
```

## Create Fingerprint

To create the fingerprint of your file from the File Manager:

```ts title="// **PLACEHOLDER FOR STEP 2: CREATE FINGERPRINT**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/issue-storage-request.ts:create-fingerprint'
```

## Issue Storage Request

Prepare the remaining parameters and issue the storage request by adding the following code:

```ts title="// **PLACEHOLDER FOR STEP 3: ISSUE STORAGE REQUEST**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/issue-storage-request.ts:issue-storage-request'
```

Run the script:

```bash
ts-node index.ts
```

Upon a successful storage request, the transaction hash will be output:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/output-01.html'

And upon a successful storage request, the transaction receipt will be output:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/output-02.html'

??? code "View complete script"
    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/issue-storage-request.ts'
    ```

## Next Steps

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/verify-storage-request-registration/" markdown>:material-arrow-right: 
    
    **Verify Storage Request Registration**

    Verify whether the storage request has been successfully recorded on-chain. This step ensures that you can proceed with file upload and file retrieval.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **Build a Data Workflow End-to-End**

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    </a>

</div>

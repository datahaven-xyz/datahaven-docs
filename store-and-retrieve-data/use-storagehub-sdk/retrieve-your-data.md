---
title: Retrieve Your Data
description: Learn how to use the StorageHub SDK to fetch a previously uploaded file from your chosen Main Storage Provider (MSP) using its deterministic file key.
---

# Retrieve Your Data

This guide shows how to fetch a previously uploaded file from your chosen Main Storage Provider (MSP) using its deterministic file key. You’ll use the file key to download the file and stream the bytes directly to disk—avoiding loading the whole object into memory.

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

!!! note
    The code below uses **DataHaven Testnet** configuration values, which include the **Chain ID**, **RPC URL**, **WSS URL**, **MSP URL**, and **token metadata**. If you’re running a **local devnet**, make sure to replace these with your local configuration parameters. You can find all the relevant **local devnet values** in the [Starter Kit](/store-and-retrieve-data/starter-kit/).

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:imports'

async function run() {
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:initialize-and-setup'

  // --- Upload file logic ---
  // **PLACEHOLDER FOR STEP 1: DOWNLOAD FILE FROM MSP CLIENT**
  // **PLACEHOLDER FOR STEP 2: SAVE DOWNLOADED FILE**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Download Your File from MSP Client

Call the `files.downloadFile` function of the `mspClient` and pass the file key in hex format as follows:

```ts title="// **PLACEHOLDER FOR STEP 1: DOWNLOAD FILE FROM MSP CLIENT**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:download-file'
```

## Save Downloaded File

To save the retrieved file from the MSP on your local machine, add the following code:

```ts title="// **PLACEHOLDER FOR STEP 2: SAVE DOWNLOADED FILE**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:save-download'
```

??? code "View complete script"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts'
    ```

## Next Steps

<div class="grid cards" markdown>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **Build a Data Workflow End-to-End**

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    </a>

-  <a href="/how-it-works/data-and-provider-model/data-flow-and-lifecycle/" markdown>:material-arrow-right: 
    
    **Data Flow and Lifecycle**

    Read this end-to-end overview to learn how data moves through the DataHaven network.

    </a>

</div>

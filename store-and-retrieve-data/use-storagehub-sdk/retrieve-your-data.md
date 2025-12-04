---
title: Retrieve Your Data
description: Learn how to use the StorageHub SDK to fetch a previously uploaded file from your chosen Main Storage Provider (MSP) using its deterministic file key.
---

# Retrieve Your Data

This guide shows how to fetch a previously uploaded file from your chosen Main Storage Provider (MSP) using its deterministic file key. You’ll use the file key to download the file and stream the bytes directly to disk—avoiding loading the whole object into memory.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'
- [A file uploaded](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/){target=\_blank} to DataHaven, along with the [file key](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/#compute-the-file-key){target=\_blank}

## Initialize the Script Entry Point

First, create an `index.ts` file, if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you’ll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started Guide](/store-and-retrieve-data/use-storagehub-sdk/get-started). The `index.ts` snippet below also imports `fileOperations.ts`, which is not in your project yet. That’s expected, as you’ll create it later in this guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:imports'

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();
  
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:init-setup'

  // --- Retrieve file logic ---
  // **PLACEHOLDER FOR STEP 1: ADD DOWNLOAD FILE HELPER METHOD**
  // **PLACEHOLDER FOR STEP 2: VERIFY FILE HELPER METHOD**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Download and Save File

To download a file you've already uploaded to the network, you will create a `downloadFile` helper method through which you will retrieve the file from the network and then save it locally to your machine. Then, update the `index.ts` file accordingly in order to execute that logic.

### Add Method to Download File

1. Create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

    ```bash
    mkdir operations
    ```

2. Create a new file within the `operations` folder called `fileOperations.ts`.

3. Add the following code:

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/fileOperations.ts:imports'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/fileOperations.ts:download-file'
    ```

### Call the Download File Helper Method

1. Proceed with updating the `index.ts` file with the following code in order to execute the download logic you just implemented:

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:download-data'
    ```

    ??? code "View complete `index.ts` file up until this point"

        ```ts title="index.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:imports'

        async function run() {
          // For anything from @storagehub-sdk/core to work, initWasm() is required
          // on top of the file
          await initWasm();
        
          --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:init-setup'

          --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:download-data'

          // Disconnect the Polkadot API at the very end
          await polkadotApi.disconnect();
        }

        await run();
        ```

2. Run the script:

    ```bash
    ts-node index.ts
    ```

    Upon a successful file download, you'll see output similar to:

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/output-01.html'


## Verify Downloaded File

To verify the integrity of the file you've just downloaded, you'll create a `verifyDownload` helper method through which the bytes of the original file will be matched to the bytes of the newly downloaded file. Then, you'll update the `index.ts` file accordingly in order to execute that logic.

### Add Method to Verify Download

Implement the `verifyDownload` helper method logic to your `fileOperations.ts` file, by adding the following code:

```ts title="fileOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/fileOperations.ts:verify-download'
```

??? code "View complete `fileOperations.ts` file"

    ```ts title="fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/fileOperations.ts'
    ```

### Call the Verify Download Helper Method

1. Update the `index.ts` file with the following code in order to execute the verification logic you just implemented:

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts:verify-download'
    ```

    ??? code "View complete `index.ts` file"

        ```ts title="index.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/retrieve-data.ts'
        ```

2. Run the script:

    ```bash
    ts-node index.ts
    ```

    Upon a successful file download, you'll see the following output:

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/output-02.html'

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

---
title: Create a Bucket
description: Guide on how to create a new storage bucket with the StorageHub SDK.
---

# Create a Bucket

Buckets are logical containers (folders) that group your files under a Main Storage Provider (MSP). Each bucket is tied to a specific MSP and value proposition, which together define where your data will be stored and at what price. Before you can issue storage requests or upload files to DataHaven, you must first create a bucket.

This guide walks you through creating your first bucket programmatically using the StorageHub SDK — from connecting to an MSP and initializing the SDK to deriving a bucket ID, creating the bucket on-chain, and verifying its data.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

## Initialize the Script Entry Point

First, create an `index.ts` file, if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you’ll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started Guide](/store-and-retrieve-data/use-storagehub-sdk/get-started). The `index.ts` snippet below also imports `bucketOperations.ts`, which is not in your project yet. That’s expected, as you’ll create it later in this guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:imports'

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();
  
  // --- Bucket creating logic ---
  // **PLACEHOLDER FOR STEP 1: CHECK MSP HEALTH**
  // **PLACEHOLDER FOR STEP 2: CREATE BUCKET**
  // **PLACEHOLDER FOR STEP 3: VERIFY BUCKET**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Check MSP Health

Next, since you are already connected to the MSP client, check its health status before creating a bucket.

Replace the placeholder `// **PLACEHOLDER FOR STEP 1: CHECK MSP HEALTH**` with the following code:

```ts title="index.ts // **PLACEHOLDER FOR STEP 1: CHECK MSP HEALTH**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:check-msp-health'
```

Then, check the health status by running the script:

```bash
ts-node index.ts
```

The response should return a **`healthy`** status, like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/output-01.html'

## Create a Bucket

To create a bucket, you are going to: 

1. Create a `getValueProps` helper method within `mspService.ts`.
2. Create a `createBucket` helper method within `bucketOperations.ts`.
3. Update the `index.ts` file to trigger the logic you've implemented.
4. Check `createBucket` method output

Here are the in-depth instructions:

1. Fetch the `valueProps` from the MSP you are connected to. This matters because an MSP's value prop is its storage fee. The files you will store within a certain bucket will cost you based on the value prop you choose.

    To fetch `valueProps` from the MSP Client, add the following helper function to your `mspService.ts` file:

    ```ts title="mspService.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/msp-service-with-value-props.ts:msp-value-props'
    ```

    ??? code "View complete `mspService.ts` file"

        ```ts title="mspService.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/msp-service-with-value-props.ts'
        ```

2. Next, make sure to create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

    ```bash
    mkdir operations
    ```

    Then, create a new file within the `operations` folder called `bucketOperations.ts` and add the following code:

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts:imports'

    // Add helper methods here
    ```

    Add the following code, instead of the placeholder `// Add helper methods here`:

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts:create-bucket'
    ```

    ??? code "View complete `bucketOperations.ts` up to this point"

        ```ts title="bucketOperations.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts:imports'

        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts:create-bucket'
        ```

3. Now that you've extracted all the bucket creation logic into its own method, let's update the `index.ts` file.

    Replace the placeholder `// **PLACEHOLDER FOR STEP 2: CREATE BUCKET**` with the following code:

    ```ts title="index.ts // **PLACEHOLDER FOR STEP 2: CREATE BUCKET**"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:create-bucket'
    ```

    !!! note
        You can also get a list of all your created buckets within a certain MSP using the `mspClient.buckets.listBuckets()` function. Make sure you are authenticated before triggering this function.


4. Finally, execute the `createBucket` method by running the script:

    ```bash
    ts-node index.ts
    ```

    The response should look something like this:

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/output-02.html'


## Check if Bucket is On-Chain

The last step is to verify that the bucket was created successfully on-chain and to confirm its stored data. Just like with the `createBucket` method you can extract all the bucket verification logic into its own `verifyBucketCreation` method. Add the following code in your `bucketOperations.ts` file:
 
```ts title="bucketOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts:verify-bucket'
```

Update the `index.ts` file to trigger the helper method you just implemented:

```ts title="index.ts // **PLACEHOLDER FOR STEP 3: VERIFY BUCKET**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:verify-bucket'
```

The response should look something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/output-03.html'

??? code "View complete `bucketOperations.ts` file"

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts'
    ```

??? code "View complete `index.ts` file"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts'
    ```

And that’s it. You’ve successfully created a bucket and verified it has successfully been created on-chain.

## Next Steps

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/" markdown>:material-arrow-right: 
    
    **Upload a File**

    Once your storage request is confirmed, use the StorageHub SDK to upload a file to the network.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **Build a Data Workflow End-to-End**

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    </a>

</div>

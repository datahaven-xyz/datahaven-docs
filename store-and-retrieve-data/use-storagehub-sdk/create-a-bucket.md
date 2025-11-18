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

First, create an `index.ts` file and add the following code:

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

Next, since you are connected to the MSP client, check its health status before creating a bucket.

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

Next, you can extract all the bucket creation logic into its own method, and have it return both the `bucketId` and the `txReceipt` in `index.ts`.

Replace the placeholder `// **PLACEHOLDER FOR STEP 2: CREATE BUCKET**` with the following code:

```ts title="index.ts // **PLACEHOLDER FOR STEP 2: CREATE BUCKET**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:create-bucket'
```

!!! note
    You can also get a list of all your created buckets within a certain MSP using the `mspClient.buckets.listBuckets()` function. Make sure you are authenticated before triggering this function.

In order to create the `createBucket` method, first make sure to create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

```bash
mkdir operations
```

Then, create a new file within the `operations` folder called `bucketOperations.ts` and add the following code:

```ts title="bucketOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts:imports'

  // --- Helper method for creating a bucket ---
  // **PLACEHOLDER FOR STEP 4: CREATE BUCKET HELPER METHOD**

  // --- Helper method for verifying a bucket is on-chain ---
  // **PLACEHOLDER FOR STEP 5: VERIFY BUCKET IS ON-CHAIN HELPER METHOD**
```

Add the following code, instead of the placeholder `// **PLACEHOLDER FOR STEP 4: CREATE BUCKET HELPER METHOD**`:

```ts title="bucketOperations.ts // **PLACEHOLDER FOR STEP 4: CREATE BUCKET HELPER METHOD**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts:create-bucket'
```

To prepare all the parameters needed for the `createBucket` function, additional data from the MSP is required, such as `mspId` and `valuePropId`. In order to fetch `valueProps` from the MSP Client, add the following helper function to your `mspService.ts` file:

```ts title="mspService.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/msp-service-with-value-props.ts:msp-value-props'
```

??? code "View complete `mspService.ts` file"

    ```ts title="mspService.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/msp-service-with-value-props.ts'
    ```

??? code "View complete `bucketOperations.ts` up to this point"

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts:imports'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts:create-bucket'

    // --- Helper method for verifying a bucket is on-chain ---
    // **PLACEHOLDER FOR STEP 5: VERIFY BUCKET IS ON-CHAIN HELPER METHOD**
    ```

Finally, execute the `createBucket` method by running the script:

```bash
ts-node index.ts
```

The response should look something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/output-02.html'


## Check if Bucket is On-Chain

The last step is to verify that the bucket was created successfully on-chain and to confirm its stored data.

```ts title="index.ts // **PLACEHOLDER FOR STEP 3: VERIFY BUCKET**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:verify-bucket'
```

Just like with the `createBucket` method you can extract all the bucket verification logic into its own `verifyBucketCreation` method in the `bucketOperations.ts` file, as follows:
 
```ts title="index.ts // **PLACEHOLDER FOR STEP 5: VERIFY BUCKET IS ON-CHAIN HELPER METHOD**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/bucketOperations.ts:verify-bucket'
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

And that’s it. You’ve successfully created a bucket on-chain and verified its data.

## Next Steps

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/" markdown>:material-arrow-right: 
    
    **Issue a Storage Request**

    Once your bucket is created, the next step is to issue a storage request to upload and register your file on DataHaven.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **Build a Data Workflow End-to-End**

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    </a>

</div>

---
title: Create a Bucket
description: Guide on how to create a new storage bucket with the StorageHub SDK.
---

# Create a Bucket

Buckets are logical containers (folders) that group your files under a Main Storage Provider (MSP). Each bucket is tied to a specific MSP and value proposition, which together define where your data will be stored and at what price. Before you can issue storage requests or upload files to DataHaven, you must first create a bucket.

This guide walks you through creating your first bucket programmatically using the StorageHub SDK — from connecting to an MSP and initializing the SDK to deriving a bucket ID, creating the bucket on-chain, and verifying its data.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

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

??? interface "Why do I need these dependencies?"

    - **[`@storagehub/types-bundle`](https://www.npmjs.com/package/@storagehub/types-bundle){target=_blank}:** Describes DataHaven's custom on-chain types.

    - **[`@polkadot/api`](https://www.npmjs.com/package/@polkadot/api){target=_blank}:** The core JavaScript library used to talk to any Substrate-based blockchain, which in our case is DataHaven.

    - **[`@storagehub/api-augment`](https://www.npmjs.com/package/@storagehub/api-augment){target=_blank}:** Extends `@polkadot/api` with DataHaven's custom pallets and RPC methods.

    - **[`viem`](https://www.npmjs.com/package/viem){target=_blank}:** Lightweight library for building Ethereum-compatible applications.

## Initialize Clients

First, you'll need to set up the necessary clients to connect to the DataHaven network, which runs on a dual-protocol architecture (Substrate for core logic and EVM for compatibility).

Create an `index.ts` file and add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:imports'

async function run() {
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:initialize-clients'
  
  // --- Bucket creating logic ---
  // **PLACEHOLDER FOR STEP 1: CONNECT TO MSP CLIENT & CHECK HEALTH**
  // **PLACEHOLDER FOR STEP 2: CREATE STORAGEHUB CLIENT**
  // **PLACEHOLDER FOR STEP 3: DERIVE BUCKET ID**
  // **PLACEHOLDER FOR STEP 4: CHECK IF BUCKET EXISTS**
  // **PLACEHOLDER FOR STEP 5: GET MSP PARAMS**
  // **PLACEHOLDER FOR STEP 6: CREATE BUCKET**
  // **PLACEHOLDER FOR STEP 7: VERIFY BUCKET**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/initialize-clients-summary.md'


## Connect to the MSP Client

Next, you'll need to connect to the MSP client and check its health status before creating a bucket.

Replace the placeholder `// **PLACEHOLDER FOR STEP 1: CONNECT TO MSP CLIENT & CHECK HEALTH**` with the following code:

```ts title="// **PLACEHOLDER FOR STEP 1: CONNECT TO MSP CLIENT & CHECK HEALTH**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:connect-msp-client'
```

Then, check the health status by running the script:

```bash
ts-node index.ts
```

The response should return a **`healthy`** status, like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/output-01.html'

## Initialize the StorageHub Client 

Add the following code to initialize the StorageHub Client:

```ts title="// **PLACEHOLDER FOR STEP 2: CREATE STORAGEHUB CLIENT**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:storagehub-client'
```

Now that you have the `StorageHubClient` initialized, you'll use it to derive the bucket ID and create the bucket.

## Derive Bucket ID

Before creating a new bucket, you'll need to derive the bucket ID by passing the bucket's name and the address you intend to use to create it. Two buckets with the same name and address cannot co-exist within the same MSP.

```ts title="// **PLACEHOLDER FOR STEP 3: DERIVE BUCKET ID**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:derive-bucket'
```

Run the script:

```bash
ts-node index.ts
```

The response should include something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/output-02.html'

## Check If Derived Bucket ID Isn’t Already On-Chain

Now that you have the bucket ID, you can ensure the bucket doesn't exist on-chain yet. 

```ts title="// **PLACEHOLDER FOR STEP 4: CHECK IF BUCKET EXISTS**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:check-bucket'
```

!!! note
    The `mspClient` can also be used to check if the derived bucket ID already exists using the `mspClient.buckets.getBucket()` function; however, this only checks if that specific MSP contains a bucket with that ID.

If you rerun the script, the response should include:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/output-03.html'

## Get Parameters from the MSP

To prepare all the parameters needed for the `createBucket` function, additional data from the MSP is required, such as `mspId` and `valuePropId`.

```ts title="// **PLACEHOLDER FOR STEP 5: GET MSP PARAMS**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:get-msp-params'
```

## Create a Bucket

Finally, you can call the `createBucket()` function using the `storageHubClient`, including the previously gathered parameters and the `isPrivate` flag that determines the bucket’s privacy.

```ts title="// **PLACEHOLDER FOR STEP 6: CREATE BUCKET**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:create-bucket'
```

!!! note
    You can also get a list of all your created buckets within a certain MSP using the `mspClient.buckets.listBuckets()` function. Make sure you are authenticated before triggering this function.

## Check if Bucket is On-Chain

The last step is to verify that the bucket was created successfully on-chain and to confirm its stored data.

```ts title="// **PLACEHOLDER FOR STEP 7: VERIFY BUCKET**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts:verify-bucket'
```

The response should look something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/output-04.html'

??? code "View complete script"

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

---
title: Create a Bucket
description: Guide to creating a new storage bucket using StorageHub SDK.
---

# Create a Bucket

## Prerequisites
- Node.js v18+
- Installed `@storagehub-sdk/core` and `@storagehub-sdk/msp-client` (described in [Get Started page](/store-and-retrieve-data/use-storagehub-sdk/get-started.md))

## Install Extra Dependencies

Install the following dependencies:

=== "pnpm"
    ```bash
    pnpm add @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem

    ```
=== "yarn"
    ```bash
    yarn add @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem

    ```
=== "npm"
    ```bash
    npm install @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem

    ```
- **`@storagehub/types-bundle`:** Describes DataHaven’s custom on-chain types.
- **`@polkadot/api`:** The core JavaScript library used to talk to any Substrate-based blockchain which in our case is DataHaven.
- **`@storagehub/api-augment`:** Extends @polkadot/api with DataHaven’s custom pallets and RPC methods.
- **`viem`:** Lightweight library for building Ethereum-compatible applications.

## Connect to the MSP Client

Add the following code to your `index.ts` file:

     ```ts
     --8<-- '.snippets/code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/connect-to-the-msp-client.ts'
     ```

Check MSP health before proceeding to make sure everything is running as expected:

     ```ts
     --8<-- '.snippets/code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/msp-health.ts'
     ```

The response should look something like this:

     ```json
     MSP Health Status: {
        status: 'healthy',
        version: '0.1.0',
        service: 'storagehub-backend',
        components: {
            storage: { status: 'healthy' },
            postgres: { status: 'healthy' },
            rpc: { status: 'healthy' }
  }
}
     ```

## Initialize the StorageHub Client 

Add the following code to initialize the StorageHub Client:

     ```ts
     --8<-- '.snippets/code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/initialize-storagehub-client.ts'
     ```

 ??? note "It is assumed that private keys are securely stored and managed according to standard security practices."
    
## Derive Bucket ID

Define bucket name and calculate the bucket id using the deriveBucketId() function within the StorageHubClient, as follows:

     ```ts
     --8<-- '.snippets/code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/derive-bucket-id.ts'
     ```

The response should look something like this:

     ```json
     Derived bucket ID: 0x5536b20fca3333b6c9ac23579b2757b774512623f926426e3b37150191140392
     ```

## Check If Derived Bucket ID Isn’t Already On-Chain

In order to check if the derived bucket ID is already on-chain the Polkadot API must be initialized as follows:

     ```ts
     --8<-- '.snippets/code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/initialize-polkadot-api.ts'
     ```

Check if a bucket with that derived id already exists on-chain as follows:

     ```ts
     --8<-- '.snippets/code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/does-derived-bucket-id-exist.ts'
     ```

 ??? note "The mspClient can also be used to check if the derived bucket ID already exists using the .getBucket function, however this only checks if that specific MSP contains a bucket with that ID."

## Create a Bucket

In order to prepare all the parameters needed for the .createBucket function, more data from the MSP is needed such as mspId and valuePropId. Add the following code to retrieve it:

     ```ts
     --8<-- '.snippets/code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket-prep.ts'
     ```

Execute the `.createBucket()` function using the storageHubClient and previously gathered parameters as follows:

     ```ts
     --8<-- '.snippets/code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts'
     ```

## Check if Bucket is On-Chain

Add the following code to check if the bucket can be found on-chain, as well as to read the bucket’s data:

     ```ts
     --8<-- '.snippets/code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/is-bucket-on-chain.ts'
     ```

---

<div class="grid cards" markdown>

-   __Issue a Storage Request__

    ---

    Once your bucket is created, the next step is to issue a storage request to upload and register your file on DataHaven.

    [:octicons-arrow-right-24: Issue a Storage Request](/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request.md)

-   __Build a Data Workflow End-to-End__

    ---

    Learn step-by-step how to store a file on DataHaven and retrieve it back from the network.

    [:octicons-arrow-right-24: End-to-End Storage Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow.md)

</div>
---
title: Create a Bucket
description: Guide on how to create a new storage bucket with the StorageHub SDK.
---

# Create a Bucket

## Prerequisites
- [Node.js](https://nodejs.org/en/download){target=_blank} v22+ installed
- Project folder created
- `package.json` file initialized
- Typescript and Node type definitions added
- Created a Typescript config
- [@storagehub-sdk/core](https://www.npmjs.com/package/@storagehub-sdk/core) and [@storagehub-sdk/msp-client](https://www.npmjs.com/package/@storagehub-sdk/msp-client) installed 

See the [Get Started guide](/store-and-retrieve-data/use-storagehub-sdk/get-started) for detailed setup instructions.

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

- **[`@storagehub/types-bundle`](https://www.npmjs.com/package/@storagehub/types-bundle){taget=_blank}:** Describes DataHaven’s custom on-chain types.

- **[`@polkadot/api`](https://www.npmjs.com/package/@polkadot/api){target=_blank}:** The core JavaScript library used to talk to any Substrate-based blockchain which in our case is DataHaven.

- **[`@storagehub/api-augment`](https://www.npmjs.com/package/@storagehub/api-augment){taget=_blank}:** Extends `@polkadot/api` with DataHaven’s custom pallets and RPC methods.

- **[`viem`](https://www.npmjs.com/package/viem){taget=_blank}:** Lightweight library for building Ethereum-compatible applications.


## Connect to the MSP Client

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/connect-to-the-msp-client.ts'
```

Check MSP health before proceeding to make sure everything is running as expected:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/msp-health.ts'
```

The response should look something like this:

```text
MSP Health Status: {
    status: 'healthy',
    version: '0.2.0',
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

!!! warning "It is assumed that private keys are securely stored and managed according to standard security practices."

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/initialize-storagehub-client.ts'
```
    
## Derive Bucket ID

Define bucket name and calculate the bucket id using the deriveBucketId() function within the StorageHubClient, as follows:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/derive-bucket-id.ts'
```

The response should look something like this:

```text
Derived bucket ID: 0x5536b20fca3333b6c9ac23579b2757b774512623f926426e3b37150191140392
```

## Check If Derived Bucket ID Isn’t Already On-Chain

To check if the derived bucket ID is already on-chain the Polkadot API must be initialized as follows:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/initialize-polkadot-api.ts'
```

Check if a bucket with that derived id already exists on-chain as follows:

!!! note "The `mspClient` can also be used to check if the derived bucket ID already exists using the .getBucket function, however this only checks if that specific MSP contains a bucket with that ID."

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/does-derived-bucket-id-exist.ts'
```

The response should look like this:

```text
Bucket before creation is empty: true
```

## Create a Bucket

In order to prepare all the parameters needed for the `createBucket` function, more data from the MSP is needed such as `mspId` and `valuePropId`. Add the following code to retrieve it:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket-prep.ts'
```

Execute the `createBucket()` function using the storageHubClient and previously gathered parameters as follows:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/create-a-bucket.ts'
```

## Check if Bucket is On-Chain

Add the following code to check if the bucket can be found on-chain, and to read the bucket’s data:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/is-bucket-on-chain.ts'
```

The response should look something like this:

```text
Bucket data: Type(7) [Map] {
  'root' => Type(32) [Uint8Array] [
    3,
    23,
    ...
    19,
    20,
    registry: TypeRegistry { createdAtHash: undefined },
    createdAtHash: undefined,
    initialU8aLength: 32,
    isStorageFallback: undefined
  ],
  'userId' => Type(20) [Uint8Array] [
    0,
    250,
    ...
    34,
    62,
    registry: TypeRegistry { createdAtHash: undefined },
    createdAtHash: undefined,
    initialU8aLength: 20,
    isStorageFallback: undefined
  ],
  'mspId' => Type {
    registry: TypeRegistry { createdAtHash: undefined },
    createdAtHash: undefined,
    initialU8aLength: 33,
    isStorageFallback: undefined
  },
  'private' => [Boolean (bool): false] {
    registry: TypeRegistry { createdAtHash: undefined },
    createdAtHash: undefined,
    initialU8aLength: 1,
    isStorageFallback: undefined
  },
  'readAccessGroupId' => Type {
    registry: TypeRegistry { createdAtHash: undefined },
    createdAtHash: undefined,
    initialU8aLength: undefined,
    isStorageFallback: undefined
  },
  'size_' => <BN: 0>,
  'valuePropId' => Type(32) [Uint8Array] [
    98,
    138,
    ...
    218,
    30,
    registry: TypeRegistry { createdAtHash: undefined },
    createdAtHash: undefined,
    initialU8aLength: 32,
    isStorageFallback: undefined
  ],
  registry: TypeRegistry { createdAtHash: undefined },
  createdAtHash: Type(32) [Uint8Array] [
    231,
    163,
    ...
    40,
    243,
    registry: TypeRegistry { createdAtHash: undefined },
    createdAtHash: undefined,
    initialU8aLength: 32,
    isStorageFallback: undefined
  ],
  initialU8aLength: 127,
  isStorageFallback: undefined
}
Bucket userId matches initial bucket owner address: true
Bucket mspId matches initial mspId: true
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
---
title: Set Custom Gas Fees
description: This guide shows you how to set custom gas fees while calling methods via the StorageHub SDK in case the default gas amount isn't enough
---

# Set Custom Gas Fees

This guide shows how to calculate the correct gas amount in DataHaven at any given time. Since the gas amount is fixed by default within the StorageHub SDK, occasionally the cost of a transaction will exceed that default amount. This is why it is important to be able to calculate the correct amount and pass it as a param in a StorageHub method call. The guide uses `createBucket` as an example, but this same approach can be used for any SDK method that where an on-chain transaction takes place.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- Implemented `createBucket` helper method from [Create a bucket](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} guide

## Initialize the Script

Create an `index.ts` file if you haven't already. Its `run` method will orchestrate all the logic in this guide. By now, your services folder (including the MSP and client helper services) should already be created along with the operations folder containing bucket operations helper methods, which means you should already have the `createBucket` helper method implemented. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide and the [Create a bucket](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/set-custom-gas-fees/set-custom-gas-fees.ts'
```

In this code, the `createBucket` helper method from `bucketOperations.ts` is called. Once all params are ready within this method, the SDK's `storageHubClient.createBucket` method is called:

```ts title="bucketOperations.ts // createBucket()"
...
// Create bucket on chain
  const txHash: `0x${string}` | undefined = await storageHubClient.createBucket(
    mspId as `0x${string}`,
    bucketName,
    isPrivate,
    valuePropId
  );
...
```

Through this method, an on-chain transaction is executed with a predefined gas amount set by the SDK. Sometimes this predefined gas amount is not enough and you can get a message like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/set-custom-gas-fees/output-01.html'

To pass a custom gas amount an extra `gasTxOpts` param of type `EvmWriteOptions` (imported from `@storagehub-sdk/core`) can be passed at the end, like so:

```ts title="bucketOperations.ts // createBucketWithCustomGas()"
...
// Create bucket on chain
  const txHash: `0x${string}` | undefined = await storageHubClient.createBucket(
    mspId as `0x${string}`,
    bucketName,
    isPrivate,
    valuePropId,
    gasTxOpts
  );
...
```

In the following section you will learn how to calculate the value of this extra parameter.

## Add Method to Calculate Gas Fees

To create the `buildGasTxOpts` helper method, follow these steps:

1. Create a `txOperations.ts` file, within the `operations` folder.

2. Add the following code:

    ```ts title="txOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/set-custom-gas-fees/txOperations.ts'
    ```

## Update Create Bucket Method

To update your existing `createBucket` helper method within your `bucketOperations.ts` file to include the `gasTxOpts` calculation, follows these steps:

1. Add this line to your imports:

    ```ts title="bucketOperations.ts"
    import { buildGasTxOpts } from './txOperations.js';
    ```

2. Trigger the `buildGasTxOpts` method right before calling the SDK's `storageHubClient.createBucket` method and the `gasTxOpts` param at the end of the param list, like so:

    ```ts title="bucketOperations.ts"
    const gasTxOpts = await buildGasTxOpts();
    // Create bucket on chain
    const txHash: `0x${string}` | undefined = await storageHubClient.createBucket(
      mspId as `0x${string}`,
      bucketName,
      isPrivate,
      valuePropId,
      gasTxOpts
    );
    ```

??? code "View complete `bucketOperations.ts` file"

    ```ts title="src/index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/set-custom-gas-fees/bucketOperations.ts'
    ```


## Run Create Bucket Script

Execute the `createBucket` method by running the script:

```bash
ts-node index.ts
```

Upon successful execution, it should return an expected bucket-creation response like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/output-02.html'

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

---
title: Set Custom Gas Params
description: This guide shows you how to set custom gas fees while calling methods via the StorageHub SDK in case the default gas amount isn't enough.
categories: StorageHub SDK, Store Data
---

# Set Custom Gas Params

This guide shows how to calculate and set custom gas params in DataHaven. The StorageHub SDK already dynamically computes the necessary gas params, but you can set custom values if needed. The `createBucket` method will be used as an example, but the same approach applies to any SDK method that involves an on-chain transaction.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- Implemented the `createBucket` helper method from the [Create a Bucket](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} guide

## Initialize the Script

Create an `index.ts` file if you haven't already. Its `run` method will orchestrate all the logic in this guide. By now, your services folder (including the MSP and client helper services) should already be created, along with the operations folder containing bucket operations helper methods, which means you should already have the `createBucket` helper method implemented. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide and the [Create a bucket](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/set-custom-gas-params/set-custom-gas-params.ts'
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

Through this method, an on-chain transaction is executed with a gas amount dynamically set by the SDK. To pass custom values, an extra `gasTxOpts` param, of type `EvmWriteOptions` (imported from `@storagehub-sdk/core`), can be passed at the end of the param list, like so:

```ts title="bucketOperations.ts // createBucket()"
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

The [`EvmWriteOptions`](https://github.com/Moonsong-Labs/storage-hub/blob/600d024b5627a6a9f9874a2d4c4c846de4e021e4/sdk/core/src/evm/types.ts#L58-L83){target=\_blank} type has the following structure:

```ts
type EvmWriteOptions = {
  
  // Explicit gas limit. If omitted, the SDK will estimate and multiply.
  // It's computed with an estimation from the contract call and a multiplier.
  gas?: bigint;
  
  // Multiplier applied over the SDK gas estimate when `gas` is not supplied.
  // Defaults to 5.
  gasMultiplier?: number;

  // Deprecated - do not use - Legacy gas price (wei)
  // StorageHub SDK is moving to EIP-1559 only. This field is ignored by the SDK.
  // Use `maxFeePerGas` and `maxPriorityFeePerGas` instead.
  gasPrice?: bigint;
  
  // EIP-1559: max fee per gas (wei). Use with `maxPriorityFeePerGas`.
  // maxFeePerGas = baseFeePerGas * safeMarginMultiplier + maxPriorityFeePerGas
  maxFeePerGas?: bigint;
  
  // EIP-1559: max priority fee per gas (wei).
  // The tip paid to validators and should be increased under network congestion.
  maxPriorityFeePerGas?: bigint;
};
```

In the following section, you will learn how to set and calculate these gas values within the `EvmWriteOptions` type.

## Add Method to Set Gas Fees

To create the `buildGasTxOpts` helper method, follow these steps:

1. Create a `txOperations.ts` file within the `operations` folder.

2. Add the following code:

    ```ts title="txOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/set-custom-gas-params/txOperations.ts'
    ```

## Update Create Bucket Method

To update your existing `createBucket` helper method within your `bucketOperations.ts` file to include the `gasTxOpts` calculation, follow these steps:

1. Add this line to your imports:

    ```ts title="bucketOperations.ts"
    import { buildGasTxOpts } from './txOperations.js';
    ```

2. Trigger the `buildGasTxOpts` method right before calling the SDK's `storageHubClient.createBucket` method and add the `gasTxOpts` param at the end of the param list, like so:

    ```ts title="bucketOperations.ts"
    ...
    const gasTxOpts = await buildGasTxOpts();
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

??? code "View complete `bucketOperations.ts` file"

    ```ts title="bucketOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/set-custom-gas-params/bucketOperations.ts'
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

---
title: Track Costs
description: This guide shows how to fetch your payment stream data using the StorageHub SDK and how to use that data to calculate remaining storage time.
---

# Track Costs

This guide covers the process of fetching payment stream data via the StorageHub SDK as an authorized user and using that data to calculate how much longer the DataHaven network will continue storing your files, based on your current balance and costs.

## Prerequisites

Before you begin, ensure you have the following:

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'
- [A file uploaded](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/){target=\_blank} to DataHaven

## Initialize the Script Entry Point

First, create an `index.ts` file if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you’ll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide.

The `index.ts` snippet below also imports `costOperations.ts`, which is not in your project yet—that's expected, as you'll create it later in this guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs.ts:imports'

async function run() {

  // --- Cost tracking logic ---
  // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**
  // **PLACEHOLDER FOR STEP 2: GET PAYMENT STREAMS**
  // **PLACEHOLDER FOR STEP 3: CALCULATE TIME REMAINING**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Authenticate

Before accessing payment stream information or balance data, authenticate with the MSP. The `authenticateUser` helper signs a SIWE message and returns a session token that authorizes your cost-tracking requests. Add the following code to use the `authenticateUser` helper method you've already implemented in `mspService.ts`:

```ts title='index.ts // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**'
--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:authenticate'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:imports'

      async function run() {

      // --- Cost tracking logic ---
      --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:authenticate'
      // **PLACEHOLDER FOR STEP 2: GET PAYMENT STREAMS**
      // **PLACEHOLDER FOR STEP 3: CALCULATE TIME REMAINING**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    await run();
    ```

## Get Payment Streams

For each created bucket and uploaded file, the MSP and corresponding BSPs storing your data bill your account a `costPerTick`. A tick corresponds to one block on the DataHaven network. With a 6-second block time, one tick = 6 seconds. Storage costs are calculated and deducted on a per-tick basis. 

To see what this recurring cost is for you specifically, in this section, you'll implement the `getPaymentStreams` helper method and then call it in your `index.ts` file.

### Add Method to Get Payment Streams

To implement the `getPaymentStreams` helper method, add the following code to the `mspService.ts` file:

```ts title="mspService.ts"
--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/msp-service-with-get-payment-streams.ts:payment-streams'
```

### Call Get Payment Streams Helper Method

Replace the placeholder `// **PLACEHOLDER FOR STEP 2: GET PAYMENT STREAMS**` with the following code:

```ts title='index.ts // **PLACEHOLDER FOR STEP 2: GET PAYMENT STREAMS**'
--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:payment-streams'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:imports'

      async function run() {

      // --- Cost tracking logic ---
      --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:authenticate'
      --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:payment-streams'
      // **PLACEHOLDER FOR STEP 3: CALCULATE TIME REMAINING**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    await run();
    ```

If you run the script with the code above, the response should look something like this:

--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/output-01.html'

## Calculate Remaining Time

In this section, you'll learn how to use the balance of your account, along with data gathered from all of your payment streams, to calculate how much time remains before your account runs out of funds due to the DataHaven network's recurring costs.

!!! warning
    If your balance reaches zero, all buckets and files will be permanently deleted. Keep funds topped up to avoid losing data.

### Add Method to Calculate Remaining Time

To implement the `calculateRemainingTime` helper method along with a few other methods to get your account's balance and format the remaining time in a human readable way, follow these steps:

1. Create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) like so:

    ```bash
    mkdir operations
    ```

2. Create a new file within the `operations` folder called `costOperations.ts`.

3. Add the following code:

    ```ts title='costOperations.ts'
    --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/costOperations.ts'
    ```

### Call Calculate Remaining Time Helper Method 

Replace the placeholder `// **PLACEHOLDER FOR STEP 3: CALCULATE TIME REMAINING**` with the following code:

```ts title='index.ts // **PLACEHOLDER FOR STEP 3: CALCULATE TIME REMAINING**'
--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:calculate-time-remaining'
```

??? code "View complete `index.ts`"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:imports'

      async function run() {

      // --- Cost tracking logic ---
      --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:authenticate'
      --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:payment-streams'
      --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/track-costs.ts:calculate-time-remaining'

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    await run();
    ```

If you run the script with the code above, the response should look something like this:

--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/output-02.html'

??? code "View complete `mspService.ts`"

    ```ts title="mspService.ts"
    --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/msp-service-with-get-payment-streams.ts'
    ```

??? code "View complete `costOperations.ts`"

    ```ts title="costOperations.ts"
    --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/costOperations.ts'
    ```

## Next Steps

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/" markdown>:material-arrow-right: 
    
    **Manage Files and Buckets**

    Learn how to manage your storage resources on DataHaven using the StorageHub SDK.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **Build a Data Workflow End-to-End**

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    </a>

</div>
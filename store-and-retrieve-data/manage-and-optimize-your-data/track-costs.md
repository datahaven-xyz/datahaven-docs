---
title: Track Costs
description: Lorem ipsum
---

# Track Costs

Lorem ipsum

## Prerequisites

Before you begin, ensure you have the following:

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'
- [A file uploaded](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/){target=\_blank} to DataHaven, along with the [file key](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/#compute-the-file-key){target=\_blank}

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

Before any file operations, authenticate with the MSP. The `authenticateUser` helper signs a SIWE message and returns a session token that authorizes your uploads, updates, and deletions. Add the following code to use the `authenticateUser` helper method you've already implemented in `mspService.ts`:

```ts title='index.ts // **PLACEHOLDER FOR STEP 1: AUTHENTICATE**'
--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs.ts:authenticate'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:imports'

      async function run() {
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:init-setup'

      // --- Cost tracking logic ---
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:authenticate'
      // **PLACEHOLDER FOR STEP 2: GET PAYMENT STREAMS**
      // **PLACEHOLDER FOR STEP 3: CALCULATE TIME REMAINING**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    await run();
    ```

## Get Payment Streams

Lorem

!!! warning
    If your balance reaches zero, all buckets and files will be permanently deleted. Keep funds topped up to avoid losing data.

### Add

Lorem



### Call

```ts title='index.ts // **PLACEHOLDER FOR STEP 2: GET PAYMENT STREAMS**'
--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs.ts:payment-streams'
```

If you run the script with the code above, the response should look something like this:

!!! note
    A tick corresponds to one block on the DataHaven network. With a 6-second block time, one tick = 6 seconds. Storage costs are calculated and deducted on a per-tick basis.

--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/output-01.html'




## Calculate Remaining Time

Lorem

### Add

### Call

```ts title='index.ts // **PLACEHOLDER FOR STEP 3: CALCULATE TIME REMAINING**'
--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs.ts:calculate-time-remaining'
```

If you run the script with the code above, the response should look something like this:

--8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/output-02.html'
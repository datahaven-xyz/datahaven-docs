---
title: Resolve Insolvent Status via API
description: This guide shows you how to check if your account has been flagged as insolvent, pay your outstanding debt, and clear your insolvent flag via the Polkadot API.
categories: Store Data, StorageHub SDK, Troubleshooting
---

# Resolve Insolvent Status via API

If your account balance runs out while you have active payment streams, the DataHaven network will flag your account as insolvent. This guide covers the process of checking your insolvent status, paying off any outstanding debt, and clearing the insolvent flag to restore your account's ability to store files in the network. This guide will cover the Polkadot API approach while the [Resolve Insolvent Status via UI](/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status-via-ui) guide covers the approach through the [Polkadot.js Apps](https://polkadot.js.org/apps/){target=\_blank} UI.

## Prerequisites

Before you begin, ensure you have the following:

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'
- [A file uploaded](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/){target=\_blank} to DataHaven
- Your account has been flagged as insolvent (or you want to proactively check your status)
- Sufficient funds in your account to pay any outstanding debt

## Understanding Insolvency

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/understanding-insolvency.md'

## Initialize the Script Entry Point

First, create an `index.ts` file if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you'll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide.

The `index.ts` snippet below also imports `costOperations.ts`, which you'll create later in this guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:imports'

async function run() {
  // Initialize WASM
  await initWasm();

  // --- Insolvency resolution logic ---
  // **PLACEHOLDER FOR STEP 1: CHECK INSOLVENT STATUS**
  // **PLACEHOLDER FOR STEP 2: AUTHENTICATE**
  // **PLACEHOLDER FOR STEP 3: GET PAYMENT STREAMS**
  // **PLACEHOLDER FOR STEP 4: CALCULATE OUTSTANDING DEBT**
  // **PLACEHOLDER FOR STEP 5: PAY OUTSTANDING DEBT**
  // **PLACEHOLDER FOR STEP 6: CLEAR INSOLVENT FLAG**
  // **PLACEHOLDER FOR STEP 7: VERIFY RESOLUTION**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

run();
```

## Check Insolvent Status

Before attempting any recovery actions, first check whether your account is actually flagged as insolvent on the network.

### Add Method to Check Insolvent Status

1. Create a new folder called `operations` within the `src` folder (at the same level as the `services` folder) if you haven't already:

    ```bash
    mkdir operations
    ```

2. Create a new file within the `operations` folder called `costOperations.ts` and add the following code:

    ```ts title="costOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/costOperations.ts:imports'

    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/costOperations.ts:is-insolvent'

    // Add other helper methods

    export { isInsolvent };
    ```

### Call the Check Insolvent Status Helper Method

Replace the placeholder `// **PLACEHOLDER FOR STEP 1: CHECK INSOLVENT STATUS**` with the following code:

```ts title='index.ts // **PLACEHOLDER FOR STEP 1: CHECK INSOLVENT STATUS**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:check-insolvent-status'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      // --- Insolvency resolution logic ---
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:check-insolvent-status'

      // **PLACEHOLDER FOR STEP 2: AUTHENTICATE**
      // **PLACEHOLDER FOR STEP 3: GET PAYMENT STREAMS**
      // **PLACEHOLDER FOR STEP 4: CALCULATE OUTSTANDING DEBT**
      // **PLACEHOLDER FOR STEP 5: PAY OUTSTANDING DEBT**
      // **PLACEHOLDER FOR STEP 6: CLEAR INSOLVENT FLAG**
      // **PLACEHOLDER FOR STEP 7: VERIFY RESOLUTION**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    run();
    ```

If you run the script with the code above, the response should look something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/output-01.html'

## Authenticate

Before accessing payment stream information, authenticate with the MSP. The `authenticateUser` helper signs a SIWE message and returns a session token that authorizes your requests. Add the following code to use the `authenticateUser` helper method you've already implemented in `mspService.ts`:

```ts title='index.ts // **PLACEHOLDER FOR STEP 2: AUTHENTICATE**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:authenticate'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      // --- Insolvency resolution logic ---
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:check-insolvent-status'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:authenticate'

      // **PLACEHOLDER FOR STEP 3: GET PAYMENT STREAMS**
      // **PLACEHOLDER FOR STEP 4: CALCULATE OUTSTANDING DEBT**
      // **PLACEHOLDER FOR STEP 5: PAY OUTSTANDING DEBT**
      // **PLACEHOLDER FOR STEP 6: CLEAR INSOLVENT FLAG**
      // **PLACEHOLDER FOR STEP 7: VERIFY RESOLUTION**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    run();
    ```

## Get Payment Streams

To pay off your outstanding debt, you need to know which providers you owe money to. This information comes from your payment streams. 

1. If you haven't already implemented the `getPaymentStreams` method from the [Track Costs](/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/){target=\_blank} guide, add the following code to your `mspService.ts` file:

    ```ts title="mspService.ts"
    --8<-- 'code/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/msp-service-with-get-payment-streams.ts:payment-streams'
    ```

2. Replace the placeholder `// **PLACEHOLDER FOR STEP 3: GET PAYMENT STREAMS**` with the following code:

    ```ts title='index.ts // **PLACEHOLDER FOR STEP 3: GET PAYMENT STREAMS**'
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:payment-streams'
    ```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      // --- Insolvency resolution logic ---
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:check-insolvent-status'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:authenticate'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:payment-streams'

      // **PLACEHOLDER FOR STEP 4: CALCULATE OUTSTANDING DEBT**
      // **PLACEHOLDER FOR STEP 5: PAY OUTSTANDING DEBT**
      // **PLACEHOLDER FOR STEP 6: CLEAR INSOLVENT FLAG**
      // **PLACEHOLDER FOR STEP 7: VERIFY RESOLUTION**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    run();
    ```

If you run the script with the code above, the response should look something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/output-02.html'

## Calculate Outstanding Debt

Before paying your debt, it's important to calculate the total amount owed and verify you have sufficient funds. Technically, you don't have to calculate your debt, since the network will automatically withdraw the exact amount owed from your account when you call the `payOutstandingDebt` extrinsic. Still, then you wouldn't know how much you were about to pay. The `calculateTotalOutstandingDebt` helper method returns two types of debt:

- **Total raw debt**: The total amount accumulated based on storage rates
- **Total effective debt**: The actual amount you owe, capped by your deposit for each payment stream (essentially the sum of each payment stream's `min(userDeposit, userDebt)`)

### Add Methods to Get Balance and Calculate Debt

Add the following methods to your `costOperations.ts` file:

```ts title="costOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/costOperations.ts:get-balance'

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/costOperations.ts:calculate-total-outstanding-debt'
```

Make sure to update your exports:

```ts title="costOperations.ts"
export {
  getBalance,
  isInsolvent,
  calculateTotalOutstandingDebt,
};
```

### Call the Calculate Outstanding Debt Helper Method

Replace the placeholder `// **PLACEHOLDER FOR STEP 4: CALCULATE OUTSTANDING DEBT**` with the following code:

```ts title='index.ts // **PLACEHOLDER FOR STEP 4: CALCULATE OUTSTANDING DEBT**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:calculate-debt'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      // --- Insolvency resolution logic ---
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:check-insolvent-status'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:authenticate'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:payment-streams'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:calculate-debt'

      // **PLACEHOLDER FOR STEP 5: PAY OUTSTANDING DEBT**
      // **PLACEHOLDER FOR STEP 6: CLEAR INSOLVENT FLAG**
      // **PLACEHOLDER FOR STEP 7: VERIFY RESOLUTION**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    run();
    ```

If you run the script with the code above, the response should look something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/output-03.html'

## Pay Outstanding Debt

Now that you've calculated the outstanding debt and verified you have sufficient funds, you can pay the debt to all providers.

If all of your providers are online and have already automatically cleaned up your files and settled debts from your deposits, this step may not be necessary. However, if any provider was offline or failed to process your insolvency, you'll need to manually pay the outstanding debt to release the locked funds from those unresolved payment streams. Calling `payOutstandingDebt` also prevents further debt from accumulating while you wait for providers to react.

### Add Method to Pay Outstanding Debt

Add the following method to your `costOperations.ts` file:

```ts title="costOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/costOperations.ts:pay-outstanding-debt'
```

Make sure to update your exports:

```ts title="costOperations.ts"
export {
  getBalance,
  isInsolvent,
  calculateTotalOutstandingDebt,
  payOutstandingDebt,
};
```

### Call the Pay Outstanding Debt Helper Method

Replace the placeholder `// **PLACEHOLDER FOR STEP 5: PAY OUTSTANDING DEBT**` with the following code:

!!! note
     When you fetch your active payment streams, some may be from the same provider, resulting in those payment streams having the same provider ID. You'll need to extract the unique provider IDs from your payment streams before paying, because the `payOutstandingDebt` extrinsic expects an array of unique provider IDs as a parameter. 

```ts title='index.ts // **PLACEHOLDER FOR STEP 5: PAY OUTSTANDING DEBT**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:pay-outstanding-debt'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      // --- Insolvency resolution logic ---
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:check-insolvent-status'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:authenticate'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:payment-streams'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:calculate-debt'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:pay-outstanding-debt'

      // **PLACEHOLDER FOR STEP 6: CLEAR INSOLVENT FLAG**
      // **PLACEHOLDER FOR STEP 7: VERIFY RESOLUTION**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    run();
    ```

If you run the script with the code above, the response should look something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/output-04.html'

## Clear Insolvent Flag

After paying all outstanding debt, you must explicitly clear the insolvent flag from your account. This signals to the network that you've resolved your debt and wish to restore normal account functionality. Once the flag is cleared and the cooldown period has passed, you can resume processing new storage requests.

### Add Method to Clear Insolvent Flag

Add the following method to your `costOperations.ts` file:

```ts title="costOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/costOperations.ts:clear-insolvent-flag'
```

Update your exports to include the new method:

```ts title="costOperations.ts"
export {
  getBalance,
  isInsolvent,
  calculateTotalOutstandingDebt,
  payOutstandingDebt,
  clearInsolventFlag,
};
```

### Call the Clear Insolvent Flag Helper Method

Replace the placeholder `// **PLACEHOLDER FOR STEP 6: CLEAR INSOLVENT FLAG**` with the following code:

```ts title='index.ts // **PLACEHOLDER FOR STEP 6: CLEAR INSOLVENT FLAG**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:clear-insolvent-flag'
```

??? code "View complete `index.ts` up until this point"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:imports'

    async function run() {
      // Initialize WASM
      await initWasm();

      // --- Insolvency resolution logic ---
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:check-insolvent-status'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:authenticate'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:payment-streams'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:calculate-debt'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:pay-outstanding-debt'
      --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:clear-insolvent-flag'

      // **PLACEHOLDER FOR STEP 7: VERIFY RESOLUTION**

      // Disconnect the Polkadot API at the very end
      await polkadotApi.disconnect();
    }

    run();
    ```

If you run the script with the code above, the response should look something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/output-05.html'

## Verify Resolution

After clearing the insolvent flag, verify that your account status has been updated.

Replace the placeholder `// **PLACEHOLDER FOR STEP 7: VERIFY RESOLUTION**` with the following code:

```ts title='index.ts // **PLACEHOLDER FOR STEP 7: VERIFY RESOLUTION**'
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts:recheck-insolvent-status'
```

If you run the script with the code above, the response should look something like this:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/output-06.html'

!!! note "Cooldown Period"
    After successfully clearing the insolvent flag, a cooldown period of 100 blocks (~10 minutes) applies before you can resume normal operations like creating buckets or uploading files.

??? code "View complete `index.ts`"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/resolve-insolvent-status.ts'
    ```

??? code "View complete `costOperations.ts`"

    ```ts title="costOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status/costOperations.ts'
    ```

## Next Steps

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/" markdown>:material-arrow-right:

    **Track Costs**

    Learn how to monitor your storage costs and calculate remaining time before your balance runs out.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/" markdown>:material-arrow-right:

    **Manage Files and Buckets**

    Learn how to manage your storage resources on DataHaven using the StorageHub SDK.

    </a>

</div>

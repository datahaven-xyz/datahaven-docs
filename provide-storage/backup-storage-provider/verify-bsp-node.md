---
title: Verify BSP Node
description: Guide on how to register your BSP node on-chain and start contributing to the DataHaven network.
---

# Verify BSP Node

This guide walks you through how to register your Backup Storage Provider (BSP) on-chain and verify it is eligible to participate in the DataHaven network.

## Prerequisites

- [A running BSP node](/provide-storage/backup-storage-provider/run-a-bsp-node.md){target=\_blank} with your BSP seed phrase and SS58 public key handy.
--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

### Deposit Requirements

The formula for the deposit is as follows:

`SpMinDeposit` + (`capacity_in_gib` * `DepositPerData`) + `buffer`

- **`SpMinDeposit`**: Base deposit of 100 MOCK
- **`capacity_in_gib`**: The set GiB capacity of your hardware
- **`DepositPerData`**: 2 MOCK per GiB
- **`buffer`**: An additional safety margin

Examples:

- **800 GiB capacity**: 100 + (800 × 2) = 1,700 MOCK required (1,800 MOCK recommended)
- **1.6 TiB capacity**: 100 + (1,638 × 2) = 3,376 MOCK required (3,500+ MOCK recommended)

The deposit is held (reserved) from your account when you start the BSP registration process and remains held while you operate as a BSP. The deposit is returned when you deregister as a BSP.

!!! note
    Your BSP account must be funded before BSP registration.

## Install Additional Dependencies

Install the following dependencies:

```bash
pnpm add polkadot-api @polkadot/util-crypto
```

## Set Up Keyrings

Set up the keyrings needed to sign BSP-related transactions and derive the correct on-chain identities.

1. Within your `services` folder, create a new file called `bspService.ts`.

2. Add the following code:

```ts  title="bspService.ts"
--8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/bspService.ts'
```

!!! warning
    It is assumed that private keys are securely stored and managed in accordance with standard security practices.

## Request BSP Sign Up

Submit an on-chain request to register your node as an official Backup Storage Provider.

### Add Helper Methods to Request Sign Up

Add reusable helper methods for funding your BSP account, checking balances, resolving multiaddresses, and submitting the sign-up transaction.

1. If you haven't already, create an `operations` folder adjacent to your `services` folder:

```bash
mkdir operations
```

2. Create a `bspOperations.ts` file.

3. Add the following helper methods to your `bspOperations.ts` file:

    ```ts title="bspOperations.ts"
    --8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/bspOperations.ts:imports'

    --8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/bspOperations.ts:fund-bsp-address'

    --8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/bspOperations.ts:check-bsp-balance'

    --8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/bspOperations.ts:check-bsp-balance:get-multiaddresses'

    --8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/bspOperations.ts:request-bsp-sign-up'

    // Add other BSP helper methods here
    ```

The roles each helper method plays:

- **`fundBspAddress`**: Ensures the BSP account has enough balance to cover the required deposit.
- **`checkBspBalance`**: Verifies available funds of the BSP address.
- **`requestBspSignUp`**: Fetches the network addresses your BSP advertises to the network and selects the proper multiaddresses for the `request_bsp_sign_up` extrinsic.
- **`requestBspSignUp`**: Submits the on-chain request to register the BSP node by calling the `request_bsp_sign_up` extrinsic.

### Call the Request Sign Up Method

Trigger the BSP sign-up flow from your main script to submit the registration request on-chain.

1. Create an `index.ts` file adjacent to your `operations` and `services` folder, if you haven't already.

2. Add the following code:

    ```ts title="index.ts"
    --8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/verify-bsp-node.ts:imports'

    --8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/verify-bsp-node.ts:request-sign-up'

    // Add other script methods here
    ```

    Check the [formula for the deposit](/provide-storage/backup-storage-provider/verify-bsp-node.md#deposit-requirements) to make sure you've prepared the right amount of funds.

## Cancel BSP Sign Up If Needed

Mistakes can happen during the BSP verification process. That's why the `cancel_sign_up` extrinsic is available after the `request_bsp_sign_up` has been called in order to revoke the request before it has been finalized on-chain. This extrinsic can only be called prior to confirming verification via the `confirm_sign_up` extrinsic.

### Add Helper Method to Cancel Sign Up

Add the `cancelBspSignUp` helper method that submits the transaction to cancel a pending BSP registration.

Add the following code to your `bspOperations.ts` file:

```ts title="bspOperations.ts"
--8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/bspOperations.ts:cancel-bsp-sign-up'
```

### Call the Cancel Sign Up Method

Invoke the cancel method from your script to abort the BSP sign-up process, with the following code:

```ts title="index.ts"
--8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/verify-bsp-node.ts:cancel-bsp-sign-up'
```

## Confirm BSP Sign Up

Confirm your BSP registration after the required waiting period has passed. You should only trigger the `confirmBspSignUp` method after a new epoch has begun. An epoch lasts 1 hour. You can check if a new epoch has begun on the Explorer page on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9946#/explorer){target=\_blank}

### Add Helper Method to Confirm Sign Up

To add the `confirmBspSignUp` helper method and thus finalize the BSP registration on-chain, add the following code to your `bspOperations.ts` file:

```ts title="bspOperations.ts"
--8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/bspOperations.ts:confirm-bsp-sign-up'
```

### Call the Confirm Sign Up Method

Call the confirmation method with the following code to complete BSP registration:

```ts title="index.ts"
--8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/verify-bsp-node.ts:confirm-bsp-sign-up'
```

## Next Steps

<div class="grid cards" markdown>

-  <a href="/provide-storage/backup-storage-provider/faqs-and-troubleshooting" markdown>:material-arrow-right: 

    **BSP FAQ and Troubleshooting**

    For any issues you may have encountered regarding the BSP and all processes related to spinning it up, make sure to check out this FAQ page.

    </a>

-  <a href="/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/" markdown>:material-arrow-right:

    **End-to-End BSP Onboarding**

    This tutorial takes you step-by-step through spinning up a BSP and verifying it on-chain.

    </a>

</div>
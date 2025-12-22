---
title: Verify BSP Node
description: Guide on how to register your BSP node on-chain and start contributing to the DataHaven network.
---

# Verify BSP Node

Lorem ipsum

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

1. Within your `services` folder, create a new file called `bspService.ts`.

2. Add the following code:

```ts
--8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/bspService.ts'
```

!!! warning
    It is assumed that private keys are securely stored and managed in accordance with standard security practices.

## Request BSP Sign Up

Lorem

### Add Helper Methods to Request Sign Up

To fund your BSP account from the MSP Client, take the following steps:

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

### Call the Request Sign Up Method

1. Create an `index.ts` file adjacent to your `operations` and `services` folder, if you haven't already.

2. Add the following code:

    ```ts
    --8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/verify-bsp-node.ts:imports'

    --8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/verify-bsp-node.ts:request-sign-up'

    // Add other script methods here
    ```

    Check the [formula for the deposit](/provide-storage/backup-storage-provider/verify-bsp-node.md#deposit-requirements) to make sure you've prepared the right amount of funds.



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
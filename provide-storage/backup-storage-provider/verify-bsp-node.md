---
title: Verify BSP Node
description: Guide on how to register your BSP node on-chain and start contributing to the DataHaven network.
---

# Verify BSP Node

Lorem ipsum

## Prerequisites

- [A running BSP node](/provide-storage/backup-storage-provider/run-a-bsp-node.md){target=\_blank} with your BSP seed phrase and SS58 public key handy.
--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

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


### Add Methods to Fund Account and Request Sign Up

To fund your BSP account from the MSP Client, take the following steps:

1. If you haven't already, create an `operations` folder adjacent to your `services` folder:

```bash
mkdir operations
```

2. Create a `bspOperations.ts` file.

3. Add the following helper methods to your `bspOperations.ts` file:

    ```ts title="bspOperations.ts"
    --8<-- 'code/provide-storage/backup-storage-provider/verify-bsp-node/bspOperations.ts:'
    ```

??? interface "How much funds are enough?"



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
---
title: Verify BSP Node via UI
description: Guide on how to register your BSP node on-chain via Polkadot.js Apps and start contributing to the DataHaven network.
---

# Verify BSP Node via UI

This guide walks you through how to register your Backup Storage Provider (BSP) on-chain and verify it is eligible to participate in the DataHaven network through the [Polkadot.js Apps](https://polkadot.js.org/apps/){target=\_blank} UI.

## Prerequisites

- [A running BSP node](/provide-storage/backup-storage-provider/run-a-bsp-node.md){target=\_blank} with your BSP's secret/raw seed and your BSP's multiaddress handy.

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


This section walks you through the 2-step process of registering your BSP on-chain and verifying that it is eligible to participate in the DataHaven network using [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9946#){target=\_blank} along with your BSP node's `wsUrl`.

## Import BSP Account Into Wallet

To proceed with verifying your BSP node, you must have your BSP account ready to sign transactions in your browser.

1. Install in your browser the [Talisman](https://talisman.xyz/){target=\_blank} wallet if you haven't already.

2. Import into your wallet of choice, the same ECDSA raw seed that you injected into your BSP node's keystore.

## Request BSP Sign Up

Trigger the BSP sign-up flow from Polkadot.js Apps to submit the registration request on-chain.

1. On [Polkadot.js Apps](https://polkadot.js.org/apps/){target=\_blank}, open the navbar on the top left, and set your custom `wsUrl` WebSocker endpoint. Depending on whether your BSP node is running on a remote Linux server or on your local machine (the same machine where you're accessing the Polkadot.js Apps) you are going to be using a different WebSocket endpoint.

    === "Remote Server"

        Set your custom `wsUrl` to be `wss://services.datahaven-testnet.network/testnet`.

        ![Set custom wsUrl for BSP running on remote server](/images/provide-storage/verify-bsp-node/verify-bsp-node-1a.webp)


    === "Local Machine"

        Set your custom `wsUrl` to be `ws://127.0.0.1:9946`. You should use the port number `9946` because that is the port number you should have defined in your `docker-compose.yml` file when going through the [Run a BSP Node](/provide-storage/backup-storage-provider/run-a-bsp-node.md) guide.

        ![Set custom wsUrl for BSP running on local machine](/images/provide-storage/verify-bsp-node/verify-bsp-node-1b.webp)

2. Within the Developer section, go to the Extrinsics page, and select the `providers.requestBspSignUp` extrinsic. 

    Three parameters are required to execute this extrinsic:

    - capacity
    - multiaddresses
    - paymentAccount

    ![Select the `providers.requestBspSignUp` extrinsic on the Extrinsics page](/images/provide-storage/verify-bsp-node/verify-bsp-node-2.webp)

3. Set capacity based on your machine's capabilities and the [hardware requirements](/provide-storage/run-a-bsp-node/#hardware-requirements){target=\_blank} provided in the "Run a BSP Node" guide.

    ![Requesting testnet funds from the faucet](/images/provide-storage/verify-bsp-node/verify-bsp-node-3.webp)

4. Add your BSP node's multiaddress into the `multiaddresses` field. You can find it in the logs of your BSP node as shown in the [Run a BSP Node](/provide-storage/backup-storage-provider/run-a-bsp-node.md) guide.

    ![Add multiaddress into `multiaddresses` field](/images/provide-storage/verify-bsp-node/verify-bsp-node-4a.webp)

    ??? interface "How can I find the multiaddress of my locally ran BSP node?"

        In order to find the correct multiaddress, within the Developer section, go to the RPC calls page and submit the `system.localListenAddresses` RPC call. Out of the provided list, you should copy the multiaddress that doesn't contain neither `127.0.0.1` nor `::1`, but the one with the actual IP address such as `192.168.97.2`.

        This will only work if you are using the WebSocket endpoint of your locally ran BSP node.

        ![Call `system.localListenAddresses` to find multiaddresses](/images/provide-storage/verify-bsp-node/verify-bsp-node-4b.webp)

5. Choose a public address on which you want to receive BSP rewards.

    ![Choose account to receive payments](/images/provide-storage/verify-bsp-node/verify-bsp-node-5.webp)

6. Submit transaction.

    ![Submit transaction](/images/provide-storage/verify-bsp-node/verify-bsp-node-6.webp)

## Confirm BSP Sign Up

Confirm your BSP registration after the required waiting period has passed. You should only trigger the `confirmBspSignUp` method after a new epoch has begun. An epoch lasts 1 hour.

1. Check if a new epoch has begun on Polkadot. js Apps' [Explorer page](https://polkadot.js.org/apps/explorer){target=\_blank}.

    ![Check epoch](/images/provide-storage/verify-bsp-node/verify-bsp-node-7.webp)

2. Go to the Extrinsics page, and select the `providers.confirmSignUp` extrinsic. 


    ![Call `providers.confirmSignUp` extrinsic](/images/provide-storage/verify-bsp-node/verify-bsp-node-8.webp)

3. Submit transaction.

    ![Submit transaction](/images/provide-storage/verify-bsp-node/verify-bsp-node-9.webp)

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

---
title: Resolve Insolvent Status via UI
description: This guide shows you how to check if your account has been flagged as insolvent, pay your debt, and clear your insolvent flag via the Polkadot.js Apps UI.
categories: Store Data, StorageHub SDK, Troubleshooting
---

# Resolve Insolvent Status via UI

If your account balance runs out while you have active payment streams, the DataHaven network will flag your account as insolvent. This guide covers the process of checking your insolvent status, paying off any outstanding debt, and clearing the insolvent flag to restore your account's ability to store files in the network. This guide will cover the UI approach through the [Polkadot.js Apps](https://polkadot.js.org/apps/){target=\_blank} UI, while the [Resolve Insolvent Status via API](/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status-via-api) guide covers the Polkadot API approach.

## Prerequisites

Before you begin, ensure you have the following:

- [A file uploaded](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/){target=\_blank} to DataHaven
- Your account has been flagged as insolvent (or you want to proactively check your status)
- Sufficient funds in your account to pay any outstanding debt
- A browser wallet (such as [Talisman](https://talisman.xyz/){target=\_blank}) with your account imported

## Understanding Insolvency

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/understanding-insolvency.md'

## Connect to Polkadot.js Apps

On [Polkadot.js Apps](https://polkadot.js.org/apps/){target=\_blank}, open the navbar on the top left, and set your custom `wsUrl` WebSocket endpoint to `wss://services.datahaven-testnet.network/testnet`.

![Set custom wsUrl](/images/store-and-retrieve-data/resolve-insolvent-status/resolve-insolvent-status-1.webp)

## Check Insolvent Status

Before attempting any recovery actions, first check whether your account is actually flagged as insolvent on the network.

1. Within the **Developer** section, go to the **Chain state** page.

2. Select the **`paymentStreams`** pallet and the **`usersWithoutFunds`** query.

3. Enter your account address in the parameter field and click the **+** button to execute the query.

4. If the result returns a value (not `None`), your account is flagged as insolvent and you need to proceed with the steps below to resolve it. If the result is `None`, your account is not insolvent.

    ![Query usersWithoutFunds](/images/store-and-retrieve-data/resolve-insolvent-status/resolve-insolvent-status-2.webp)

## Pay Outstanding Debt

If all of your providers are online and have already automatically cleaned up your files and settled debts from your deposits, this step may not be necessary. However, if any provider was offline or failed to process your insolvency, you'll need to manually pay the outstanding debt to release the locked funds from those unresolved payment streams. Calling `payOutstandingDebt` also prevents further debt from accumulating while you wait for providers to react.

!!! note
    To calculate your total outstanding debt before paying it, see the [Resolve Insolvent Status via API](/store-and-retrieve-data/use-storagehub-sdk/resolve-insolvent-status-via-api/#calculate-outstanding-debt) guide.

1. Within the **Developer** section, go to the **Extrinsics** page.

2. Select your account from the **using the selected account** dropdown.

3. Select the **`paymentStreams`** pallet and the **`payOutstandingDebt`** extrinsic.

    ![Select payOutstandingDebt extrinsic](/images/store-and-retrieve-data/resolve-insolvent-status/resolve-insolvent-status-3.webp)

4. Find the values of **`providerIds`** parameter by checking the [DataHaven dApp Payments](https://datahaven.app/testnet/payments){target=\_blank} page.

    !!! note
        To query your payment streams yourself see the [Track Costs](/store-and-retrieve-data/manage-and-optimize-your-data/track-costs/){target=\_blank} guide.

    ![Find provider ID values](/images/store-and-retrieve-data/resolve-insolvent-status/resolve-insolvent-status-4.webp)

5. In the **`providerIds`** parameter, add the provider IDs that you owe debt to. When you have multiple payment streams, some of them may be from the same provider. Make sure to only include each unique provider ID once in the `providerIds` parameter.

    ![Add unique provider IDs](/images/store-and-retrieve-data/resolve-insolvent-status/resolve-insolvent-status-5.webp)

6. Click **Submit Transaction** and sign the transaction with your wallet.

    ![Submit payOutstandingDebt transaction](/images/store-and-retrieve-data/resolve-insolvent-status/resolve-insolvent-status-6.webp)

## Clear Insolvent Flag

After paying all outstanding debt, you must explicitly clear the insolvent flag from your account. This signals to the network that you've resolved your debt and wish to restore normal account functionality. Once the flag is cleared and the cooldown period has passed, you can resume processing new storage requests.

1. On the **Extrinsics** page, select the **`paymentStreams`** pallet and the **`clearInsolventFlag`** extrinsic.

    ![Select clearInsolventFlag extrinsic](/images/store-and-retrieve-data/resolve-insolvent-status/resolve-insolvent-status-7.webp)

2. Click **Submit Transaction** and sign the transaction with your wallet.

    ![Submit clearInsolventFlag transaction](/images/store-and-retrieve-data/resolve-insolvent-status/resolve-insolvent-status-8.webp)

## Verify Resolution

After clearing the insolvent flag, verify that your account status has been updated.

1. Go back to the **Chain state** page.

2. Select the **`paymentStreams`** pallet and the **`usersWithoutFunds`** query.

3. Enter your account address and click the **+** button to execute the query.

4. The result should now return `None`, confirming that your account is no longer flagged as insolvent.

    ![Verify insolvent status cleared](/images/store-and-retrieve-data/resolve-insolvent-status/resolve-insolvent-status-2.webp)

!!! note "Cooldown Period"
    After successfully clearing the insolvent flag, a cooldown period of 100 blocks (~10 minutes) applies before you can resume normal operations like creating buckets or uploading files.

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

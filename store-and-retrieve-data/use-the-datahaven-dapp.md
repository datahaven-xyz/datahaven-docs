---
title: Use the DataHaven dApp
description: Use the DataHaven web dApp to create buckets, upload files, and download data on the DataHaven testnet without writing code.
---

# Use the DataHaven dApp

The DataHaven dApp is a convenient front-end for users to interact with the DataHaven network. It guides you through connecting your wallet, creating buckets, and uploading or downloading files without writing any code.

## Prerequisites

- DataHaven testnet RPC added to your wallet (see the [Testnet](/store-and-retrieve-data/network-details/testnet/#network-configurations){target=\_blank} page for RPC details; the connection flow below will also prompt you to add it)
- [MOCK testnet tokens](https://apps.datahaven.xyz/testnet/faucet){target=\_blank} to cover transactions and storage fees
- [DataHaven dApp testnet URL](https://datahaven.app/testnet){target=\_blank}

## Connect and Fund Your Wallet

To get started, visit the [DataHaven testnet portal](https://apps.datahaven.xyz/testnet){target=\_blank} and click **Connect**. When prompted, approve adding the DataHaven testnet RPC to your wallet, then sign the login message to authenticate.

![Connect your wallet on the DataHaven portal](/images/store-and-retrieve-data/use-the-datahaven-dapp/use-the-datahaven-dapp-1.webp)

To request tokens:

1. Go to the **Faucet** tab.
2. Complete the captcha.
3. Click **Request tokens** to receive MOCK for gas and storage payments.

![Requesting testnet funds from the faucet](/images/store-and-retrieve-data/use-the-datahaven-dapp/use-the-datahaven-dapp-2.webp)

## Connect to DataHaven dApp and Authorize Storage Payments

1. Go to the [DataHaven dApp on testnet](https://datahaven.app/testnet){target=\_blank}.
2. Click **Connect wallet** and choose your wallet provider, then sign the login message.
3. Approve the allowance prompts that appear. DataHaven charges on an ongoing basis for the amount of data you store and the desired replication factor, so these approvals let the dApp deduct storage fees from your testnet balance when you upload files.

![Approving ongoing storage allowances in DataHaven dApp](/images/store-and-retrieve-data/use-the-datahaven-dapp/use-the-datahaven-dapp-3.webp)

## Sign In With MSP

1. Click **Sign in with MSP**.
2. Sign the message.

![Approving connection with MSP](/images/store-and-retrieve-data/use-the-datahaven-dapp/use-the-datahaven-dapp-4.webp)

## Create a Bucket

1. In the DataHaven dApp, open **Buckets** and review the notice displayed on the page.
2. Select the checkbox that you have read and agree to the terms and conditions.
3. Press **Start**.
4. Click **Create Bucket**.

![Buckets view in DataHaven dApp](/images/store-and-retrieve-data/use-the-datahaven-dapp/use-the-datahaven-dapp-5.webp)

In the pop-up window:

1. Choose if the bucket should be private or public.
2. Give the bucket a name and press **Create Bucket**.
3. Click **Create Bucket**.

    ![Creating a new bucket](/images/store-and-retrieve-data/use-the-datahaven-dapp/use-the-datahaven-dapp-6.webp)

4. Approve the  bucket creation transaction in your wallet.

    ![Confirm bucket creation transaction](/images/store-and-retrieve-data/use-the-datahaven-dapp/use-the-datahaven-dapp-7.webp)

Wait a few moments while the bucket is indexed. Once it appears, you can open it to manage files and folders.

## Upload and Download a File

1. Open your bucket and review the notice displayed on the page.

    ![Open bucket](/images/store-and-retrieve-data/use-the-datahaven-dapp/use-the-datahaven-dapp-8.webp)

2. Click **Upload**.

    ![Click Upload button](/images/store-and-retrieve-data/use-the-datahaven-dapp/use-the-datahaven-dapp-9.webp)

In the pop-up window:

1. Choose a file from your computer and leave replication settings as-is (they are fixed in the current release).
2. Click **Create Storage Request** and approve the transaction to start the upload.

    ![Creating a storage request for an upload](/images/store-and-retrieve-data/use-the-datahaven-dapp/use-the-datahaven-dapp-10.webp)

The upload shows **In progress** while replicas are distributed. You can still click **Download** during replication. Once replication meets the target, the status switches to **Ready**.

![Upload in progress with download available](/images/store-and-retrieve-data/use-the-datahaven-dapp/use-the-datahaven-dapp-11.webp)

That’s all you need to store and retrieve files on DataHaven using the DataHaven dApp.

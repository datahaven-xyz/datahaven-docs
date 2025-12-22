---
title: Use the DataHaven dApp
description: Use the DataHaven web dApp to create buckets, upload files, and download data on the DataHaven testnet without writing code.
---

# Use the DataHaven dApp

The DataHaven dApp is a convenient front-end for users to interact with the DataHaven network. It guides you through connecting your wallet, creating buckets, and uploading or downloading files without writing any code.

## Prerequisites

- DataHaven testnet RPC added to your wallet (see the [Storage Starter Kit](/store-and-retrieve-data/starter-kit/#network-configurations){target=\_blank} for RPC details; the connection flow below will also prompt you to add it)
- [MOCK testnet tokens](https://apps.datahaven.xyz/faucet){target=\_blank} to cover transactions and storage fees
- [DataHaven dApp testnet URL](https://datahaven.app/testnet){target=\_blank}

## Connect and Fund Your Wallet

To get started, visit the [DataHaven testnet portal](https://apps.datahaven.xyz/testnet){target=\_blank} and click **Connect**. When prompted, approve adding the DataHaven testnet RPC to your wallet, then sign the login message to authenticate.

![Connect your wallet on the DataHaven portal](/images/datahaven-dapp/datahaven-dapp-1.webp)

Then, in the **Faucet** tab, complete the captcha and click **Request tokens** to receive MOCK for gas and storage payments.

![Requesting testnet funds from the faucet](/images/datahaven-dapp/datahaven-dapp-2.webp)

## Authorize Storage Payments

1. Go to the [DataHaven dApp on testnet](https://datahaven.app/testnet){target=\_blank}.
2. Click **Connect wallet** and choose your wallet provider, then sign the login message.
3. Approve the allowance prompts that appear. DataHaven charges on an ongoing basis for the amount of data you store and the desired replication factor, so these approvals let the dApp deduct storage fees from your testnet balance when you upload files.

![Approving ongoing storage allowances in DataHaven dApp](/images/datahaven-dapp/datahaven-dapp-3.webp)

## Create a Bucket

1. In the DataHaven dApp, open **Buckets** and review the notice that buckets are public on testnet.
2. Select the checkbox that you have read and agree to the terms and conditions.
3. Press **Start**.
4. Click **Create Bucket**.

![Buckets view in DataHaven dApp](/images/datahaven-dapp/datahaven-dapp-4.webp)

In the pop-up window, give the bucket a name and press **Create Bucket**. Then confirm the transaction in your wallet.

![Creating a new bucket](/images/datahaven-dapp/datahaven-dapp-5.webp)

Wait a few moments while the bucket is indexed. Once it appears, you can open it to manage files and folders.

## Upload and Download a File

1. Open your bucket and (optionally) create folders to organize files.
2. Click **Upload**, choose a file from your computer, and leave replication settings as-is (they are fixed in the current release).
3. Select **Create Storage Request** and confirm the transaction to start the upload.

![Creating a storage request for an upload](/images/datahaven-dapp/datahaven-dapp-6.webp)

The upload shows **In progress** while replicas are distributed. You can still click **Download** during replication. Once replication meets the target, the status switches to **Ready**.

![Upload in progress with download available](/images/datahaven-dapp/datahaven-dapp-7.webp)

That’s all you need to store and retrieve files on DataHaven using the DataHaven dApp.

---
title: Store and Retrieve Data Overview
description: Overview of the complete data storage and retrieval process in DataHaven, from bucket creation to verification and file access.
---

DataHaven separates storage from verification. Providers keep your file bytes off-chain, while the chain records a small, verifiable receipt so integrity can be checked at read time. This section shows how to create a bucket, upload, share access, and retrieve with confidence—without deep technical steps.

## How it works at a glance

1. **Pick a provider and bucket**  
   Connect your wallet or app identity. Select an MSP and create or reuse a bucket. You can make it public or private (encrypted).

2. **Upload**  
   The app sends your file to the provider and records a compact on-chain receipt in your bucket. Providers keep the file bytes off-chain. Backup Storage Providers (BSPs) may mirror copies based on policy.

3. **Retrieve**  
   When you download, the provider returns the bytes plus a small proof. The app can verify this against the on-chain receipt before using the data.

Ready to try it in the dapp? Start with the core workflows below.

## Start here: core workflows

- Create a bucket to organize your data. Choose Public for shared access or Private (encrypted) for sensitive information.
- Upload files to a Main Storage Provider (MSP). The app creates a storage request and submits an on-chain transaction that anchors a tiny fingerprint of each file.
- Retrieve files later with a lightweight integrity check against the on-chain receipt.

Before you jump into guides, here are a few practical notes.

## Before you start

- **Costs and deposits.** Wallet and network fees may apply. Creating a bucket and registering data requires a small on-chain deposit. Providers may charge periodic storage fees.
- **Provider choice and capacity.** You pick a Main Storage Provider (MSP). Capacity, performance, and pricing are provider-specific. You can switch later by creating a new bucket with another MSP and moving your data.
- **Large files.** Large uploads are supported. The app automatically handles chunking and integrity checks under the hood.


## Next steps

- **Quickstart**  
  Create a bucket and upload your first file.  
  → [Open the Quickstart](/store-and-retrieve-data/quickstart)

- **Use StorageHub TypeScript SDK / Get Started**  
  Build programmatically with the TypeScript SDK and the same primitives your app uses.  
  → [Get started with the StorageHub TypeScript SDK](/store-and-retrieve-data/use-storagehub-sdk/get-started)
---
title: Store and Retrieve Data Overview
description: Overview of the complete data storage and retrieval process in DataHaven, from bucket creation to verification and file access.
---

DataHaven is a verifiable storage network that separates storage from verification. Providers keep your file bytes off-chain, while the chain records a small, verifiable receipt so integrity can be checked at read time. This section shows at a high level how to create a bucket, upload, share access, and retrieve files.

## How File Storage works at a glance

1. **Pick a provider and bucket**: Connect your wallet or app identity. Select a Main Storage Provider (MSP) and create or reuse a bucket. You can make it public or private (encrypted).

2. **Upload**: The app uploads the file to an MSP and anchors a compact on-chain receipt. The network then replicates the file to Backup Storage Providers (BSPs) to meet the configured replication target.

3. **Retrieve**: When you download, the provider returns the bytes plus a small proof. The app can verify this against the on-chain receipt before using the data.

Ready to try it in the dapp? It's a straightforward create, upload, and retrieve process.

## Start here: core workflows

- Create a bucket to organize your data. Choose Public for shared access or Private (encrypted) for sensitive information.
- Upload files to an MSP. The app creates a storage request and submits an on-chain transaction that anchors a tiny fingerprint of each file.
- Retrieve files later with a lightweight integrity check against the on-chain receipt.

Before you jump into guides, here are a few practical notes.

## Key considerations

As you plan your workflow, consider the following concepts:

- **Costs and deposits.** Wallet and network fees apply. Creating a bucket and registering data requires a small on-chain deposit. Providers may charge periodic storage fees.
- **Provider choice and capacity.** You pick a Main Storage Provider (MSP). Capacity, performance, and pricing are provider-specific. You can switch later by creating a new bucket with another MSP and moving your data.
- **Extra large files.** Large uploads are supported. The app automatically handles chunking and integrity checks under the hood.

## Next steps

<div class="grid cards" markdown>

-   __Quickstart__

    ---

    Create a bucket and upload your first file.

    [:octicons-arrow-right-24: Open the Quickstart](/store-and-retrieve-data/quickstart)

-   __Use StorageHub TypeScript SDK / Get Started__

    ---

    Build programmatically with the TypeScript SDK.

    [:octicons-arrow-right-24: Get started with the StorageHub TypeScript SDK](/store-and-retrieve-data/use-storagehub-sdk/get-started)

</div>
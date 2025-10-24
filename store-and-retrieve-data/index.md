---
title: Store and Retrieve Data Overview
description: Overview of the complete data storage and retrieval process in DataHaven, from bucket creation to verification and file access.
---

DataHaven is a verifiable storage network that separates storage from verification. Storage Providers hold your file bytes off-chain, while the chain records compact on-chain commitments (“receipts”) so integrity can be checked at read time. This section shows at a high level how to create a bucket, upload, and retrieve files.

## How File Storage works at a glance

1. **Pick an MSP and bucket**: Connect your wallet or app identity. Select a Main Storage Provider (MSP) and create or reuse a bucket. Today, access is owner-only; sharing/public access is planned. Set your desired replication factor (BSP replicas).

2. **Upload**: Your app opens a storage request to the MSP. The MSP accepts it, stores the bytes off-chain, coordinates replication to protocol-assigned Backup Storage Providers (BSPs), and then anchors a per-bucket update on-chain (a compact commitment that indirectly commits to the file). If replication or anchoring fails, the upload aborts.

3. **Retrieve**: If the storage request is fulfilled (BSP replication reached the target and the bucket’s root was anchored), the MSP returns the bytes plus a Merkle proof and your app verifies it against the bucket’s on-chain commitment. If the request is pending or expired due to insufficient BSPs, the MSP may still serve the bytes, but there’s no on-chain anchor to verify against. Treat it as not yet secured by the network until replication completes.

Ready to try it in the dapp? It’s a straightforward create, upload, and retrieve process.

## Start here: core workflows

- Create a bucket and choose an MSP. Access is currently owner-only; sharing/public access is on the roadmap. For confidentiality, you can encrypt files client-side before uploading.
- Upload files: the app creates a storage request; after BSP replication acks, the MSP anchors a per-bucket update on-chain that commits to your file(s).
- Retrieve files later with a lightweight integrity check against the bucket’s on-chain commitment.

Before you jump into guides, here are a few practical notes.

## Key considerations

As you plan your workflow, consider the following concepts:

- **Costs and deposits:** Network fees apply. Storage is billed via a prepaid deposit that streams per block.
- **MSP choice and capacity:** You pick a Main Storage Provider (MSP). Market dynamics encourage MSPs to offer capacity and performance at competitive prices. You can reassign a bucket to a new MSP later; the new MSP rehydrates from BSP replicas (no manual copying required).
- **Large files:** Files up to 2 GB are currently supported (subject to change). The app automatically handles chunking and integrity checks under the hood.

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
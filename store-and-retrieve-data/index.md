---
title: Store and Retrieve Data
description: Learn about the complete data storage and retrieval process in DataHaven, from bucket creation to verification and file access.
---

# Store and Retrieve Data Overview

DataHaven is a verifiable storage network that separates storage from verification. Storage providers hold your file bytes off-chain, while the chain records compact on-chain commitments (“receipts”) so integrity can be checked at read time.

This section provides a high-level overview of how to create a bucket, upload, and retrieve files.

## How File Storage Works at a Glance

1. **Pick an MSP and bucket**: Connect your wallet or app identity. Select a Main Storage Provider (MSP) and create or reuse a bucket. Today, access is owner-only; sharing/public access is planned. Set your desired replication factor (BSP replicas).

2. **Upload data**: Your app opens a storage request to the MSP. The MSP accepts it, stores the bytes off-chain, and coordinates replication to protocol-assigned Backup Storage Providers (BSPs). If enough BSPs acknowledge within the window, the MSP anchors a per-bucket update on-chain (a compact commitment that indirectly commits to the file). If not, the request expires: the MSP may still have the bytes, but the file is not yet fully secured by the network.

3. **Retrieve data**: If the storage request is fulfilled (replication reached the target and the bucket’s root was anchored), the MSP returns the bytes plus a Merkle proof and your app verifies it against the bucket’s on-chain commitment. If the request is pending or expired, the MSP may still serve the bytes, but there’s no on-chain anchor to verify against. Treat it as not yet secured until replication completes.

Ready to try it in the dapp? It’s a straightforward create, upload, and retrieve process.

## Start Here: Core Workflows

- Create a bucket and choose an MSP. Access is currently owner-only; sharing/public access is on the roadmap. For confidentiality, you can encrypt files on the client side before uploading.
- Upload files: the app creates a storage request; once required BSP replication acks arrive, the MSP anchors a per-bucket update on-chain that commits to your file(s).
- Retrieve files later with a lightweight integrity check against the bucket’s on-chain commitment (only when fulfilled).

Before you jump into guides, here are a few practical notes.

## Key Considerations

As you plan your workflow, consider the following concepts:

- **Costs and deposits**: Network fees apply. Storage is billed via a prepaid deposit that streams per block and auto-pauses when the balance falls below a minimum threshold.
- **MSP choice and capacity**: You pick a MSP. Market dynamics encourage MSPs to offer capacity and performance at competitive prices. You can reassign a bucket to a new MSP later; the new MSP rehydrates from BSP replicas (no manual copying required).
- **File status & replicas**: Treat files as “verified” only after a fulfillment signal (e.g., `StorageRequestFulfilled`) and, ideally, show current replicas vs target so users see progress.
- **Large files**: Files up to 2 GB are currently supported (subject to change). The app automatically handles chunking and integrity checks under the hood.

## Next Steps

<div class="grid cards" markdown>

-   **Quick Start**

    ---

    Create a bucket and upload your first file.

    [:octicons-arrow-right-24: Get started](/store-and-retrieve-data/quickstart/)

-   **Get Started with the StorageHub TypeScript SDK**

    ---

    Build programmatically with the TypeScript SDK.

    [:octicons-arrow-right-24: Get started](/store-and-retrieve-data/use-storagehub-sdk/get-started/)

</div>

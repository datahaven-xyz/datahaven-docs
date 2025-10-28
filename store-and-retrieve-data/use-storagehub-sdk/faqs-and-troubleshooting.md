---
title: FAQs & Troubleshooting
description: Common issues, errors, and fixes when using StorageHub SDK.
---

## SDK & Development

### What is the difference between @storagehub-sdk/core and @storagehub-sdk/msp-client?

- **[@storagehub-sdk/core](https://www.npmjs.com/package/@storagehub-sdk/core){:target="_blank"}** provides backend-agnostic primitives: wallet handling, Substrate ↔ EVM bridging, Merkle/WASM utilities, signing, and shared types. Use it for foundational building blocks.

- **[@storagehub-sdk/msp-client](https://www.npmjs.com/package/@storagehub-sdk/msp-client){:target="_blank"}** handles MSP-specific operations: authentication, health checks, file upload/download, and streaming. Use it to communicate directly with Main Storage Providers.

## Storage & Costs

### How much does it cost to store a file?

Actions on the DataHaven network, such as uploading files and creating buckets, incur small transaction fees paid in HAVE tokens. These fees are automatically deducted from your connected wallet balance via payment streams when you perform these operations.

DataHaven is designed to be cost-effective with minimal burden to users, while ensuring sufficient incentives for storage providers to store and maintain your files. The fee structure balances affordability for users with the need to fairly compensate Main Storage Providers and Backup Storage Providers for their services.

By interacting with the DataHaven network, such as uploading a file, you understand and agree that your wallet will be charged for storage actions. You can view your detailed billing history by connecting your wallet to[apps.datahaven.xyz](https://apps.datahaven.xyz) and visiting the **Payments** section.

## Bucket Sharing & Management

### Can I create a private bucket?

Yes. When you create a bucket, you can decide whether the bucket is public or private (encrypted). Private buckets provide encrypted storage for sensitive data.

### How do I share a bucket?

When sharing a bucket, you can generate a shareable link that provides access to the entire contents of the bucket, including all files and folders within it.

**Share Options:**

- **Access Level**: Choose between view-only access or view and upload access
- **Password Protection**: Set a password to protect your shared bucket. This password will be required to access the bucket
- **Expiry Date**: Set an optional expiration date for the share link

**Important Notes:**

- Only the bucket owner can delete files, regardless of access level granted
- When you share a bucket, recipients have access to all contents within it
- For security purposes, consider creating a new dedicated bucket before sharing and clearly identifying it as a shared bucket

### Can I rename a bucket?

Yes. The bucket owner can rename a bucket at any time.

### Can I delete a bucket?

Yes. The bucket owner can delete a bucket at any time.

### How can I be sure my file is safe on DataHaven?

When you select a main storage provider and upload a file, there is a two-step process to ensure your file is successfully consumed by the DataHaven network:

**Step 1: File Upload Receipt**: Your file upload completes and you receive a receipt indicating successful upload to the main storage provider.

**Step 2: Network Propagation Confirmation**: Verify that your `fileKey` has generated a `StorageRequestFulfilled` event on-chain. This confirms your file has been propagated through the DataHaven network. DataHaven is developing tools to more easily track the state of your file and whether it has completed both steps.

Once your file has completed Step 2, it is considered securely stored in the DataHaven network.

**How DataHaven Ensures File Integrity**

DataHaven employs a dual-provider model:

- **Main Storage Providers (MSPs)**: User-selected providers that store your files
- **Backup Storage Providers (BSPs)**: Randomly assigned by the network for redundancy

BSPs ensure data reliability and redundancy in a decentralized network, backing up data to keep it available even if an MSP fails. Each file stored by a BSP is split into chunks, "merkelized," and linked to a file key, with the Merkle root stored on-chain as proof of storage. BSPs must hold collateral that can be slashed if data is lost. 

BSPs are periodically challenged to submit proof of storage, with challenge frequency based on storage size. A Fair Distribution mechanism prevents front-running, allowing all BSPs the chance to volunteer for new storage requests. Main storage providers are not currently polled or slashed, as backup providers ensure file integrity in the event of main provider data loss. Market dynamics naturally incentivize MSPs to provide the best possible service to network users.

## Network & Chain Configuration

### Can you deploy smart contracts onto DataHaven?

Not yet. Full EVM compatibility including support for smart contract deployment via Moonbeam's technology stack is planned for a future release. DataHaven will offer full JSON-RPC compatibility with Ethereum APIs, making it compatible with existing dApps, wallets, and development tools.

### What is the EVM Chain ID for DataHaven?

- **Mainnet**: `1289`
- **Testnet**: `1288`

### How does EigenLayer integrate with DataHaven?

EigenLayer secures DataHaven by keeping operator economics on Ethereum while execution happens on DataHaven.

**Operator Registration & Validator Sets:**

Operators restake into EigenLayer strategies and register with the DataHaven AVS ServiceManager, which organizes three operator sets: validators, BSPs (Backup Storage Providers), and MSPs (Main Storage Providers). Validators provide a mapping from their Ethereum address to a DataHaven AccountId20, allowing the AVS to build a canonical validator set. The ServiceManager periodically sends this set to DataHaven over Snowbridge; the `external-validators` pallet activates it on era boundaries, so validator membership on DataHaven is derived from EigenLayer.

**Slashing & Faults:**

Faults and incentives flow across the same bridge. Slashing is initiated on Ethereum through a vetoable slasher: requests are queued, a committee can cancel within a block window, and if not vetoed, the AVS slashes the restaked allocations via EigenLayer.

**Rewards:**

Rewards accrue on DataHaven per era. The `external-validators-rewards` pallet computes a Merkle root of validator points and sends it to Ethereum. The RewardsRegistry updates the root, and the AVS (on behalf of operators) uses Substrate-style positional Merkle proofs to claim payouts proportional to earned points.

## Other Questions?

If your question isn't answered here, join the [DataHaven Discord](https://discord.gg/datahaven) and use the Support Ticket chat. This will create a private channel to ensure your ticket is answered in a timely manner by our support team.
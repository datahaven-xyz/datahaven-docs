---
title: Data Flow and Lifecycle
description: A non-technical, step-by-step overview of how data moves through DataHaven’s provider model—from upload to retrieval and beyond.
slug: /how-it-works/data-and-provider-model/data-flow-lifecycle
sidebar_label: Data Flow & Lifecycle
---

DataHaven separates storage from verification: providers hold the bytes and the chain records a small, verifiable receipt. This page follows a file’s journey, from choosing a provider and bucket to uploading, optional mirroring with BSPs, retrieval with an automatic integrity check, and routine health checks. It also shows how updates create new versions and how you can move or remove data, without going into implementation details.

## Roles at a glance

- **You / your app**: Choose where to store, upload, and later retrieve files.
- **Main Storage Provider (MSP)**: The primary provider that manages buckets and serves retrievals.
- **Backup Storage Providers (BSPs)**: Optional redundancy at lower operational cost (they only perform occasional peer-to-peer retrieval) and they participate in periodic availability checks.
- **DataHaven chain**: Keeps a small on-chain receipt (a cryptographic fingerprint) and coordinates routine checks of storage providers.

---

## Step-by-step journey

### 1. Connect and choose where to store
Connect a wallet or app identity, select an MSP manually or via policy, and create or reuse a bucket as the container for related files. You now have a place to put data with clear ownership and policy.

### 2. Upload the file
When you upload, the dapp creates a storage request and submits an on-chain transaction that anchors a small fingerprint of the file in your bucket. The provider stores the actual bytes off-chain, and the chain records the compact receipt so the file can be verified later.

### 3. Store and add redundancy
The MSP stores the file off-chain. Depending on policy, BSPs mirror copies for durability and geography. BSPs have lower operational cost since they only handle occasional peer-to-peer retrieval and periodic checks.

### 4. Share and set access (optional)
Depending on your app, grant access to collaborators or services by adding addresses, links, or policy rules so the right people or services can read the file when needed.

### 5. Retrieve the file
When you request the file, the MSP serves the bytes plus a small proof. The app checks the proof against the chain’s receipt automatically so you know the file has not been tampered with.

### 6. Ongoing health checks
On a schedule, the chain coordinates lightweight challenges that ask providers to show they still hold the data. Providers respond with small proofs. Consistent success signals healthy storage, while repeated failures can lead to consequences defined by policy or governance.

### 7. Update or replace a file
If you upload a changed file, it produces a new file root (cryptographic fingerprint). The bucket can update its reference to that new root; whether older versions are retained is defined by your app or provider policy.

### 8. Move or remove data
You can remove a file’s reference from a bucket (deleting its entry). Migration to another provider can be done by copying data and re-anchoring in a new bucket; formal migration paths are noted in the roadmap. Retention or erasure behavior follows provider policy and any compliance settings.

### 9. Billing and transparency
Providers track storage usage and retrievals and surface charges in the app. On-chain actions, like anchoring receipts and coordinating proofs, consume gas in the system token. Pricing aims for predictable per-GB per-time costs.


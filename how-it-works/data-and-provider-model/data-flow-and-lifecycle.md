---
title: Data Flow and Lifecycle
description: A non-technical, step-by-step overview of how data moves through DataHaven’s provider model—from upload to retrieval and beyond.
---

DataHaven separates storage from verification: Storage Providers hold the bytes and the chain records a compact, verifiable receipt. This page follows a file’s journey from choosing an MSP and bucket to uploading, policy-driven redundancy with BSPs, retrieval with an integrity check, and ongoing health checks. It also shows from a high level how updates create new versions and how you can move or remove data. 

## Roles at a glance

- **You / your app:** Choose an MSP, create a bucket, upload, and later retrieve files.
- **Main Storage Provider (MSP):** User-selected primary Storage Provider for a bucket. Serves reads and anchors per-bucket updates on-chain.
- **Backup Storage Providers (BSPs):** Protocol-assigned replicas for durability. Do not serve user reads. Post one global commitment and respond to periodic proofs.
- **DataHaven chain:** Stores compact commitments (bucket roots from MSPs; global roots from BSPs) and coordinates BSP challenges.

## Step-by-step journey

1. **Connect and choose where to store**: Connect a wallet or app identity, pick an MSP, and create or reuse a bucket as the container for related files (you can choose different MSPs per bucket). Set your replication policy (how many BSP replicas).

2. **Upload the file**: Your app opens a storage request for the bucket. The MSP accepts it, stores the bytes off-chain, and coordinates replication to the selected BSPs. Once required replicas acknowledge, the MSP anchors a bucket update on-chain (a compact receipt tied to the file’s fingerprint). If replication or anchoring fails, the upload aborts.

3. **Store and add redundancy**: The MSP keeps the primary copy and serves reads. BSPs hold replicas for durability and decentralization; they are not in the normal read path.

4. **Retrieve the file**: When you request the file, the MSP returns the bytes plus a small cryptographic proof (Merkle proof). Your app automatically checks it against the file’s on-chain commitment (anchored in the bucket) so you know the content matches what was committed. For now, files are owner-only; sharing/public access is planned.

5. **Ongoing health checks**: On a schedule, the chain challenges BSPs (not MSPs) to prove they still hold your data. BSPs answer with small cryptographic proofs; repeated failures can trigger slashing per protocol rules.

6. **Update or replace a file**: Uploading changed content produces a new fingerprint (a new version). The bucket updates its on-chain summary to reference the new version. Whether older versions are kept is up to your app or Storage Provider policy.

7. **Move or remove data**: You can remove a file’s reference from a bucket (deleting its entry). To change Storage Providers, reassign the bucket to a new MSP; the new MSP reseeds from BSP replicas and anchors a fresh bucket update without manual transfers required.

8. **Billing and transparency**: Storage Providers track storage and retrieval usage and surface charges in-app. On-chain actions (like anchoring and challenges) consume gas in the system token. Pricing targets predictable per-GB per-time costs; payments are streamed per block from a prepaid deposit and automatically pause when the balance falls below a minimum threshold. Top up to resume; BSPs receive an automated revenue share.

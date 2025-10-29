---
title: Data Flow and Lifecycle
description: A non-technical, step-by-step overview of how data moves through DataHaven's provider model—from upload to retrieval and beyond.
---

# Data Flow and Lifecycle

DataHaven separates storage from verification: storage providers hold the bytes, and the chain records a compact, verifiable receipt.

This page follows a file’s journey from choosing an MSP and bucket to uploading, policy-driven redundancy with BSPs, retrieval with an integrity check, and ongoing health checks. It also shows, at a high level, how updates create new versions and how you can move or remove data. 

## Roles at a Glance

- **User / Application**: Initiates actions such as choosing an MSP, creating buckets, uploading files, and retrieving stored data.
- **Main Storage Provider (MSP)**: User-selected primary storage provider. Maintains buckets, serves reads, and anchors per-bucket updates on-chain.
- **Backup Storage Providers (BSPs)**: Protocol-assigned replicas that enhance durability. They post a global commitment for stored files and respond to periodic challenges. They do not serve user reads.
- **DataHaven chain**: Maintains compact on-chain commitments (bucket roots from MSPs, global roots from BSPs) and coordinates BSP challenges.

## Step-by-Step Journey

1. **Connect and choose where to store**: Connect a wallet or app identity, pick an MSP, and create or reuse a bucket as the container for related files (you can choose different MSPs per bucket). Set your replication policy (how many BSP replicas).

2. **Upload the file**: Your app opens a storage request for the bucket. The MSP accepts it, stores the bytes off-chain, and coordinates replication to the selected BSPs. Once required replicas acknowledge, the MSP anchors a bucket update on-chain (a compact receipt tied to the file’s fingerprint). If replication or anchoring fails, the upload aborts.

3. **Store and add redundancy**: The MSP keeps the primary copy and serves reads. BSPs hold replicas for durability and decentralization; they are not in the normal read path.

4. **Share and set access (optional)**: You may choose to share access to your bucket by generating a link that provides view-only access or view-and-upload access to the contents of your bucket, including all files and folders. You can set an optional expiration date for the link and protect it with a password if needed. 

5. **Retrieve the file**: When you request the file, the MSP returns the bytes plus a small cryptographic proof (Merkle proof). Your app automatically checks it against the file's on-chain commitment (anchored in the bucket), so you know the content matches the committed content. For now, files are owner-only; sharing/public access is planned.

6. **Ongoing health checks**: On a schedule, the chain challenges BSPs (not MSPs) to prove they still hold your data. BSPs provide small cryptographic proofs; slashing is possible in the event of data loss by BSPs per the protocol rules.

7. **Update or replace a file**: Uploading changed content produces a new fingerprint (a new version). The bucket updates its on-chain summary to reference the new version. Whether older versions are kept is up to your app or storage provider policy.

8. **Move or remove data**: You can remove a file's reference from a bucket (deleting its entry). To change storage providers, reassign the bucket to a new MSP; the new MSP reseeds from BSP replicas and anchors a fresh bucket update without manual transfers required.

9. **Billing and transparency**: Storage providers track storage and retrieval usage and surface charges in-app. On-chain actions (like anchoring and challenges) consume gas in the system token. Pricing targets predictable per-GB per-time costs; payments are streamed per block from a prepaid deposit and automatically pause when the balance falls below a minimum threshold. Top up to resume; BSPs receive an automated revenue share.

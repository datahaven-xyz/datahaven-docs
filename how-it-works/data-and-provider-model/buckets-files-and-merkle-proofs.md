---
title: Buckets, Files, and Merkle Proofs
description: High-level overview of how DataHaven organizes data and proves integrity using buckets, files, and Merkle proofs.
slug: /how-it-works/data-and-provider-model/buckets-files-merkle-proofs
sidebar_label: Buckets, Files & Merkle Proofs
---

## Introduction

Storing large files directly on-chain is impractical, while relying on off-chain storage alone forces you to trust whoever holds the bytes. DataHaven resolves this by separating storage from verification: providers store data off-chain, and the chain anchors compact cryptographic commitments on-chain.

In practice, DataHaven groups objects into buckets (user-created containers hosted by Main Storage Providers), commits each file by its Merkle root (a unique fingerprint of the file's chunks), and uses Merkle proofs to verify integrity at read time and during periodic BSP challenges—without moving whole files on-chain. This page explains those building blocks so apps and smart contracts can verify existence, integrity, and ongoing availability with minimal on-chain impact.

## Roles at a Glance

- **MSP (Main Storage Provider):** User-selected, primary storage & retrieval for a bucket. Maintains the bucket trie and anchors the bucket root on-chain. Not slashable in the current design (market/SLA incentives).
- **BSP (Backup Storage Provider):** Randomly assigned replicas across many users/files. Posts one global commitment covering all files it stores and is periodically challenged; failures are slashable.

## Buckets: Purpose and Structure

A **bucket** groups related objects under a single Main Storage Provider and policy. Think of it as a scoped namespace with:

- **Ownership & policy:** Who can write/read, retention expectations, redundancy targets.
- **Compact on-chain summary (per-bucket root):** The chain stores a single 32-byte bucket root (Merkle/Patricia-style map whose leaves are file roots).
- **Stable anchor:** One place for pricing, accounting, and proofs across contained files.

While MSPs store buckets, Backup Storage Providers (BSPs) store replicas and publish one aggregate commitment for all files they hold.

!!! note
    Currently, files stored on DataHaven can be accessed only by the file owner (no public/shared links yet). Access is enforced by provider-side authentication and policy. Data is not end-to-end encrypted by default; optional client-side encryption is planned.

## Files: From Bytes to Commitments

During upload, DataHaven runs a short pipeline that turns raw bytes into a verifiable on-chain commitment:

1. **Chunking:** The file is split deterministically (client/MSP default chunk size is currently 8 KB for I/O).
2. **Hashing:** Each chunk is hashed; chunk hashes are combined into a Merkle tree.
3. **Commitment:** The tree’s root becomes the file’s immutable fingerprint (commitment).
4. **Anchoring (MSP, per bucket):** The MSP updates the bucket trie to include (or remove) the file root and submits a transaction anchoring the **bucket root** on-chain. The MSP supplies inclusion and/or non-inclusion proofs to justify the trie update.
5. **Storage:** Full file bytes remain with the MSP (primary) and chosen BSPs (replicas).

**Replication & write semantics (high level):** The MSP coordinates replication to BSPs. Uploads succeed only after required replicas acknowledge and the bucket-root update is submitted on-chain; otherwise the request aborts.

!!! note
    Updating file bytes yields a new Merkle root (a new commitment). Renames/metadata updates that don’t touch content don’t change the root.

## Merkle Proofs: Verifying Without Trust

A Merkle proof is a short witness that a specific chunk (or an entire file) is part of a dataset committed by a known root. Given the leaf hash (chunk), its sibling path (with positions), and the on-chain root, anyone can recompute the root and check it matches—no trusted third party needed. Proof size scales as O(log N) in the number of chunks.

- **Challenge leaf size (protocol):** For storage validation, the network uses a protocol-defined challenge chunk size (currently 1 KB).
- **Client I/O chunk size (implementation):** Upload/download defaults are 8 KB and may be tuned without affecting challenge logic.

**Minimal proof shape (conceptual):**
```json
{
  "fileRoot": "0xROOT...",
  "leafIndex": 1337,
  "leafHash": "0xLEAF...",
  "path": ["0xSIBLING1...", "0xSIBLING2...", "..."],
  "positions": ["R","L","L","..."],
  "hashFn": "keccak256" // protocol-defined; value shown for clarity
}
```

A verifier recomputes the root from `leafHash`, `leafIndex`, `path` + `positions`; if it equals `fileRoot` (anchored on-chain), the proof is valid.

In DataHaven, Merkle proofs support two essential checks:

  - Integrity at retrieval (MSP read path): When a client downloads a file/chunk from the MSP, the provider includes a proof so the client can verify against the known file root.

  - Ongoing storage proofs (BSP audits): The protocol challenges BSPs on random chunk indices; BSPs answer with Merkle proofs to demonstrate continued custody.

## What’s On-Chain vs Off-Chain

- **Bucket state (on-chain, per bucket via MSP):** A compact cryptographic map (Merkle/Patricia-style) whose root is stored on-chain. MSP updates this root during storage request acceptance and file-deletion flows, supplying proofs for correctness in the same session as data changes.

- **File commitments (on-chain reference):** Each file is identified by its Merkle root and included in the bucket map.

- **BSP commitment (on-chain, per BSP)**: A single global root that summarizes all files a BSP stores (used for randomized challenges and slashing logic).

- **Data (off-chain):** Stored and served by the MSP; replicated by BSPs. Verifiers don’t need the bytes- proofs are enough.

## Read / Write / Migrate Flow

- **Write:** Client → MSP; MSP forwards to BSPs; MSP updates bucket root on-chain with proofs. If a replica declines or anchoring fails, the write aborts.

- **Read:** Client fetches from the MSP and verifies Merkle proofs locally. BSPs are not in the normal read path.

- **Migrate**: If an MSP fails, the user can reassign the bucket to a new MSP. The new MSP can reconstruct from BSP replicas.

## User Personas

### For dApp developers

- Treat a bucket like a scoped object store handled by a storage provider.
- On upload, you receive a file root plus a receipt tied to the bucket's on-chain summary.
- On read, request bytes + proof; verify against the file root you already know (or resolve via the bucket summary).

### For auditors & smart contracts

- Use the bucket summary on-chain to confirm a file root existed by/at a specific block.
- Verify Merkle proofs tied to that root to confirm a storage provider's claims about stored content.

### For end users

- Your app (or wallet) verifies proofs automatically, so you don't have to trust the storage provider.
- Redundant storage via BSPs and regular challenges improves availability and durability.
---
title: Buckets, Files, and Merkle Proofs
description: High-level overview of the DataHaven system, explaining how buckets and files structure your data and how Merkle proofs ensure cryptographic data integrity.
---

# Buckets, Files, and Merkle Proofs

Storing large files directly on-chain is impractical, while relying solely on off-chain storage forces you to trust whoever controls the bytes. DataHaven resolves this by separating storage from verification: providers store data off-chain, and the chain anchors compact cryptographic commitments on-chain.

In practice, DataHaven groups objects into buckets, which are user-created containers hosted by Main Storage Providers (MSP), commits each file via its Merkle root (a unique fingerprint of the file's chunks), and uses Merkle proofs to verify integrity at read time and during periodic BSP challenges—without moving entire files on-chain. This page explains those building blocks so apps and smart contracts can verify existence, integrity, and ongoing availability with minimal on-chain impact.

## Roles at a Glance

- **Main Storage Provider (MSP)**: User-selected, primary storage and retrieval for a bucket. Maintains the bucket trie and anchors the bucket root on-chain. Not slashable in the current design (market/SLA incentives).
- **Backup Storage Provider (BSP)**: Randomly assigned replicas across many users/files. It posts one global commitment covering all files it stores and is periodically challenged; failures are slashable.

## Buckets: Purpose and Structure

Buckets define how data is grouped, owned, and anchored on-chain. Each bucket serves as a scoped namespace, managed by an MSP and governed by its associated policy.

**Key properties**:

- **Ownership and policy**: Defines who can read or write data, retention expectations, and redundancy targets.
- **Compact on-chain summary**: Each bucket is represented by a single 32-byte root — a Merkle/Patricia-style map whose leaves correspond to file roots.
- **Stable anchor**: Provides a single point of reference for pricing, accounting, and proofs across all files in the bucket.

While MSPs maintain and store buckets, BSPs handle replicas by publishing a single aggregate commitment for all files they store.

!!! note
    File access in DataHaven is currently restricted to the file owner. Access is enforced by provider-side authentication and policy. Data is not end-to-end encrypted by default; optional client-side encryption is planned.

## Files: From Bytes to Commitments

When a file is uploaded, DataHaven converts its raw bytes into a verifiable on-chain commitment. This process ensures that every stored file can be proven to exist and remain unchanged.

**Upload pipeline:**

1. **Chunking**: The file is split deterministically (client/MSP default chunk size is currently 8 KB for I/O).
2. **Hashing**: Each chunk is hashed, and those hashes are combined into a Merkle tree.
3. **Commitment**: The Merkle root becomes the file’s immutable fingerprint — its on-chain commitment.
4. **Anchoring**: The MSP updates the bucket’s trie to include (or remove) the file root and submits a transaction anchoring the new bucket root on-chain.
This update is accompanied by inclusion and/or non-inclusion proofs verifying the trie change.
5. **Storage**: Full file bytes remain with the MSP (primary) and designated BSPs (replicas).

**Replication and write semantics (high level)**: 

The MSP coordinates replication to BSPs. Uploads succeed only after required replicas acknowledge and the bucket-root update is submitted on-chain; otherwise, the request aborts.

!!! note
    Updating file bytes yields a new Merkle root (a new commitment). Renames/metadata updates that don’t touch content don’t change the root.

## Merkle Proofs: Verifying Without Trust

A Merkle proof is a short witness that a specific chunk (or an entire file) is part of a dataset committed by a known root. Given the leaf hash (chunk), its sibling path (with positions), and the on-chain root, anyone can recompute the root and check it matches—no trusted third party needed. Proof size scales as O(log N) with respect to the number of chunks.

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

A verifier recomputes the root from `leafHash`, `leafIndex`, `path`, and `positions`; if it equals `fileRoot` (anchored on-chain), the proof is valid.

In DataHaven, Merkle proofs support two essential checks:

  - **Integrity at retrieval (MSP read path)**: When a client downloads a file/chunk from the MSP, the provider includes a proof so the client can verify against the known file root.

  - **Ongoing storage proofs (BSP audits)**: The protocol challenges BSPs on random chunk indices; BSPs answer with Merkle proofs to demonstrate continued custody.

## What's On-Chain vs Off-Chain

**On-chain components**:

- **Bucket state (per bucket via MSP)**: A compact cryptographic map (Merkle/Patricia-style) whose root is stored on-chain. The MSP updates this root during storage request acceptance and file-deletion flows, providing proofs of correctness in the same session as the data changes.
- **File commitments**: Each file is identified by its Merkle root and included in the bucket's map.
- **BSP commitment (per BSP)**: A single global root that summarizes all files a BSP stores (used for randomized challenges and slashing logic).

**Off-chain components**:

- **Data**: The actual file bytes are stored and served by the MSP and replicated by BSPs. Verifiers and smart contracts only need proofs—not the raw data.

## Storage Flows

DataHaven’s storage lifecycle revolves around three core flows: writing, reading, and migrating data. Each flow ensures verifiable integrity and redundancy through MSPs and BSPs.

- **Write**: Client uploads data to its MSP; MSP forwards to BSPs; MSP updates bucket root on-chain with proofs. If a replica declines or anchoring fails, the write aborts.
- **Read**: Client fetches data from the MSP and verifies Merkle proofs locally. BSPs are not in the normal read path.
- **Migrate**: If an MSP fails, the user can reassign the bucket to a new MSP. The new MSP can reconstruct from BSP replicas.

## System Interactions by Role

### DApp Developers

- Treat a bucket like a scoped object store handled by a storage provider.
- On upload, you receive a file root plus a receipt tied to the bucket's on-chain summary.
- On read, request bytes and proof; verify against the file root you already know (or resolve via the bucket summary).

### Auditors and Smart Contracts

- Use the bucket summary on-chain to confirm a file root existed by/at a specific block.
- Verify Merkle proofs tied to that root to confirm a storage provider's claims about stored content.

### End Users

- Your app (or wallet) verifies proofs automatically, so you don't have to trust the storage provider.
- Redundant storage via BSPs and regular challenges improves availability and durability.

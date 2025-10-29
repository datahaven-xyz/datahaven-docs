---
title: Buckets, Files, and Merkle Proofs
description: High-level overview of the DataHaven system, explaining how buckets and files structure your data and how Merkle proofs ensure cryptographic data integrity.
---

# Buckets, Files, and Merkle Proofs

Storing large files directly on-chain is impractical, while relying solely on off-chain storage forces you to trust whoever controls the bytes. DataHaven resolves this by separating storage from verification: providers store data off-chain, and the chain anchors compact cryptographic commitments on-chain.

In practice, DataHaven groups objects into buckets, which are user-created containers hosted by Main Storage Providers (MSP), commits each file via its Merkle root (a unique fingerprint of the file's chunks), and uses Merkle proofs to verify integrity at read time and during periodic BSP challenges—without moving entire files on-chain. This page explains those building blocks so apps and smart contracts can verify existence, integrity, and ongoing availability with minimal on-chain impact.

## Roles at a Glance

- **Main Storage Provider (MSP)**: The user-selected primary provider for a bucket’s storage and retrieval. It maintains the bucket trie and anchors the bucket root on-chain. MSPs aren’t currently subject to slashing; service quality is instead incentivized by open competition and reputation.
- **Backup Storage Provider (BSP)**: Randomly assigned replicas across many users/files. It posts one global commitment covering all files it stores and is periodically challenged; failures are slashable.

## Buckets: Purpose and Structure

Buckets define how data is grouped, owned, and anchored on-chain. Each bucket serves as a scoped namespace, managed by an MSP and governed by its associated policy.

**Key properties**:

- **Ownership and policy**: Defines who can read or write data, retention expectations, and redundancy targets.
- **Compact on-chain summary**: Each bucket is represented by a single 32-byte root — a Merkle-Patricia trie summarizing the bucket’s file entries (e.g., file roots/metadata).
- **Stable anchor**: Provides a single point of reference for pricing, accounting, and proofs across all files in the bucket.

MSPs maintain and update each bucket’s root on-chain. BSPs store replicas and periodically submit proofs (against their committed Merkle forest) that they continue to store the data; they don’t update bucket roots on-chain.

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

The MSP coordinates replication to BSPs. Your upload completes when the MSP accepts the file and issues a receipt. Network confirmation occurs only after the required BSP replicas accept and the MSP updates the bucket’s root on-chain (emitting a fulfillment event). If replication or anchoring doesn’t complete within the request time out window, the request is cancelled.

!!! note
    Updating file bytes yields a new Merkle root (a new commitment). Renames/metadata updates that don’t touch content don’t change the root.

## Merkle Proofs: Verifying Without Trust

A Merkle proof is a short witness that a specific chunk (or an entire file) is part of a dataset committed by a known root. Given the leaf hash (chunk), its sibling path (with positions), and the on-chain root, anyone can recompute the root and check it matches—no trusted third party needed. Proof size scales as O(log N) with respect to the number of chunks.

- **Challenge leaf size (protocol):** For storage validation, the network uses a protocol-defined challenge chunk size (currently 1 KB).
- **Client I/O chunk size (implementation):** Upload/download defaults are 8 KB (subject to change).

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

A verifier recomputes the root from `path`, and `positions`; if it equals `fileRoot` (anchored on-chain), the proof is valid.

In DataHaven, Merkle proofs support two essential checks:

  - **Integrity at retrieval (MSP read path)**: When a client downloads a file/chunk from the MSP, the provider includes a proof so the client can verify against the known file root.

  - **Ongoing storage proofs (BSP audits)**: The protocol challenges BSPs on random chunk indices; BSPs answer with Merkle proofs to demonstrate continued custody.

## What's On-Chain vs Off-Chain

**On-chain components**:

- **Bucket state (per bucket via MSP)**: A compact Merkle-Patricia map whose root is stored on-chain. The MSP updates this bucket root when confirming storage requests and processing deletions, supplying proofs that the updated root is consistent.
- **File commitments**: Each file is identified by its Merkle root ("file key") and is included as an entry in the bucket's map.
- **BSP commitment (per BSP)**: A Merkle forest commitment summarizing the set of file keys a BSP stores; it's used to derive randomized challenges and to enforce slashing.

**Off-chain components**:

- **Data**: The file bytes are stored/served by the MSP and replicated by BSPs. The runtime/verifiers operate on proofs; they don't require raw file data.

## Storage Flows

DataHaven’s storage lifecycle revolves around three core flows: writing, reading, and migrating data. Each flow ensures verifiable integrity and redundancy through MSPs and BSPs.

- **Write**: Client uploads data to its MSP; the MSP coordinates replication to BSPs; the MSP updates the bucket root on-chain once replication is confirmed. If replication or anchoring doesn't complete within the request timeout, the request is canceled.
- **Read**: Client fetches data from the MSP and verifies Merkle proofs locally. BSPs are not in the normal read path.
- **Migrate**: If an MSP fails, the user can reassign the bucket to a new MSP via an on-chain move-bucket flow. The new MSP reconstructs from BSP replicas and re-anchors the bucket root.

---
title: Buckets, Files, and Merkle Proofs
description: High-level overview of how DataHaven organizes data and proves integrity using buckets, files, and Merkle proofs.
slug: /how-it-works/data-and-provider-model/buckets-files-merkle-proofs
sidebar_label: Buckets, Files & Merkle Proofs
---

## Introduction

Storing large files directly on-chain is impractical, while relying on off-chain storage alone forces you to trust whoever holds the bytes. DataHaven resolves this trade-off by separating storage from verification: providers store the data off-chain, and the chain anchors compact cryptographic commitments on-chain.

In practice, DataHaven groups objects into buckets (user-created, provider-hosted containers), commits each file by its Merkle root (a unique fingerprint of the file’s chunks), and uses Merkle proofs to verify integrity at read time and during periodic challenges, without moving whole files on-chain. This page explains those three building blocks and how they fit together so apps and smart contracts can verify existence, integrity, and ongoing availability with minimal on-chain impact. 

## Buckets: Purpose and Structure

A bucket groups related objects under a single provider and policy. Think of it as a scoped namespace with:

- **Ownership & policy:** Who can write/read, retention expectations, redundancy targets.
- **Compact on-chain summary:** The chain records a cryptographic summary, not every file.
- **Stable anchor:** One place for pricing, accounting, and proofs across contained files.

Each provider can maintain one or more buckets. Buckets are summarized on-chain so smart contracts can answer questions like "did this object exist at block N?" without bloating state. DataHaven uses Merkle/Patricia-style structures to keep on-chain state minimal yet verifiable.

### Bucket types and organization

Create a new bucket to organize and store your data. Choose **Public** for shared access or **Private (encrypted)** for sensitive information.

- **Public bucket**: Designed for shared or team access. Good for assets meant to be broadly readable by your app or collaborators.
- **Private (encrypted) bucket**: Contents are encrypted before upload and available only to authorized users.

## Files: From Bytes to Commitments

During upload, DataHaven runs a short pipeline as follows that turns raw bytes into a verifiable on-chain commitment:

1. **Chunking:** The file is split deterministically (fixed-size or strategy-defined).
2. **Hashing:** Each chunk is hashed; chunk hashes are combined into a [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree){target="_blank"}.
3. **Commitment:** The tree's root becomes the file's immutable fingerprint (commitment).
4. **Anchoring:** The bucket's cryptographic summary references the file (directly or indirectly), and a compact commitment is recorded on-chain.
5. **Storage:** The full file bytes remain with providers (off-chain) for efficiency.


In DataHaven, Main Storage Providers (MSPs) are the primary storage and retrieval layer, managing buckets and servicing reads. Backup Storage Providers (BSPs) provide redundancy to the network with lower operational overhead and are periodically challenged to prove they still store the data by responding to randomized checks against the file's Merkle structure.

!!! note
    Updating file bytes yields a new Merkle root (a new commitment).

## Merkle Proofs: Verifying Without Trust

A Merkle proof is a short piece of evidence that a specific chunk (or an entire file) is part of a dataset committed by a known Merkle root. Given the leaf hash (chunk), the ordered list of sibling hashes (the path), and the on-chain root, anyone can recompute the root and check it matches without trusting a third party. Proof size scales as O(log N) in the number of chunks, and verification is quick.

In DataHaven, Merkle proofs support two essential checks:

- **Integrity at retrieval:** When a client downloads a file or chunk, the provider includes a proof so the client verifies it matches the committed root.
- **Ongoing storage proofs:** The protocol can challenge providers on random chunk indices; providers answer with a Merkle proof to demonstrate they still store the data.

**Minimal proof shape (conceptual):**

At a minimum, a Merkle proof includes the committed root, the target leaf (or its index/hash), the ordered sibling path, and the hash function:

```json
{
  "fileRoot": "0xROOT...",
  "leafIndex": 1337,
  "leafHash": "0xLEAF...",
  "path": ["0xSIBLING1...", "0xSIBLING2...", "..."],
  "hashFn": "keccak256"
}
```

A verifier recomputes the root from leafHash, leafIndex, and path; if it equals fileRoot (anchored on-chain), the proof is valid.

## How Buckets, Files, and Proofs Fit Together

- **Bucket state (on-chain):** A compact cryptographic map (e.g., Merkle/Patricia–style) that summarizes which file roots belong to the bucket and basic metadata pointers.

- **File commitments (on-chain):** Each file's Merkle root (or a reference included by the bucket map). This turns "I have file X" into an objective, checkable statement.

- **Data (off-chain):** Stored by MSPs and BSPs. Verifiers don't need full file bytes—proofs are enough.

- **Challenges & audits (on-chain coordination, off-chain response):** Randomized challenges prompt providers to return Merkle proofs for selected chunks. Failure can trigger penalties; consistent success reinforces availability.

## User Personas

### For dApp developers

- Treat a bucket like a scoped object store handled by a provider.
- On upload, you receive a file root plus a receipt tied to the bucket's on-chain summary.
- On read, request bytes + proof; verify against the file root you already know (or resolve via the bucket summary).

### For auditors & smart contracts

- Use the bucket summary on-chain to confirm a file root existed by/at a specific block.
- Verify Merkle proofs tied to that root to confirm a provider's claims about stored content.

### For end users

- Your app (or wallet) verifies proofs automatically, so you don't have to trust the provider.
- Redundant storage via BSPs and regular challenges improves availability and durability.

---
title: Overview
description: What DataHaven is, how it works, and who it's for.
---

# Overview

DataHaven is a verifiable, developer-friendly storage network. Apps write and read files through a simple SDK, while integrity and economics are enforced on-chain.

## What is DataHaven?

DataHaven is a decentralized storage and retrieval network designed for apps that need production-scale storage with cryptographic integrity guarantees. It combines easy developer surfaces (SDK + REST) with an on-chain control plane that anchors proofs of your data, so you can verify what is stored, by whom, and when it changed. The network is built as an [autonomous verifiable service (AVS)](https://docs.eigencloud.xyz/products/eigenlayer/developers/concepts/avs-developer-guide){target="_blank"} that leverages Ethereum restaking via EigenLayer for security of the protocol's core checks and incentives.

## How does it work?

- **Roles**: You choose a Main Storage Provider (MSP) to serve your bucket. The MSP maintains the bucket trie and periodically anchors the bucket root on-chain. Backup Storage Providers (BSPs) replicate data across the network; each BSP periodically posts a single global Merkle commitment covering the files it stores and can be challenged—failures are slashable.

- **Integrity**: File and directory state is summarized as Merkle roots. Those roots are anchored on-chain, giving you a tamper-evident history and a way to verify storage proofs independent of any single provider.

- **Access**: Apps integrate via the StorageHub SDK or a REST interface. Authentication is web3-native (SIWE + short-lived JWTs) so users sign once and interact with providers securely.

- **Economics & Quality of Service (QoS)**: Usage fees are transparent. BSPs face objective challenges and slashing to enforce durability, while MSPs compete on performance, uptime, and reputation—driving service quality without centralized control. MSPs are not slashable today; QoS is enforced by competition and observed reliability.

- **Interop**: The network exposes both EVM and Substrate-style endpoints (where relevant) so you can build from familiar tooling while benefiting from on-chain verification.

## Who is it for?

- dApp teams storing user-generated content, media, or stateful assets with verifiable integrity.

- Data and AI products that require auditable storage footprints and reproducible datasets.

- Web2 builders who want a simple API now and a trust-minimized audit trail as they scale.

- Operators who want to run MSP or BSP nodes and earn fees for performance and reliability.

## Future development

Today you can onboard with the StorageHub SDK to create buckets, upload/download files, share, and verify. EVM smart-contract compatibility and broader programmability are in development and not yet available in the current release.
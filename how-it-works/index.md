---
title: How DataHaven Works
description: Get a high-level look at how DataHaven users, providers, and on-chain proofs work together to provide a secure, interoperable, trust-minimized storage layer.
---

# Overview

DataHaven connects users and storage providers through an on-chain system that guarantees data availability and integrity. Users upload files to storage providers, who anchor cryptographic proofs on-chain, creating tamper-evident, verifiable storage.

The pages in this section explain how users, providers, and on-chain proofs work together to provide a secure, interoperable, trust-minimized storage layer.

## What is DataHaven?

DataHaven is a decentralized storage and retrieval network designed for apps that need production-scale storage with cryptographic integrity guarantees. It combines easy developer interfaces via SDK and REST with on-chain commitments that anchor proofs of your data, so you can verify what is stored, by whom, and when it changed.

The network is built as an [autonomous verifiable service (AVS)](https://docs.eigencloud.xyz/products/eigenlayer/developers/concepts/avs-developer-guide){target=\_blank} that leverages Ethereum restaking via EigenLayer to secure the protocol's core checks and incentives. Authentication is web3-native, using [SIWE](https://docs.login.xyz/){target=\_blank} and short-lived [JWTs](https://www.jwt.io/){target=\_blank}, so users sign once and interact with providers securely.

## How Does It Work?

DataHaven is designed to maximize service quality, data integrity, and interoperability to meet your data storage and retrieval needs. 

### Roles Create Resiliency

DataHaven combines two storage provider types to ensure data preservation and integrity: Main Storage Providers (MSP) and Backup Storage Providers (BSP).

| MSP                                                                     | BSP                                                                  |
|-------------------------------------------------------------------------|----------------------------------------------------------------------|
| Chosen by the user.                                                     | Randomly assigned by the network.                                    |
| Maintains the bucket trie.                                              | Replicates data across the network.                                  |
| Periodically anchors the bucket root on-chain.                          | Periodically posts the global Merkle commitment of all files stored. |
| Performance is incentivized by competition to attract and retain users. | Performance ensured via a slashing mechanism for failed challenges.  |

### Verify Proofs for Data Integrity

File and directory state is summarized as [Merkle roots](https://en.wikipedia.org/wiki/Merkle_tree){target=_blank}. Those roots are anchored on-chain, giving you a tamper-evident history and a way to verify storage proofs independent of any single provider.

Visit [Buckets, Files, and Merkle Proofs](/how-it-works/data-and-provider-model/buckets-files-and-merkle-proofs/) for more information on how these items work together so you can store, manage, retrieve, and verify your data. 

### Connect Across Ecosystems

[Snowbridge](https://app.snowbridge.network/){target=_blank} acts as a trustless bridge between Ethereum and Substrate-based chains like DataHaven, enabling on-chain, verifiable, bidirectional movement of tokens and messages using familiar EVM tooling.

Visit [Snowbridge and Cross-Chain Messaging](/how-it-works/interoperability/snowbridge-and-cross-chain-messaging/) to learn more about how DataHaven sends messages and tokens across chains.

## Future Development

You can currently onboard with the StorageHub SDK to create buckets and upload, download, share, and verify files. EVM smart contract compatibility and broader programmability are under development for future releases.

## Next Steps

<div class="grid cards" markdown>

-   **Data Flow and Lifecycle**

    ---

    Follow this step-by-step summary to understand how data moves through DataHaven, including selecting an MSP, uploading your first files, and retrieving and verifying your data.

    [:octicons-arrow-right-24: Get started](/how-it-works/data-and-provider-model/data-flow-and-lifecycle/)

-   **Get Started with the StorageHub TypeScript SDK**

    ---

    If you are ready to start building, this Get Started guide will help you set up your environment, install the required dependencies, and get your project started.

    [:octicons-arrow-right-24: Get started](/store-and-retrieve-data/use-storagehub-sdk/get-started/)

</div>
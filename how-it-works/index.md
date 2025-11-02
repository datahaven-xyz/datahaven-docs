---
title: How DataHaven Works
description: Get a high-level look at how DataHaven users, providers, and on-chain proofs work together to provide a secure, interoperable, trust-minimized storage layer.
---

# Overview

DataHaven is a decentralized storage and retrieval network designed for apps that need verifiable, production-scale data storage. DataHaven connects users and storage providers through an on-chain system that guarantees data availability and integrity.

The pages in this section explain how users, providers, and on-chain proofs work together to provide a secure, interoperable, trust-minimized storage layer.

## Store Off-chain, Verify On-chain

DataHaven separates file storage from on-chain verification, giving you the benefits of performant, cost-effective storage and retrieval without sacrificing reliable data provenance. Storage providers store user data off-chain and create cryptographic, on-chain commitments for verification use.

See [Data Flow and Lifecycle](/how-it-works/data-and-provider-model/data-flow-and-lifecycle/) for a step-by-step look at how data moves through the storage, replication, verification, and retrieval process. 

## Verify Proofs for Data Integrity

File and directory state is summarized as [Merkle roots](https://en.wikipedia.org/wiki/Merkle_tree){target=_blank}. Those roots are anchored on-chain, giving you a tamper-evident history and a way to verify storage proofs independent of any single provider. Periodic proof challenges with potential slashing penalties ensure continued data storage over time.

## Connect Across Ecosystems

[Snowbridge](https://app.snowbridge.network/){target=_blank} acts as a trustless bridge between Ethereum and Substrate-based chains like DataHaven, enabling on-chain, verifiable, bidirectional movement of tokens and messages using familiar EVM tooling.

## Secure By Design

The network is built as an [autonomous verifiable service (AVS)](https://docs.eigencloud.xyz/products/eigenlayer/developers/concepts/avs-developer-guide){target=\_blank} that leverages Ethereum restaking via EigenLayer to secure the protocol's core checks and incentives. Authentication is web3-native, using [SIWE](https://docs.login.xyz/){target=\_blank} and short-lived [JWTs](https://www.jwt.io/){target=\_blank}, so users sign once and interact with providers securely.

## Future Development

You can currently onboard with the [StorageHub SDK](/store-and-retrieve-data/use-storagehub-sdk/get-started/) to create buckets and upload, download, share, and verify files. EVM smart contract compatibility and broader programmability are under development for future releases.

## Next Steps

<div class="grid cards" markdown>

-  <a href="/how-it-works/data-and-provider-model/data-flow-and-lifecycle/" markdown>:material-arrow-right: 
    
    **Data Flow and Lifecycle**

    Follow data on a step-by-step journey through DataHaven.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/get-started/" markdown>:material-arrow-right:

    **Get Started with the StorageHub SDK**

    Environment set up and dependency installation to get your project started.

    </a>

</div>
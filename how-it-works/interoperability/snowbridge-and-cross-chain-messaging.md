---
title: Snowbridge & Cross-Chain Messaging
description: Explaining how Snowbridge enables trustless communication between DataHaven and Ethereum.
slug: /how-it-works/interoperability/snowbridge-and-cross-chain-messaging
---

## Introduction

While DataHaven is a sovereign Layer 1 blockchain, it isn't meant to operate in isolation. It's built to communicate with Ethereum and other ecosystems. This is where Snowbridge comes in.

## What is Snowbridge?

Snowbridge is a decentralized, trustless bridge protocol connecting Ethereum and Substrate-based chains (such as DataHaven). It allows the secure transfer of assets and arbitrary messages between these networks using on-chain light clients. This means each side can verify the other’s state directly, without relying on third-party custodians or multisigs.

In practice, Snowbridge provides DataHaven with a native bridge to Ethereum, enabling bi-directional communication and interoperability. It serves as the backbone for both token transfers (e.g. wrapped ETH or ERC-20 assets) and message passing (e.g. validator updates or reward synchronization for the EigenLayer AVS).

## Why Cross-Chain Messaging Matters

DataHaven is designed to operate as part of a broader, interoperable Web3 ecosystem. Through Snowbridge, it can:

- **Inherit security from Ethereum:** Messages from EigenLayer’s contracts (e.g. validator sets, slashing events) are relayed to DataHaven in a verifiable way.
- **Send state updates back to Ethereum:** DataHaven reports block finality, validator rewards, and other on-chain data back to EigenLayer contracts.
- **Enable multi-chain dApps:** Developers can build applications that combine Ethereum smart contracts and DataHaven’s decentralized storage in one workflow (e.g. mint an NFT on Ethereum while storing its underlying data on DataHaven).

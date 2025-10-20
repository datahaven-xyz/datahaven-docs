---
title: EigenLayer AVS & Shared Security Model
description: Overview of DataHaven’s integration with EigenLayer as an AVS.
slug: /how-it-works/security-model-and-restaking/eigenlayer-avs-shared-security-model
---

## Introduction

New networks often struggle to achieve the same level of economic security that secures already established networks such as Ethereum. EigenLayer solves this issue through its restaking mechanism which allows established networks to extend their economic security to other networks. For DataHaven, this means it can use that mechanism to build trust into its foundation from day one.

## What is EigenLayer?

EigenLayer is a protocol built on Ethereum that introduces restaking which is a mechanism allowing staked ETH and Liquid Staking Tokens (LSTs) to secure additional networks and services beyond Ethereum itself. This extends Ethereum’s economic security to new applications, known as Actively Validated Services (AVSs), without requiring each to bootstrap its own validator set. Each AVS defines the rules that operators must follow and the proofs they must submit to show they’re executing the service correctly.


## What are EigenLayer Operators?

Operators are independent entities that run specialized software to perform validation tasks for one or more AVSs. They use their restaked ETH as collateral, meaning that if they act maliciously or fail to perform their duties, they can be slashed. By opting in to support specific AVSs, operators essentially lend their security and trustworthiness to those networks in exchange for rewards. Currently, in Testnet the operators will be preselected, but this will change as mainnet is released.


## DataHaven's Role as an AVS

DataHaven is deployed as an Autonomous Verifiable Service (AVS) secured by EigenLayer’s re-staking protocol. This means that EigenLayer operators can opt in to validate DataHaven blocks and runtime proofs. In doing so, DataHaven inherits the economic security of Ethereum. This way DataHaven leverages the same validator incentives and slashing guarantees that keep Ethereum secure. Ethereum’s trust layer ensures validator honesty and accountability, while DataHaven’s runtime focuses on decentralized storage and verification. Together, they form a trust-minimized foundation for verifiable data storage and computation in Web3.

---
title: EigenLayer AVS and Shared Security Model
description: DataHaven is an AVS secured by EigenLayer restaking, inheriting Ethereum's economic security to enable trust-minimized decentralized storage.
---

# EigenLayer AVS and Shared Security Model

New networks face a cold-start security problem. EigenLayer addresses this through restaking, extending Ethereum’s economic security to other networks. For DataHaven, this means inheriting stronger security from day one.

## What is EigenLayer?

[EigenLayer](https://docs.eigencloud.xyz/){target=_blank} is a protocol built on Ethereum that introduces restaking, a mechanism that allows staked ETH and Liquid Staking Tokens (LSTs) to secure additional networks and services beyond Ethereum itself. This extends Ethereum’s economic security to new applications, known as Autonomous Verifiable Services, or AVSs ([formerly known as Actively Validated Services](https://blog.eigencloud.xyz/redefining-avs-from-actively-validated-to-autonomous-verifiable-services/){target=_blank}), without requiring each to bootstrap its own validator set. Each AVS defines the rules that operators must follow and the proofs they must submit to show they’re executing the service correctly.

## What are EigenLayer Operators?

Operators are independent entities that run specialized software to validate one or more AVSs. They use their restaked ETH as collateral, meaning that if they act maliciously or fail to perform their duties, they can be slashed. By opting in to support specific AVSs, operators essentially lend their security and trustworthiness to those networks in exchange for rewards. Currently, in TestNet, operators are preselected, but this will change as mainnet is released.

## DataHaven's Role as an AVS

DataHaven is deployed as an Autonomous Verifiable Service (AVS) secured by EigenLayer’s re-staking protocol. This means that EigenLayer operators can opt in to validate DataHaven blocks and runtime proofs. In doing so, DataHaven inherits Ethereum's economic security. This way, DataHaven leverages the same operator incentives and slashing guarantees that keep Ethereum secure. Ethereum’s trust layer ensures operator honesty and accountability, while DataHaven’s runtime focuses on decentralized storage and verification. Together, they form a trust-minimized foundation for verifiable data storage and computation in Web3.

---
title: Tokenomics 
description: An overview of DataHaven's tokenomics model and incentive structures.
---

!!! note 
    The HAVE token has not yet launched. No official token contracts currently exist. Avoid interacting with any token claiming to be HAVE. For updates, always refer to DataHaven’s official channels.

## HAVE utility

### Staking to secure DataHaven
DataHaven security is anchored by Ethereum re-staking via [EigenLayer](https://www.eigenlayer.xyz){target="_blank"}. In addition, other assets may be staked/re-staked to help secure the AVS. HAVE holders will be able to delegate stake to operators to participate in securing the network and earn rewards. [Moonbeam's](https://moonbeam.network){target="_blank"} native token GLMR and/or GLMR LSTs will also be supported for re-staking. See [GLMR re-staking](#glmr-re-staking) below.

### Payment for execution (gas)
HAVE is the network’s gas token used to pay for computation and transaction fees. As in typical EVM environments, gas costs are denominated in the system token (HAVE). A dynamic fee mechanism will mitigate spam and promote efficient resource use. Priority fees accrue to operators, while base fee handling (burn vs treasury split) is governed on-chain.

### Storage fees and incentives
DataHaven provides a decentralized, resilient, and verifiable storage network designed for scale and cost-efficiency. Storage fees may be paid in HAVE, and storage providers may be compensated in HAVE. The goal is predictable, fiat-referenced pricing per GB per unit time. Storage providers must post collateral in HAVE; backup storage providers can be slashed for data loss, reinforcing durability commitments.

### Governance
HAVE is central to governance. Token holders may propose and vote on protocol changes, fee parameters, council composition, and treasury allocations via transparent, on-chain processes. Delegation is supported for holders who prefer representative participation.

### GLMR re-staking
As DataHaven expands from the Moonbeam ecosystem, GLMR holders remain integral. In partnership with [StellaSwap](https://stellaswap.com/){target="_blank"}, GLMR holders will be able to re-stake and earn both Moonbeam-native staking rewards and additional emissions for helping secure DataHaven.

## Token supply & distribution

### Key token information
- Network: DataHaven
- Token name: HAVE
- Genesis supply: 10,000,000,000

### Allocation and Vesting Schedule

For information on token allocation and vesting schedule of tokens please see the [DataHaven website](https://datahaven.xyz/tokenomics/){target="_blank"}.

## Inflation
Initial inflation is a fixed, non-compounding 500,000,000 tokens per year, primarily directed to staking rewards to incentivize decentralization and security. The annual amount is adjustable via governance to align incentives with long-term network health.

## Fees, burns, and treasury
Base gas fees are split between burn and treasury; the default treasury share is 20% (remainder burned). Tips/priority fees accrue to block authors/operators. Storage pricing is denominated in HAVE and dynamically adjusted by utilization within bounds, with an explicit minimum treasury cut on streams. Parameters are configurable via governance.

## Bridging
The native token will be bridgeable using standardized cross-chain infrastructure, with options such as Snowbridge for message passing where applicable. Additional details will be provided closer to launch.
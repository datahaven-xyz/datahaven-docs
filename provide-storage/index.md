---
title: Provide Storage
description: Orientation for operators who want to supply storage capacity to DataHaven, with an emphasis on the backup role that safeguards redundancy and proofs.
---

# Provide Storage Overview

DataHaven depends on independent operators to keep replicas available and verifiable. This section is for teams that want to run storage nodes, starting with the Backup Storage Provider (BSP) role that backs up user data, answers proof challenges, and helps the network recover if a Main Storage Provider (MSP) goes offline.

## Provider Roles at a Glance

| Role | How it's chosen | Core responsibilities | Incentives and risks |
|:----:|:---------------:|:---------------------:|:--------------------:|
| MSP | User-selected primary provider for a bucket | Handles uploads and reads, anchors bucket roots on-chain, coordinates replication to BSPs | Earns storage fees; currently not polled or slashed, so reputation and market competition drive quality |
| BSP | Assigned by the network for redundancy | Stores replicas, maintains a global commitment of stored file keys, responds to periodic proof challenges, and serves recovery if an MSP fails | Earns rewards for durable replicas; can be slashed for missing proofs or losing data |

## What to Expect as a Provider

- **Operate through EigenLayer and DataHaven**: Operators register with the DataHaven AVS and bond restaked stake or collateral to join the BSP set.
- **Stay reachable for replication and proofs**: MSPs rely on BSPs to accept replication quickly; protocol challenges have deadlines.
- **Plan for durability and bandwidth**: Keep enough capacity to accommodate new replicas, and maintain consistent throughput to answer chunk-level challenges.
- **Monitor network status**: Review known issues and release notes so you understand current replication behavior and any temporary protocol limits.

!!! note
    BSP replication availability can change during testnet iterations. Check [Known Issues](/store-and-retrieve-data/known-issues/) for the latest status before onboarding capacity.

## Next Steps

<div class="grid cards" markdown>

 -  <a href="/provide-storage/backup-storage-provider-bsp/" markdown>:material-arrow-right: 
    
    **Backup Storage Provider (BSP)**

    Responsibilities, operational flow, and readiness checklist for running a BSP.

    </a>

-   <a href="/how-it-works/data-and-provider-model/data-flow-and-lifecycle/" markdown>:material-arrow-right: 

    **Data Flow and Lifecycle**

    End-to-end view of how uploads, replication, proofs, and recovery fit together.

    </a>

</div>

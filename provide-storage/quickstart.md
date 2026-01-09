---
title: Provide Storage Quickstart
description: Fast path for operators to bring a Backup Storage Provider online with the right prerequisites, registration steps, and validation checkpoints (with light pointers to MSP coordination).
---

# Provide Storage Quickstart

Ready to put your storage capacity to work on DataHaven? This quickstart walks you through bringing a Backup Storage Provider (BSP) online and covers prerequisites, identity, bringing up services, replication, commitments, and proofs. 

## What You'll Do

- Check hardware, bandwidth, and testnet access for sustained replication and proofs.
- Register as a BSP and set realistic capacity targets.
- Fund your BSP account and prep your service key (BCSV) for signing.
- Configure and launch your service with reachable endpoints and fast storage.
- Validate replication, commitments, and proof monitoring before taking on load.

## Storage Provider Roles

- **Main Storage Provider (MSP)**: Chosen by users; handles uploads and reads, anchors bucket roots on-chain, and coordinates replication to BSPs.
- **Backup Storage Provider (BSP)**: Assigned by the network; stores replicas, maintains a global commitment, answers periodic proof challenges, and helps recovery if an MSP fails. Slashing applies for missed proofs or lost data.

## Shared Prerequisites

For the full prerequisites checklist, see the [Provide Storage Overview](/provide-storage/). The essentials are:

- **Infrastructure**: 8 cores @ 3.4 GHz, 32 GB RAM, 500 GB NVMe (chain), 1 TB+ NVMe/HDD (user data), 500 Mbit/s symmetric. Keep chain and user data on separate volumes; set `--max-storage-capacity` to ~80% of available disk.
- **Access**: DataHaven testnet endpoints ([RPC/WSS and MSP service URLs](/store-and-retrieve-data/network-details/testnet/)), reachable hostname/ports, and solid time sync (NTP).
- **Wallet and funds**: Operational keys plus [testnet tokens](https://apps.datahaven.xyz/testnet/faucet){target=_blank} for fees and collateral. Deposit is `SpMinDeposit` + (`capacity_in_gib` × `DepositPerData`) + buffer; for example, ~800 GiB needs about 1,700 MOCK (add headroom).
- **Ops hygiene**: Logs/metrics and alerts for replication latency, anchoring health, challenge deadlines, and disk utilization.

## BSP Path: Replicate, Commit, and Prove

Here's an example of a "happy path" for a Backup Storage Provider:

1. **Register and bond**: Start BSP signup on-chain with `request_bsp_sign_up`, then confirm with `confirm_sign_up` to post stake or collateral (BSPs do not register through EigenLayer). Deposit scales with capacity (see above), and the sign-up lock is `BspSignUpLockPeriod = 90 * DAYS`. Inject your BCSV service key into the node keystore before serving traffic.
2. **Configure service**: Set testnet RPC/WSS endpoints, public host/ports for replication, and a realistic `--max-storage-capacity` (about 80% of available disk). Keep chain and user data on separate volumes.
3. **Accept replication**: Validate chunk integrity from MSPs, persist data, and acknowledge completion. Update your BSP commitment after each accepted replica so the on-chain root matches your stored inventory.
4. **Prove custody**: Subscribe to proof challenges and respond before deadlines; missed or invalid answers can be slashed. Watch logs/metrics for challenge success rate and replication backlog.
5. **Test recovery**: Periodically stream data to another node to mirror the path used during MSP failover.

## Next Steps

<div class="grid cards" markdown>

-   <a href="/provide-storage/backup-storage-provider/get-started/" markdown>:material-arrow-right: 

    **Backup Storage Provider: Get Started**

    Responsibilities, operational flow, and readiness checklist before running a BSP.

    </a>

-   <a href="/provide-storage/" markdown>:material-arrow-right: 
    
    **Provide Storage Overview**

    Roles, hardware guidance, and what to expect before onboarding capacity.

    </a>

-   <a href="/how-it-works/data-and-provider-model/buckets-files-and-merkle-proofs/" markdown>:material-arrow-right: 

    **Buckets, Files, and Merkle Proofs**

    How commitments, anchoring, and proof challenges work for both MSPs and BSPs.

    </a>

-   <a href="/how-it-works/data-and-provider-model/data-flow-and-lifecycle/" markdown>:material-arrow-right: 

    **Data Flow and Lifecycle**

    End-to-end view of uploads, replication, proofs, and recovery across MSPs and BSPs.

    </a>

</div>

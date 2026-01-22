---
title: Provide Storage Quickstart
description: Fast path for operators to bring a Backup Storage Provider online with the right prerequisites, registration steps, and validation checkpoints. Focused on Backup Storage Providers (BSPs) only.
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
- **Wallet and funds**: Operational keys plus [testnet tokens](https://apps.datahaven.xyz/testnet/faucet){target=\_blank} for fees and collateral. Deposit is `SpMinDeposit` + (`capacity_in_gib` × `DepositPerData`) + buffer; for example, ~800 GiB needs about 1,700 MOCK (add headroom).
- **Ops hygiene**: Logs/metrics and alerts for replication latency, anchoring health, challenge deadlines, and disk utilization.

## BSP Path: Replicate, Commit, and Prove

Here's an example of a "happy path" for a Backup Storage Provider:

1. **Spin up the node and capture signup params**: Follow [Run a BSP Node](/provide-storage/backup-storage-provider/run-a-bsp-node/) — the [Docker Compose example in the Configure Docker section](/provide-storage/backup-storage-provider/run-a-bsp-node/#configure-docker-for-the-bsp-node) is a good starting template — to launch with testnet RPC/WSS endpoints, public host/ports for replication, and a realistic `--max-storage-capacity` (about 80% of available disk). Keep chain and user data on separate volumes. Grab your node's multiaddress from the logs; both the multiaddress and max capacity are required for `request_bsp_sign_up`. Inject your BCSV service key into the node keystore before any on-chain actions.
2. **Register and bond**: With the node running, start BSP signup on-chain with `request_bsp_sign_up` (supplying the multiaddress and capacity from step 1), then confirm with `confirm_sign_up` to post stake or collateral (BSPs do not register through EigenLayer). Deposit scales with capacity (see above), and the sign-up lock is `BspSignUpLockPeriod = 90 * DAYS`.
3. **Accept replication (auto after signup confirmation)**: Once `confirm_sign_up` is finalized, the network assigns replicas to your running node. It will validate chunk integrity, persist data, and acknowledge completion; keep an eye on logs and metrics and ensure your commitment updates after each accepted replica so the on-chain root matches your stored inventory.
4. **Prove custody (auto after signup confirmation)**: Proof challenges begin once you're registered and online. The node subscribes and responds automatically; watch deadlines, challenge success rate, and replication backlog since missed or invalid answers can be slashed.
5. **Test recovery**: Periodically stream data to another node to mirror the path used during MSP failover.

## Next Steps

<div class="grid cards" markdown>

-   <a href="/provide-storage/backup-storage-provider/run-a-bsp-node/" markdown>:material-arrow-right: 

    **Run a BSP Node**

    Docker Compose template, required flags, and keystore injection to bring a BSP online.

    </a>

-   <a href="/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/" markdown>:material-arrow-right: 
    
    **End-to-End BSP Onboarding**

    Full tutorial from spinning up a node to registering on-chain and handling proofs.

    </a>

</div>

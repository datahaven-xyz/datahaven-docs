title: Get Started as a Backup Storage Provider
description: Walk through the responsibilities, onboarding flow, and reliability expectations before running a Backup Storage Provider on DataHaven.
---

# Get Started as a Backup Storage Provider

Use this starter to understand what a Backup Storage Provider (BSP) is responsible for and how to prepare your node. BSPs supply redundancy for every bucket on DataHaven: they store replicated file bytes, maintain a verifiable record of the file keys they hold, answer periodic proof challenges, and serve data if a Main Storage Provider (MSP) becomes unavailable.

## What Does a BSP Do?

The responsibilities of BSPs include:

- **Accept replication from MSPs**: Receive file chunks from MSPs after a user upload, validate integrity, and persist replicas until policy allows deletion.
- **Maintain a global commitment**: Track stored file keys in a Merkle forest, publish the resulting root on-chain, and keep it current as files are added or removed.
- **Answer protocol challenges**: Respond within the challenge window using Merkle proofs derived from local data to show continued custody. Missed or invalid answers can lead to slashing.
- **Support recovery**: If an MSP fails, stream replicas to a replacement MSP so the bucket can be reconstructed without data loss.
- **Manage capacity**: Advertise realistic storage limits and monitor utilization so you can continue accepting replication without breaching service targets.

## Operational Flow

Follow this sequence to understand the onboarding and operations of a BSP from registration through replication, commitments, and proof responses.

- **Register and bond**: Start BSP signup on DataHaven with `request_bsp_sign_up`, then confirm with `confirm_sign_up` to post stake or collateral (BSPs do not onboard through EigenLayer).
- **Prepare endpoints**: Run your BSP service on reliable storage and bandwidth, expose secure endpoints MSPs can reach for replication, and keep time in sync for challenge deadlines.
- **Accept and persist replicas**: When selected, fetch the file data from the MSP, validate chunk hashes, and acknowledge completion so the MSP can finalize the upload on-chain.
- **Publish commitments**: Update your BSP commitment after each accepted replica so the on-chain root matches your local inventory.
- **Respond to challenges**: Monitor for scheduled challenge messages, derive proofs from your stored data, and respond before the deadline to avoid faults.
- **Assist migrations**: Serve stored replicas to new MSPs during bucket migrations or recovery events to minimize downtime for users.

## Replication Targets and Pricing Signals

DataHaven offers multiple replication tiers as follows:

| Tier | BSP replicas |
|:----:|:------------:|
| Basic | 7 |
| Standard | 12 |
| High | 17 |
| Super High | 22 |
| Ultra High | 26 |

Users pay for storage based on the data they store over time and the replication factor they choose. Lower replication factors reduce cost; higher tiers increase redundancy.

## Reliability and Readiness Checklist

- **Durable storage**: Use redundant disks or volume management suited to sustained writes and reads of chunked data.
- **Steady bandwidth**: Size uplink and downlink to handle concurrent replication plus challenge traffic without contention.
- **Observability**: Capture metrics and logs for replication latency, challenge response times, commitment publication, and storage utilization; alert on deadline risk.
- **Key and identity hygiene**: Protect signing keys used for BSP registration and on-chain updates; rotate credentials carefully to keep commitments intact.
- **Test recoveries**: Periodically verify you can stream data to another node, mirroring the path used during MSP failover.

## Run a BSP Node

For node CLI flags, key setup, and deployment patterns, see [Run a BSP Node instructions](/provide-storage/backup-storage-provider/run-a-bsp-node/). This guide covers registration, capacity sizing, and task flags in one place. 

## Faults, Slashing, and Exits

- Missed or invalid challenge responses and provable data loss are subject to slashing of the stake or collateral backing the BSP.
- Keeping commitments up to date is essential; stale roots can create false failures during challenges.
- BSP sign-up lock period: `BspSignUpLockPeriod = 90 * DAYS` (about 3 months) from sign-up.
- Exits must respect TTLs and challenge windows; BSPs can be removed from the allowlist and operator set, but rushing exits risks slashing.
- If you need to scale down, drain capacity gracefully so pending replications and open challenges are complete before exiting the operator set.

## Next Steps

<div class="grid cards" markdown>

-  <a href="/provide-storage/" markdown>:material-arrow-right: 
    
    **Provide Storage Overview**

    How BSPs and MSPs fit together plus what to expect before onboarding capacity.

    </a>

-   <a href="/how-it-works/data-and-provider-model/buckets-files-and-merkle-proofs/" markdown>:material-arrow-right: 

    **Buckets, Files, and Merkle Proofs**

    Technical background for the commitments and proofs a BSP maintains.

    </a>

</div>

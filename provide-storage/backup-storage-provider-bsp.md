---
title: Backup Storage Provider (BSP)
description: Understand the responsibilities, operating flow, and reliability expectations for running a Backup Storage Provider on DataHaven.
---

# Backup Storage Provider (BSP)

Backup Storage Providers supply redundancy for every bucket on DataHaven. They store replicated file bytes, maintain a verifiable record of the file keys they hold, answer periodic proof challenges, and serve data if a Main Storage Provider (MSP) becomes unavailable.

## What a BSP Does

- **Accept replication from MSPs**: Receive file chunks from MSPs after a user upload, validate integrity, and persist replicas until policy allows deletion.
- **Maintain a global commitment**: Track stored file keys in a Merkle forest, publish the resulting root on-chain, and keep it current as files are added or removed.
- **Answer protocol challenges**: Respond within the challenge window using Merkle proofs derived from local data to show continued custody. Missed or invalid answers can lead to slashing.
- **Support recovery**: If an MSP fails, stream replicas to a replacement MSP so the bucket can be reconstructed without data loss.
- **Manage capacity**: Advertise realistic storage limits and monitor utilization so you can continue accepting replication without breaching service targets.

## Operational Flow

1. **Register and bond**: Join the BSP operator set through the DataHaven AVS (via EigenLayer) and stake the collateral that backs your commitments.
2. **Prepare endpoints**: Run your BSP service on reliable storage and bandwidth, expose secure endpoints MSPs can reach for replication, and keep time in sync for challenge deadlines.
3. **Accept and persist replicas**: When selected, fetch the file data from the MSP, validate chunk hashes, and acknowledge completion so the MSP can finalize the upload on-chain.
4. **Publish commitments**: Update your BSP commitment after each accepted replica so the on-chain root matches your local inventory.
5. **Respond to challenges**: Monitor for scheduled challenge messages, derive proofs from your stored data, and respond before the deadline to avoid faults.
6. **Assist migrations**: Serve stored replicas to new MSPs during bucket migrations or recovery events to minimize downtime for users.

## Reliability and Readiness Checklist

- **Durable storage**: Use redundant disks or volume management suited to sustained writes and reads of chunked data.
- **Steady bandwidth**: Size uplink and downlink to handle concurrent replication plus challenge traffic without contention.
- **Observability**: Capture metrics and logs for replication latency, challenge response times, commitment publication, and storage utilization; alert on deadline risk.
- **Key and identity hygiene**: Protect signing keys used for AVS registration and on-chain updates; rotate credentials carefully to keep commitments intact.
- **Test recoveries**: Periodically verify you can stream data to another node, mirroring the path used during MSP failover.

## Faults, Slashing, and Exits

- Missed or invalid challenge responses and provable data loss are subject to slashing of the stake or collateral backing the BSP.
- Keeping commitments up to date is essential; stale roots can create false failures during challenges.
- If you need to scale down, drain capacity gracefully so pending replications and open challenges complete before exiting the operator set.

## Next Steps

<div class="grid cards" markdown>

-  <a href="/provide-storage/" markdown>:material-compass-outline: 
    
    **Provide Storage Overview**

    How BSPs and MSPs fit together plus what to expect before onboarding capacity.

    </a>

-   <a href="/how-it-works/data-and-provider-model/buckets-files-and-merkle-proofs/" markdown>:material-source-branch-plus: 

    **Buckets, Files, and Merkle Proofs**

    Technical background for the commitments and proofs a BSP maintains.

    </a>

</div>

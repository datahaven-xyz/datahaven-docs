---
title: BSP CLI Flags
description: Configuration flags for running a Backup Storage Provider node, covering capacity limits, task execution, proof handling, and operational tuning.
categories: Storage Providers, BSP, Reference
---

# BSP CLI Flags

This page documents all CLI flags available when running a Backup Storage Provider (BSP) node, including storage capacity, task execution, and operational behavior.

## Core Provider Flags

Core provider flags are required to run a node in BSP mode. They help define storage capacity, provider identity, and local storage backend configuration.

| Flag | Description | Required | Default |
|:------|:-------------|:----------|:---------|
| `--provider` | Enable storage provider mode | Yes | false |
| `--provider-type bsp` | Set provider type to BSP | Yes | None |
| `--max-storage-capacity <BYTES>` | Maximum storage capacity | Yes | None |
| `--jump-capacity <BYTES>` | Jump capacity for new storage | Yes | None |
| `--storage-layer <TYPE>` | Storage backend (`rocksdb` or `memory`) | No | `memory` |
| `--storage-path <PATH>` | Storage path (required if rocksdb) | No | None |

**Example Values:**

- `--max-storage-capacity 858993459200` (800 GiB = 80% of 1 TB disk)
- `--max-storage-capacity 1717986918400` (1.6 TiB = 80% of 2 TB disk)
- `--jump-capacity 107374182400` (100 GiB)

!!! note
    Set `--max-storage-capacity` to approximately **80% of your available physical disk space** to leave headroom for filesystem overhead and temporary files.

## BSP-Specific Task Flags

BSP-specific task flags enable and configure background BSP tasks such as file uploads, bucket migrations, fee charging, and storage proof submission.

| Flag | Description | Default |
|:------|:-------------|:---------|
| `--bsp-upload-file-task` | Enable file upload from MSP task | false |
| `--bsp-upload-file-max-try-count <N>` | Max retries for file uploads | 5 |
| `--bsp-upload-file-max-tip <AMOUNT>` | Max tip for upload file extrinsics | 0 |
| `--bsp-move-bucket-task` | Enable bucket migration task | false |
| `--bsp-move-bucket-grace-period <SECONDS>` | Grace period after bucket move | 300 |
| `--bsp-charge-fees-task` | Enable automatic fee charging | false |
| `--bsp-charge-fees-min-debt <AMOUNT>` | Minimum debt threshold to charge | 0 |
| `--bsp-submit-proof-task` | Enable proof submission task | false |
| `--bsp-submit-proof-max-attempts <N>` | Max attempts to submit proof | 3 |

## Remote File Handling Flags

Remote file handling flags offer controls for downloading and uploading files from MSP backends, including timeouts, chunking behavior, buffering, and HTTP settings.

| Flag | Description | Default |
|:------|:-------------|:---------|
| `--max-file-size <BYTES>` | Maximum file size | 10737418240 (10 GB) |
| `--connection-timeout <SECONDS>` | Connection timeout | 30 |
| `--read-timeout <SECONDS>` | Read timeout | 300 |
| `--follow-redirects <BOOL>` | Follow HTTP redirects | true |
| `--max-redirects <N>` | Maximum redirects | 10 |
| `--user-agent <STRING>` | HTTP user agent | "StorageHub-Client/1.0" |
| `--chunk-size <BYTES>` | Upload/download chunk size | 8192 (8 KB) |
| `--chunks-buffer <N>` | Number of chunks to buffer | 512 |

## Operational Flags

Operational flags are advanced parameters that influence retry behavior, synchronization thresholds, and how the BSP reacts to chain state changes.

| Flag | Description | Default |
|:------|:-------------|:---------|
| `--extrinsic-retry-timeout <SECONDS>` | Extrinsic retry timeout | 60 |
| `--sync-mode-min-blocks-behind <N>` | Min blocks behind for sync mode | 5 |
| `--check-for-pending-proofs-period <N>` | Period to check pending proofs | 4 |
| `--max-blocks-behind-to-catch-up-root-changes <N>` | Max blocks to process for root changes | 10 |

## Next Steps

<div class="grid cards" markdown>

-  <a href="/provide-storage/backup-storage-provider/run-a-bsp-node" markdown>:material-arrow-right: 

    **Run a BSP Node**

    Follow this guide to set up and run your own BSP node.

    </a>

-  <a href="/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/" markdown>:material-arrow-right:

    **End-to-End BSP Onboarding**

    This tutorial takes you step-by-step through spinning up a BSP and verifying it on-chain.

    </a>

</div>
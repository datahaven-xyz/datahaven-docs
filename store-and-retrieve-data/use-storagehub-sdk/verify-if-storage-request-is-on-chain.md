---
title: Verify if Storage Request is On-Chain
description: Guide to checking and confirming that your storage request is registered on-chain.
---

## Introduction

Use this guide to confirm that a file’s Storage Request was recorded on-chain. You’ll derive the deterministic file key (owner AccountId20 + bucketId + fileName), query `fileSystem.storageRequests`(fileKey) via the Polkadot.js API, and inspect the returned record. A successful check proves the request exists and that core fields including `bucketId` and the content fingerprint match your local values. If no record is found, the transaction may not be finalized yet, or one of the inputs used to compute the key (address, bucket ID type, or case-sensitive file name) doesn’t exactly match what was used when the request was issued. This flow is read-only.

## Prerequisites

- [Issue a Storage Request Guide](/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request)

## Compute the file key

To compute the file key with its required parameters in the appropriate types add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-if-storage-request-is-on-chain/compute-file-key.ts'
```

## Retrieve Storage Request data via Polkadot API

To retrieve Storage Request data, add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-if-storage-request-is-on-chain/retrieve-storage-request-data.ts'
```

## Read Storage Request data

To read Storage Request data, it first must be unwrapped as follows:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-if-storage-request-is-on-chain/read-storage-request-data.ts'
```

Upon successful verification, you'll see a message like:

```bash
Storage request bucketId: 0x8bb80c024079126ba72150cce1d60665e4d4da038c56f75121471912b036c70a
Storage request fingerprint should be the same as initial fingerprint true
```

## Next Steps

<div class="grid cards" markdown>

-   __Upload Your First File__

    ---

    Once your storage request is confirmed, use the StorageHub SDK to upload your first file to the network. 

    [:octicons-arrow-right-24: Retrieve Your Data](/store-and-retrieve-data/use-storagehub-sdk/upload-your-first-file)

-   __Build a Data Workflow End-to-End__

    ---

    Learn step-by-step how to store a file on DataHaven and retrieve it back from the network.

    [:octicons-arrow-right-24: End-to-End Storage Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow)

</div>
---
title: End-to-End Storage Workflow
description: Step-by-step tutorial on uploading a file to DataHaven and retrieving it from the network.
---

## Introduction

This guide walks you through the exact order of operations for storing a file on DataHaven and retrieving it back. Follow each step in sequence; each guide linked below provides the detailed code you will run.

## Workflow at a Glance

For more details on each step, check out the respective guides for each one. 

Prerequisite: [Create a Bucket](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket)

1. [Issue a Storage Request](/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request)
2. [Verify if Storage Request is On-Chain](/store-and-retrieve-data/use-storagehub-sdk/verify-if-storage-request-is-on-chain)
3. [Authenticate with SIWE and JWT](/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt)
4. [Upload Your First File](/store-and-retrieve-data/use-storagehub-sdk/upload-your-first-file)
5. [Retrieve Your Data](/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data)

## Step-by-Step

### Prerequisite: Create a Bucket

This tutorial assumes you've already created a bucket and know its bucket name to be able to access it. If you haven't yet created a bucket, you can do by following the [Create a Bucket Guide](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket).

### 1) Issue a Storage Request

Register your intent to store a file in your bucket and set its replication policy. Initialize `FileManager`, compute the file’s fingerprint, fetch MSP info (and extract peer IDs), choose a replication level and replica count, then call issueStorageRequest

```ts title="Issue a Storage Request"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/combined.ts'
```

### 2) Verify if Storage Request is On-Chain

Derive the deterministic file key, query on-chain state, and confirm the request exists and matches your local fingerprint and bucket.

```ts title="Verify if Storage Request is On-Chain"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-if-storage-request-is-on-chain/combined.ts'
```

### 3) Authenticate with SIWE and JWT

Sign-in with Ethereum (SIWE) to the MSP and obtain a short-lived JWT to authorize upload and retrieval operations.

```ts title="Authenticate with SIWE and JWT"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/combined.ts'
```

### 4) Upload Your First File

Send the file bytes to the MSP, linked to your Storage Request. Confirm the upload receipt indicates a successful upload.

```ts title="Upload Your First File"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-your-first-file/combined.ts'
```

### 5) Retrieve Your Data

Download the file by its deterministic key from the MSP and save it locally.

```ts title="Retrieve Your Data"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/combined.ts'
```

## Putting it All Together

The code containing the complete series of steps from issuing a storage request to retrieving the data can be accessed below.

??? code "View complete script"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end.ts'
    ```

### Notes on Data Safety

Uploading a file does not guarantee network-wide replication. Files are considered secured by DataHaven only after replication to a Backup Storage Provider (BSP) completes. Tooling to surface replication status is in active development.

## Next Steps

<div class="grid cards" markdown>

-   __Data Flow and Lifecycle__

    ---

    End-to-end overview of how data moves through the DataHaven network.

    [:octicons-arrow-right-24: Data Flow and Lifecycle](/how-it-works/data-and-provider-model/data-flow-and-lifecycle)

-   __How It Works: FAQs__

    ---

    Answers to common questions about providers, replication, and network guarantees.

    [:octicons-arrow-right-24: FAQs](/how-it-works/faqs)

</div>


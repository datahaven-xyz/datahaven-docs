---
title: End-to-End Storage Workflow
description: Learn how to store and retrieve files on DataHaven with this step-by-step guide, from issuing a storage request to uploading and downloading data securely.
---

# End-to-End Storage Workflow

This guide walks you through the exact steps for storing a file on DataHaven and retrieving it. Follow each step in sequence; each guide linked below provides the detailed code you will run.

## Workflow at a Glance

For more details on each step, check out the respective guides. 

Prerequisite: [Create a Bucket](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/)

1. [Issue a Storage Request](/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/)
2. [Verify if Storage Request is On-Chain](/store-and-retrieve-data/use-storagehub-sdk/verify-if-storage-request-is-on-chain/)
3. [Authenticate with SIWE and JWT](/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/)
4. [Upload Your First File](/store-and-retrieve-data/use-storagehub-sdk/upload-your-first-file/)
5. [Retrieve Your Data](/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/)

## Prerequisites

- [Node.js](https://nodejs.org/en/download){target=_blank} v22+ installed
- [A TypeScript project](/store-and-retrieve-data/use-storagehub-sdk/get-started/#set-up-a-typescript-project){target=\_blank}
    <!-- TODO: Add TypeScript project instructions here as admo -->
- The [StorageHub SDK](/store-and-retrieve-data/use-storagehub-sdk/get-started/#install-the-storagehub-sdk){target=\_blank} installed
- [A bucket created](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} with the ID handy

## Issue a Storage Request

Register your intent to store a file in your bucket and set its replication policy. Initialize `FileManager`, compute the file’s fingerprint, fetch MSP info (and extract peer IDs), choose a replication level and replica count, then call issueStorageRequest

```ts title="Issue a Storage Request"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/combined.ts'
```

## Verify If Storage Request Is On-Chain

Derive the deterministic file key, query on-chain state, and confirm the request exists and matches your local fingerprint and bucket.

```ts title="Verify If Storage Request Is On-Chain"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/verify-if-storage-request-is-on-chain/combined.ts'
```

## Authenticate with SIWE and JWT

Sign-in with Ethereum (SIWE) to the MSP and obtain a short-lived JWT to authorize upload and retrieval operations.

```ts title="Authenticate with SIWE and JWT"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/combined.ts'
```

## Upload Your First File

Send the file bytes to the MSP, linked to your Storage Request. Confirm that the upload receipt indicates a successful upload.

```ts title="Upload Your First File"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-your-first-file/combined.ts'
```

## Retrieve Your Data

Download the file by its deterministic key from the MSP and save it locally.

```ts title="Retrieve Your Data"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/combined.ts'
```

## Putting it All Together

The code containing the complete series of steps from issuing a storage request to retrieving the data is available below.

??? code "View complete script"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end.ts'
    ```

### Notes on Data Safety

Uploading a file does not guarantee network-wide replication. Files are considered secured by DataHaven only after replication to a Backup Storage Provider (BSP) completes. Tooling to surface replication status is in active development.

## Next Steps

<div class="grid cards" markdown>

-  <a href="/how-it-works/data-and-provider-model/data-flow-and-lifecycle/" markdown>:material-arrow-right: 
    
    **Data Flow and Lifecycle**

    End-to-end overview of how data moves through the DataHaven network.

    </a>

-   <a href="/how-it-works/faqs/" markdown>:material-arrow-right:

    **How It Works: FAQs**

    Answers to common questions about providers, replication, and network guarantees.

    </a>

</div>

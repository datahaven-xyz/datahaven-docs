---
title: End-to-End Storage Workflow
description: Learn how to store and retrieve files on DataHaven with this step-by-step guide, from issuing a storage request to uploading and downloading data securely.
---

# End-to-End Storage Workflow

Learn the complete process for storing and retrieving a file on DataHaven—presented in order with runnable code samples in each section.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- The [StorageHub SDK](/store-and-retrieve-data/use-storagehub-sdk/get-started/#install-the-storagehub-sdk){target=\_blank} installed

## Create a Bucket

Buckets group your files under a specific Main Storage Provider (MSP) and value proposition. Derive a deterministic bucket ID, fetch MSP parameters, then create the bucket. If you run the script multiple times, use a new `bucketName` to avoid a revert, or modify the logic to use your existing bucket in later steps.

```ts title="Create a Bucket"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/create-a-bucket.ts'
```

## Issue a Storage Request

Register your intent to store a file in your bucket and set its replication policy. Initialize `FileManager`, compute the file’s fingerprint, fetch MSP info (and extract peer IDs), choose a replication level and replica count, then call `issueStorageRequest`.

```ts title="Issue a Storage Request"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/issue-storage-request.ts'
```

## Verify If Storage Request Is On-Chain

Derive the deterministic file key, query on-chain state, and confirm the request exists and matches your local fingerprint and bucket.

```ts title="Verify If Storage Request Is On-Chain"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/verify-storage-request.ts'
```

## Authenticate with SIWE and JWT

Sign-in with Ethereum (SIWE) to the MSP and obtain a short-lived JWT to authorize upload and retrieval operations.

```ts title="Authenticate with SIWE and JWT"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/authenticate.ts'
```

## Upload a File

Send the file bytes to the MSP, linked to your Storage Request. Confirm that the upload receipt indicates a successful upload.

```ts title="Upload a File"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/upload-a-file.ts'
```

## Retrieve Your Data

Download the file by its deterministic key from the MSP and save it locally.

```ts title="Retrieve Your Data"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/retrieve-your-data.ts'
```

## Putting It All Together

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

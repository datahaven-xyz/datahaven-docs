---
title: End-to-End Storage Workflow
description: Learn how to store and retrieve files on DataHaven with this step-by-step guide, from issuing a storage request to uploading and downloading data securely.
---

# End-to-End Storage Workflow

This tutorial will cover the end-to-end process of creating a bucket, uploading a file, and retrieving it, in a step-by-step format.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- The [StorageHub SDK](/store-and-retrieve-data/use-storagehub-sdk/get-started/#install-the-storagehub-sdk){target=\_blank} installed

## Client Setup and Create a Bucket

Buckets group your files under a specific Main Storage Provider (MSP) and value proposition. Derive a deterministic bucket ID, fetch MSP parameters, then create the bucket. If you run the script multiple times, use a new `bucketName` to avoid a revert, or modify the logic to use your existing bucket in later steps.

In the following code, you will initialize the StorageHub, viem, and Polkadot.js clients on the DataHaven Testnet, sign in via SIWE (Sign in With Ethereum), and pull the MSP’s details/value proposition to prepare for bucket creation. Then you will derive the bucket ID, confirm it doesn’t exist, submit a createBucket transaction, wait for confirmation, and finally query the chain to verify that the new bucket’s MSP and owner match our account. 

The following sections will build on this snippet, so it's important to start here to properly configure the client and ensure the bucket is created correctly. If you'd prefer to step through the Create a Bucket steps individually, please see the [Create a Bucket Page](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank}.

```ts title="Create a Bucket"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/create-a-bucket.ts'
```

## Issue a Storage Request

Ensure your file is ready to upload. In this demonstration, we're using a `.jpg` file named `hello.jpg` stored in the current working directory, i.e., the same as the typescript project files, `/src/`. 

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

In this section, you'll trigger the SIWE flow: the connected wallet signs an EIP-4361 message, the MSP verifies it, and returns a JWT session token. Save that token as `sessionToken` and reuse it for subsequent authenticated requests.

```ts title="Authenticate with SIWE and JWT"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/authenticate.ts'
```

## Upload a File

Send the file bytes to the MSP, linked to your storage request. Confirm that the upload receipt indicates a successful upload.

```ts title="Upload a File"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/upload-a-file.ts'
```

## Retrieve Your Data

Download the file by its deterministic key from the MSP and save it locally.

```ts title="Retrieve Your Data"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/retrieve-your-data.ts'
```

## Putting It All Together

The code containing the complete series of steps from issuing a storage request to retrieving the data is available below. As a reminder, before running the full script, ensure you have the following:

- Tokens to pay for the storage request on your account
- A file to upload, such as `hello.jpg`

??? code "View complete script"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/end-to-end.ts'
    ```

### Notes on Data Safety

Uploading a file does not guarantee network-wide replication. Files are considered secured by DataHaven only after replication to a Backup Storage Provider (BSP) is complete. Tooling to surface replication status is in active development.

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

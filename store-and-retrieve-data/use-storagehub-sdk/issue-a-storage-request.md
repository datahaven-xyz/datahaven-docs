---
title: Issue a Storage Request
description: Guide to issuing a storage request using StorageHub SDK.
---

# Issue a Storage Request

## Introduction

## Prerequisites

- [Create a Bucket Guide](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket)

## Prepare file

Make sure to have a file ready that you plan on uploading to DataHaven. Any file type is accepted, although the current limit on the file size for the Testnet is 2 GB. For the purpose of this guide, put the file in a `files` folder that will be within the `src` folder of your project.

## Initialize File Manager

In order to initialize the File Manager, add the following code to your file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/initialize-file-manager.ts'
```

## Create Fingerprint

To create the fingerprint of your file from the File Manager, add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/create-fingerprint.ts'
```

## Issue Storage Request

Prepare the remaining parameters and issue the storage request by adding the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/issue-a-storage-request/issue-storage-request.ts'
```

## Next Steps

<div class="grid cards" markdown>

-   __Verify if Storage Request is On-Chain__

    ---

    Verify whether the storage request has been successfully recorded on-chain. This step ensures that you can proceed with file upload and file retrieval.

    [:octicons-arrow-right-24: Retrieve Your Data](/store-and-retrieve-data/use-storagehub-sdk/verify-if-storage-request-is-on-chain)

-   __Build a Data Workflow End-to-End__

    ---

    Learn step-by-step how to store a file on DataHaven and retrieve it back from the network.

    [:octicons-arrow-right-24: End-to-End Storage Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow)

</div>
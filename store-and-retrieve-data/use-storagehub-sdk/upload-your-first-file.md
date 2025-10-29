---
title: Upload Your First File
description: Guide to uploading files using the StorageHub SDK.
---

# Upload Your First File

## Introduction

## Prerequisites

- [Verify if Storage Request is On-Chain Guide](/store-and-retrieve-data/use-storagehub-sdk/verify-if-storage-request-is-on-chain)
- [Authenticate with SIWE and JWT Guide](/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt)

## Upload File to MSP

Add the following code to trigger the file upload to the connected MSP:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-your-first-file/upload-file-to-msp.ts'
```

## Verify File Upload was Successful

Check receipt status in order to verify the file upload was successful:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/upload-your-first-file/verify-successful-file-upload.ts'
```

## Next Steps

<div class="grid cards" markdown>

-   __Retrieve Your Data__

    ---

    Once your file is successfully uploaded, the next step is to retrieve it from the Main Storage Provider (MSP) using the StorageHub SDK and save it locally.

    [:octicons-arrow-right-24: Retrieve Your Data](/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data)

-   __Build a Data Workflow End-to-End__

    ---

    Learn step-by-step how to store a file on DataHaven and retrieve it back from the network.

    [:octicons-arrow-right-24: End-to-End Storage Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow)

</div>
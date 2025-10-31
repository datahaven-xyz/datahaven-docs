---
title: Retrieve Your Data
description: Guide to fetching and downloading your files from DataHaven using the StorageHub SDK.
---

# Retrieve Your Data

## Introduction

This section shows how to fetch a previously uploaded file from your chosen Main Storage Provider (MSP) using its deterministic file key. You’ll pass the file key in hex to `mspClient.files.downloadFile`, validate a 200 response, and stream the bytes directly to disk—avoiding loading the whole object into memory. 

## Prerequisites

- [Upload Your First File Guide](/store-and-retrieve-data/use-storagehub-sdk/upload-your-first-file)
- [Authenticate with SIWE and JWT Guide](/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt)

## Download Your File from MSP Client

Convert the file key to hex and pass it to the .downloadByKey function of the mspClient as follows:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/download-file-from-msp.ts'
```

## Save Downloaded File

In order to save the retrieved file from the MSP on your local machine, add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/save-downloaded-file.ts'
```

## Next Steps

<div class="grid cards" markdown>

-   __Build a Data Workflow End-to-End__

    ---

    Learn step-by-step how to store a file on DataHaven and retrieve it back from the network.

    [:octicons-arrow-right-24: End-to-End Storage Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow)

-   __Data Flow and Lifecycle__

    ---

    End-to-end overview of how data moves through the DataHaven network.

    [:octicons-arrow-right-24: Retrieve Your Data](/how-it-works/data-and-provider-model/data-flow-and-lifecycle)


</div>
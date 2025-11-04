---
title: Manage Files and Buckets
description: Guide on how to use the StorageHub SDK to remove your file from the network and how to delete your bucket.
---

# Manage Files and Buckets

This guide explains how to manage your storage resources on DataHaven using the StorageHub SDK. You will learn how to request the removal of a file from the network and how to delete buckets. It's important to periodically review and clean up unused data to avoid unnecessary costs, since buckets and files come with continuous storage fees.

## Prerequisites

- [Initialized StorageHub Client]
- [Initialized Public Client]
- [Upload Your First File Guide](/store-and-retrieve-data/use-storagehub-sdk/upload-your-first-file)

## Delete a file

```ts 
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:request-file-deletion'
```

## Delete a Bucket



!!! note
    A bucket can only be deleted if the files in that bucket have already been deleted

```ts 
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/manage-files-and-buckets.ts:delete-bucket'
```

## Next Steps

<div class="grid cards" markdown>

-   __Handle Payments and Track Costs__

    ---

    Check the current costs you are paying out to each MSP for all your uploaded files and created buckets.

    [:octicons-arrow-right-24: Issue a Storage Request](/store-and-retrieve-data/manage-and-optimize-your-data/handle-payments-and-track-costs)

-   __Build a Data Workflow End-to-End__

    ---

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    [:octicons-arrow-right-24: End-to-End Storage Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow)

</div>
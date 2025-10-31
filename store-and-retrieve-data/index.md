---
title: Store and Retrieve Data
description: Learn about the complete data storage and retrieval process in DataHaven, from bucket creation to verification and file access.
---

# Store and Retrieve Data Overview

DataHaven is a verifiable storage network that separates storage from verification. Storage providers hold your file bytes off-chain, while the chain records compact on-chain commitments. These commitments serve as "receipts" so data can be checked at read time.

## Key Considerations

As you plan your development, consider the following:

- **Bucket access**: Currently, bucket access is limited to the bucket owner.
- **Data security**: For confidentiality, you can encrypt files on the client side before uploading.
- **Costs and deposits**: Storage is billed via a prepaid deposit that streams per block and auto-pauses when the balance falls below a minimum threshold.
- **MSP choice**: If you opt to reassign a bucket to a new MSP later, the new MSP rehydrates data from BSP replicas without requiring manual copying.
- **File status and replicas**: Treat files as “verified” only after a fulfillment event is emitted. 
- **Large files**: Files up to 2 GB are currently supported, subject to change. The app automatically handles chunking and integrity checks under the hood.

## Store Data with StorageHub SDK

Use the following how-to guides to move through the DataHaven storage and retrieval lifecycle:

[timeline.left(datahaven-docs/.snippets/store-and-retrieve-data/overview/timeline-01.json)]

You can also visit the [End-to-End StorageHub SDK Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow.md) tutorial for a streamlined walk-through using DataHaven's StorageHub SDK to store and retrieve data.

## Next Steps

<div class="grid cards" markdown>

-   **Quickstart**

    ---

    Visit the Quickstart guide to set up your RPC endpoints, discover block explorers, and obtain TestNet HAVE tokens. 

    [:octicons-arrow-right-24: Get started](/store-and-retrieve-data/quickstart/)

-   **Get Started with the StorageHub SDK**

    ---

    Follow this guide to set up your development environment and install key dependencies to get your DataHaven project up and running smoothly.

    [:octicons-arrow-right-24: Get started](/store-and-retrieve-data/use-storagehub-sdk/get-started/)

</div>

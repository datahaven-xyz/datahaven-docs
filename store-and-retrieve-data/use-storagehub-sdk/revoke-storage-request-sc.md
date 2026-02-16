---
title: Revoke a Storage Request
description: Learn how to cancel a pending storage request on DataHaven by calling the FileSystem Precompile's revokeStorageRequest function directly.
categories: Store Data, Smart Contract
toggle:
  group: revoke-sq
  canonical: true
  variant: sc
  label: SC
---

# Revoke a Storage Request

After issuing a storage request, you may need to cancel it before the MSP fully confirms or replicates the file. This guide shows you how to revoke a pending storage request by calling the `revokeStorageRequest` function on the [FileSystem Precompile](https://github.com/Moonsong-Labs/storage-hub/blob/main/precompiles/pallet-file-system/FileSystem.sol#L7){target=\_blank} directly via `walletClient.writeContract`.

This is useful if you submitted a request by mistake, need to change the file or bucket, or want to cancel before incurring storage fees.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

- [A bucket created](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} with the ID handy
- A file to use for issuing a storage request (any file type is accepted; the current testnet file size limit is {{ networks.testnet.file_size_limit }})
- Familiarity with [issuing storage requests](/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/){target=\_blank}
- [The FileSystem Precompile's ABI](/store-and-retrieve-data/use-storagehub-sdk/get-started/#set-up-the-smart-contract-path-optional) handy


## Initialize the Script Entry Point

Create an `index.ts` file if you haven't already. Its `run` method will orchestrate all the logic in this guide, and you'll replace the labelled placeholders with real code step by step. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/revoke-storage-request.ts:imports'

async function run() {
  await initWasm();

  const bucketId = 'INSERT_BUCKET_ID'; // `0x${string}`

  // **PLACEHOLDER FOR STEP 1: ISSUE A STORAGE REQUEST**
  // **PLACEHOLDER FOR STEP 2: COMPUTE THE FILE KEY**
  // **PLACEHOLDER FOR STEP 3: VERIFY STORAGE REQUEST EXISTS**
  // **PLACEHOLDER FOR STEP 4: REVOKE THE STORAGE REQUEST**
  // **PLACEHOLDER FOR STEP 5: VERIFY REVOCATION**

  await polkadotApi.disconnect();
}

await run();
```

## Issue a Storage Request

Before you can revoke a storage request, one must exist on-chain. In this step, you'll issue a storage request without uploading the file to the MSP—just enough to register the intent on-chain so it can be revoked.

Replace the placeholder `// **PLACEHOLDER FOR STEP 1: ISSUE A STORAGE REQUEST**` with the following code:

```ts title="index.ts // **PLACEHOLDER FOR STEP 1: ISSUE A STORAGE REQUEST**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/revoke-storage-request.ts:issue-storage-request'
```

!!! note
    This step issues a storage request by calling `issueStorageRequest` on the FileSystem Precompile directly. The file is **not** uploaded to the MSP—only the on-chain request is created. This is intentional, since the goal of this guide is to demonstrate revocation.

## Compute the File Key

The file key is a deterministic identifier derived from the owner address, bucket ID, and file name. You'll need it to both verify the request on-chain and to revoke it.

Replace the placeholder `// **PLACEHOLDER FOR STEP 2: COMPUTE THE FILE KEY**` with the following code:

```ts title="index.ts // **PLACEHOLDER FOR STEP 2: COMPUTE THE FILE KEY**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/revoke-storage-request.ts:compute-file-key'
```

## Verify the Storage Request Exists

Before revoking, confirm that the storage request was successfully recorded on-chain by querying the runtime state:

Replace the placeholder `// **PLACEHOLDER FOR STEP 3: VERIFY STORAGE REQUEST EXISTS**` with the following code:

```ts title="index.ts // **PLACEHOLDER FOR STEP 3: VERIFY STORAGE REQUEST EXISTS**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/revoke-storage-request.ts:verify-request-exists'
```

At this point, the output should confirm the storage request exists on-chain:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/output-01.html'

## Add the Revoke Storage Request Helper

Create a `fileOperations.ts` file within your `operations` folder (or add to an existing one). This helper calls `walletClient.writeContract` with `functionName: 'revokeStorageRequest'`, passing the file key as the only argument:

```ts title="operations/fileOperations.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/fileOperations.ts:imports'

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/fileOperations.ts:revoke-storage-request'
```

## Revoke the Storage Request

Replace the placeholder `// **PLACEHOLDER FOR STEP 4: REVOKE THE STORAGE REQUEST**` with the following code:

```ts title="index.ts // **PLACEHOLDER FOR STEP 4: REVOKE THE STORAGE REQUEST**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/revoke-storage-request.ts:revoke-request'
```

If the revocation succeeds, you'll see the transaction hash and receipt:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/output-02.html'

## Verify the Revocation

Finally, confirm that the storage request no longer exists on-chain by querying the runtime state again:

Replace the placeholder `// **PLACEHOLDER FOR STEP 5: VERIFY REVOCATION**` with the following code:

```ts title="index.ts // **PLACEHOLDER FOR STEP 5: VERIFY REVOCATION**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/revoke-storage-request.ts:verify-revoked'
```

If the revocation was successful, the output should confirm the request was removed:

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/output-03.html'

??? code "View complete `fileOperations.ts`"

    ```ts title="operations/fileOperations.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/fileOperations.ts'
    ```

??? code "View complete `index.ts`"

    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/revoke-storage-request/revoke-storage-request.ts'
    ```

## Next Steps

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/upload-a-file/" markdown>:material-arrow-right:

    **Upload a File**

    Once your storage request is confirmed, use the StorageHub SDK to upload a file to the network.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/manage-files-and-buckets/" markdown>:material-arrow-right:

    **Manage Files and Buckets**

    Learn how to get file info, request file removal from the network, and how to delete buckets.

    </a>

</div>

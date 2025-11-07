---
title: Known Issues
description: This page lists the major known issues affecting the DataHaven StorageHub SDK. It’s updated regularly as issues are identified or resolved.
---

# Known Issues

This page lists the major known issues affecting the DataHaven StorageHub SDK (as of version v0.3.1). It’s updated regularly as issues are identified or resolved.

If you encounter a problem not listed here, please join the [DataHaven Discord](https://discord.com/invite/datahaven){target=\_blank} and use the Support Ticket chat to report it. This will create a private channel where our support team can respond directly.

## Bucket Sharing Not Yet Supported

Bucket sharing is not yet permitted. For now, only the bucket owner can access a bucket, regardless of whether it’s set to `Public` or `Private`. A future release will enable true public access for public buckets and allow private buckets to be shared with permitted users beyond the owner.

## BSPs Unable to Accept Files for Replication

While uploads to Main Storage Providers (MSPs) happen successfully, Backup Storage Providers (BSPs) are not accepting new requests right now, so network-level replication doesn’t complete. This can cause file storage requests to transition from `upload successful` to `expired`. Although the requests show as `expired`, the files are still successfully uploaded to the MSP. Still, they are not considered to be in their final state of being secured by the network, given that BSP replication is unavailable.

## Get Profile Method Returns Hardcoded Placeholder

The `auth.getProfile()` client method returns the correct address but a hardcoded placeholder of `user.eth` in the `ens` field.

```json
{
    ...
    ens: 'user.eth'
}
```

## File Deletion Not Supported on Devnet

File deletion is not yet supported when running a local DataHaven development network. As a workaround, you can shut down the network and spin it back up again, which will result in the network state being reset, including deletion of all buckets and files. 

## Get Info Method Returns Hardcoded Placeholder Values

When querying the `getInfo()` method, you'll see the following hardcoded placeholder values that do not reflect the uptime statistics.

```json
{
  ....
  activeSince: 123,
  uptime: '2 days, 1 hour'
}
```

## GetBucket Method Returns Hardcoded Placeholder Values

When querying for information about a bucket with the method `getBucket(bucketId)`, you'll see the following hardcoded placeholder values that do not reflect the actual file count or file size in bytes.

```json 
{
  ....
  sizeBytes: 0,
  valuePropId: 'unknown',
  fileCount: 0  
}
```

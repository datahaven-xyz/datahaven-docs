---
title: Known Issues
description: This page lists the major known issues affecting the DataHaven StorageHub SDK. It’s updated regularly as issues are identified or resolved.
categories: Store Data, StorageHub SDK, Troubleshooting
---

# Known Issues

This page lists the major known issues affecting the DataHaven StorageHub SDK (as of version v0.3.1). It’s updated regularly as issues are identified or resolved.

If you encounter a problem not listed here, please join the [DataHaven Discord](https://discord.com/invite/datahaven){target=\_blank} and use the Support Ticket chat to report it. This will create a private channel where our support team can respond directly.

## Private Bucket Sharing Not Yet Supported

Private buckets are available; however, sharing private bucket access with someone other than the bucket owner is not supported. A future release will enable private buckets to be shared with permitted users beyond the owner.

## Get Profile Method Returns Hardcoded Placeholder

The `auth.getProfile()` client method returns the correct address but a hardcoded placeholder of `user.eth` in the `ens` field.

```json
{
    ...
    ens: 'user.eth'
}
```

## Get Info Method Returns Hardcoded Placeholder Values

When querying the `getInfo()` method, you'll see the following hardcoded placeholder values that do not reflect the uptime statistics.

```json
{
    ...
    activeSince: 123,
    uptime: '2 days, 1 hour'
}
```

## Get Bucket Method Returns Hardcoded Placeholder Values

When querying for information about a bucket with the method `getBucket(bucketId)`, you'll see the following hardcoded placeholder values that do not reflect the actual file count or file size in bytes.

```json 
{
    ...
    sizeBytes: 0,
    valuePropId: 'unknown',
    fileCount: 0  
}
```
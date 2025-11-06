---
title: Known Issues
description: Current known issues with authentication refresh and BSP replication.
---

# Known Issues

This page lists major known issues with the DataHaven SDK. 

## Bucket Sharing Not Yet Supported

Bucket sharing is not yet permitted. For now, only the bucket owner can access a bucket, regardless of whether it’s set to Public or Private. A future release will enable true public access for public buckets and allow private buckets to be shared with permitted users beyond the owner.

## BSPs are currently unable to accept files for replication

While uploads to Main Storage Providers (MSPs) happen successfully, Backup Storage Providers (BSPs) are not accepting new requests right now, so network‑level replication doesn’t complete. This can cause file storage requests to transition from `upload successful` to `expired`. Although the requests show as `expired`, the files are still successfully uploaded to the MSP, but are not considered to be in their final state of being secured by the network, given that BSP replication is unavailable.

## `GetProfile` method returns hardcoded placeholder information

The `auth.getProfile()` client method returns a hardcoded placeholder of `user.eth`. In a future release it will be updated to return the authenticated user’s profile in the form `({ address: string; ens: string })`

## Other Issues

If you experience an issue unrelated to the above items and you would like to flag it with the team, please join the [DataHaven Discord](https://discord.com/invite/datahaven){target=_blank} and use the Support Ticket chat. This will create a private channel to ensure your ticket is answered promptly by our support team.
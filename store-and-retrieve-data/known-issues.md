---
title: Known Issues
description: Current known issues with authentication refresh and BSP replication.
---

# Known Issues

This page lists major known issues with the DataHaven SDK. 

## SIWE Authentication Timeouts

After initial authentication via [SIWE (Sign In With Ethereum)](https://docs.login.xyz/){target=_blank}, subsequent re-authentication attempts may fail with the error `Invalid or expired nonce`. This issue may reoccur intermittently.

## BSPs are currently unable to accept files for replication

While uploads to Main Storage Providers (MSPs) happen successfully, Backup Storage Providers (BSPs) are not accepting new requests right now, so network‑level replication doesn’t complete. This can cause file storage requests to transition from `upload successful` to `expired`. Although the requests show as `expired`, the files are still successfully uploaded to the MSP, but are not considered to be in their final state of being secured by the network, given that BSP replication is unavailable.

What works: 

- You can upload to an MSP.
- You can retrieve files from the MSP.

Current limitations:

- Files are not yet replicated across the network.
- Deleting uploaded files is temporarily unavailable.

Tips:

- Avoid uploading anything sensitive or that you may need to delete soon.
- Retrieve files [directly from your MSP](/store-and-retrieve-data/use-storagehub-sdk/retrieve-your-data/).

## Other Issues

If you experience an issue unrelated to the above items and you would like to flag it with the team, please join the [DataHaven Discord](https://discord.com/invite/datahaven){target=_blank} and use the Support Ticket chat. This will create a private channel to ensure your ticket is answered promptly by our support team.
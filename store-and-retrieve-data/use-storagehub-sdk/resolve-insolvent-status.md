---
title: Resolve Insolvent Status
description: This guide shows you how to ...
---

# Resolve Insolvent Status

This guide shows how to ....

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

##

- check if insolvent
- if yes 
- - auth
- - get payment streams
***mspService.ts - getPaymentStreams method - import from track costs guide
- - extract providerIds
- - pay outstanding debt
- - clear insolv flag
- - wait for cooldown to pass
***user without funds cooldown - 100 blocks - after clear_insolvent_flag has been triggered.





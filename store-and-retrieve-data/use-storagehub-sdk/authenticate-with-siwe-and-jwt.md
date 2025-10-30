---
title: Authenticate with SIWE and JWT
description: Guide on how to use Sign-In with Ethereum and JWT tokens for secure authentication via the StorageHub SDK.
---

# Authenticate with SIWE and JWT

## Introduction

This guide shows how to sign in to a StorageHub Main Storage Provider (MSP) using Sign-In with Ethereum (SIWE, EIP-4361) and maintain a session with short-lived JSON Web Tokens (JWTs). The MSP verifies a wallet-signed challenge, issues a JWT for subsequent requests, and resolves an ENS profile where available. The StorageHub SDK wraps this flow so you can check auth status, complete login, and fetch the authenticated profile with a few calls.

## Prerequisites

- [Create a Bucket Guide](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket)

## Authenticate Your Address via MSP

To check your address's authentication status and to authenticate your address using the MSP Client, add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/authenticate-your-address.ts'
```

!!! note
    `auth.status` can equal "Authenticated", "NotAuthenticated", or "TokenExpired"

## Get Profile Info from MSP

After authentication, to get authenticated profile info from an MSP, add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/get-authenticated-profile-info.ts'
```

The response should return a response like this:

```shell
Authenticated user profile: {
  address: '0x00DA35D84a73db75462D2B2c1ed8974aAA57223e',
  ens: 'user.eth'
}
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
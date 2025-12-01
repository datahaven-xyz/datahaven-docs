---
title: Authenticate with SIWE and JWT
description: This guide shows you how to use Sign-In with Ethereum (SIWE) and JSON Web Tokens (JWT) for secure authentication via the StorageHub SDK.
---

# Authenticate with SIWE and JWT

This guide shows how to sign in to a StorageHub Main Storage Provider (MSP) using Sign-In with Ethereum (SIWE, [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361){target=\_blank}) and maintain a session with short-lived JSON Web Tokens (JWTs). The MSP verifies a wallet-signed challenge, issues a JWT for subsequent requests, and resolves an ENS profile where available. The StorageHub SDK wraps this flow so you can check auth status, complete login, and fetch the authenticated profile with a few calls.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

## Set Up Auth Script

Create an `index.ts` file, if you haven't already. Its `run` method will orchestrate all the logic in this guide. By now, your services folder (including the MSP and client helper services) should already be created. If not, see the [Get Started Guide](/store-and-retrieve-data/use-storagehub-sdk/get-started).

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/authenticate.ts'
```

As you can see, the `authenticateUser` helper method is being called from your `mspService.ts` file. This is the method responsible for checking your address's authentication status and authenticating your address via the MSP Client. 

Within the `authenticateUser` method, the SDK's `mspClient.auth.SIWE` method is triggered, which produces a JWT token that serves as proof of authentication. Within `mspService.ts`, this token is passed into the `sessionProvider` const that is one of the two required params for the `MspClient.connect` method. When you connect to an MSP while `sessionProvider` contains a valid JWT token, you are allowed to trigger certain MSP methods you otherwise wouldn't be able to (such as `MspClient.auth.getProfile`, `MspClient.files.uploadFile`, `MspClient.info.getPaymentStreams`).

## Run Auth Script

```bash
ts-node index.ts
```

After the address has been authenticated, the `authenticateUser` method that triggers `MspClient.auth.getProfile` upon successful execution, should return a response like this:

!!! note
    The ENS name is hardcoded currently.

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/output-01.html'

## Next Steps

<div class="grid cards" markdown>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **Build a Data Workflow End-to-End**

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    </a>

-  <a href="/how-it-works/data-and-provider-model/data-flow-and-lifecycle/" markdown>:material-arrow-right: 
    
    **Data Flow and Lifecycle**

    Read this end-to-end overview to learn how data moves through the DataHaven network.

    </a>

</div>

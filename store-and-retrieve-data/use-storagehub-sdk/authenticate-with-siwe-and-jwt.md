---
title: Authenticate with SIWE and JWT
description: This guide shows you how to use Sign-In with Ethereum (SIWE) and JSON Web Tokens (JWT) for secure authentication via the StorageHub SDK.
categories: Store Data, StorageHub SDK
---

# Authenticate with SIWE and JWT

This guide shows how to sign in to a StorageHub Main Storage Provider (MSP) using Sign-In with Ethereum (SIWE, [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361){target=\_blank}) and maintain a session with short-lived JSON Web Tokens (JWTs). The MSP verifies a wallet-signed challenge, issues a JWT for subsequent requests, and resolves an ENS profile where available. The StorageHub SDK wraps this flow so you can check auth status, complete login, and fetch the authenticated profile with a few calls.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

## Set Up Auth Script

Create an `index.ts` file if you haven't already. Its `run` method will orchestrate all the logic in this guide. By now, your services folder (including the MSP and client helper services) should already be created, which means you should already have the `authenticateUser` helper method implemented. If not, see the [Get Started](/store-and-retrieve-data/use-storagehub-sdk/get-started/) guide.

Add the following code to your `index.ts` file:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/authenticate.ts'
```

In this code, the `authenticateUser` helper method from `mspService.ts` is called. This method:

- Checks and authenticates your address via the MSP Client.
- Calls the SDK's `mspClient.auth.SIWE` method, which produces a JWT token used as proof of authentication.
- Passes the JWT token to the `sessionProvider` constant, one of the two required parameters for `MspClient.connect`.

??? interface "Take a look at the `authenticateUser` helper method code."

    ```ts title="mspService.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/msp-service.ts:auth-user'
    ```

When you connect to the MSP with a valid `sessionProvider`, you can trigger certain methods you wouldn’t otherwise be able to:

- **`MspClient.auth.getProfile`**: Returns the authenticated user's profile.
- **`MspClient.files.uploadFile`**: Uploads a file to the MSP.
- **`MspClient.info.getPaymentStreams`**: Returns the authenticated user's payment streams.

## Run Auth Script

Execute the `authenticateUser` method by running the script:

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

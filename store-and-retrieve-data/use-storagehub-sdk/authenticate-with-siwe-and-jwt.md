---
title: Authenticate with SIWE and JWT
description: This guide shows you how to use Sign-In with Ethereum (SIWE) and JSON Web Tokens (JWT) for secure authentication via the StorageHub SDK.
---

# Authenticate with SIWE and JWT

This guide shows how to sign in to a StorageHub Main Storage Provider (MSP) using Sign-In with Ethereum (SIWE, [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361){target=\_blank}) and maintain a session with short-lived JSON Web Tokens (JWTs). The MSP verifies a wallet-signed challenge, issues a JWT for subsequent requests, and resolves an ENS profile where available. The StorageHub SDK wraps this flow so you can check auth status, complete login, and fetch the authenticated profile with a few calls.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

## Initialize the Script Entry Point

First, create an `index.ts` file and add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/authenticate.ts:imports'

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();
  
  // --- Authenticate logic ---
  // **PLACEHOLDER : ADD AUTH HELPER METHOD**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Authenticate Your Address via MSP

As mentioned in the Prerequisites section, you should already have the `authenticateUser` helper method in your `mspService.ts` file. To check your address's authentication status via this method and to authenticate your address using the MSP Client, add the following code:

```ts title="index.ts // **PLACEHOLDER: ADD AUTH HELPER METHOD**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/authenticate.ts:authenticate'
```

Run the script:

```bash
ts-node index.ts
```

The SIWE session response should return a response like this:

!!! note
    The ENS name is hardcoded currently.

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/output-01.html'

Also, after the address has been authenticated, fetching profile info should return a response like this:

!!! note
    The ENS name is hardcoded currently.

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/output-02.html'

??? code "View complete script"
    ```ts title="index.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/authenticate.ts'
    ```

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

---
title: Authenticate with SIWE and JWT
description: This guide shows you how to use Sign-In with Ethereum (SIWE) and JSON Web Tokens (JWT) for secure authentication via the StorageHub SDK.
---

# Authenticate with SIWE and JWT

This guide shows how to sign in to a StorageHub Main Storage Provider (MSP) using Sign-In with Ethereum (SIWE, [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361){target=\_blank}) and maintain a session with short-lived JSON Web Tokens (JWTs). The MSP verifies a wallet-signed challenge, issues a JWT for subsequent requests, and resolves an ENS profile where available. The StorageHub SDK wraps this flow so you can check auth status, complete login, and fetch the authenticated profile with a few calls.

## Prerequisites

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/prerequisites.md'

## Dependencies

=== "pnpm"

    ```bash { .break-spaces }
    pnpm add @storagehub-sdk/core @storagehub-sdk/msp-client @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
    ```

=== "yarn"

    ```bash { .break-spaces }
    yarn add @storagehub-sdk/core @storagehub-sdk/msp-client @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
    ```

=== "npm"

    ```bash { .break-spaces }
    npm install @storagehub-sdk/core @storagehub-sdk/msp-client @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
    ```

## Initialize Clients

First, you'll need to set up the necessary clients to connect to the DataHaven network, which runs on a dual-protocol architecture (Substrate for core logic and EVM for compatibility).

If you've already followed the [Create a Bucket](/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/){target=\_blank} guide, your clients may already be initialized. Review the placeholders at the bottom of the following snippet to see where you'll add logic in this guide, then skip ahead to [Authenticate Your Address via MSP](#authenticate-your-address-via-msp).

Create an `index.ts` and add the following code:

```ts title="index.ts"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/authenticate.ts:imports'

async function run() {
  --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/authenticate.ts:initialize-clients'

  // --- Issue storage request logic ---
  // **PLACEHOLDER FOR STEP 1: AUTHENTICATE YOUR ADDRESS VIA MSP**
  // **PLACEHOLDER FOR STEP 2: GET PROFILE INFO FROM MSP**

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();
```

## Authenticate Your Address via MSP

To check your address's authentication status and to authenticate your address using the MSP Client, add the following code:

```ts title="// **PLACEHOLDER FOR STEP 1: AUTHENTICATE YOUR ADDRESS VIA MSP**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/authenticate.ts:authenticate-via-msp'
```

Run the script:

```bash
ts-node index.ts
```

The SIWE session response should return a response like this:

!!! note
    The ENS name is hardcoded currently.

--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/output-01.html'


## Get Profile Info from MSP

After authentication, to get the authenticated profile info from an MSP, add the following code:

```ts title="// **PLACEHOLDER FOR STEP 2: GET PROFILE INFO FROM MSP**"
--8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/authenticate-with-siwe-and-jwt/authenticate.ts:retrieve-user-profile'
```

Run the script:

```bash
ts-node index.ts
```

The response should return a response like this:

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

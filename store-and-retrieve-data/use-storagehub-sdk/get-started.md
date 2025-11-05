---
title: Get Started with the StorageHub SDK
description: Set up your development environment, install the StorageHub SDK, and prepare your project to start interacting with the DataHaven network.
---

# Get Started with the StorageHub SDK

The StorageHub SDK is a modular toolkit that makes it easy to build on DataHaven, giving developers direct access to functionalities for managing storage, buckets, and proofs. It simplifies both on-chain and off-chain interactions so you can focus on your application logic rather than low-level integrations.

This guide introduces and compares the functionalities of the StorageHub SDK packages. You'll also find prerequisites for using DataHaven and [StorageHub SDK installation instructions](#install-the-storagehub-sdk).

## StorageHub SDK Packages

The StorageHub SDK contains the following packages:

| <div style="width: 220px;">Package</div>                                                                     | Description                                                                  | When to Use                | Environments      |
|:-------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------|:---------------------------|:------------------|
| **[`@storagehub-sdk/core`](https://www.npmjs.com/package/@storagehub-sdk/core){target=\_blank}**             | Foundational, backend-agnostic building blocks for StorageHub.               | Chain-facing interactions  | Node.js, Browsers |
| **[`@storagehub-sdk/msp-client`](https://www.npmjs.com/package/@storagehub-sdk/msp-client){target=\_blank}** | High-level client for interacting with Main Storage Provider (MSP) services. | Provider-facing operations | Node.js, Browsers |

??? interface "`@storagehub-sdk/core`"

    The primary functions of [`@storagehub-sdk/core`](https://www.npmjs.com/package/@storagehub-sdk/core){target=\_blank} are to act as backend-agnostic building blocks including: 
    
    - Wallets and signing.
    - [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193){target=\_blank}.
    - Precompile helpers for bridging between Substrate and EVM.
    - Merkle and WASM utilities.
    - Low-level HTTP.
    - Types and constants shared across the SDK.

    This package includes EVM account-typed helpers, WASM-backed file utilities, and stable primitives usable without any backend.

??? interface "`@storagehub-sdk/msp-client`"

    The primary functions of [`@storagehub-sdk/msp-client`](https://www.npmjs.com/package/@storagehub-sdk/msp-client){target=\_blank} are as follows:

    - Retrieve MSP-specific client information, such as:
        - Health
        - Authorization nonce/verify
        - Upload and download endpoints
    - Talk to an MSP backend for authorization and file transfer.
    - Includes REST contracts for MSP, token handling, and streaming or multipart upload and download helpers.

    This package includes all MSP-tied logic.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js ≥ 22](https://nodejs.org/en/download){target=\_blank} installed. LTS version recommended.
- [pnpm](https://pnpm.io/){target=\_blank}, [npm](https://www.npmjs.com/){target=\_blank}, or [yarn](https://yarnpkg.com/){target=\_blank} installed for package management
- [Network configuration details](/store-and-retrieve-data/quick-start/#network-configurations){target=\_blank}, including the RPC and WSS endpoints
- [MSP base URL](/store-and-retrieve-data/quick-start/#msp-service-endpoints){target=\_blank}
- [TestNet tokens](TODO: link to the faucet){target=\_blank}

??? interface "Need a starter project?"
    --8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/get-started/starter-sdk-project-01.md'

## Install the StorageHub SDK

Add the core and MSP client packages to your project. These libraries provide the APIs and utilities needed to interact with DataHaven’s storage network.

=== "pnpm"
    
    ```bash
    pnpm add @storagehub-sdk/core @storagehub-sdk/msp-client
    ```

=== "yarn"
    
    ```bash
    yarn add @storagehub-sdk/core @storagehub-sdk/msp-client
    ```

=== "npm"
    
    ```bash
    npm install @storagehub-sdk/core @storagehub-sdk/msp-client
    ```

## Next Steps

Now that you have the StorageHub SDK packages installed, you are ready to start building with DataHaven. 

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/" markdown>:material-arrow-right: 

    **Create A Bucket**

    Follow this guide to create your first bucket, DataHaven's storage container for your files.

    </a>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **End-to-End Storage Workflow**

    This tutorial takes you step-by-step through storing a file on DataHaven and retrieving it from the network.

    </a>

</div>

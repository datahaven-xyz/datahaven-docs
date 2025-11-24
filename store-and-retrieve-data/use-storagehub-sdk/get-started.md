---
title: Get Started with the StorageHub SDK
description: Set up your development environment, install the StorageHub SDK, and prepare your project to start interacting with the DataHaven network.
---

# Get Started with the StorageHub SDK

The StorageHub SDK is a modular toolkit that makes it easy to build on DataHaven, giving developers direct access to functionalities for managing storage, buckets, and proofs. It simplifies both on-chain and off-chain interactions so you can focus on your application logic rather than low-level integrations.

This guide introduces and compares the functionalities of the StorageHub SDK packages. You'll also find prerequisites for using DataHaven and instructions for how to [install the StorageHub SDK](#install-the-storagehub-sdk), along with instructions on [how to set up all of the necessary StorageHub SDK clients](#initialize-the-storagehub-sdk) you will need to have set up in order to use the StorageHub SDK's features and the following guides.

## Workflow Overview

A high-level look at how data moves through DataHaven, from storage requests to upload, verification, and retrieval.

[timeline.left(datahaven-docs/.snippets/text/store-and-retrieve-data/overview/timeline-02.json)]


## StorageHub SDK Packages

The StorageHub SDK contains the following packages:

| <div style="width: 220px;">Package</div>                                                                     | Description                                                                  | When to Use                | Environments      |
|:-------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------|:---------------------------|:------------------|
| **[`@storagehub-sdk/core`](https://www.npmjs.com/package/@storagehub-sdk/core){target=\_blank}**             | Foundational, backend-agnostic building blocks for StorageHub.               | Chain-facing interactions  | Node.js, Browsers |
| **[`@storagehub-sdk/msp-client`](https://www.npmjs.com/package/@storagehub-sdk/msp-client){target=\_blank}** | High-level client for interacting with Main Storage Provider (MSP) services. | Provider-facing operations | Node.js, Browsers |

??? interface "`@storagehub-sdk/core`"

    The primary functions of [`@storagehub-sdk/core`](https://www.npmjs.com/package/@storagehub-sdk/core){target=\_blank} are to act as backend-agnostic building blocks including: 
    
    - Wallets and signing
    - [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193){target=\_blank}
    - Precompile helpers for bridging between Substrate and EVM
    - Merkle and WASM utilities
    - Low-level HTTP
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
- [Network configuration details](/store-and-retrieve-data/starter-kit/#network-configurations){target=\_blank}, including the RPC and WSS endpoints
- [MSP base URL](/store-and-retrieve-data/starter-kit/#msp-service-endpoints){target=\_blank}
- [Testnet tokens](https://apps.datahaven.xyz/faucet){target=\_blank}

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/create-typescript-project.md'

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

## Initialize the StorageHub SDK

Follow the steps in this section to set up the clients needed to work with the StorageHub SDK, allowing you to interact with DataHaven and manage your data.

### Install Client Dependencies

=== "pnpm"

    ```bash { .break-spaces }
    pnpm add @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
    ```

=== "yarn"

    ```bash { .break-spaces }
    yarn add @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
    ```

=== "npm"

    ```bash { .break-spaces }
    npm install @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
    ```

??? interface "Why do I need these dependencies?"

    - **[`@storagehub/types-bundle`](https://www.npmjs.com/package/@storagehub/types-bundle){target=_blank}:** Describes DataHaven's custom on-chain types.

    - **[`@polkadot/api`](https://www.npmjs.com/package/@polkadot/api){target=_blank}:** The core JavaScript library used to talk to any Substrate-based blockchain, which in our case is DataHaven.

    - **[`@storagehub/api-augment`](https://www.npmjs.com/package/@storagehub/api-augment){target=_blank}:** Extends `@polkadot/api` with DataHaven's custom pallets and RPC methods. You will import it in your `index.ts` file where your main script logic will be executed.

    - **[`viem`](https://www.npmjs.com/package/viem){target=_blank}:** Lightweight library for building Ethereum-compatible applications.

### Set Up Client Service

You'll need to set up the necessary clients to connect to the DataHaven network, which runs on a dual-protocol architecture (Substrate for core logic and EVM for compatibility).

1. In the folder where your `index.ts` (or main code file) is located, create a new folder called `services`:

    ```shell
    mkdir services && cd services
    ```

2. Create a `clientService.ts` file and add the following code:

    !!! note
        The code below uses DataHaven testnet configuration values, which include the chain ID RPC URL, WSS URL, MSP URL, and token metadata. If you’re running a local devnet, make sure to replace these with your local configuration parameters. You can find all the relevant local devnet values in the [Storage Starter Kit](/store-and-retrieve-data/starter-kit/).

    ```ts title="clientService.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/client-service.ts'
    ```

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/initialize-client-service-summary.md'

### Set Up MSP Service

To interact with DataHaven's Main Storage Provider (MSP) services, you need to establish a connection using the `MspClient` from the StorageHub SDK. This involves configuring the HTTP client, setting up session management for authenticated requests, and initializing the MSP client itself.


1. Create a `mspService.ts` file within your `services` folder and add the following code:

    !!! note
        The code below uses **DataHaven Testnet** configuration values, which include the **Chain ID**, **RPC URL**, **WSS URL**, **MSP URL**, and **token metadata**. If you’re running a **local devnet**, make sure to replace these with your local configuration parameters. You can find all the relevant **local devnet values** in the [Quick Start Guide](/store-and-retrieve-data/quick-start).

    ```ts title="mspService.ts"
    --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/msp-service.ts'
    ```

--8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/initialize-msp-service-summary.md'

## Next Steps

Now that you have the StorageHub SDK packages installed and all the necessary clients set up, you are ready to start building with DataHaven. 

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/create-a-bucket/" markdown>:material-arrow-right: 

    **Create A Bucket**

    Follow this guide to create your first bucket, DataHaven's storage container for your files. This is the perfect first step on your journey of building on DataHaven.

    </a>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **End-to-End Storage Workflow**

    This tutorial takes you step-by-step through storing a file on DataHaven and retrieving it from the network. Take this step to see how all the pieces fit together in one go.

    </a>

</div>

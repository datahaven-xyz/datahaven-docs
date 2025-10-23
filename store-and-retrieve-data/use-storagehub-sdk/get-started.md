---
title: Get Started
description: Get up and running quickly with the StorageHub SDK.
slug: /store-and-retrieve-data/use-storagehub-sdk/get-started
---

# Get Started with the StorageHub SDK

## Overview

The StorageHub SDK is a developer toolkit that makes it easy to build on DataHaven by providing direct access to StorageHub pallet functionalities for managing storage, buckets, and proofs.

The SDK is split into two packages for convenient separation of concerns: `@storagehub-sdk/core` and `@storagehub-sdk/msp-client`. Both packages run in both browser and Node.js environments. Here are the use cases for both of them:

@storagehub-sdk/core

- Backend‑agnostic building blocks (wallets, EIP‑1193, precompile helpers bridging Substrate↔EVM, Merkle/WASM utilities, HttpClient, shared types).
- Signing, Merkle/proofs, precompile calls, low‑level HTTP, shared types.
- This package includes EVM account‑typed helpers, WASM‑backed file utilities, and stable primitives **usable without any backend**.
- [Read more](https://www.npmjs.com/package/@storagehub-sdk/core){taget=_blank}

@storagehub-sdk/msp-client

- Retrieving MSP‑specific client information (health, auth nonce/verify, upload/download endpoints). All MSP‑tied logic lives here.
- Talking to an MSP backend (auth + file transfer).
- Includes REST contracts for MSP, token handling, streaming/multipart upload and download helpers.
- [Read more](https://www.npmjs.com/package/@storagehub-sdk/msp-client){target=_blank}

## MSP Service Endpoints

To interact with a Main Storage Provider (MSP) through `@storagehub-sdk/msp-client`, a service endpoint is required. You can use any of the following MSP base urls as an endpoint for storing and retrieving your files:
  - The MSP backend requires connection to a StorageHub blockchain node

Instead of building this out yourself you can just use any of the following MSP base urls for storing and retrieving your files:


 |      Network      |                                   Value                                   |
 |:-----------------:|:-------------------------------------------------------------------------:|
 | DataHaven Testnet | <pre>```https://deo-dh-backend.stagenet.datahaven-infra.network/```</pre> |
                    

## Prerequisites

System requirements

- Node.js ≥ 18 (recommended LTS version)
- pnpm, npm, or yarn for package management

Blockchain access

- Network endpoints (They can be found in the [Quickstart page](/store-and-retrieve-data/quick-start.md){target=_blank})
    - RPC URL
    - Web Socket URL 
- Test tokens (They can be found in the [Quickstart page](/store-and-retrieve-data/quick-start.md){target=_blank})
- [MSP base url](TODO)

### Installation

Within your desired project, install the SDK dependencies using the following commands:

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

---


<div class="grid cards" markdown>

-   __Create Your First Bucket__

    ---

    Buckets are logical containers for files. Learn how to create them using the StorageHub SDK.

    [:octicons-arrow-right-24: Create a Bucket](/store-and-retrieve-data/use-storagehub-sdk/get-started.md)

-   __Build a Data Workflow End-to-End__

    ---

    Learn step-by-step how to store a file on DataHaven and retrieve it back from the network.

    [:octicons-arrow-right-24: End-to-End Storage Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow.md)

</div>


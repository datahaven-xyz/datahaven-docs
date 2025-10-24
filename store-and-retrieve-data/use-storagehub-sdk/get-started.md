---
title: Get Started
description: Set up your development environment, install the StorageHub SDK, and prepare your project to start interacting with the DataHaven network.
slug: /store-and-retrieve-data/use-storagehub-sdk/get-started
---

# Get Started with the StorageHub SDK

## Overview

The StorageHub SDK is a developer toolkit that makes it easy to build on DataHaven by providing direct access to StorageHub pallet functionalities for managing storage, buckets, and proofs.

The SDK is split into two packages for convenient separation of concerns: `@storagehub-sdk/core` and `@storagehub-sdk/msp-client`. Both work in browsers and Node.js environments. You may not always need both at once, so it’s useful to understand the purpose and typical use cases of each. 

As a quick rule of thumb, use `@storagehub-sdk/core` for all chain-facing interactions (keys, precompiles, proofs), and `@storagehub-sdk/msp-client` for all provider-facing operations (MSP connection, MSP authentication, bucket management, file uploads and downloads).

The primary functions of [`@storagehub-sdk/core`](https://www.npmjs.com/package/@storagehub-sdk/core){target=_blank} are:

- Backend‑agnostic building blocks (wallets, EIP‑1193, precompile helpers bridging Substrate↔EVM, Merkle/WASM utilities, HttpClient, shared types).
- Signing, Merkle/proofs, precompile calls, low‑level HTTP, shared types.
- This package includes EVM account‑typed helpers, WASM‑backed file utilities, and stable primitives **usable without any backend**.

The primary functions of [`@storagehub-sdk/msp-client`](https://www.npmjs.com/package/@storagehub-sdk/msp-client){target=_blank} are:

- Retrieve MSP‑specific client information (health, auth nonce/verify, upload/download endpoints). All MSP‑tied logic lives here.
- Talk to an MSP backend (auth + file transfer).
- Includes REST contracts for MSP, token handling, streaming/multipart upload and download helpers.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js ≥ 22](https://nodejs.org/en/download){target=_blank} (recommended LTS version) installed  
- [pnpm](https://pnpm.io/){target=_blank}, [npm](https://www.npmjs.com/){target=_blank}, or [yarn](https://yarnpkg.com/){target=_blank} installed for package management
- [RPC endpoint URL](#configure-network)
- [Web Socket URL](#configure-network)
- [Test tokens](TODO: link to the faucet){target=_blank}
- [MSP base URL](#get-msp-url)

## Create a New Project Folder

To create a new project folder, execute the following command in the terminal:

```shell
mkdir datahaven-project && cd datahaven-project
```

## Initialize a package.json file

To initialize a package.json file, execute the following command in the terminal:

=== "pnpm"

    ```shell
    pnpm init
    ```

=== "yarn"

    ```shell
    yarn init
    ```

=== "npm"

    ```shell
    npm init --y
    ```

The output of that command should be something like this:

```text
Wrote to .../datahaven-project/package.json

{
  "name": "datahaven-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.17.0"
}
```

## Add TypeScript and Node type definitions

To add the TypeScript and Node type definitions to your projects, execute the following command in the terminal:

=== "pnpm"
    ```bash
    pnpm add -D typescript ts-node @types/node
    ```
=== "yarn"
    ```bash
    yarn add -D typescript ts-node @types/node
    ```
=== "npm"
    ```bash
    npm install -D typescript ts-node @types/node
    ```

If the installation is successful, your terminal should print something similar to:

```text
Packages: +20
++++++++++++++++++++
Progress: resolved 20, reused 20, downloaded 0, added 20, done

devDependencies:
+ @types/node 24.9.1
+ ts-node 10.9.2
+ typescript 5.9.3
```

## Create a TypeScript config

Create a `tsconfig.json` file in the root of your project and paste the following configuration:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "nodenext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts"]
}
```

## Initialize the src Directory

To initialize the src directory, execute the following command in the root of your project:

```shell
mkdir src && touch src/index.ts
```

## Add the StorageHub SDK to Your Project

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

```text
Packages: +50
++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 70, reused 70, downloaded 0, added 50, done

dependencies:
+ @storagehub-sdk/core 0.2.0
+ @storagehub-sdk/msp-client 0.2.0
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


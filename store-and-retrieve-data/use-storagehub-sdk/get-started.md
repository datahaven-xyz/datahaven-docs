---
title: Get Started with the StorageHub SDK
description: Set up your development environment, install the StorageHub SDK, and prepare your project to start interacting with the DataHaven network.
---

# Get Started with the StorageHub SDK

The StorageHub SDK is a modular toolkit that makes it easy to build on DataHaven, giving developers direct access to functionalities for managing storage, buckets, and proofs. It simplifies both on-chain and off-chain interactions so you can focus on your application logic rather than low-level integrations.

This guide introduces the basic structure of the StorageHub SDK packages and walks you through the complete setup process—from initializing a project and installing dependencies to configuring TypeScript and using the SDK to interact with the network.

## StorageHub SDK Packages

The StorageHub SDK contains the following packages:

| <div style="width: 220px;">Package</div>                                                                     | Description                                                                  | When to Use                | Environments      |
|:-------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------|:---------------------------|:------------------|
| **[`@storagehub-sdk/core`](https://www.npmjs.com/package/@storagehub-sdk/core){target=\_blank}**             | Foundational, backend-agnostic building blocks for StorageHub.               | Chain-facing interactions  | Node.js, Browsers |
| **[`@storagehub-sdk/msp-client`](https://www.npmjs.com/package/@storagehub-sdk/msp-client){target=\_blank}** | High-level client for interacting with Main Storage Provider (MSP) services. | Provider-facing operations | Node.js, Browsers |

??? interface "`@storagehub-sdk/core`"

    The primary functions of [`@storagehub-sdk/core`](https://www.npmjs.com/package/@storagehub-sdk/core){target=\_blank} are:

    - Backend‑agnostic building blocks (wallets, EIP‑1193, precompile helpers bridging Substrate↔EVM, Merkle/WASM utilities, HttpClient, shared types).
    - Signing, Merkle/proofs, precompile calls, low‑level HTTP, shared types.
    - This package includes EVM account‑typed helpers, WASM‑backed file utilities, and stable primitives **usable without any backend**.

??? interface "`@storagehub-sdk/msp-client`"

    The primary functions of [`@storagehub-sdk/msp-client`](https://www.npmjs.com/package/@storagehub-sdk/msp-client){target=\_blank} are:

    - Retrieve MSP‑specific client information (health, auth nonce/verify, upload/download endpoints). All MSP‑tied logic lives here.
    - Talk to an MSP backend (auth + file transfer).
    - Includes REST contracts for MSP, token handling, streaming/multipart upload and download helpers.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js ≥ 22](https://nodejs.org/en/download){target=\_blank} (recommended LTS version) installed
- [pnpm](https://pnpm.io/){target=\_blank}, [npm](https://www.npmjs.com/){target=\_blank}, or [yarn](https://yarnpkg.com/){target=\_blank} installed for package management
- [Network configuration details](/store-and-retrieve-data/quick-start/#network-configurations){target=\_blank}, including the RPC and WSS endpoints
- [MSP base URL](/store-and-retrieve-data/quick-start/#msp-service-endpoints){target=\_blank}
- [Test tokens](TODO: link to the faucet){target=\_blank}

## Set Up a TypeScript Project

1.  Create a new project folder by executing the following command in the terminal:

    ```shell
    mkdir datahaven-project && cd datahaven-project
    ```

2. Initialize a `package.json` file:

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

    <div class="termynal" data-termynal>
        <span data-ty>Wrote to .../datahaven-project/package.json</span>
        <span data-ty><pre>
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
        </pre></span>
    </div>

3. Add the TypeScript and Node type definitions to your projects:

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

4. Create a `tsconfig.json` file in the root of your project and paste the following configuration:

    ```json title="tsconfig.json"
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

5. Initialize the `src` directory:

    ```shell
    mkdir src && touch src/index.ts
    ```

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

<div class="grid cards" markdown>

- **Create Your First Bucket**

    ---

    Buckets are logical containers for files. Learn how to create them using the StorageHub SDK.

    [:octicons-arrow-right-24: Create a Bucket](/store-and-retrieve-data/use-storagehub-sdk/get-started/)

- **Build a Data Workflow End-to-End**

    ---

    Learn step-by-step how to store a file on DataHaven and retrieve it back from the network.

    [:octicons-arrow-right-24: End-to-End Storage Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/)

</div>

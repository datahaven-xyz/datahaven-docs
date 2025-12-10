---
title: Local Devnet Starter Kit
description: Configuration details, pre-funded accounts, and MSP endpoints that help you set up your environment and start developing on the DataHaven local devnet.
---

# Local Devnet Starter Kit

DataHaven is a fully EVM-compatible decentralized storage and computation platform built as a Substrate-based Layer 1 blockchain. Developers can interact with DataHaven using Ethereum RPCs, popular wallets, and libraries such as MetaMask or viem, while also accessing Substrate APIs for additional features.

The following sections provide essential information for configuring your local development tools to work with the DataHaven devnet. You’ll also find details on pre-funded accounts and MSP endpoints for testing your integrations.

|        Network         | Network Type | Native Asset Symbol | Native Asset Decimals |
|:----------------------:|:------------:|:-------------------:|:---------------------:|
| DataHaven Local Devnet | Local Devnet |         SH          |          18           |

## Network Configuration

To interact with the network, use the following information to configure DataHaven's local devnet within the developer tools you are using:

|    Variable     |                    Value                    |
|:---------------:|:-------------------------------------------:|
|    Chain ID     | <pre>`{{ networks.devnet.chain_id }}`</pre> |
| Public RPC URLs | <pre>`{{ networks.devnet.rpc_url }}`</pre>  |
| Public WSS URLs | <pre>`{{ networks.devnet.wss_url }}`</pre>  |

## Block Explorers

The local devnet does not include hosted explorers. Use tools such as:

- `hardhat` local chain inspection  
- [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2F127.0.0.1%3A9666#/explorer){target=\_blank} (local Substrate RPC)  

## Pre-Funded Devnet Accounts

The local devnet ships with multiple **pre-funded test accounts**, which reset every time the devnet restarts. These can be imported into MetaMask or used in scripts.

| Account Name  | EVM Address                                             | Private Key                                                                     |
|:-------------:|:--------------------------------------------------------|:--------------------------------------------------------------------------------|
|   **Alith**   | <pre>`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`</pre> | <pre>`0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133`</pre> |
| **Baltathar** | <pre>`0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0`</pre> | <pre>`0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b`</pre> |
| **Charleth**  | <pre>`0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc`</pre> | <pre>`0x0b6e18cafb6ed99687ec547bd28139cafdd2bffe70e6b688025de6b445aa5c5b`</pre> |
|  **Dorothy**  | <pre>`0x773539d4Ac0e786233D90A233654ccEE26a613D9`</pre> | <pre>`0x39539ab1876910bbf3a223d84a29e28f1cb4e2e456503e7e91ed39b2e7223d68`</pre> |
|   **Ethan**   | <pre>`0xFf64d3F6efE2317EE2807d223a0Bdc4c0c49dfDB`</pre> | <pre>`0x7dce9bc8babb68fec1409be38c8e1a52650206a7ed90ff956ae8a6d15eeaaef4`</pre> |
|   **Faith**   | <pre>`0xC0F0f4ab324C46e55D02D0033343B4Be8A55532d`</pre> | <pre>`0xb9d2ea9a615f3165812e8d44de0d24da9bbd164b65c4f0573e1ce2c8dbd9c8df`</pre> |
|  **Goliath**  | <pre>`0x7BF369283338E12C90514468aa3868A551AB2929`</pre> | <pre>`0x96b8a38e12e1a31dee1eab2fffdf9d9990045f5b37e44d8cc27766ef294acf18`</pre> |

!!! note
    These keys are for **local development only** and should **never be used on public networks**. Every time you start the local devnet, all balances and states are reset.

## MSP Service Endpoint (Local Devnet)

Use the following base URL when interacting with an MSP through the StorageHub SDK:

|        Network         |                  Endpoint                   |
|:----------------------:|:-------------------------------------------:|
| DataHaven Local Devnet | <pre>`{{ networks.devnet.msp_url }}`</pre>  |

## Next Steps

<div class="grid cards" markdown>

-  <a href="/store-and-retrieve-data/use-storagehub-sdk/get-started/" markdown>:material-arrow-right: 
    
    **Get Started with the StorageHub SDK**

    Set up a project and install the StorageHub SDK to start storing and retrieving data.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **End-to-End Storage Workflow**

    Learn step-by-step how to store a file on DataHaven and retrieve it from the network.

    </a>

</div>

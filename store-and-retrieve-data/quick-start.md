---
title: DataHaven Quick Start Guide
description: Everything you need to start building on DataHaven, including network configs, block explorers, faucets, and MSP endpoints for working with the StorageHub SDK.
---

# DataHaven Quick Start Guide

DataHaven is a fully EVM-compatible decentralized storage and computation platform built as a sovereign Substrate-based Layer 1 chain. It combines Ethereum-style accounts and tooling with Substrate’s modular runtime to provide seamless interaction between on-chain smart contracts and off-chain data storage. Developers can interact with DataHaven using familiar Ethereum RPCs, wallets, and libraries such as MetaMask or viem, while also accessing Substrate APIs for advanced features like governance or custom runtime calls.

By integrating with EigenLayer, DataHaven operates as an Autonomous Verifiable Service (AVS) secured by Ethereum restakers, inheriting Ethereum's security without relying on its own validator bootstrap. This unified design enables decentralized applications to coordinate computation and storage through a single network that links smart contract logic with verifiable, persistent data maintained by storage providers.

## DataHaven Networks

To start building on DataHaven, check out the list of currently available DataHaven networks:

|        Network         | Network Type | Native Asset Symbol | Native Asset Decimals |
|:----------------------:|:------------:|:-------------------:|:---------------------:|
|   DataHaven Testnet    |   Testnet    |        MOCK         |          18           |
| DataHaven Local Devnet | Local Devnet |         SH          |          18           |


### Network Configurations

To interact with the network, use the following information to configure DataHaven within the developer tools you are using:

=== "DataHaven Testnet"

    |    Variable     |                    Value                     |
    |:---------------:|:--------------------------------------------:|
    |    Chain ID     | <pre>`{{ networks.testnet.chain_id }}`</pre> |
    | Public RPC URLs | <pre>`{{ networks.testnet.rpc_url }}`</pre>  |
    | Public WSS URLs | <pre>`{{ networks.testnet.wss_url }}`</pre>  |

=== "DataHaven Local Devnet"

    |    Variable     |                    Value                    |
    |:---------------:|:-------------------------------------------:|
    |    Chain ID     | <pre>`{{ networks.devnet.chain_id }}`</pre> |
    | Public RPC URLs | <pre>`{{ networks.devnet.rpc_url }}`</pre>  |
    | Public WSS URLs | <pre>`{{ networks.devnet.wss_url }}`</pre>  |


### Block Explorers

DataHaven provides dedicated explorers for both its EVM and Substrate layers:

|                                 Explorer                                  |   Layer   |
|:-------------------------------------------------------------------------:|:---------:|
| [Basic Explorer](https://datahaven-explorer.netlify.app/){target=\_blank} | Ethereum  |
|                                Coming soon                                | Substrate |

## Funding Testnet Accounts

To begin building on a DataHaven test network, you'll need to obtain MOCK tokens to cover transaction fees and interact with the network. These tokens are distributed freely for testing and development purposes only.

|      Testnet      |                           Where To Get Tokens From                           | Amount Dispensed                                                                 |
|:-----------------:|:----------------------------------------------------------------------------:|----------------------------------------------------------------------------------|
| DataHaven Testnet | [Official Testnet Faucet](https://apps.datahaven.xyz/faucet){target=\_blank} | The faucet dispenses {{ networks.testnet.website_faucet_amount }} every 12 hours |

!!! note
    Testnet MOCK tokens do not have any market value. Please do not spam the faucet with unnecessary requests.

## Pre-Funded Local Devnet Accounts

Your local DataHaven devnet automatically includes several **pre-funded test accounts**. These accounts can be imported into MetaMask or used directly in your scripts to sign transactions, issue storage requests, and deploy contracts. Each account starts with a large test balance and is reset every time you restart the devnet.

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

## MSP Service Endpoints

To interact with a Main Storage Provider (MSP) through `@storagehub-sdk/msp-client`, a service endpoint is required. You can use any of the following MSP base URLs as an endpoint for storing and retrieving your files:

|        Network         |                  Endpoint                   |
|:----------------------:|:-------------------------------------------:|
|   DataHaven Testnet    | <pre>`{{ networks.testnet.msp_url }}`</pre> |
| DataHaven Local Devnet | <pre>`{{ networks.devnet.msp_url }}`</pre>  |

## Next Steps

<div class="grid cards" markdown>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/get-started/" markdown>:material-arrow-right:

    **Install the StorageHub SDK**

    Install StorageHub SDK packages to start storing, retrieving, and verifying data.

    </a>

-   <a href="/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/" markdown>:material-arrow-right:

    **Build a Data Workflow End-to-End**

    Learn step-by-step how to store a file on DataHaven and retrieve it back from the network.

    </a>

</div>

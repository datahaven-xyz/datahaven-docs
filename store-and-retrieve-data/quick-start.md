---
title: Quick Start
description: Set up your environment and connect to the DataHaven network.
slug: /store-and-retrieve-data/quick-start
---

# Quick Start Guide for Developing on DataHaven

## Quick Overview

DataHaven is a fully EVM-compatible decentralized storage and computation platform built as a sovereign Substrate-based Layer 1 chain. It combines Ethereum-style accounts and tooling with Substrate’s modular runtime to provide seamless interaction between on-chain smart contracts and off-chain data storage. Developers can interact with DataHaven using familiar Ethereum RPCs, wallets, and libraries such as MetaMask or viem, while also accessing Substrate APIs for advanced features like governance or custom runtime calls. Through integration with EigenLayer, DataHaven operates as an AVS (Actively Validated Service) secured by Ethereum restakers, allowing it to inherit Ethereum’s security without relying on its own validator bootstrap. This unified design enables decentralized applications to coordinate computation and storage through a single network which links smart contract logic with verifiable, persistent data maintained by storage providers.

## DataHaven Networks

To start building on DataHaven, check out the list of currently available DataHaven networks:

|                                          Network                                          | Network Type  | Native Asset Symbol | Native Asset Decimals |
|:-----------------------------------------------------------------------------------------:|:-------------:|:-------------------:|:---------------------:|
|                                     DataHaven Testnet                                     |    TestNet    |        HAVE         |          18           |


### Network Configurations

To interact with the network, use the following information to configure DataHaven within the developer tools you are using:

=== "DataHaven Testnet"

 |    Variable     |                      Value                       |
 |:---------------:|:------------------------------------------------:|
 |    Chain ID     | <pre>```{{ networks.testnet.chain_id }}```</pre> |
 | Public RPC URLs | <pre>```{{ networks.testnet.rpc_url }}```</pre>  |
 | Public WSS URLs | <pre>```{{ networks.testnet.wss_url }}```</pre>  |


### Block Explorers

DataHaven provides dedicated explorers for both its EVM and Substrate layers, reflecting its hybrid architecture. Developers can use the Ethereum-compatible explorer to inspect smart contract deployments, storage interactions, and on-chain proofs executed through the EVM interface. Meanwhile, the Substrate explorer offers visibility into the network’s underlying modules, such as provider registration, storage requests, and reward distribution. Together, these explorers provide a complete view of DataHaven’s activity enabling developers to trace events and validate state changes across both layers of the network.

TBD

## Funding TestNet Accounts

To begin building on a DataHaven test network, you’ll need to obtain HAVE tokens to cover transaction fees and interact with the network. These tokens are distributed freely for testing and development purposes only. They do not have any real market value.


|                TestNet                 |                                                             Where To Get Tokens From                                                             |
|:--------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------:|
| [DataHaven Testnet](#){target=\_blank} | The [DataHaven Testnet Faucet](#){target=\_blank} website. <br> The faucet dispenses {{ networks.testnet.website_faucet_amount }} every 24 hours |
|                                        |


---


<div class="grid cards" markdown>

-   __Build with StorageHub SDK__

    ---

    Install StorageHub SDK dependencies to start storing, retrieving, and verifying data.

    [:octicons-arrow-right-24: Get started](/store-and-retrieve-data/use-storagehub-sdk/get-started.md)

-   __Build a Data Workflow End-to-End__

    ---

    Learn step-by-step how to store a file on DataHaven and retrieve it back from the network.

    [:octicons-arrow-right-24: End-to-End Storage Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow.md)

</div>
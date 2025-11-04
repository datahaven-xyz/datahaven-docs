---
title: Storage Starter Kit
description: Everything you need to start building on DataHaven, including network configs, block explorers, faucets, and MSP endpoints for working with the StorageHub SDK.
---

# Storage Starter Kit

DataHaven is a fully EVM-compatible decentralized storage and computation platform built as a Substrate-based Layer 1 blockchain. Developers can interact with DataHaven using familiar Ethereum RPCs, wallets, and libraries such as MetaMask or viem, while also accessing Substrate APIs for additional features.

The following sections provide essential information for configuring your favorite Ethereum-based developer tools for use with DataHaven. You'll also find links to additional resources such as token faucets and block explorers. 

## DataHaven Networks

To start building on DataHaven, check out the list of currently available DataHaven networks:

|      Network      | Network Type | Native Asset Symbol | Native Asset Decimals |
|:-----------------:|:------------:|:-------------------:|:---------------------:|
| DataHaven TestNet |   TestNet    |        HAVE         |          18           |

### Network Configurations

To interact with the network, use the following information to configure DataHaven within the developer tools you are using:

=== "DataHaven TestNet"

    |    Variable     |                    Value                     |
    |:---------------:|:--------------------------------------------:|
    |    Chain ID     | <pre>`{{ networks.testnet.chain_id }}`</pre> |
    | Public RPC URLs | <pre>`{{ networks.testnet.rpc_url }}`</pre>  |
    | Public WSS URLs | <pre>`{{ networks.testnet.wss_url }}`</pre>  |

### Block Explorers

DataHaven provides dedicated explorers for both its EVM and Substrate layers:

|           Explorer           |   Layer   |
|:----------------------------:|:---------:|
| [TODO](TODO){target=\_blank} | Ethereum  |
| [TODO](TODO){target=\_blank} | Substrate |

## Funding TestNet Accounts

To begin building on a DataHaven test network, you'll need to obtain HAVE tokens to cover transaction fees and interact with the network. These tokens are distributed freely for testing and development purposes only.

|      TestNet      |            Where To Get Tokens From             | Amount Dispensed                                                                 |
|:-----------------:|:-----------------------------------------------:|----------------------------------------------------------------------------------|
| DataHaven TestNet | [Official TestNet Faucet](TODO){target=\_blank} | {{ networks.testnet.website_faucet_amount }} every 24 hours |

TestNet HAVE tokens have no market value. Please do not spam the faucet with unnecessary requests.

## MSP Service Endpoints

To interact with a Main Storage Provider (MSP) through `@storagehub-sdk/msp-client`, a service endpoint is required. You can use any of the following MSP base URLs as an endpoint for storing and retrieving your files:

|      Network      |                                 Value                                 |
|:-----------------:|:---------------------------------------------------------------------:|
| DataHaven TestNet | <pre>`https://deo-dh-backend.stagenet.datahaven-infra.network/`</pre> |

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

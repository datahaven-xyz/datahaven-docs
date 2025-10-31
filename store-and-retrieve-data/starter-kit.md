---
title: Data Storage Starter Kit
description: Everything you need to start building on DataHaven, including network configs, block explorers, faucets, and MSP endpoints for working with the StorageHub SDK.
---

# Data Storage Starter Kit

DataHaven is fully EVM-compatible. You can interact with DataHaven using familiar Ethereum RPCs, wallets, and libraries such as MetaMask or viem, while also accessing Substrate APIs for advanced features like governance or custom runtime calls.

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
| DataHaven TestNet | [Official TestNet Faucet](TODO){target=\_blank} | The faucet dispenses {{ networks.testnet.website_faucet_amount }} every 24 hours |

!!! note
    TestNet HAVE tokens do not have any market value. Please do not spam the faucet with unnecessary requests.

## MSP Service Endpoints

To interact with a Main Storage Provider (MSP) through `@storagehub-sdk/msp-client`, a service endpoint is required. You can use any of the following MSP base URLs as an endpoint for storing and retrieving your files:

|      Network      |                                 Value                                 |
|:-----------------:|:---------------------------------------------------------------------:|
| DataHaven TestNet | <pre>`https://deo-dh-backend.stagenet.datahaven-infra.network/`</pre> |

## Next Steps

<div class="grid cards" markdown>

- **Build with StorageHub SDK**

    ***

    Install StorageHub SDK dependencies to start storing, retrieving, and verifying data.

    [:octicons-arrow-right-24: Get started](/store-and-retrieve-data/use-storagehub-sdk/get-started/)

- **Build a Data Workflow End-to-End**

    ***

    Learn step-by-step how to store a file on DataHaven and retrieve it back from the network.

    [:octicons-arrow-right-24: End-to-End Storage Workflow](/store-and-retrieve-data/use-storagehub-sdk/end-to-end-storage-workflow/)

</div>

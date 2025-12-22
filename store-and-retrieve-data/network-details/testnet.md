---
title: Testnet
description: Configuration details, block explorers, faucets, and MSP endpoints you need to connect your tools and start building on the DataHaven testnet.
---

# Testnet

DataHaven is a fully EVM-compatible decentralized storage and computation platform built as a Substrate-based Layer 1 blockchain. Developers can interact with DataHaven using Ethereum RPCs, popular wallets, and libraries such as MetaMask or viem, while also accessing Substrate APIs for additional features.

The following sections provide essential information for configuring your favorite Ethereum-based developer tools for use with the DataHaven testnet. You'll also find links to additional resources such as token faucets and block explorers.

|        Network         | Network Type | Native Asset Symbol | Native Asset Decimals |
|:----------------------:|:------------:|:-------------------:|:---------------------:|
|   DataHaven Testnet    |   Testnet    |        MOCK         |          18           |

## Network Configuration

To interact with the network, use the following information to configure DataHaven's testnet within the developer tools you are using:

|    Variable     |                    Value                     |
|:---------------:|:--------------------------------------------:|
|    Chain ID     | <pre>`{{ networks.testnet.chain_id }}`</pre> |
| Public RPC URLs | <pre>`{{ networks.testnet.rpc_url }}`</pre>  |
| Public WSS URLs | <pre>`{{ networks.testnet.wss_url }}`</pre>  |

## Block Explorers

DataHaven provides dedicated explorers for both its EVM and Substrate layers:

|                                 Explorer                                  |   Layer   |
    |:-------------------------------------------------------------------------:|:---------:|
    | [DataHaven Testnet Explorer](https://testnet.dhscan.io/){target=\_blank}  | Ethereum  |
    | [Basic Explorer](https://datahaven-explorer.netlify.app/){target=\_blank} | Ethereum  |
    |  [Statescan](https://datahaven-testnet.statescan.io/#/){target=\_blank}   | Substrate |

## Funding Testnet Accounts

To build on the testnet, you will need **MOCK** tokens for transaction fees.

|      Testnet      |                           Where To Get Tokens From                           | Amount Dispensed                                                                 |
|:-----------------:|:----------------------------------------------------------------------------:|----------------------------------------------------------------------------------|
| DataHaven Testnet | [Official Testnet Faucet](https://apps.datahaven.xyz/testnet/faucet){target=\_blank} | The faucet dispenses {{ networks.testnet.website_faucet_amount }} every 24 hours |

### How to Get Tokens

1. Connect your wallet to the faucet.  
2. Sign a message to authenticate.  
3. Click **Request Tokens**.

![Requesting tokens from the testnet faucet](/images/store-and-retrieve-data/network-details/testnet/testnet-01.gif)

Testnet MOCK tokens have no market value. Please do not spam the faucet.

## MSP Service Endpoint

Use this base URL when connecting to an MSP via the StorageHub SDK:

```
{{ networks.testnet.msp_url }}
```

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

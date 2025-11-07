---
title: FAQs and Troubleshooting
description: Conversational style StorageHub SDK-related FAQs and their answers. Includes bucket management, security best practices, and the role of EigneLayer.
---

# StorageHub SDK FAQs

## What is the difference between the `core` and `msp-client` StorageHub SDK packages?

The two packages differ in the following ways:

- **[@storagehub-sdk/core](https://www.npmjs.com/package/@storagehub-sdk/core){:target="_blank"}** provides backend-agnostic primitives such as: 
        
    - Wallet, signing, Merkle, and WASM utilities.
    - Substrate to EVM bridging.
    - Shared types and constants used across SDK packages.
    
    Use the `core` SDK package for foundational building blocks.

- **[@storagehub-sdk/msp-client](https://www.npmjs.com/package/@storagehub-sdk/msp-client){:target="_blank"}** handles Main Storage Provider (MSP) operations such as: 
        
    - Authentication.
    - Health checks.
    - File upload and download.
    - Bucket management and interaction. 
    
    Use the `msp-client` SDK package to communicate directly with MSPs.

## How much does it cost to store a file?

Actions on the DataHaven network, such as uploading files and creating buckets, incur small transaction fees paid in HAVE tokens. Fees are automatically deducted from your connected wallet balance via payment streams when you perform these operations.

You can view your detailed billing history by connecting your wallet to [apps.datahaven.xyz](https://apps.datahaven.xyz) and visiting the **Payments** section.

## How do I estimates costs when comparing Main Storage Providers?

Each Main Storage Provider (MSP) exposes a public API endpoint that lists its current pricing tiers. You can query this endpoint to see the price per gigabyte per block that the MSP charges for storage.

For example, call the endpoint:

```bash
GET /value-props
```

This returns a list of available service tiers, including fields like: 
    - **`pricePerGbPerBlock`**: The cost to store 1 GB for one block. 
    - **`dataLimitPerBucketBytes`**: The maximum bucket size allowed for that tier.

Once you have the price, you can estimate your storage cost using a simple formula:

cost = `pricePerGbPerBlock` × (GB stored) × (number of replicas) × (number of blocks)

For a monthly estimate, assume about 432,000 blocks per month (assuming a 6-second block time).

You can view your detailed billing history by connecting your wallet to [apps.datahaven.xyz](https://apps.datahaven.xyz) and visiting the **Payments** section.

## Can I create a private bucket?

Currently buckets are public. To ensure privacy, encrypt your files before uploading them to DataHaven.

## Can I rename a bucket?

Yes. The bucket owner can rename a bucket at any time.

## Can I delete a bucket?

Yes. The bucket owner can delete a bucket at any time.

## How can I be sure my file is safe on DataHaven?

When you select a Main Storage Provider(MSP) and upload a file, there is a two-step process to ensure your file is successfully consumed by the DataHaven network:

1. **File upload receipt**: Your file upload completes and you receive a receipt indicating successful upload to the MSP.

2. **Network propagation confirmation**: Confirm your file has been propagated through the DataHaven network by verifying that your `fileKey` has generated a `StorageRequestFulfilled` event on-chain. DataHaven is developing tools to more easily track the state of your file and whether it has completed both steps.

Once your file has completed both steps, it is considered securely stored in the DataHaven network.

## How does DataHaven ensure file integrity?

DataHaven employs a dual-provider model with the following defined roles:

- **Main Storage Providers (MSPs)**: User-selected providers that store your files.
- **Backup Storage Providers (BSPs)**: Providers randomly assigned by the network for backup storage to ensure redunancy.

BSPs ensure data reliability and redundancy in a decentralized network, backing up data to keep it available even if an MSP fails. Each file stored by a BSP is split into chunks, "Merkleized," and linked to a file key. The Merkle root is then stored on-chain as proof of storage. BSPs must hold collateral that can be slashed if data is lost. 

BSPs are periodically challenged to submit proof of storage, with challenge frequency based on storage size. A Fair Distribution mechanism prevents front-running, allowing all BSPs the chance to volunteer for new storage requests. MSPs are not currently polled or slashed, as backup providers ensure file integrity in the event of main provider data loss. 

Market dynamics naturally incentivize MSPs to provide the best possible service to attract and retain network users.

## Can you deploy smart contracts onto DataHaven?

Not yet. Full EVM compatibility including support for smart contract deployment via Moonbeam's technology stack is planned for a future release. DataHaven will offer full JSON-RPC compatibility with Ethereum APIs, making it compatible with existing dApps, wallets, and development tools.

## What is the EVM Chain ID for DataHaven?

- **Mainnet**: `{{ networks.mainnet.chain_id }}`
- **Testnet**: `{{ networks.testnet.chain_id }}`

## How does EigenLayer integrate with DataHaven?

EigenLayer secures DataHaven by keeping operator economics on Ethereum while execution happens on DataHaven. EigenLayer plays the following roles:

- **Operator Registration & Validator Sets**: Operators restake into EigenLayer strategies and register with the DataHaven AVS ServiceManager. Registration works as follows:
    - The AVS ServiceManager organizes three operator sets: validators, Backup Storage Providers(BSPs), and Main Storage Providers (MSPs). 
    - Validators provide a mapping from their Ethereum address to a DataHaven `AccountId20`, allowing the AVS ServiceManager to build a canonical validator set. 
    - The AVS ServiceManager periodically sends the updated validator set to DataHaven over Snowbridge 
    - The `external-validators` pallet activates it on era boundaries, so validator membership on DataHaven is derived from EigenLayer.

- **Slashing & Faults**: Faults and incentives also flow across Snowbridge. Slashing is initiated on Ethereum through a vetoable slasher as follows: 
    - Slashing requests are queued. 
    - Requests can be vetoed by a committee within a block window and cancelled.
    - If a request is not vetoed, the AVS slashes the restaked allocation via EigenLayer.

- **Rewards**: Rewards accrue on DataHaven per era. The rewards flow works as follows:
    - The `external-validators-rewards` pallet computes a Merkle root of validator points and sends it to Ethereum. 
    - The RewardsRegistry updates the root
    - The AVS, on behalf of operators, uses Substrate-style positional Merkle proofs to claim payouts proportional to earned points.

## Don't see your question?

If your question isn't answered here, join the [DataHaven Discord](https://discord.gg/datahaven) and use the Support Ticket chat. This will create a private channel to ensure your ticket is answered in a timely manner by our support team.
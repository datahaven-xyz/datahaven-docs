---
title: Spin Up Local Devnet
description: Learn how to spin up a local DataHaven development network to test storage operations, deploy contracts, and interact with the StorageHub SDK in a self-contained environment.
---

# Spin Up Local Devnet

DataHaven can be run locally as a self-contained development network that mirrors the behavior of the full chain. Running a local devnet lets you experiment with core components without relying on external infrastructure. In this guide, you’ll learn how to spin up a local DataHaven node, which will allow you to go through the guides in the DataHaven docs as if you were using the testnet.

## Prerequisites

Before you begin, ensure you have the following:

- macOS or Linux operating system
- [Docker](https://www.docker.com/){target=\_blank} installed and running
- [Node.js ≥ 22](https://nodejs.org/en/download){target=\_blank} installed. LTS version recommended.
- [pnpm](https://pnpm.io/){target=\_blank} installed for package management

## Clone the StorageHub Repository

Start by cloning the official StorageHub repository, which contains all the scripts and Docker configurations required to spin up your local DataHaven devnet.

```bash
git clone https://github.com/Moonsong-Labs/storage-hub.git
cd storage-hub/test
```

## Install Dependencies

Install all required dependencies using pnpm. 

```bash
pnpm i
```

## Pull Docker Images

Download the latest StorageHub and MSP Backend Docker images. These images include prebuilt binaries and configurations for running the DataHaven node and Main Storage Provider locally.

```bash
docker pull --platform linux/amd64 moonsonglabs/storage-hub:latest
docker tag moonsonglabs/storage-hub:latest storage-hub:local
docker pull --platform linux/amd64 moonsonglabs/storage-hub-msp-backend:latest
docker tag moonsonglabs/storage-hub-msp-backend:latest sh-msp-backend:local
```

## Start the Local Devnet

With everything set up, start your local DataHaven devnet using the preconfigured solochain-evm script. This will launch a Substrate node with EVM compatibility and initialize the StorageHub runtime pallets.

!!! note
    After you have stopped running the solochain (local devnet) script, you should also remove all Docker containers manually. To do this, simply run `docker rm -f $(docker ps -a -q)` in the terminal. This command directly forces the removal of all running containers by listing their IDs with `docker ps -a -q` and then it passes them to `docker rm -f`.

```bash
pnpm docker:start:solochain-evm:initialised
```

Now you’re ready to start building and testing with the StorageHub SDK against your local DataHaven devnet. You can use this setup to issue storage requests, create buckets, upload files, and more. The relevant local devnet configuration parameters (including Chain ID, RPC URL, WS URL, and MSP URL) can be found in the [Quick Start Guide](/store-and-retrieve-data/quick-start){target\_blank}

!!! note
    Deleting files in the local devnet is currently not supported.
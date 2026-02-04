---
title: Spin Up Local Devnet
description: Set up a local DataHaven development network to test storage operations, deploy contracts, and interact with the StorageHub SDK in a self-contained environment.
categories: Network, StorageHub SDK
---

# Spin Up Local Devnet

DataHaven can be run locally as a self-contained development network that mirrors the behavior of the full chain. Running a local devnet lets you experiment with core components without relying on external infrastructure. In this guide, you’ll learn how to spin up a local DataHaven node, which will allow you to go through the guides in the DataHaven docs as if you were using the testnet.

## Prerequisites

Before you begin, ensure you have the following:

- macOS or Linux operating system (Ubuntu 24.04 LTS recommended for Linux)
- [Docker](https://www.docker.com/){target=\_blank} installed and running

    ??? interface "Instructions if running macOS Tahoe (v26 or higher)"

        If running macOS Tahoe (v26 or higher), instead of using Docker, you should install [OrbStack](https://orbstack.dev/download){target=\_blank}. Make sure Docker Desktop is not running while using OrbStack to ensure it works properly. You can run all your Docker commands the same way while using OrbStack. 
        
        After installing OrbStack, to confirm you are using OrbStack under the hood instead of Docker Desktop, you can run the following command in the terminal:

        ```bash
        docker context show
        ```

        The output should be `orbstack`.

- [Node.js ≥ 24](https://nodejs.org/en/download){target=\_blank} installed. LTS version recommended
- [pnpm](https://pnpm.io/){target=\_blank} installed for package management
- [Rust ≥ 1.86](https://rust-lang.org/tools/install/){target=\_blank} installed
- [PostgreSQL 16](https://www.postgresql.org/download/){target=\_blank} installed
- [Diesel CLI](https://diesel.rs/guides/getting-started#installing-diesel-cli){target=\_blank} installed for database management
 
    ??? interface "Diesel CLI installation instructions"

        - Install system dependencies:

            === "Linux"

                ```bash
                sudo apt update && sudo apt install build-essential
                ```

            === "macOS"

                ```bash
                xcode-select --install
                ```
            
        - Install Diesel CLI with PostgreSQL support:

            ```bash
            cargo install diesel_cli --no-default-features --features postgres
            ```

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

Download the latest StorageHub and Main Storage Provider (MSP) backend Docker images. These images include prebuilt binaries and configurations for running the DataHaven node and MSP locally.

```bash
docker pull --platform linux/amd64 moonsonglabs/storage-hub:latest
docker tag moonsonglabs/storage-hub:latest storage-hub:local
docker pull --platform linux/amd64 moonsonglabs/storage-hub-msp-backend:latest
docker tag moonsonglabs/storage-hub-msp-backend:latest sh-msp-backend:local
```

## Start the Local Devnet

With everything set up, start your local DataHaven devnet using the preconfigured `solochain-evm` script. This will launch a Substrate node with EVM compatibility and initialize the StorageHub runtime pallets.

```bash
pnpm docker:start:solochain-evm:initialised
```

Now you're ready to start building and testing with the StorageHub SDK against your local DataHaven devnet. You can use this setup to issue storage requests, create buckets, upload files, and more. The relevant local devnet configuration parameters (including Chain ID, RPC URL, WS URL, and MSP URL) can be found in the [Local Devnet](/store-and-retrieve-data/network-details/local-devnet/) page.

## Stop the Local Devnet

To stop the local devnet, press `Ctrl + C` in the terminal where it's running.

After you stop running the solochain (local devnet) script, you should also manually remove all Docker containers.

To remove containers related to the devnet, you can run the following command in the terminal and then manually remove them by name or ID:

```bash
docker ps -a
```

If you want to remove all containers, you can run:

```bash
docker rm -f $(docker ps -a -q)
```

This command forces the removal of all running containers by listing their IDs with `docker ps -a -q`, then passing them to `docker rm -f`.
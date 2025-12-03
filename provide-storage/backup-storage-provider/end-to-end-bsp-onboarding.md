---
title: End-to-End BSP Onboarding
description: This step-by-step tutorial follows the full process to spin up your own BSP node and how to register to the DataHaven network
---

# End-to-End BSP Onboarding

Backup Storage Providers (BSPs) provide redundant storage for files in the DataHaven network, receiving files from Main Storage Providers (MSPs) and submitting proofs of storage.

This tutorial walks through the entire process of bringing a Backup Storage Provider (BSP) node online, from spinning up the node and selecting the correct chain spec to inserting your private key into the node’s keystore and registering your BSP on-chain. By the end, you will have a fully verified BSP that joins the DataHaven network, accepts storage assignments, and participates in StorageHub’s storage-proof lifecycle.

## Prerequisites

Before you begin, ensure you have the following:

- macOS or Linux operating system
- Storage Capacity (minimum 1 TB, recommended 2 TB+)
- [Docker](https://www.docker.com/){target=\_blank} and [Docker Compose](https://docs.docker.com/compose/install/){target=\_blank} installed and running
- A BCSV key of scheme ECDSA (a 32 byte private key) for the BSP node's on-chain identity and signing
- Sufficient account balance for deposits and collateral
- Stable network connection
- Open network ports (30333, optionally 9944)

### Hardware Requirements

BSPs have similar hardware requirements to MSPs as they store backup data and must reliably submit proofs of storage.

#### Specifications

| Component | Requirement |
|-----------|-------------|
| **CPU** | 8 physical cores @ 3.4 GHz (Intel Ice Lake+ or AMD Zen3+) |
| **RAM** | 32 GB DDR4 ECC |
| **Storage (System)** | 500 GB NVMe SSD (chain data) |
| **Storage (User Data)** | 1 TB NVMe SSD or HDD (minimum) |
| **Network** | 500 Mbit/s symmetric |

#### Important Considerations

- **Separate storage volumes**: Keep chain data and user data on separate volumes for better I/O performance
- **Storage expansion**: Plan for growth; user data storage should be easily expandable
- **max-storage-capacity**: Set this CLI flag to **80% of available physical disk space** to leave headroom for filesystem overhead and temporary files
- **Cloud compatible**: BSPs can run effectively on cloud VPS with dedicated storage volumes
- **Proof submission**: Ensure reliable network connectivity for timely proof submissions

### Deposit Requirements

- **Base Deposit**: 100 MOCK (`SpMinDeposit`)
- **Per GiB**: 2 MOCK (`DepositPerData`)
- **Formula**: 100 + (`capacity_in_gib` × 2) + buffer

Examples:

- **800 GiB capacity**: 100 + (800 × 2) = 1,700 MOCK required (1,800 MOCK recommended)
- **1.6 TiB capacity**: 100 + (1,638 × 2) = 3,376 MOCK required (3,500+ MOCK recommended)

The deposit is held (reserved) from your account when you start the BSP registration process and remains held while you operate as a BSP. The deposit is returned when you deregister as a BSP.

!!! note
    Your BSP account must be funded before BSP registration

## Project Structure

This is how the project structure will look like, once everything is set up.

```
datahaven-bsp-node/
├── datahaven-node
├── bsp-data
│   └── chains
│   │   ├── datahaven_stagenet_local
│   │   │   └── keystore
│   │   └── datahaven_testnet
│   │       └── keystore
│   bsp-storage    
│   └── storagehub    
│       ├── file_storage
│       └── forest_storage      
├── Dockerfile
├── docker-compose.yml
└── bsp.log    
```

## Project Setup

Before running a BSP node, you will need to obtain the `datahaven-node` client binary and the chain specifications for the network you want to join.

### Download Latest Client Release

From the [Releases](https://github.com/datahaven-xyz/datahaven/releases){target=\_blank} section of the DataHaven repo, the latest version of the `datahaven-node` binary can be found. Currently, the latest version is {{ networks.testnet.client_version }} and it can be downloaded directly from [this link](https://github.com/datahaven-xyz/datahaven/releases/download/{{ networks.testnet.client_version }}/datahaven-node).

Make sure to download it in the root of your `datahaven-bsp-node` folder.

### Download Desired Chain Specs

Next, [download the testnet chain specs](#){target=\_blank} and include them in the root of your project. Call the file `datahaven-testnet-raw-specs.json`. The specs you use dictate to which DataHaven network your BSP will connect and interact with.

## Docker Configuration for the BSP Node

In this section you’ll create the `Dockerfile`, `docker-compose.yml`, and `.dockerignore` needed to run the node, mount your keystore, load the chain spec, and expose the required ports. After this step, your BSP can run cleanly in an isolated, reproducible container that is easy to start, stop, and upgrade.

The `datahaven-node` binaries published in the DataHaven repository are precompiled Linux `x86-64` binaries, which macOS users with Apple Silicon chips cannot compile natively. Docker solves this as well, via emulation.

1. In the root of your project, create a `Dockerfile` file

2. Add the following code:

    ```dockerfile title="Dockerfile"
    # Note: This Dockerfile is architecture-agnostic. Use
    # `docker build --platform=linux/amd64` on Apple Silicon
    # so Rosetta can emulate x86-64 binaries.
    FROM ubuntu:22.04

    # Install runtime dependencies for datahaven-node
    RUN apt-get update && apt-get install -y \
        libpq5 \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

    # Copy the datahaven-node binary into the image
    COPY datahaven-node /usr/local/bin/datahaven-node
    RUN chmod +x /usr/local/bin/datahaven-node

    # Default entrypoint: just run the node
    ENTRYPOINT ["datahaven-node"]
    ```

    This `Dockerfile` builds a minimal Ubuntu-based image containing the `datahaven-node` binary and its required runtime libraries. It installs only the necessary dependencies, copies the node executable into the container, and marks it as runnable. On macOS with Apple Silicon, the image must be built with `--platform=linux/amd64` so Docker can emulate the `x86-64` Linux environment that the precompiled DataHaven binaries expect. The default entrypoint runs `datahaven-node` directly, allowing the container to behave like a fully configured BSP node.

3. Create a `.dockerignore` file

4. Run the following command in the terminal to list the `data` folder within the `.dockerignore` file:

    ```bash
    echo "data" > .dockerignore
    ```

    This way the `data` folder and its contents won't get included in the docker image.

5. Build the docker image with the following command:

    !!! note
        The following command has the `--platform=linux/amd64` flag which should be included for macOS users that have an Apple Silicon chip. The `datahaven-node` binary is built so it natively supports `x86_64` chips. In order for this flag to work, macOS users need to go to their Docker Desktop app and toggle on the `Use Rosetta for x86_64/amd64 emulation on Apple Silicon` setting in Settings -> General -> Virtual Machine Options -> Apple Virtualization Framework.

    ```bash
    docker build --platform=linux/amd64 -t datahaven-bsp:latest .
    ```

    The image name can be anything. In this tutorial, we'll use `datahaven-bsp:latest`. 
    
    You won't run the BSP this way, but if you wanted to, right now you could run a BSP in the background through a `datahaven-bsp` docker container with a command like this:

    !!! note
        Include `--platform=linux/amd64` only if using Apple Silicon.

    ```bash
    docker run -d \
      --platform=linux/amd64 \
      --name datahaven-bsp \
      --restart unless-stopped \
      -v "./data":/data \
      datahaven-bsp:latest \
        --provider \
        --provider-type bsp \
        --max-storage-capacity 10737418240 \
        --jump-capacity 1073741824 \
        --storage-layer rocks-db \
        --storage-path /data
    ```

    To display this container's logs in terminal, run:

    ```bash
    docker logs -f datahaven-bsp
    ```

    !!! note
        To stop displaying the logs in terminal run `Ctrl+C`, but keep in mind that it won't actually stop the container from running.

    Once the `datahaven-bsp` container is running, these commands are useful to keep in mind:

    ```bash
    # stop the container
    docker stop datahaven-bsp 

    # start the container
    docker start datahaven-bsp 

    # restart the container
    docker restart datahaven-bsp

    # delete the stopped container entirely
    docker rm datahaven-bsp 
    ```

    The logs output should be something like:

    --8<-- 'code/provide-data/backup-storage-provider/end-to-end-bsp-onboarding/output-01.html'

    If you have spun up this `datahaven-bsp` container, prior to the upcoming step, make sure to stop it and remove it:

    ```bash
    docker stop datahaven-bsp
    docker rm datahaven-bsp
    ```

6. In the root of your project create a `docker-compose.yml` file

7. Add the following code:

    !!! note
        Here a `--chain` flag will be included, as well as an addition to `volumes` in order to select the proper chain using the chain spec you obtained in one of the previous sections. If no chain is specified, DataHaven Local Stagenet will be selected by default.

    ```yaml title="docker-compose.yml"
    services:
      datahaven-bsp:
        image: datahaven-bsp:latest
        platform: linux/amd64
        container_name: datahaven-bsp
        ports:
          - "30334:30333"
          - "9946:9946"
        volumes:
          - ./bsp-data:/data
          - ./bsp-storage:/data/storage
          - ./datahaven-testnet-raw-specs.json:/testnet-chain-spec.json:ro
        command:
          - "--chain=/testnet-chain-spec.json"
          - "--name=BSP01"
          - "--base-path=/data"
          - "--keystore-path=/data/keystore"
          - "--provider"
          - "--provider-type=bsp"
          - "--max-storage-capacity=858993459200"
          - "--jump-capacity=107374182400"
          - "--storage-layer=rocks-db"
          - "--storage-path=/data/storage"
          - "--bsp-upload-file-task"
          - "--bsp-upload-file-max-try-count=5"
          - "--bsp-upload-file-max-tip=0"
          - "--bsp-move-bucket-task"
          - "--bsp-move-bucket-grace-period=300"
          - "--bsp-charge-fees-task"
          - "--bsp-charge-fees-min-debt=0"
          - "--bsp-submit-proof-task"
          - "--bsp-submit-proof-max-attempts=3"
          - "--port=30333"
          - "--rpc-port=9946"
    restart: unless-stopped
    
    volumes:
      bsp-data:
      bsp-storage:
    ```

    Docker Compose makes the setup reproducible, easier to maintain, and safer for operators who shouldn’t need to remember every flag manually. It also ensures the node restarts automatically, and mounts persistent storage correctly.

8. Run the BSP:

    ```bash
    docker compose up -d
    ```

    The output will look something like this:

    --8<-- 'code/provide-data/backup-storage-provider/end-to-end-bsp-onboarding/output-02.html'

    Here are a few useful commands to keep handy:

    ```bash
    # stop and remove the container
    docker compose down

    # check status and logs while the container is running
    docker compose ps

    # continuously tail logs in terminal
    docker compose logs -f

    # continuously stream and save all logs into a file
    docker compose logs -f > bsp.log

    # continuously display logs in terminal and continuously save them into a file
    docker compose logs -f | tee bsp.log
    ```

    After checking the logs, make sure the `Chain specification` log is displaying the network that matches the chain spec you are using:

    --8<-- 'code/provide-data/backup-storage-provider/end-to-end-bsp-onboarding/output-03.html'

## Inject the BSP Blockchain Service Key

The node has a keystore directory. BSP nodes need the Blockchain service key injected into the node's keystore. The key is of type `bcsv` and scheme `ECDSA` which is the same curve scheme that’s used for Ethereum-style keys. That key will serve as your BSP node's "BSP service identity” through which it will sign transactions on-chain.

### Prepare BCSV Key

You have two options:
- Use an already existing seed phrase and derive its SS58 public key.
- Generate a completely new seed phrase and derive its SS58 public key.

!!! note
    If you are a Linux user and can run the `datahaven-node` binary natively, you can replace `docker compose run --rm datahaven-bsp` with `datahaven-node` in the commands bellow.

1. Save seed phrase to `$SEED` variable:

    ```bash
    # Use an already existing seed phrase
    SEED="INSERT_SEED_PHRASE_OR_0X_PRIVATE_KEY"

    # OR

    # Generate a completely new seed phrase
    SEED=$(docker compose run --rm datahaven-bsp \
    key generate --scheme ecdsa --output-type json | jq -r '.secretPhrase')
    ```

2. Derive BSP account:

    ```bash
    docker compose run --rm datahaven-bsp \
    key inspect --scheme ecdsa --output-type json "$SEED" | jq -r '.ss58PublicKey'
    ```

    The output should look something like this:

    --8<-- 'code/provide-data/backup-storage-provider/end-to-end-bsp-onboarding/output-04.html'

### Insert BCSV Key (ECDSA)

1. Make sure to stop and remove the container by running:

    ```bash
    docker compose down
    ```

2. Run the following command:

    !!! note
        The `--base-path` flag is crucial for keeping your keys across restarts.

    ```bash
    docker compose run --rm \
    datahaven-bsp key insert \
      --base-path /data \
      --chain /testnet-chain-spec.json \
      --key-type bcsv \
      --scheme ecdsa \
      --suri "$SEED"
    ```

    This command writes the resulting key into `/bsp-data/chains/datahaven_testnet/keystore` on your host. You can check if the command was successful by running:

    ```bash
    find bsp-data -maxdepth 4 -type d -name keystore
    ls bsp-data/chains/*/keystore
    ```

    The output should look something like this:

    --8<-- 'code/provide-data/backup-storage-provider/end-to-end-bsp-onboarding/output-05.html'

## Register BSP On-Chain


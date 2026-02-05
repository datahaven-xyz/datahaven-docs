---
title: Run a BSP Node
description: Guide on how to set up, configure, and spin up a Backup Storage Provider (BSP) node on the DataHaven network using Docker.
categories: Storage Providers, BSP
---

# Run a BSP Node

This guide explains how to prepare your project workspace, run the node with Docker, select the correct chain spec, and inject your Backup Storage Provider (BSP) service key. By the end, you’ll have a fully configured BSP that is ready to join the DataHaven network.

## Prerequisites

Before you begin, ensure you have the following:

- macOS or Linux operating system
- [Docker](https://www.docker.com/){target=\_blank} and [Docker Compose](https://docs.docker.com/compose/install/){target=\_blank} installed and running

    ??? interface "Docker installation instructions"

        If you are using macOS Tahoe (v26 or higher) or Linux, make sure to follow these instructions:

        === "Linux"

            1. Install Docker

                ```bash
                curl -fsSL https://get.docker.com -o get-docker.sh
                sudo sh get-docker.sh
                ```
            
            2. Add your user to docker group (so you don't need sudo)
            
                ```bash
                sudo usermod -aG docker $USER
                ```

            3. Apply group changes:

                ```bash
                newgrp docker
                ```

            4. Verify Docker is working:

                ```bash
                docker --version
                docker ps
                ```

        === "macOS Tahoe (v26 or higher)"

            If running macOS Tahoe (v26 or higher), instead of using Docker, you should install [OrbStack](https://orbstack.dev/download){target=\_blank}. Make sure Docker Desktop is not running while using OrbStack to ensure it works properly. You can run all your Docker commands the same way while using OrbStack. 
        
            After installing OrbStack, to confirm you are using OrbStack under the hood instead of Docker Desktop, you can run the following command in the terminal:

            ```bash
            docker context show
            ```

            The output should be `orbstack`.

- A BCSV key of scheme ECDSA (a 32 byte private key) for the BSP node's on-chain identity and signing
- Sufficient account balance for deposits and collateral
- Stable network connection
- Open network ports (30333, optionally 9944)

### Hardware Requirements

BSPs have similar hardware requirements to MSPs as they store backup data and must reliably submit proofs of storage.

| Component | Requirement |
|-----------|-------------|
| **CPU** | 8 physical cores @ 3.4 GHz (Intel Ice Lake+ or AMD Zen3+) |
| **RAM** | 32 GB DDR4 ECC |
| **Storage (System)** | 500 GB NVMe SSD (chain data) |
| **Storage (User Data)** | 1 TB NVMe SSD or HDD (minimum) |
| **Network** | 500 Mbit/s symmetric |

The following are some important considerations:  

- **Use separate storage volumes**: Keep chain data and user data on separate volumes for better I/O performance.
- **Plan for storage growth**: Ensure user data storage is easily expandable.
- **Limit disk usage**: Set `max-storage-capacity` flag to 80% of available physical disk space to leave headroom for filesystem overhead and temporary files.
- **Optimize for cloud**: Run BSPs on cloud VPS with dedicated storage volumes.
- **Ensure network reliability**: Maintain stable network connectivity for timely proof submissions.

## Project Structure

This is how the project structure will look like, once everything is set up.

```
datahaven-bsp-node/
├── datahaven-node
├── bsp-data
│   ├── keystore
│   ├── chains
│   │   ├── datahaven_testnet
│   │   │   ├── db
│   │   │   ├── frontier
│   │   │   └── network
│   │   └── datahaven_stagenet_local
│   ├── bsp_peer_manager
│   ├── storage
│   └── storagehub
├── bsp-storage    
│   └── storagehub    
│       ├── file_storage
│       └── forest_storage      
├── Dockerfile
├── docker-compose.yml
├── datahaven-testnet-raw-specs.json
└── bsp.log    
```

## Project Setup

Before running a BSP node, you will need to obtain the `datahaven-node` client binary and the chain specifications for the network you want to join.

1. Create a `datahaven-bsp-node` folder:

    ```bash
    mkdir datahaven-bsp-node
    cd datahaven-bsp-node
    ```

2. Download the latest client release ({{ networks.testnet.client_version }}) of the `datahaven-node` binary from the Releases section of the DataHaven repo. Make sure to download it in the root of your `datahaven-bsp-node` folder.

    ```bash
    curl -LO https://github.com/datahaven-xyz/datahaven/releases/download/{{networks.testnet.client_version}}/datahaven-node
    ```

3. Download the testnet chain specs and save them to your project root as `datahaven-testnet-raw-specs.json`. The specs determine the DataHaven network your BSP uses.

    Either manually [download the testnet chain specs](/downloads/datahaven-testnet-raw-specs.json){target=\_blank} or download them via terminal:

    ```bash
    curl -LO https://docs.datahaven.xyz/downloads/datahaven-testnet-raw-specs.json
    ```

## Configure Docker for the BSP Node

In this section, you’ll create the `Dockerfile`, `docker-compose.yml`, and `.dockerignore` needed to run the node, mount your keystore, load the chain spec, and expose the required ports. After this step, your BSP can run cleanly in an isolated, reproducible container that is easy to start, stop, and upgrade.

The `datahaven-node` binaries published in the DataHaven repository are precompiled Linux `x86-64` binaries, which macOS users with Apple Silicon chips cannot compile natively. Docker solves this as well, via emulation.

1. In the root of your project, create a `Dockerfile` file.

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

3. Create a `.dockerignore` file.

4. List the `data` folder within the `.dockerignore` file:

    ```bash
    echo "bsp-data" > .dockerignore
    echo "bsp-storage" > .dockerignore
    ```

    This way the `bsp-data` and `bsp-storage` folders and their contents won't get included in the Docker image.

5. Build the Docker image:

    !!! note "Note for macOS (Apple Silicon) users"
        The `--platform=linux/amd64` flag is required on Apple Silicon because the `datahaven-node` binary targets x86_64.

        To ensure proper emulation, open Docker Desktop → **Settings** → **General** → **Apple Virtualization Framework** and enable **Use Rosetta for x86_64/amd64 emulation on Apple Silicon**.

    === "Linux"

        ```bash
        docker build -t datahaven-bsp:latest .
        ```

    === "macOS"

        ```bash
        docker build --platform=linux/amd64 -t datahaven-bsp:latest .
        ```

    The image name can be anything; This guide, uses `datahaven-bsp:latest`.
    
    ??? interface "(Optional) Spin up the BSP node now to see what the output is like."

        Going forward, you won't run the BSP this way, but right now you could run a BSP node in the background through the `datahaven-bsp` Docker container with a command like this:

        === "Linux"

            ```bash
            docker run -d \
            --name datahaven-bsp \
            --restart unless-stopped \
            -v "./preview-data":/data \
            datahaven-bsp:latest \
                --provider \
                --provider-type bsp \
                --max-storage-capacity 32212254720 \
                --jump-capacity 5368709120 \
                --storage-layer rocks-db \
                --storage-path /data
            ```
            
        === "macOS"

            ```bash
            docker run -d \
            --platform=linux/amd64 \
            --name datahaven-bsp \
            --restart unless-stopped \
            -v "./preview-data":/data \
            datahaven-bsp:latest \
                --provider \
                --provider-type bsp \
                --max-storage-capacity 32212254720 \
                --jump-capacity 5368709120 \
                --storage-layer rocks-db \
                --storage-path /data
            ```

        To display this container's logs in terminal, run:

        ```bash
        docker logs -f datahaven-bsp
        ```

        !!! note
            To stop displaying the logs in terminal run `Ctrl+C`, but keep in mind that it won't actually stop the container from running.

        The logs output should be something like:

        --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-01.html'

        If you have spun up this `datahaven-bsp` container, prior to the upcoming step, make sure to stop it and remove it:

        ```bash
        docker stop datahaven-bsp
        docker rm datahaven-bsp
        ```

6. Generate node key:

    ```bash
    docker run --rm datahaven-bsp:latest key generate-node-key
    ```

    The output should look something like:

    --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-02.html'

7. In the root of your project create a `docker-compose.yml` file.

8. Add the following code:

    !!! note
        This configuration uses your generated node key (`--node-key`) and the chain spec you downloaded (`--chain`). The chain spec file must be mounted into the container via `volumes`. If `--chain` is omitted, the node defaults to DataHaven Local Stagenet.

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
          - "--node-key=INSERT_NODE_KEY"
          - "--node-key-type=ed25519"
          - "--unsafe-rpc-external"
          - "--rpc-methods=unsafe"
          - "--name=BSP01"
          - "--base-path=/data"
          - "--keystore-path=/data/keystore"
          - "--provider"
          - "--provider-type=bsp"
          - "--max-storage-capacity=1099511627776"
          - "--jump-capacity=137438953472"
          - "--storage-layer=rocks-db"
          - "--storage-path=/data/storage"
          - "--bsp-upload-file-task"
          - "--bsp-upload-file-max-try-count=5"
          - "--bsp-upload-file-max-tip=0"
          - "--bsp-move-bucket-task"
          - "--bsp-move-bucket-grace-period=300"
          - "--bsp-charge-fees-task"
          - "--bsp-charge-fees-min-debt=20000000000000"
          - "--bsp-submit-proof-task"
          - "--bsp-submit-proof-max-attempts=3"
          - "--port=30333"
          - "--rpc-port=9946"
        restart: unless-stopped
    
    volumes:
      bsp-data:
      bsp-storage:
    ```

    Docker Compose makes the setup reproducible, easier to maintain, and safer for operators who shouldn’t need to remember every flag manually. It also ensures the node restarts automatically and mounts persistent storage correctly.

    To better understand each of these flags, make sure to check out the [BSP CLI Flags](/provide-storage/backup-storage-provider/bsp-cli-flags) guide.

8. Run the BSP:

    ```bash
    docker compose up -d
    ```

    The output will look something like this:

    --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-03.html'

9. Check BSP's logs:

    ```bash
    docker compose logs -f | tee bsp.log
    ```

    The output should look something like this (with varying storage capacity depending on the capacity you've set for your machine):

    --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-04.html'

    What these logs tell you:

    -  Your node is running on the correct network with the identity derived from your node key.
        ```
        📋 Chain specification: DataHaven Testnet
        🏷 Node name: BSP01
        👤 Role: FULL
        🏷 Local node identity is: 12D3KooWQ3fycKkf4X8qgoj4Kd6QSQEiWBD5tPhPPSkzK9KYVW95
        ```
    - Storage provider started.
        ```
        Starting as a Storage Provider.
        Storage path: Some("/data/storage"),
        Max storage capacity: Some(32212254720),
        Jump capacity: Some(5368709120)
        ```
        - **Max storage capacity**: 32,212,254,720 bytes (~30 GiB)
        - **Jump capacity**: 5,368,709,120 bytes (~5 GiB)
    - External address discovered (multiaddress).

        !!! note
            This is your node's multiaddress and you will use it as a param while verifying the BSP node on-chain later.
        ```
        🔍 Discovered new external address for our node:
        /ip4/37.187.93.17/tcp/30333/ws/p2p/12D3KooWQ3fycKkf4X8qgoj4Kd6QSQEiWBD5tPhPPSkzK9KYVW95
        ```

    - Node started syncing with network.
        ```
        ⚙️ Syncing, target=#1021251 (7 peers), best: #1611, finalized #1536
        ⬇ 384.5kiB/s ⬆ 11.7kiB/s
        ```
        - **Target**: Current chain head (#1,021,251)
        - **Best**: Blocks downloaded so far (#1,611)
        - **Finalized**: Blocks confirmed as final (#1,536)
        - **Peers**: 7 connected nodes

        Your node will catch up over time. Once `best` reaches `target`, you're fully synced.

### Useful Docker Commands

A collection of helpful Docker Compose commands you’ll use while developing or debugging your BSP node:

- Run the container in the background.
    ```bash
    docker compose up -d
    ```
- Stop and remove the container.
    ```bash
    docker compose down
    ```
- Check status and logs while the container is running.
    ```bash
    docker compose ps
    ```
- Continuously tail logs in terminal.
    ```bash
    docker compose logs -f
    ```
- Continuously display logs in terminal and save them into a file.
    ```bash
    docker compose logs -f | tee bsp.log
    ```
- Continuously stream and continuously save all logs into a file.
    ```bash
    docker compose logs -f > bsp.log
    ```

## Inject the BSP Blockchain Service Key

The node has a keystore directory. BSP nodes need the blockchain service key injected into the node's keystore. The key is of type BCSV and scheme ECDSA, which is the same curve scheme that’s used for Ethereum-style keys. That key will serve as your BSP node's "BSP service identity” through which it will sign transactions on-chain.

### Prepare BCSV Key

You have two options:

- Use an already existing **ECDSA raw seed**.
- Generate a completely new raw seed.

!!! warning "Key Scheme Requirement"
    DataHaven BSPs must use ECDSA keys. If you're bringing an existing seed, ensure it was generated with `--scheme ecdsa`. Other key types will not work.

!!! note
    If you are a Linux user and can run the `datahaven-node` binary natively, you can replace `docker compose run --rm datahaven-bsp` with `datahaven-node` in the command bellow.

1. Save seed to `$SEED` variable:

    ```bash
    # Option 1: Use an already existing ECDSA raw seed
    # Format: 0x-prefixed hex string (66 characters total)
    SEED="INSERT_0X_RAW_SEED"

    # OR

    # Option 2: Generate a new ECDSA raw seed
    SEED=$(docker compose run --rm datahaven-bsp \
    key generate --scheme ecdsa --output-type json | jq -r '.secretSeed')
    ```

2. Verify the seed was saved:

    ```bash
    echo $SEED
    ```

### Insert BCSV Key (ECDSA)

1. Make sure to stop and remove the container by running:

    ```bash
    docker compose down
    ```

2. Run the following command:

    !!! note
        The `--keystore-path` flag is crucial for keeping your keys across restarts.

    ```bash
    docker compose run --rm \
    datahaven-bsp key insert \
      --keystore-path /data/keystore \
      --chain /testnet-chain-spec.json \
      --key-type bcsv \
      --scheme ecdsa \
      --suri "$SEED"
    ```

    This command writes the resulting key into `/bsp-data/chains/datahaven_testnet/keystore` on your host. You can check if the command was successful by running:

    ```bash
    ls -la bsp-data/keystore/
    ```

    The output should look something like this:

    --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-05.html'

Finally, you have a running BSP node within an easily maintainable Docker container, with an injected keystore on the DataHaven network you've specified.

## Next Steps

<div class="grid cards" markdown>

-  <a href="/provide-storage/backup-storage-provider/verify-bsp-node-via-ui/" markdown>:material-arrow-right: 

    **Verify BSP On-Chain via UI**

    Follow this guide to verify your BSP on-chain using the Polkadot.js Apps UI and thus enable your BSP node to participate in replicating DataHaven's files.

    </a>

-  <a href="/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/" markdown>:material-arrow-right:

    **End-to-End BSP Onboarding**

    This tutorial takes you step-by-step through spinning up a BSP and verifying it on-chain.

    </a>

</div>


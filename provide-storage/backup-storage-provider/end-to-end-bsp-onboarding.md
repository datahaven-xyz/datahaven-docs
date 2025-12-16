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
- [Docker](https://www.docker.com/){target=\_blank} and [Docker Compose](https://docs.docker.com/compose/install/){target=\_blank} installed and running
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

### Deposit Requirements

The formula for the deposit is as follows:

`SpMinDeposit` + (`capacity_in_gib` * `DepositPerData`) + `buffer`

- **`SpMinDeposit`**: Base deposit of 100 MOCK
- **`capacity_in_gib`**: The set GiB capacity of your hardware
- **`DepositPerData`**: 2 MOCK per GiB
- **`buffer`**: An additional safety margin

Examples:

- **800 GiB capacity**: 100 + (800 × 2) = 1,700 MOCK required (1,800 MOCK recommended)
- **1.6 TiB capacity**: 100 + (1,638 × 2) = 3,376 MOCK required (3,500+ MOCK recommended)

The deposit is held (reserved) from your account when you start the BSP registration process and remains held while you operate as a BSP. The deposit is returned when you deregister as a BSP.

!!! note
    Your BSP account must be funded before BSP registration.

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

1. Download the latest client release from the [Releases](https://github.com/datahaven-xyz/datahaven/releases){target=\_blank} section of the DataHaven repo. There, you'll find the latest version of the [`datahaven-node` binary](https://github.com/datahaven-xyz/datahaven/releases/download/{{ networks.testnet.client_version }}/datahaven-node){target=_\blank}. Currently, the latest version is {{ networks.testnet.client_version }}.

Make sure to download it in the root of your `datahaven-bsp-node` folder.

2. Next, [download the testnet chain specs](/downloads/datahaven-testnet-raw-specs.json){target=\_blank} and include them in the root of your project. Make sure the file is called `datahaven-testnet-raw-specs.json`. The specs you use dictate to which DataHaven network your BSP will connect and interact with.

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
    echo "data" > .dockerignore
    ```

    This way the `data` folder and its contents won't get included in the Docker image.

5. Build the Docker image:

    !!! note "Note for macOS (Apple Silicon) users"
        The `--platform=linux/amd64` flag is required on Apple Silicon because the `datahaven-node` binary targets x86_64.

        To ensure proper emulation, open Docker Desktop → **Settings** → **General** → **Apple Virtualization Framework** and enable **Use Rosetta for x86_64/amd64 emulation on Apple Silicon**.

    ```bash
    docker build --platform=linux/amd64 -t datahaven-bsp:latest .
    ```

    The image name can be anything; This tutorial, uses `datahaven-bsp:latest`.
    
    ??? interface "(Optional) Spin up the BSP node now to see what the output is like."

        Going forward, you won't run the BSP this way, but right now you could run a BSP node in the background through the `datahaven-bsp` Docker container with a command like this:

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

        The logs output should be something like:

        --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-01.html'

        If you have spun up this `datahaven-bsp` container, prior to the upcoming step, make sure to stop it and remove it:

        ```bash
        docker stop datahaven-bsp
        docker rm datahaven-bsp
        ```

6. In the root of your project create a `docker-compose.yml` file.

7. Add the following code:

    !!! note
        This step adds the `--chain` flag and updates `volumes` to point to the chain spec you downloaded earlier. If omitted, the node defaults to DataHaven Local Stagenet.  


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

    Docker Compose makes the setup reproducible, easier to maintain, and safer for operators who shouldn’t need to remember every flag manually. It also ensures the node restarts automatically and mounts persistent storage correctly.

8. Run the BSP:

    ```bash
    docker compose up -d
    ```

    The output will look something like this:

    --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-02.html'

9. Check BSP's logs:

    ```bash
    docker compose logs -f | tee bsp.log
    ```

    Make sure the `Chain specification` log is displaying the network that matches the chain spec you are using:

    --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-03.html'

### Useful Docker Commands

A collection of helpful Docker Compose commands you’ll use while developing or debugging your BSP node:

    ```bash
    # run the container in the background
    docker compose up -d

    # stop and remove the container
    docker compose down

    # check status and logs while the container is running
    docker compose ps

    # continuously tail logs in terminal
    docker compose logs -f

    # continuously display logs in terminal and save them into a file
    docker compose logs -f | tee bsp.log

    # continuously stream and continuously save all logs into a file
    docker compose logs -f > bsp.log
    ```

## Inject the BSP Blockchain Service Key

The node has a keystore directory. BSP nodes need the blockchain service key injected into the node's keystore. The key is of type BCSV and scheme ECDSA, which is the same curve scheme that’s used for Ethereum-style keys. That key will serve as your BSP node's "BSP service identity” through which it will sign transactions on-chain.

### Prepare BCSV Key

You have two options:

- Use an already existing seed phrase and derive its SS58 public key.
- Generate a completely new seed phrase and derive its SS58 public key.

!!! note
    If you are a Linux user and can run the `datahaven-node` binary natively, you can replace `docker compose run --rm datahaven-bsp` with `datahaven-node` in the commands below.

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

    --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-04.html'

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

    --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-05.html'

Now, you have a running BSP node within an easily maintainable Docker container, with an injected keystore on the DataHaven network you've specified.

## Verify BSP On-Chain


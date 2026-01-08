---
title: End-to-End BSP Onboarding
description: This step-by-step tutorial follows the full process to spin up your own BSP node and how to register to the DataHaven network.
---

# End-to-End BSP Onboarding

Backup Storage Providers (BSPs) provide redundant storage for files in the DataHaven network, receiving files from Main Storage Providers (MSPs) and submitting proofs of storage.

This tutorial walks through the entire process of bringing a BSP node online, from spinning up the node and selecting the correct chain spec to inserting your private key into the node’s keystore and registering your BSP on-chain. By the end, you will have a fully verified BSP that joins the DataHaven network, accepts storage assignments, and participates in StorageHub’s storage-proof lifecycle.


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
    ```

2. Download the latest client release from the Releases section of the DataHaven repo. There, you'll find the latest version of the [`datahaven-node` binary](https://github.com/datahaven-xyz/datahaven/releases/download/{{ networks.testnet.client_version }}/datahaven-node){target=_\blank}. Currently, the latest version is {{ networks.testnet.client_version }}.

    Make sure to download it in the root of your `datahaven-bsp-node` folder.

3. [Download the testnet chain specs](/downloads/datahaven-testnet-raw-specs.json){target=\_blank} and include them in the root of your project. Make sure the file is called `datahaven-testnet-raw-specs.json`. The specs you use dictate to which DataHaven network your BSP will connect and interact with.

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

6. Generate node key:

    ```bash
    docker run --rm datahaven-bsp:latest key generate-node-key
    ```

    The output should look something like:

    --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-02.html'

7. In the root of your project create a `docker-compose.yml` file.

8. Add the following code:

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
          - "--bsp-charge-fees-min-debt=1000000000000000000"
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

    --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-03.html'

9. Check BSP's logs:

    ```bash
    docker compose logs -f | tee bsp.log
    ```

    Make sure the `Chain specification` log is displaying the network that matches the chain spec you are using:

    --8<-- 'code/provide-storage/backup-storage-provider/end-to-end-bsp-onboarding/output-04.html'

### Useful Docker Commands

A collection of helpful Docker Compose commands you’ll use while developing or debugging your BSP node:

```bash
# Run the container in the background
docker compose up -d

# Stop and remove the container
docker compose down

# Check status and logs while the container is running
docker compose ps

# Continuously tail logs in terminal
docker compose logs -f

# Continuously display logs in terminal and save them into a file
docker compose logs -f | tee bsp.log

# Continuously stream and continuously save all logs into a file
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
    If you are a Linux user and can run the `datahaven-node` binary natively, you can replace `docker compose run --rm datahaven-bsp` with `datahaven-node` in the commands bellow.

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

Now, you have a running BSP node within an easily maintainable Docker container, with an injected keystore on the DataHaven network you've specified.

## Verify BSP Node

This section walks you through the 2-step process of registering your BSP on-chain and verifying that it is eligible to participate in the DataHaven network using [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9946#){target=\_blank} along with your BSP node's `wsUrl`.

### Import BSP Account Into Wallet

To proceed with verifying your BSP node, you must have your BSP account ready to sign transactions in your browser.

1. Install in your browser the [Talisman](https://talisman.xyz/){target=\_blank} wallet if you haven't already.

2. Import into your wallet of choice, the same ECDSA raw seed that you injected into your BSP node's keystore.

### Request BSP Sign Up

Trigger the BSP sign-up flow from Polkadot.js Apps to submit the registration request on-chain.

1. On [Polkadot.js Apps](https://polkadot.js.org/apps/){target=\_blank}, open the navbar on the top left, and set your custom `wsUrl` to be `ws://127.0.0.1:9946`. You should use the port number `9946` because that is the port number you should have defined in your `docker-compose.yml` file.

    ![Set custom wsUrl](/images/provide-storage/verify-bsp-node/verify-bsp-node-1.webp)

2. Within the Developer section, go to the Extrinsics page, and select the `providers.requestBspSignUp` extrinsic. 

    Three parameters are required to execute this extrinsic:

    - capacity
    - multiaddresses
    - paymentAccount

    ![Select the `providers.requestBspSignUp` extrinsic on the Extrinsics page](/images/provide-storage/verify-bsp-node/verify-bsp-node-2.webp)

3. Set capacity based on your machine's capabilities and the [hardware requirements](#hardware-requirements) provided in this guide.

    ![Requesting testnet funds from the faucet](/images/provide-storage/verify-bsp-node/verify-bsp-node-3.webp)

4. In order to find the correct multiaddress, within the Developer section, go to the RPC calls page and submit the `system.localListenAddresses` RPC call. Out of the provided list, you should copy the multiaddress that doesn't contain neither `127.0.0.1` nor `::1`, but the one with the actual IP address such as `192.168.97.2`.

    ![Call `system.localListenAddresses` to find multiaddresses](/images/provide-storage/verify-bsp-node/verify-bsp-node-4.webp)

5. Once you've pasted your multiaddress in the second param field of the `providers.requestBspSignUp` extrinsic, make sure to choose a public address on which you want to receive BSP rewards.

    ![Choose account to receive payments](/images/provide-storage/verify-bsp-node/verify-bsp-node-5.webp)

6. Submit transaction.

    ![Submit transaction](/images/provide-storage/verify-bsp-node/verify-bsp-node-6.webp)

### Confirm BSP Sign Up

Confirm your BSP registration after the required waiting period has passed. You should only trigger the `confirmBspSignUp` method after a new epoch has begun. An epoch lasts 1 hour.

1. Check if a new epoch has begun on Polkadot. js Apps' [Explorer page](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9946#/explorer){target=\_blank}.

    ![Check epoch](/images/provide-storage/verify-bsp-node/verify-bsp-node-7.webp)

2. Go to the Extrinsics page, and select the `providers.confirmSignUp` extrinsic. 


    ![Call `providers.confirmSignUp` extrinsic](/images/provide-storage/verify-bsp-node/verify-bsp-node-8.webp)

3. Submit transaction.

    ![Submit transaction](/images/provide-storage/verify-bsp-node/verify-bsp-node-9.webp)





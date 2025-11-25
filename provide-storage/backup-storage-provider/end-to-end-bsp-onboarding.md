---
title: End-to-End BSP Onboarding
description: This step-by-step tutorial follows the full process to spin up your own BSP node and how to register to the DataHaven network
---

# End-to-End BSP Onboarding

This tutorial will cover the end-to-end process of spinning up a BSP node, using the correct chain spec, inserting your private key into the node keystore, and registering your BSP to the network, in a step-by-step format.

## Prerequisites

Before you begin, ensure you have the following:

- macOS or Linux operating system
- At least 10 GB free disk space (as BSP storage capacity)
- At least 8 GB RAM recommended
- [Docker](https://www.docker.com/){target=\_blank} and [Docker Compose](https://docs.docker.com/compose/install/){target=\_blank} installed and running
- [Node.js ≥ 24](https://nodejs.org/en/download){target=\_blank} installed. LTS version recommended
- A keystore / ECDSA keypair for the BSP node (a 32 byte private key)

## Project Structure

This is how the project structure will look like, once everything is set up.

```
datahaven-bsp-node/
├── datahaven-node
├── data
│   └── storagehub
│       ├── file_storage
│       └── forest_storage
├── Dockerfile
├── docker-compose.yml
├── bsp.log
└── node-base
    └── chains
        ├── datahaven_stragenet_local
        └── ..lorem_testnet..
```

## Download Latest Client Release

From the [Releases](https://github.com/datahaven-xyz/datahaven/releases){target=\_blank} section of the DataHaven repo, the latest version of the `datahaven-node` binary can be found. Currently, the latest version is {{ networks.testnet.client_version }} and it can be downloaded directly from [this link](https://github.com/datahaven-xyz/datahaven/releases/download/v0.7.0/datahaven-node).

Make sure to download it in the root of your `datahaven-bsp-node` folder.

## Make the binary executable

From project root, execute:

```bash
chmod +x datahaven-node
```

## Make Data Directory

```bash
mkdir data
```

## Spin Up BSP Node

Right away you could spin up the BSP node with the following command:

```bash
./datahaven-node \
  --provider \
  --provider-type bsp \
  --max-storage-capacity 10737418240 \
  --jump-capacity=1073741824 \
  --storage-layer rocks-db \
  --storage-path ./data
```

And the output would look something like this:

--8<-- 'code/provide-data/backup-storage-provider/end-to-end-bsp-onboarding/output-01.html'

You've successfully spun up your own BSP node, however the current set up chain spec is `DataHaven Stagenet Local` while we want to connect to testnet and we want a more easily repeatable process than to type in that long command each time. That's where Docker comes in.

## Docker Configuration for the BSP Node

In this section you’ll create the `Dockerfile`, `docker-compose.yml`, and `.dockerignore` needed to run the node, mount your keystore, load the chain spec, and expose the required ports. After this step, your BSP can run cleanly in an isolated, reproducible container.

In the root of your project, create a `Dockerfile` file and add the following code:

```bash
# Force amd64 image so Rosetta can emulate it on your M-chip
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

Also, create a `.dockerignore` file with the `data` folder listed, by running the following command:

```bash
echo "data" > .dockerignore
```

This way the `data` folder and its contents won't get included in the docker image.

Now you can build the docker image with the following command:

!!! note
    The following command has the `--platform=linux/amd64` flag which should be included for macOS users that have an Apple Silicon chip. The `datahaven-binary` is built so it natively supports `x86_64` chips. In order for this flag to work macOS users need to go to their Docker Desktop app and toggle on the `Use Rosetta for x86_64/amd64 emulation on Apple Silicon` setting in Settings -> General -> Virtual Machine Options -> Apple Virtualization Framework.

```bash
docker build --platform=linux/amd64 -t datahaven-bsp:0.7.0 .
```

The image name can be anything. In this tutorial, we'll use `datahaven-bsp:0.7.0`. The output should be the same as before:

--8<-- 'code/provide-data/backup-storage-provider/end-to-end-bsp-onboarding/output-01.html'

Next, in the root of your project, create a `docker-compose.yml` file and add the following code:

```bash
services:
  datahaven-bsp:
    image: datahaven-bsp:0.7.0
    platform: linux/amd64
    container_name: datahaven-bsp
    restart: unless-stopped
    volumes:
      - ./data:/data
      - ./node-base:/node-base
    command:
      - --provider
      - --provider-type
      - bsp
      - --max-storage-capacity
      - "10737418240"
      - --jump-capacity
      - "1073741824"
      - --storage-layer
      - rocks-db
      - --storage-path
      - /data
```

The Dockerfile defines how the BSP node image is built, but the docker-compose.yml defines how that image actually runs: which volumes to mount, which ports to expose, what command to start the node with, and how the container should behave. Compose makes it easy to reproduce the full BSP environment with a single command, without manually passing long flags or managing mounts each time.
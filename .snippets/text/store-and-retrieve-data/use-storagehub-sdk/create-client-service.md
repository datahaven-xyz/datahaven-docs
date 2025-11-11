??? interface "Haven't initialized the SDK?"

    1. Within your `src` folder where `index.ts` should be located, create a new folder called `services` as follows:

        ```shell
        mkdir services && cd services
        ```

        You'll need to set up the necessary clients to connect to the DataHaven network, which runs on a dual-protocol architecture (Substrate for core logic and EVM for compatibility).

    2. Create a `clientService.ts` file and add the following code:

        !!! note
            The code below uses **DataHaven Testnet** configuration values, which include the **Chain ID**, **RPC URL**, **WSS URL**, **MSP URL**, and **token metadata**. If you’re running a **local devnet**, make sure to replace these with your local configuration parameters. You can find all the relevant **local devnet values** in the [Quick Start Guide](/store-and-retrieve-data/quick-start).

        ```ts title="clientService.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/client-service.ts:imports'
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/client-service.ts:initial-clients-setup'
    
        // --- Client Service logic ---
        // **PLACEHOLDER FOR STEP 1: CREATE STORAGEHUB CLIENT**
        // **PLACEHOLDER FOR STEP 2: CREATE POLKADOT API CLIENT**

        // Export initialized clients and accounts for reuse across the project.
        // This allows other modules to easily import shared configuration and avoid duplicate setup.
        export { account, address, publicClient, walletClient, storageHubClient, polkadotApi };
        ```

    3. Initialize the StorageHub Client 

        Add the following code to initialize the StorageHub Client:

        ```ts title="// **PLACEHOLDER FOR STEP 1: CREATE STORAGEHUB CLIENT**"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/client-service.ts:storagehub-client'
        ```

    4. Initialize the Polkadot API Client 

        Add the following code to initialize the Polkadot API Client:

        ```ts title="// **PLACEHOLDER FOR STEP 2: CREATE POLKADOT API CLIENT**"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/client-service.ts:polkadot-api-client'
        ```

    --8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/initialize-client-service-summary.md'

    ??? code "View complete script"

        ```ts title="clientService.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/client-service.ts'
        ```


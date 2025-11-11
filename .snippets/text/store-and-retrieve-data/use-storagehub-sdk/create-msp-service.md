??? interface "Haven't initialized the MSP Client?"

    To interact with DataHaven's Main Storage Provider (MSP) services, you need to establish a connection using the `MspClient` from the StorageHub SDK. This involves configuring the HTTP client, setting up session management for authenticated requests, and initializing the MSP client itself.

    1. Create a `mspService.ts` file within your `services` folder and add the following code:

        !!! note
            The code below uses **DataHaven Testnet** configuration values, which include the **Chain ID**, **RPC URL**, **WSS URL**, **MSP URL**, and **token metadata**. If you’re running a **local devnet**, make sure to replace these with your local configuration parameters. You can find all the relevant **local devnet values** in the [Quick Start Guide](/store-and-retrieve-data/quick-start).

        ```ts title="mspService.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/msp-service.ts:imports'
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/msp-service.ts:initial-setup'
    
        // --- MSP Service logic ---
        // **PLACEHOLDER FOR STEP 1: CONNECT MSP CLIENT **
        // **PLACEHOLDER FOR STEP 2: CREATE MSP HELPER FUNCTIONS **

        // Export initialized clients and accounts for reuse across the project.
        // This allows other modules to easily import shared configuration and avoid duplicate setup.
        export { mspClient, getMspInfo, getMspHealth, authenticateUser };
        ```

    3. Connect to the MSP Client

        Add the following code to connect to the MSP Client:

        ```ts title="// **PLACEHOLDER FOR STEP 1: CONNECT MSP CLIENT**"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/msp-service.ts:connect-msp-client'
        ```

    4. Create MSP Helper Functions

        Add the following code to create MSP helper functions regarding MSP info, MSP health, and user authentication via the MSP:

        ```ts title="// **PLACEHOLDER FOR STEP 2: CREATE MSP HELPER FUNCTIONS**"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/msp-service.ts:msp-helper-functions'
        ```

    --8<-- 'text/store-and-retrieve-data/use-storagehub-sdk/initialize-msp-service-summary.md'

    ??? code "View complete script"

        ```ts title="mspService.ts"
        --8<-- 'code/store-and-retrieve-data/use-storagehub-sdk/get-started/msp-service.ts'
        ```


??? interface "Haven't installed the necessary dependencies?"

    Install the following dependencies:

    === "pnpm"

        ```bash { .break-spaces }
        pnpm add @storagehub-sdk/core @storagehub-sdk/msp-client @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
        ```

    === "yarn"

        ```bash { .break-spaces }
        yarn add @storagehub-sdk/core @storagehub-sdk/msp-client @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
        ```

    === "npm"

        ```bash { .break-spaces }
        npm install @storagehub-sdk/core @storagehub-sdk/msp-client @storagehub/types-bundle @polkadot/api @storagehub/api-augment viem
        ```

    ??? interface "Why do I need these dependencies?"

        - **[`@storagehub/types-bundle`](https://www.npmjs.com/package/@storagehub/types-bundle){target=_blank}:** Describes DataHaven's custom on-chain types.

        - **[`@polkadot/api`](https://www.npmjs.com/package/@polkadot/api){target=_blank}:** The core JavaScript library used to talk to any Substrate-based blockchain, which in our case is DataHaven.

        - **[`@storagehub/api-augment`](https://www.npmjs.com/package/@storagehub/api-augment){target=_blank}:** Extends `@polkadot/api` with DataHaven's custom pallets and RPC methods.

        - **[`viem`](https://www.npmjs.com/package/viem){target=_blank}:** Lightweight library for building Ethereum-compatible applications.

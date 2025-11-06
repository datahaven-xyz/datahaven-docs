!!! warning
    It is assumed that private keys are securely stored and managed in accordance with standard security practices.

With the above code in place, you now have the following:

- **`walletClient`**: Used for signing and broadcasting transactions using the derived private key.
- **`publicClient`**: Used for reading general public data from the chain, such as checking transaction receipts or block status.
- **`polkadotApi`**: Used for reading code chain logic and state data from the underlying DataHaven Substrate node.
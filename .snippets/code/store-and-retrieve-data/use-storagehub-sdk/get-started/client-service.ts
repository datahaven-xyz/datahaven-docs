// --8<-- [start:imports]
import { privateKeyToAccount } from 'viem/accounts';
import {
  createPublicClient,
  createWalletClient,
  http,
  WalletClient,
  PublicClient,
} from 'viem';
import { StorageHubClient } from '@storagehub-sdk/core';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { NETWORK, chain } from '../config/networks.js';
// --8<-- [end:imports]
// --8<-- [start:initial-clients-setup]
const account = privateKeyToAccount('INSERT_PRIVATE_KEY' as `0x${string}`);
const address = account.address;

// Create signer from secret URI
await cryptoWaitReady();
const walletKeyring = new Keyring({ type: 'ethereum' });
const signer = walletKeyring.addFromUri('INSERT_PRIVATE_KEY');

const walletClient: WalletClient = createWalletClient({
  chain,
  account,
  transport: http(NETWORK.rpcUrl),
});

const publicClient: PublicClient = createPublicClient({
  chain,
  transport: http(NETWORK.rpcUrl),
});
// --8<-- [end:initial-clients-setup]

// --8<-- [start:storagehub-client]
// Create StorageHub client
const storageHubClient: StorageHubClient = new StorageHubClient({
  rpcUrl: NETWORK.rpcUrl,
  chain: chain,
  walletClient: walletClient,
  filesystemContractAddress: NETWORK.filesystemContractAddress,
});
// --8<-- [end:storagehub-client]

// --8<-- [start:polkadot-api-client]
// Create Polkadot API client
const provider = new WsProvider(NETWORK.wsUrl);
const polkadotApi: ApiPromise = await ApiPromise.create({
  provider,
  typesBundle: types,
  noInitWarn: true,
});
// --8<-- [end:polkadot-api-client]

export {
  account,
  address,
  signer,
  publicClient,
  walletClient,
  storageHubClient,
  polkadotApi,
};

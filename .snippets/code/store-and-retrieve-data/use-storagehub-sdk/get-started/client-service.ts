// --8<-- [start:imports]
import { privateKeyToAccount } from 'viem/accounts';
import { Chain, defineChain } from 'viem';
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
// --8<-- [end:imports]
// --8<-- [start:initial-clients-setup]
const account = privateKeyToAccount('INSERT_PRIVATE_KEY' as `0x${string}`);
const address = account.address;

// Create substrate signer from secret URI
await cryptoWaitReady();
const walletKeyring = new Keyring({ type: 'ethereum' });
const signer = walletKeyring.addFromUri('INSERT_PRIVATE_KEY');

const NETWORKS = {
  devnet: {
    id: 181222,
    name: 'DataHaven Local Devnet',
    rpcUrl: 'http://127.0.0.1:9666',
    wsUrl: 'wss://127.0.0.1:9666',
    mspUrl: 'http://127.0.0.1:8080/',
    nativeCurrency: { name: 'StorageHub', symbol: 'SH', decimals: 18 },
  },
  testnet: {
    id: 55931,
    name: 'DataHaven Testnet',
    rpcUrl: 'https://services.datahaven-testnet.network/testnet',
    wsUrl: 'wss://services.datahaven-testnet.network/testnet',
    mspUrl: 'https://deo-dh-backend.testnet.datahaven-infra.network/',
    nativeCurrency: { name: 'Mock', symbol: 'MOCK', decimals: 18 },
  },
};

const chain: Chain = defineChain({
  id: NETWORKS.testnet.id,
  name: NETWORKS.testnet.name,
  nativeCurrency: NETWORKS.testnet.nativeCurrency,
  rpcUrls: { default: { http: [NETWORKS.testnet.rpcUrl] } },
});

const walletClient: WalletClient = createWalletClient({
  chain,
  account,
  transport: http(NETWORKS.testnet.rpcUrl),
});

const publicClient: PublicClient = createPublicClient({
  chain,
  transport: http(NETWORKS.testnet.rpcUrl),
});
// --8<-- [end:initial-clients-setup]

// --8<-- [start:storagehub-client]
// Create StorageHub client
const storageHubClient: StorageHubClient = new StorageHubClient({
  rpcUrl: NETWORKS.testnet.rpcUrl,
  chain: chain,
  walletClient: walletClient,
  filesystemContractAddress:
    '0x0000000000000000000000000000000000000404' as `0x${string}`,
});
// --8<-- [end:storagehub-client]

// --8<-- [start:polkadot-api-client]
// Create Polkadot API client
const provider = new WsProvider(NETWORKS.testnet.wsUrl);
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

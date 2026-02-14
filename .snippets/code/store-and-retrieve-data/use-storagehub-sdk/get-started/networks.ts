import { Chain, defineChain } from 'viem';

export const NETWORKS = {
  devnet: {
    id: 181222,
    name: 'DataHaven Local Devnet',
    rpcUrl: 'http://127.0.0.1:9666',
    wsUrl: 'ws://127.0.0.1:9666',
    mspUrl: 'http://127.0.0.1:8080/',
    nativeCurrency: { name: 'StorageHub', symbol: 'SH', decimals: 18 },
    filesystemContractAddress:
      '0x0000000000000000000000000000000000000064' as `0x${string}`,
  },
  testnet: {
    id: 55931,
    name: 'DataHaven Testnet',
    rpcUrl: 'https://services.datahaven-testnet.network/testnet',
    wsUrl: 'wss://services.datahaven-testnet.network/testnet',
    mspUrl: 'https://deo-dh-backend.testnet.datahaven-infra.network/',
    nativeCurrency: { name: 'Mock', symbol: 'MOCK', decimals: 18 },
    filesystemContractAddress:
      '0x0000000000000000000000000000000000000404' as `0x${string}`,
  },
};

export const NETWORK = NETWORKS.testnet; // Change this to switch between devnet and testnet

export const chain: Chain = defineChain({
  id: NETWORK.id,
  name: NETWORK.name,
  nativeCurrency: NETWORK.nativeCurrency,
  rpcUrls: { default: { http: [NETWORK.rpcUrl] } },
});

import { Chain, defineChain, createWalletClient, WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Define datahaven chain as expected by viem
const chain = defineChain({
  id: 1283,
  name: 'DataHaven Stagenet',
  nativeCurrency: { name: 'Have', symbol: 'HAVE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://services.datahaven-dev.network/stagenet'] },
  },
});

// Define account from a private key
const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

// Create a wallet client using defined chain, account, and RPC url
const walletClient: WalletClient = createWalletClient({
  chain,
  account,
  transport: http('https://services.datahaven-dev.network/stagenet'),
});

// Initialize StorageHub Client
const storageHubClient = new StorageHubClient({
  rpcUrl: 'https://services.datahaven-dev.network/stagenet',
  chain: chain,
  walletClient: walletClient,
  filesystemContractAddress:
    '0x0000000000000000000000000000000000000404' as `0x${string}`,
});

// Add this line to the end of the script after everything has executed - at the end of the run function
await substrateApi.disconnect();

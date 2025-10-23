import { Chain, defineChain, createWalletClient, WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Define datahaven chain as expected by viem
const chain: Chain = defineChain({
  id: 1283,
  name: 'DataHaven Stagenet',
  nativeCurrency: { name: 'Have', symbol: 'HAVE', decimals: 18 },
  rpcUrls: {
    default: { http: ['TODO'] },
  },
});

// Define account from a private key
const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
// Extract address from account
const address = account.address;

// Create a wallet client using defined chain, account, and RPC url
const walletClient: WalletClient = createWalletClient({
  chain,
  account,
  transport: http('TODO'),
});

// Initialize StorageHub Client
const storageHubClient = new StorageHubClient({
  rpcUrl: 'TODO',
  chain: chain,
  walletClient: walletClient,
  filesystemContractAddress:
    '0x0000000000000000000000000000000000000404' as `0x${string}`,
});

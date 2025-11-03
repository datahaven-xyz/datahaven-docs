// --8<-- [start:imports]
import '@storagehub/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';
import {
  HttpClientConfig,
  initWasm,
} from '@storagehub-sdk/core';
import {
  AuthStatus,
  HealthStatus,
  MspClient,
  UserInfo,
} from '@storagehub-sdk/msp-client';
import {
  Chain,
  WalletClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
// --8<-- [end:imports]

async function run() {
  // --8<-- [start:initialize-clients]
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();

  // --- viem setup ---
  // Define DataHaven chain, as expected by viem
  const chain: Chain = defineChain({
    id: 1283,
    name: 'DataHaven Stagenet',
    nativeCurrency: { name: 'Have', symbol: 'HAVE', decimals: 18 },
    rpcUrls: {
      default: { http: ['TODO'] },
    },
  });

  // Define account from a private key
  const account = privateKeyToAccount('INSERT_PRIVATE_KEY' as `0x${string}`);

  // Create a wallet client using the defined chain, account, and RPC URL
  const walletClient: WalletClient = createWalletClient({
    chain,
    account,
    transport: http('TODO'),
  });

  // --- Polkadot.js API setup ---
  const provider = new WsProvider('TODO');
  const polkadotApi: ApiPromise = await ApiPromise.create({
    provider,
    typesBundle: types,
    noInitWarn: true,
  });

  // --- Connect to MSP Client ---
  const baseUrl = 'TODO';
  const httpConfig: HttpClientConfig = { baseUrl: baseUrl };
  const mspClient = await MspClient.connect(httpConfig, polkadotApi);

  // Check MSP Health Status
  const mspHealth: HealthStatus = await mspClient.info.getHealth();
  console.log('MSP service health:', mspHealth);
  // --8<-- [end:initialize-clients]

  // --- Authenticate via SIWE and JWT logic ---
  // --8<-- [start:authenticate-via-msp]
  // Check if the user is already authenticated with the MSP
  const auth: AuthStatus = await mspClient.auth.getAuthStatus();
  console.log('MSP Auth Status:', auth.status);

  // If not authenticated, trigger the SIWE (Sign-In with Ethereum) flow.
  // This prompts the connected wallet to sign an EIP-4361 message,
  // which the MSP backend verifies to issue a JWT session token
  if (auth.status !== 'Authenticated') {
    await mspClient.auth.SIWE(walletClient);
    console.log('User authenticated with MSP via SIWE');
  }
  // --8<-- [end:authenticate-via-msp]

  // --8<-- [start:retrieve-user-profile]
  // Retrieve and log the authenticated user's profile.
  // This includes wallet address and, if available, ENS name
  const profile: UserInfo = await mspClient.auth.getProfile();
  console.log('Authenticated user profile:', profile);
  // --8<-- [end:retrieve-user-profile]
}

await run();

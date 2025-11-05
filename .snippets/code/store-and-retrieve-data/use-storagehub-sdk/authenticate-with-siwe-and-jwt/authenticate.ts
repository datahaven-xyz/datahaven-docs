// --8<-- [start:imports]
import '@storagehub/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';
import { HttpClientConfig, initWasm } from '@storagehub-sdk/core';
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
    id: 1288,
    name: 'DataHaven Testnet',
    nativeCurrency: { name: 'Have', symbol: 'HAVE', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://services.datahaven-testnet.network/testnet'] },
    },
  });

  // Define account from a private key
  const account = privateKeyToAccount('INSERT_PRIVATE_KEY' as `0x${string}`);
  const address = account.address;

  // Create a wallet client using the defined chain, account, and RPC URL
  const walletClient: WalletClient = createWalletClient({
    chain,
    account,
    transport: http('https://services.datahaven-testnet.network/testnet'),
  });

  // --- Polkadot.js API setup ---
  const provider = new WsProvider(
    'wss://services.datahaven-testnet.network/testnet'
  );
  const polkadotApi: ApiPromise = await ApiPromise.create({
    provider,
    typesBundle: types,
    noInitWarn: true,
  });

  // --- Connect to MSP Client ---
  // Base URL of the MSP backend you want to interact with.
  const baseUrl = 'https://deo-dh-backend.testnet.datahaven-infra.network/';

  // Configuration for the HTTP client used by the SDK internally.
  const httpConfig: HttpClientConfig = { baseUrl: baseUrl };

  // A temporary authentication token obtained after Sign-In with Ethereum (SIWE).
  // If not yet authenticated, this will remain undefined and the client will operate in read-only mode.
  // Authentication is not required for issuing storage requests, but is needed for other operations like file uploads and bucket management.
  let sessionToken: string | undefined = undefined;

  // Provides the SDK with session data when available.
  // This callback is automatically invoked by the MSP Client whenever it needs to authenticate a request.
  const sessionProvider = async () =>
    sessionToken
      ? ({ token: sessionToken, user: { address: address } } as const)
      : undefined;

  // Create an instance of the MSP Client and establish connection with the backend.
  const mspClient = await MspClient.connect(httpConfig, sessionProvider);

  // Check MSP Health Status
  const mspHealth: HealthStatus = await mspClient.info.getHealth();
  console.log('MSP service health:', mspHealth);
  // --8<-- [end:initialize-clients]

  // --- Authenticate via SIWE and JWT logic ---
  // --8<-- [start:authenticate-via-msp]

  // Trigger the SIWE (Sign-In with Ethereum) flow to get authenticated.
  // The SIWE method prompts the connected wallet to sign an EIP-4361 message,
  // which the MSP backend verifies to issue a JWT session token
  const siweSession = await mspClient.auth.SIWE(walletClient);
  console.log('SIWE Session:', siweSession);
  // Store the obtained session token for future authenticated requests
  sessionToken = (siweSession as { token: string }).token;

  // --8<-- [end:authenticate-via-msp]

  // --8<-- [start:retrieve-user-profile]
  // Retrieve and log the authenticated user's profile.
  // This includes wallet address and, if available, ENS name
  const profile: UserInfo = await mspClient.auth.getProfile();
  console.log('Authenticated user profile:', profile);
  // --8<-- [end:retrieve-user-profile]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();

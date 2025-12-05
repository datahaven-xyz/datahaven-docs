// --8<-- [start:imports]
import {
  HealthStatus,
  InfoResponse,
  MspClient,
  UserInfo,
} from '@storagehub-sdk/msp-client';
import { HttpClientConfig } from '@storagehub-sdk/core';
import { address, walletClient } from './clientService.js';
// --8<-- [end:imports]

// --8<-- [start:initial-setup]
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
// --8<-- [end:initial-setup]

// --8<-- [start:connect-msp-client]
// Configure the HTTP client to point to the MSP backend
const httpCfg: HttpClientConfig = { baseUrl: NETWORKS.testnet.mspUrl };

// Initialize a session token for authenticated requests (updated after authentication
// through SIWE)
let sessionToken: string | undefined = undefined;

// Provide session information to the MSP client whenever available
// Returns a token and user address if authenticated, otherwise undefined
const sessionProvider = async () =>
  sessionToken
    ? ({ token: sessionToken, user: { address: address } } as const)
    : undefined;

// Establish a connection to the Main Storage Provider (MSP) backend
const mspClient = await MspClient.connect(httpCfg, sessionProvider);
// --8<-- [end:connect-msp-client]

// --8<-- [start:msp-helper-functions]
// Retrieve MSP metadata, including its unique ID and version, and log it to the console
const getMspInfo = async (): Promise<InfoResponse> => {
  const mspInfo = await mspClient.info.getInfo();
  console.log(`MSP ID: ${mspInfo.mspId}`);
  return mspInfo;
};

// Retrieve and log the MSP’s current health status
const getMspHealth = async (): Promise<HealthStatus> => {
  const mspHealth = await mspClient.info.getHealth();
  console.log(`MSP Health: ${mspHealth}`);
  return mspHealth;
};

// --8<-- [start:auth-user]
// Authenticate the user via SIWE (Sign-In With Ethereum) using the connected wallet
// Once authenticated, store the returned session token and retrieve the user’s profile
const authenticateUser = async (): Promise<UserInfo> => {
  console.log('Authenticating user with MSP via SIWE...');

  // In development domain and uri can be arbitrary placeholders,
  // but in production they must match your actual frontend origin.
  const domain = 'localnost';
  const uri = 'http://localnost';

  const siweSession = await mspClient.auth.SIWE(walletClient, domain, uri);
  console.log('SIWE Session:', siweSession);
  sessionToken = (siweSession as { token: string }).token;

  const profile: UserInfo = await mspClient.auth.getProfile();
  return profile;
};
// --8<-- [end:auth-user]
// --8<-- [end:msp-helper-functions]

// Export initialized client and helper functions for use in other modules
export { mspClient, getMspInfo, getMspHealth, authenticateUser };

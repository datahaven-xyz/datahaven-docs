import type { UserInfo } from '@storagehub-sdk/msp-client';

// Assumes the following are available in scope from prior setup:
// - walletClient (viem WalletClient with an account)
// - mspClient configured with a sessionProvider that returns { token, user: { address } }
// - a module-level `sessionToken: string | undefined` that sessionProvider reads

// Authenticate user (SIWE) and cache the JWT for the sessionProvider
const authenticateUser = async (): Promise<UserInfo> => {
  const siweSession = await mspClient.auth.SIWE(walletClient);
  console.log('SIWE Session:', siweSession);

  sessionToken = (siweSession as { token?: string }).token;
  if (!sessionToken) throw new Error('SIWE did not return a session token');

  const profile: UserInfo = await mspClient.auth.getProfile();
  console.log('Authenticated user profile:', profile);

  return profile;
};
import type { AuthStatus, UserInfo } from '@storagehub-sdk/msp-client';

// Assumes the following are available in scope:
// - mspClient, walletClient

// Check auth status and authenticate if needed (SIWE)
const auth: AuthStatus = await mspClient.auth.getAuthStatus();
console.log('MSP Auth Status:', auth.status);

if (auth.status !== 'Authenticated') {
  await mspClient.auth.SIWE(walletClient);
  console.log('User authenticated with MSP via SIWE');
}

// Fetch authenticated profile info
const profile: UserInfo = await mspClient.auth.getProfile();
console.log('Authenticated user profile:', profile);



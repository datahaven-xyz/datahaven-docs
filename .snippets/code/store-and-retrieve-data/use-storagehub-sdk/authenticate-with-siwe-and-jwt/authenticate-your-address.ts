import { AuthStatus } from '@storagehub-sdk/msp-client';

// Check if the user is already authenticated with the MSP
const auth: AuthStatus = await mspClient.auth.getAuthStatus();
console.log('MSP Auth Status:', auth.status);

// If not authenticated, trigger the SIWE (Sign-In with Ethereum) flow
// This prompts the connected wallet to sign an EIP-4361 message,
// which the MSP backend verifies to issue a JWT session token.
if (auth.status !== 'Authenticated') {
  await mspClient.auth.SIWE(walletClient);
  console.log('User authenticated with MSP via SIWE');
}

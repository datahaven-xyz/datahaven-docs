import { UserInfo } from '@storagehub-sdk/msp-client';

// Retrieve and log the authenticated user's profile
// This includes wallet address and, if available, ENS name.
const profile: UserInfo = await mspClient.auth.getProfile();
console.log('Authenticated user profile:', profile);

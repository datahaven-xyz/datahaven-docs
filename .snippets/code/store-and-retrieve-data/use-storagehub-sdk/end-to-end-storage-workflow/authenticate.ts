// Prior section code here
  
// Trigger the SIWE (Sign-In with Ethereum) flow.
// This prompts the connected wallet to sign an EIP-4361 message,
// which the MSP backend verifies to issue a JWT session token
const siweSession = await mspClient.auth.SIWE(walletClient);
console.log('SIWE Session:', siweSession);
// Store the obtained session token for future authenticated requests
sessionToken = (siweSession as { token: string }).token;

// Next section code here

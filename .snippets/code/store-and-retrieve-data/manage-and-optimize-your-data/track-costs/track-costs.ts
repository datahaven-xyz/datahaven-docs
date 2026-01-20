// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { address, polkadotApi } from './services/clientService.js';
import { authenticateUser, getPaymentStreams } from './services/mspService.js';
import {
  calculateTimeRemaining,
  getBalance,
} from './operations/costOperations.js';
// --8<-- [end:imports]

async function run() {
  // Initialize WASM
  await initWasm();

  // --8<-- [start:authenticate]
  // Authenticate
  const authProfile = await authenticateUser();
  console.log('Authenticated user profile:', authProfile);
  // --8<-- [end:authenticate]

  // --8<-- [start:payment-streams]
  // Get payment streams from MSP
  const paymentStreams = await getPaymentStreams();
  console.log('Payment Streams:', paymentStreams);
  // --8<-- [end:payment-streams]

  // --8<-- [start:calculate-time-remaining]
  // Calculate time remaining based on balance and payment streams
  const balance = await getBalance(address); // MOCK tokens
  const result = calculateTimeRemaining(balance, paymentStreams);
  console.log(`Time remaining: ${result.formatted}`);
  // --8<-- [end:calculate-time-remaining]

  // Disconnect from Polkadot API
  await polkadotApi.disconnect();
}

run();

// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { address, polkadotApi } from './services/clientService.js';
import { authenticateUser, getPaymentStreams } from './services/mspService.js';
import {
  calculateTotalOutstandingDebt,
  clearInsolventFlag,
  getBalance,
  isInsolvent,
  payOutstandingDebt,
} from './operations/costOperations.js';
import { PaymentStreamInfo } from '@storagehub-sdk/msp-client';
import { formatEther } from 'viem';
// --8<-- [end:imports]

async function run() {
  // Initialize WASM
  await initWasm();

  // --8<-- [start:check-insolvent-status]
  // Check if insolvent
  const insolventStatus = await isInsolvent(address);
  console.log(`Insolvent status for ${address}:`, insolventStatus);
  if (!insolventStatus) {
    console.log('Not insolvent, no action needed.');
    await polkadotApi.disconnect();
    return;
  }
  // --8<-- [end:check-insolvent-status]

  // --8<-- [start:authenticate]
  // Authenticate
  const authProfile = await authenticateUser();
  console.log('Authenticated user profile:', authProfile);
  // --8<-- [end:authenticate]

  // --8<-- [start:payment-streams]
  // Get payment streams from MSP
  const paymentStreams = await getPaymentStreams();
  console.log('Payment Streams:', paymentStreams);

  // Extract unique provider IDs
  const providerIds = [
    ...new Set(
      paymentStreams.streams.map(
        (stream: PaymentStreamInfo) => stream.provider,
      ),
    ),
  ];
  console.log('Provider IDs:', providerIds);
  // --8<-- [end:payment-streams]

  // --8<-- [start:pay-outstanding-debt]
  const balance = await getBalance(address); // MOCK token in wei
  console.log(
    `Current balance: ${balance} (wei), ${Number(formatEther(balance))} (MOCK)`,
  );
  // Calculate total outstanding debt
  const { totalRawDebt, totalEffectiveDebt } =
    await calculateTotalOutstandingDebt(address, paymentStreams);
  // Log debts
  console.log(
    `Total Raw Debt: ${totalRawDebt} (wei), ${Number(formatEther(totalRawDebt))} (MOCK)`,
  );
  console.log(
    `Total Effective Debt: ${totalEffectiveDebt} (wei), ${Number(formatEther(totalEffectiveDebt))} (MOCK)`,
  );

  if (balance < totalEffectiveDebt) {
    console.log('Insufficient balance to pay outstanding debt.');
    await polkadotApi.disconnect();
    return;
  }

  // Pay outstanding debt
  await payOutstandingDebt(providerIds);
  // --8<-- [end:pay-outstanding-debt]

  // --8<-- [start:clear-insolvent-flag]
  // Clear insolvent flag
  await clearInsolventFlag();
  // --8<-- [end:clear-insolvent-flag]

  // --8<-- [start:recheck-insolvent-status]
  // Re-check insolvent status
  const newInsolventStatus = await isInsolvent(address);
  console.log(`New insolvent status for ${address}:`, newInsolventStatus);
  // --8<-- [end:recheck-insolvent-status]

  // Disconnect from Polkadot API
  await polkadotApi.disconnect();
}

run();

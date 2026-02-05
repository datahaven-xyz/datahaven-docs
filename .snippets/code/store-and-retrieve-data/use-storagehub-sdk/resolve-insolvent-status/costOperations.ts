// --8<-- [start:imports]
import { polkadotApi, publicClient } from '../services/clientService';
import { PaymentStreamsResponse } from '@storagehub-sdk/msp-client';
import { signer } from '../services/clientService';
// --8<-- [end:imports]

// --8<-- [start:get-balance]
const getBalance = async (address: `0x${string}`): Promise<bigint> => {
  // Query balance
  const balanceWei = await publicClient.getBalance({ address });
  return balanceWei;
};
// --8<-- [end:get-balance]

// --8<-- [start:is-insolvent]
const isInsolvent = async (address: string) => {
  // Query if user is labelled as insolvent by the network
  const userWithoutFundsResponse =
    await polkadotApi.query.paymentStreams.usersWithoutFunds(address);
  console.log(
    `User ${address} without funds response:`,
    userWithoutFundsResponse.toHuman(),
  );
  // If the userWithoutFundsResponse is null, it means the user is not insolvent
  const userIsInsolvent = userWithoutFundsResponse.isSome;
  return userIsInsolvent;
};
// --8<-- [end:is-insolvent]

// --8<-- [start:calculate-total-outstanding-debt]
const calculateTotalOutstandingDebt = async (
  address: string,
  paymentStreams: PaymentStreamsResponse,
) => {
  const seen = new Set<string>();

  // Get current price index
  const currentPriceIndex =
    await polkadotApi.query.paymentStreams.accumulatedPriceIndex();
  // Get latest block
  const currentHeader = await polkadotApi.rpc.chain.getHeader();
  const currentTick = currentHeader.number;

  let totalRawDebt = 0n;
  let totalEffectiveDebt = 0n;

  // For each unique provider id, query the on-chain storage to get the amount owed
  for (const { provider, providerType } of paymentStreams.streams) {
    if (seen.has(provider)) continue;
    seen.add(provider);

    // Depending on provider type, query respective storage map
    // For BSPs, we calculate debt based on the dynamic rate payment stream formula
    // For MSPs, we calculate debt based on the fixed rate payment stream formula
    if (providerType === 'bsp') {
      const stream =
        await polkadotApi.query.paymentStreams.dynamicRatePaymentStreams(
          provider,
          address,
        );
      if (stream.isSome) {
        const dynamicRatePaymentStream = stream.unwrap();

        // Raw debt for BSP payment stream is calculated as:
        // (current price index - price index when last charged) * amount provided / 2^30
        // Price index is per giga-unit (2^30 bytes = 1 GB); divide to scale by actual amount
        const rawDebt =
          ((currentPriceIndex.toBigInt() -
            dynamicRatePaymentStream.priceIndexWhenLastCharged.toBigInt()) *
            dynamicRatePaymentStream.amountProvided.toBigInt()) /
          2n ** 30n;

        // Effective debt is capped by user deposit
        const effectiveDebt =
          rawDebt < dynamicRatePaymentStream.userDeposit.toBigInt()
            ? rawDebt
            : dynamicRatePaymentStream.userDeposit.toBigInt();
        totalRawDebt += rawDebt;
        totalEffectiveDebt += effectiveDebt;
      }
    } else if (providerType === 'msp') {
      const stream =
        await polkadotApi.query.paymentStreams.fixedRatePaymentStreams(
          provider,
          address,
        );
      if (stream.isSome) {
        const fixedRatePaymentStream = stream.unwrap();
        // Raw debt for MSP payment stream is calculated as (current tick - last charged tick) * rate
        const rawDebt =
          (currentTick.toBigInt() -
            fixedRatePaymentStream.lastChargedTick.toBigInt()) *
          fixedRatePaymentStream.rate.toBigInt();
        // Effective debt is capped by user deposit
        const effectiveDebt =
          rawDebt < fixedRatePaymentStream.userDeposit.toBigInt()
            ? rawDebt
            : fixedRatePaymentStream.userDeposit.toBigInt();
        totalRawDebt += rawDebt;
        totalEffectiveDebt += effectiveDebt;
      }
    }
  }
  return { totalRawDebt, totalEffectiveDebt };
};
// --8<-- [end:calculate-total-outstanding-debt]

// --8<-- [start:pay-outstanding-debt]
const payOutstandingDebt = async (providerIds: string[]) => {
  // Create and send transaction to pay outstanding debt
  const confirmTx =
    polkadotApi.tx.paymentStreams.payOutstandingDebt(providerIds);

  await new Promise<void>((resolve, reject) => {
    confirmTx
      .signAndSend(signer, ({ status, dispatchError }) => {
        console.log('Paying outstanding debt...');
        if (status.isFinalized) {
          if (dispatchError) {
            if (dispatchError.isModule) {
              // get details of the error
              const decoded = polkadotApi.registry.findMetaError(
                dispatchError.asModule,
              );
              reject(
                new Error(
                  `${decoded.section}.${decoded.method}: ${decoded.docs.join(' ')}`,
                ),
              );
            } else {
              // Other, CannotLookup, BadOrigin, no extra info
              reject(new Error(dispatchError.toString()));
            }
          } else {
            console.log('Outstanding debt paid successfully!');
            resolve();
          }
        }
      })
      .catch(reject);
  });
};
// --8<-- [end:pay-outstanding-debt]

// --8<-- [start:clear-insolvent-flag]
const clearInsolventFlag = async () => {
  // Create and send transaction to clear insolvent flag
  const confirmTx = polkadotApi.tx.paymentStreams.clearInsolventFlag();

  await new Promise<void>((resolve, reject) => {
    confirmTx
      .signAndSend(signer, ({ status, dispatchError }) => {
        console.log('Clearing insolvent flag...');
        if (status.isFinalized) {
          if (dispatchError) {
            if (dispatchError.isModule) {
              // get details of the error
              const decoded = polkadotApi.registry.findMetaError(
                dispatchError.asModule,
              );
              reject(
                new Error(
                  `${decoded.section}.${decoded.method}: ${decoded.docs.join(' ')}`,
                ),
              );
            } else {
              // Other, CannotLookup, BadOrigin, no extra info
              reject(new Error(dispatchError.toString()));
            }
          } else {
            console.log('Insolvent flag cleared successfully!');
            resolve();
          }
        }
      })
      .catch(reject);
  });
};
// --8<-- [end:clear-insolvent-flag]

export {
  getBalance,
  isInsolvent,
  calculateTotalOutstandingDebt,
  payOutstandingDebt,
  clearInsolventFlag,
};

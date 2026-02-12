// --8<-- [start:imports]
import { polkadotApi, publicClient } from '../services/clientService.js';
import { PaymentStreamsResponse } from '@storagehub-sdk/msp-client';
import { signer } from '../services/clientService.js';
// --8<-- [end:imports]

// --8<-- [start:get-balance]
const getBalance = async (address: `0x${string}`): Promise<bigint> => {
  // Query balance
  const balanceWei = await publicClient.getBalance({ address });
  return balanceWei;
};
// --8<-- [end:get-balance]

// --8<-- [start:is-insolvent]
const isInsolvent = async (address: `0x${string}`) => {
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
  address: `0x${string}`,
  paymentStreams: PaymentStreamsResponse,
) => {
  const seen = new Set<string>();

  // Current tick from proofs dealer — used for MSPs (privileged providers)
  const currentTick = await polkadotApi.call.proofsDealerApi.getCurrentTick();

  let totalRawDebt = 0n;
  let totalEffectiveDebt = 0n;

  for (const { provider, providerType } of paymentStreams.streams) {
    if (seen.has(provider)) continue;
    seen.add(provider);

    if (providerType === 'bsp') {
      // BSPs use per-provider LastChargeableInfo (updated on proof submission)
      const lastChargeableInfo =
        await polkadotApi.query.paymentStreams.lastChargeableInfo(provider);

      if (!lastChargeableInfo) continue;

      const stream =
        await polkadotApi.query.paymentStreams.dynamicRatePaymentStreams(
          provider,
          address,
        );
      if (stream.isSome) {
        const dynamicRatePaymentStream = stream.unwrap();

        const rawDebt =
          ((lastChargeableInfo.priceIndex.toBigInt() -
            dynamicRatePaymentStream.priceIndexWhenLastCharged.toBigInt()) *
            dynamicRatePaymentStream.amountProvided.toBigInt()) /
          2n ** 30n;

        const effectiveDebt =
          rawDebt < dynamicRatePaymentStream.userDeposit.toBigInt()
            ? rawDebt
            : dynamicRatePaymentStream.userDeposit.toBigInt();
        totalRawDebt += rawDebt;
        totalEffectiveDebt += effectiveDebt;
      }
    } else if (providerType === 'msp') {
      // MSPs are privileged providers — they can charge up to the current tick
      const stream =
        await polkadotApi.query.paymentStreams.fixedRatePaymentStreams(
          provider,
          address,
        );
      if (stream.isSome) {
        const fixedRatePaymentStream = stream.unwrap();

        const rawDebt =
          (currentTick.toBigInt() -
            fixedRatePaymentStream.lastChargedTick.toBigInt()) *
          fixedRatePaymentStream.rate.toBigInt();

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
              // Get details of the error
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
              // Get details of the error
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

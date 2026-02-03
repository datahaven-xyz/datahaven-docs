// --8<-- [start:imports]
import { polkadotApi } from '../services/clientService';
import { signer } from '../services/clientService';
// --8<-- [end:imports]

// --8<-- [start:is-insolvent]
const isInsolvent = async (address: string) => {
  // Query if user is labelled as insolvent by the network
  const userWithoutFundsResponse =
    await polkadotApi.query.paymentStreams.usersWithoutFunds(address);
  console.log(
    `User ${address} without funds response:`,
    userWithoutFundsResponse.toHuman(),
  );
  const isInsolvent = userWithoutFundsResponse.isSome;
  return isInsolvent;
};
// --8<-- [end:is-insolvent]

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
              // for module errors, we have the section and the name
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
              // for module errors, we have the section and the name
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

export { isInsolvent, payOutstandingDebt, clearInsolventFlag };

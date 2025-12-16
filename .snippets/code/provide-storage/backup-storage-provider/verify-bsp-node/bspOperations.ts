// --8<-- [start:imports]
import { Binary } from 'polkadot-api';
import { signer, bspSigner } from '../services/bspService.js';
import { polkadotApi } from '../services/clientService.js';
// --8<-- [end:imports]

// --8<-- [start:fund-bsp-address]
export async function fundBspAddress(bspAddress: string, amount: bigint) {
  console.log('Recipient:', bspAddress);
  console.log('Amount (raw):', amount.toString());

  // Build transfer extrinsic
  const tx = polkadotApi.tx.balances.transferKeepAlive(bspAddress, amount);

  const unsub = await tx.signAndSend(signer, (result) => {
    const { status, dispatchError } = result;
    console.log(`Current status: ${status.type}`);

    if (dispatchError) {
      if (dispatchError.isModule) {
        const decoded = polkadotApi.registry.findMetaError(
          dispatchError.asModule
        );
        const { name, section } = decoded;
        console.log(`Error: ${section}.${name}`);
      }
    }

    if (status.isFinalized) {
      console.log('Transaction successfully finalized');
      unsub();
    }
  });
}
// --8<-- [end:fund-bsp-address]

// --8<-- [start:check-bsp-balance]
export async function checkBspBalance(bspAddress: string) {
  // Query balance
  const { data: balance } = await polkadotApi.query.system.account(bspAddress);
  console.log(`BSP Address Balance: ${balance.free.toBigInt()} (raw units)`);
}
// --8<-- [end:check-bsp-balance]

// --8<-- [start:request-bsp-sign-up]
export async function requestBspSignUp(
  bspAddress: string,
  multiaddresses: Binary[],
  capacity: bigint
) {
  // Step 1: Request BSP sign up
  const requestTx = polkadotApi.tx.Providers.request_bsp_sign_up({
    capacity: capacity,
    multiaddresses: multiaddresses,
    payment_account: bspSigner.publicKey, // Account receiving payments
  });

  // Sign and submit the request
  await new Promise<void>((resolve, reject) => {
    requestTx
      .signAndSend(bspSigner, ({ status, dispatchError }) => {
        console.log('BSP sign-up requested. Waiting for finalization...');
        if (dispatchError) {
          reject(dispatchError);
        }
        if (status.isFinalized) {
          console.log('Request finalized! Deposit has been reserved.');
          resolve();
        }
      })
      .catch(reject);
  });
}
// --8<-- [end:request-bsp-sign-up]

// --8<-- [start:confirm-bsp-sign-up]
export async function confirmBspSignUp() {
  // Step 2: Confirm the sign-up (after waiting for randomness)
  const confirmTx = polkadotApi.tx.Providers.confirm_sign_up({
    provider_account: undefined, // Optional: omit to use signer's account
  });

  await new Promise<void>((resolve, reject) => {
    confirmTx
      .signAndSend(bspSigner, ({ status, dispatchError }) => {
        console.log('Confirming BSP registration...');
        if (dispatchError) {
          reject(dispatchError);
        }
        if (status.isFinalized) {
          console.log('BSP registration confirmed and active!');
          resolve();
        }
      })
      .catch(reject);
  });
}
// --8<-- [end:confirm-bsp-sign-up]

// --8<-- [start:cancel-bsp-sign-up]
export async function cancelBspSignUp() {
  // Cancel BSP sign-up
  const cancelTx = polkadotApi.tx.Providers.cancel_sign_up({});

  await new Promise<void>((resolve, reject) => {
    cancelTx
      .signAndSend(bspSigner, ({ status, dispatchError }) => {
        console.log('Cancelling BSP registration...');
        if (dispatchError) {
          reject(dispatchError);
        }
        if (status.isFinalized) {
          console.log('BSP registration cancelled.');
          resolve();
        }
      })
      .catch(reject);
  });
}
// --8<-- [end:cancel-bsp-sign-up]

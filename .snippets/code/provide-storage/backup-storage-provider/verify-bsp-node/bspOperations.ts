// --8<-- [start:imports]
import { Binary } from 'polkadot-api';
import { bspEvmSigner, bspSubstrateSigner } from '../services/bspService.js';
import {
  chain,
  account,
  publicClient,
  walletClient,
  polkadotApi,
} from '../services/clientService.js';
import { formatEther } from 'viem/utils';
import { polkadotApiBsp } from '../services/bspService.js';
// --8<-- [end:imports]

// --8<-- [start:fund-bsp-address]
export async function fundBspAddress(
  bspAddress: `0x${string}`,
  amount: bigint
) {
  console.log('Recipient:', bspAddress);
  console.log('Amount (raw):', amount.toString());

  const txHash = await walletClient.sendTransaction({
    account: account,
    chain: chain,
    to: bspAddress,
    value: amount,
  });
  console.log('Tx hash:', txHash);

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log('Finalized in block:', receipt.blockNumber.toString());
}
// --8<-- [end:fund-bsp-address]

// --8<-- [start:check-bsp-balance]
export async function checkBspBalance(bspAddress: `0x${string}`) {
  // Query balance
  const balance = formatEther(
    await publicClient.getBalance({ address: bspAddress })
  );

  console.log(`BSP EVM Address: ${bspAddress}`);
  console.log(`Balance: ${balance} MOCK`);
}
// --8<-- [end:check-bsp-balance]

// --8<-- [start:get-multiaddresses]
export async function getMultiaddresses() {
  try {
    const addresses = await polkadotApiBsp.rpc.system.localListenAddresses();

    // addresses are Vec<Text> type. Turn into plain strings
    const stringAddresses = addresses
      .map((a) => a.toString())
      .filter((addr) => !addr.includes('/ip4/127.0.0.1'))
      .filter((addr) => !addr.includes('/ip6/::1'));
    console.log('Local listen addresses:', stringAddresses);
    // Convert multiaddresses to Binary format
    return stringAddresses.map((addr) => Binary.fromText(addr));
  } catch (error) {
    console.error('Error fetching local listen addresses:', error);
    throw new Error('Failed to fetch local listen addresses');
  }
}
// --8<-- [end:get-multiaddresses]

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
    payment_account: bspEvmSigner.address, // Account receiving payments
  });

  // Sign and submit the request
  await new Promise<void>((resolve, reject) => {
    requestTx
      .signAndSend(bspSubstrateSigner, ({ status, dispatchError }) => {
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
      .signAndSend(bspSubstrateSigner, ({ status, dispatchError }) => {
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
      .signAndSend(bspSubstrateSigner, ({ status, dispatchError }) => {
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

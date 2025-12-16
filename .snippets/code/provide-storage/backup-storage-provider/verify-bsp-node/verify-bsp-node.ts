// --8<-- [start:imports]
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService';
import { Binary } from 'polkadot-api';
import {
  cancelBspSignUp,
  checkBspBalance,
  confirmBspSignUp,
  fundBspAddress,
  requestBspSignUp,
} from './operations/bspOperations';
// --8<-- [end:imports]

// --8<-- [start:run-sign-up-request]
async function runSignUpRequest() {
  // Initialize WASM
  await initWasm();

  // --8<-- [start:init-setup]
  // Make sure to set the BSP SS58 public key you saved when following the "Run a BSP Node" steps
  const bspAddress = 'KWD8ccdd317Nzf849PnQ2dqBQ2zoTcSqL9LFFnRrsKv16VRRW';
  // --8<-- [end:init-setup]

  // --8<-- [start:fund-bsp-address]
  // Amount in smallest units of the native token.
  const depositAmount = 10_000_000_000_000_000_000n;

  await fundBspAddress(bspAddress, depositAmount);

  await checkBspBalance(bspAddress);
  // --8<-- [end:fund-bsp-address]

  // --8<-- [start:request-bsp-sign-up]
  // BSP configuration
  const ipAddress = '79.117.162.20';
  // Node identity should match the node-key set in docker-compose.yml
  const nodeIdentity = '12D3KooWPPvCxeYfyPYC9eGT674VDzUc8QSYujJrQtZsVZSdHgAS';
  // Convert multiaddresses to Binary format
  const multiaddresses = [
    `/ip4/${ipAddress}/tcp/30334/p2p/${nodeIdentity}`,
  ].map((addr) => Binary.fromText(addr));
  // Capacity should match the capacity set in docker-compose.yml
  // This is just an example value.
  const capacity = BigInt(10_737_418_240); // 10 GiB (80% of 12 GiB disk)

  await requestBspSignUp(bspAddress, multiaddresses, capacity);
  // --8<-- [end:request-bsp-sign-up]

  await polkadotApi.disconnect();
}
// --8<-- [end:run-sign-up-request]

// --8<-- [start:cancel-bsp-sign-up]
async function runSignUpCancel() {
  // Initialize WASM
  await initWasm();

  // Registration can only be cancelled before the confirm_sign_up extrinsic is called
  await cancelBspSignUp();

  await polkadotApi.disconnect();
}
// Uncomment to run the cancel function
// runSignUpCancel();
// --8<-- [end:cancel-bsp-sign-up]

// --8<-- [start:confirm-bsp-sign-up]
async function runSignUpConfirm() {
  // Initialize WASM
  await initWasm();

  await confirmBspSignUp();

  await polkadotApi.disconnect();
}
// Make sure to run `runSignUpRequest()` first and to
// wait accordingly before running `runSignUpConfirm()`
// as explained in the documentation

// runSignUpRequest();
runSignUpConfirm();
// --8<-- [end:confirm-bsp-sign-up]

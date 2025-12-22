// --8<-- [start:imports]
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService';
import {
  cancelBspSignUp,
  checkBspBalance,
  confirmBspSignUp,
  fundBspAddress,
  getMultiaddresses,
  requestBspSignUp,
} from './operations/bspOperations';
import { bspEvmSigner } from './services/bspService';
// --8<-- [end:imports]

// --8<-- [start:request-sign-up]
async function runSignUpRequest() {
  // Initialize WASM
  await initWasm();

  // --8<-- [start:init-setup]
  // Make sure to set the BSP public key from the seed phrase you saved when following the "Run a BSP Node" steps
  const bspAddress = bspEvmSigner.address as `0x${string}`;
  // --8<-- [end:init-setup]
  // console.log('bspSigner.address:', bspSigner.address);

  // --8<-- [start:fund-bsp-address]
  // Amount in smallest units of the native token.
  const depositAmount = 200_000_000_000_000_000_000n;

  await fundBspAddress(bspAddress, depositAmount);

  await checkBspBalance(bspAddress);
  // --8<-- [end:fund-bsp-address]

  // --8<-- [start:call-sign-up-method]
  // BSP configuration

  // Get multiaddresses from the BSP node
  const multiaddresses = await getMultiaddresses();

  // Capacity should match the capacity set in docker-compose.yml
  // This is just an example value.
  const capacity = BigInt(10_737_418_240); // 10 GiB (80% of 12 GiB disk)

  await requestBspSignUp(bspAddress, multiaddresses, capacity);
  // --8<-- [end:call-sign-up-method]

  await polkadotApi.disconnect();
}
// --8<-- [end:request-sign-up]

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

runSignUpRequest();
// runSignUpConfirm();
// --8<-- [end:confirm-bsp-sign-up]

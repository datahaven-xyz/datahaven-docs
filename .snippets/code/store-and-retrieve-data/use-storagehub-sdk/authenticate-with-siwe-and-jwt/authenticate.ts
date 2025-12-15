// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import { authenticateUser } from './services/mspService.js';
// --8<-- [end:imports]

async function run() {
  // Initialize WASM
  await initWasm();

  // --8<-- [start:authenticate]
  // Authenticate address (e.g. before performing actions that require authentication
  // like uploading a file or retrieving private data)
  const authProfile = await authenticateUser();
  console.log('Authenticated user profile:', authProfile);
  // --8<-- [end:authenticate]

  await polkadotApi.disconnect();
}

run();

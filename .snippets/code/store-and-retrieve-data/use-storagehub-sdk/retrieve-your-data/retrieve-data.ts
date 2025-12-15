// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import { downloadFile, verifyDownload } from './operations/fileOperations.js';
// --8<-- [end:imports]

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();

  // --8<-- [start:init-setup]
  const fileKeyHex = 'INSERT_FILE_KEY_AS_HEX';
  // Convert to H256 type if not already
  const fileKey = polkadotApi.createType('H256', fileKeyHex);
  // Make sure the file extension matches the original file
  const filePath = new URL(`./files/INSERT_FILENAME.png`, import.meta.url)
    .pathname;
  const downloadedFilePath = new URL(
    './files/INSERT_FILENAME_downloaded.png',
    import.meta.url
  ).pathname;
  // --8<-- [end:init-setup]

  // --8<-- [start:download-data]
  // Download file
  const downloadedFile = await downloadFile(fileKey, downloadedFilePath);
  console.log(
    `Downloaded ${downloadedFile.size} bytes to ${downloadedFile.path}`
  );
  // --8<-- [end:download-data]

  // --8<-- [start:verify-download]
  const isValid = await verifyDownload(filePath, downloadedFilePath);
  console.log(`File integrity verified: ${isValid ? 'PASSED' : 'FAILED'}`);
  // --8<-- [end:verify-download]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();

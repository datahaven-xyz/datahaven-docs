// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import { uploadFile } from './operations/fileOperations.js';
// --8<-- [end:imports]

async function run() {
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();

  // --8<-- [start:init-setup]
  // Add your bucket ID here from the bucket you created earlier
  // Example (32byte hash): 0xdd2148ff63c15826ab42953a9d214770e6c8a73b22b83d28819a1777ab9d1322
  const bucketId = 'INSERT_BUCKET_ID';
  // --8<-- [end:init-setup]

  // --8<-- [start:upload-file]

  // Specify the file name of the file to be uploaded
  const fileName = 'INSERT_FILE_NAME'; // Example: filename.jpeg
  const filePath = new URL(`../files/${fileName}`, import.meta.url).pathname;

  // Upload file
  const { fileKey, uploadReceipt } = await uploadFile(
    bucketId,
    filePath,
    fileName
  );
  console.log(`File uploaded: ${fileKey}`);
  console.log(`Status: ${uploadReceipt.status}`);
  // --8<-- [end:upload-file]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

run();

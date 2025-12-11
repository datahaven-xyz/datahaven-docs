// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm } from '@storagehub-sdk/core';
import { polkadotApi } from './services/clientService.js';
import {
  downloadFile,
  uploadFile,
  verifyDownload,
} from './operations/fileOperations.js';
import { HealthStatus } from '@storagehub-sdk/msp-client';
import { mspClient } from './services/mspService.js';
import {
  createBucket,
  verifyBucketCreation,
} from './operations/bucketOperations.js';
// --8<-- [end:imports]

async function run() {
  // Initialize WASM
  await initWasm();

  console.log('🚀 Starting DataHaven Storage End-to-End Script...');

  // --8<-- [start:check-msp-health]
  // 1. Check MSP Health
  const mspHealth: HealthStatus = await mspClient.info.getHealth();
  console.log('MSP Health Status:', mspHealth);
  // --8<-- [end:check-msp-health]

  // --8<-- [start:create-bucket]
  // 2. Create Bucket
  const bucketName = 'init-bucket';
  const { bucketId, txReceipt } = await createBucket(bucketName);
  console.log(`Created Bucket ID: ${bucketId}`);
  console.log(`createBucket() txReceipt: ${txReceipt}`);
  // --8<-- [end:create-bucket]

  // --8<-- [start:verify-bucket]
  // 3. Verify bucket exists on chain
  const bucketData = await verifyBucketCreation(bucketId);
  console.log('Bucket data:', bucketData);
  // --8<-- [end:verify-bucket]

  // --8<-- [start:upload-file]
  // 4. Upload file
  const fileName = 'helloworld.txt';
  const filePath = new URL(`./files/${fileName}`, import.meta.url).pathname;

  const { fileKey, uploadReceipt } = await uploadFile(
    bucketId,
    filePath,
    fileName
  );
  console.log(`File uploaded: ${fileKey}`);
  console.log(`Status: ${uploadReceipt.status}`);
  // --8<-- [end:upload-file]

  // --8<-- [start:download-data]
  // 5. Download file
  const downloadedFilePath = new URL(
    './files/helloworld_downloaded.txt',
    import.meta.url
  ).pathname;
  const downloadedFile = await downloadFile(fileKey, downloadedFilePath);
  console.log(`File type: ${downloadedFile.mime}`);
  console.log(
    `Downloaded ${downloadedFile.size} bytes to ${downloadedFile.path}`
  );
  // --8<-- [end:download-data]

  // --8<-- [start:verify-download]
  // 6. Verify download integrity
  const isValid = await verifyDownload(filePath, downloadedFilePath);
  console.log(`File integrity verified: ${isValid ? 'PASSED' : 'FAILED'}`);
  // --8<-- [end:verify-download]

  console.log('🚀 DataHaven Storage End-to-End Script Completed Successfully.');

  await polkadotApi.disconnect();
}

run();

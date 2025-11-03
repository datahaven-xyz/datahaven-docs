// --8<-- [start:imports]
import '@storagehub/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { TypeRegistry } from '@polkadot/types';
import { AccountId20, H256 } from '@polkadot/types/interfaces';
import { types } from '@storagehub/types-bundle';
import { FileManager, initWasm } from '@storagehub-sdk/core';
import { createReadStream, statSync } from 'node:fs';
import { Readable } from 'node:stream';
// --8<-- [end:imports]

async function run() {
  // --8<-- [start:initialize-and-setup]
  // For anything from @storagehub-sdk/core to work, initWasm() is required
  // on top of the file
  await initWasm();

  // --- Polkadot.js API setup ---
  const provider = new WsProvider('TODO');
  const polkadotApi: ApiPromise = await ApiPromise.create({
    provider,
    typesBundle: types,
    noInitWarn: true,
  });

  // --- File Manager setup ---
  // Specify the file name of the file to be uploaded
  const fileName = 'INSERT_FILE_NAME'; // Example: filename.jpeg

  // Specify the file path of the file to be uploaded relative to the location of your index.ts file
  const filePath = new URL(`./files/${fileName}`, import.meta.url).pathname;
  const fileSize = statSync(filePath).size;

  // Initialize a FileManager instance with file metadata and a readable stream.
  // The stream converts the local file into a Web-compatible ReadableStream,
  // which the SDK uses to handle file uploads to the network
  const fileManager = new FileManager({
    size: fileSize,
    stream: () =>
      Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>,
  });
  const fingerprint = await fileManager.getFingerprint();
  // --8<-- [end:initialize-and-setup]

  // --- Verify storage request logic ---
  // --8<-- [start:compute-file-key]
  // Compute file key
  const ownerAccount = 'INSERT_ACCOUNT_AS_HEX_STRING';
  const bucketId = 'INSERT_BUCKET_ID';

  const registry = new TypeRegistry();
  const owner = registry.createType('AccountId20', ownerAccount) as AccountId20;
  const bucketIdH256 = registry.createType('H256', bucketId) as H256;
  const fileKey = await fileManager.computeFileKey(
    owner,
    bucketIdH256,
    fileName
  );
  console.log('Computed file key:', fileKey.toHex());
  // --8<-- [end:compute-file-key]

  // --8<-- [start:verify-storage-request]
  // Verify storage request on chain
  const storageRequest = await polkadotApi.query.fileSystem.storageRequests(
    fileKey
  );
  if (!storageRequest.isSome) {
    throw new Error('Storage request not found on chain');
  }
  // --8<-- [end:verify-storage-request]

  // --8<-- [start:read-storage-request]
  // Read the storage request data
  const storageRequestData = storageRequest.unwrap();
  console.log('Storage request data:', storageRequestData);
  console.log(
    'Storage request bucketId:',
    storageRequestData.bucketId.toString()
  );
  console.log(
    'Storage request fingerprint should be the same as initial fingerprint',
    storageRequestData.fingerprint.toString() === fingerprint.toString()
  );
  // --8<-- [end:read-storage-request]

  // Disconnect the Polkadot API at the very end
  await polkadotApi.disconnect();
}

await run();

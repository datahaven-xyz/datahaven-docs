import { Readable } from 'node:stream';
import { createWriteStream } from 'node:fs';
import type { DownloadResult } from '@storagehub-sdk/msp-client';

// Assumes the following are available in scope:
// - mspClient, fileKey

// Download file bytes from MSP
const downloadResponse: DownloadResult = await mspClient.files.downloadFile(
  fileKey.toHex()
);
if (downloadResponse.status !== 200) {
  throw new Error(`Download failed with status: ${downloadResponse.status}`);
}

// Save to disk
const downloadPath = new URL('../../files/filename_downloaded.png', import.meta.url).pathname;
const writeStream = createWriteStream(downloadPath);
const readableStream = Readable.fromWeb(downloadResponse.stream as any);
readableStream.pipe(writeStream);
console.log('Downloaded file saved to:', downloadPath);



// --8<-- [start:imports]
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { H256 } from '@polkadot/types/interfaces';
import { mspClient } from '../services/mspService.js';
import { DownloadResult } from '@storagehub-sdk/msp-client';
// --8<-- [end:imports]

// --8<-- [start:download-file]
export async function downloadFile(
  fileKey: H256,
  downloadPath: string
): Promise<string> {
  // Download file from MSP
  const downloadResponse: DownloadResult = await mspClient.files.downloadFile(
    fileKey.toHex()
  );

  // Check if the download response was successful
  if (downloadResponse.status !== 200) {
    throw new Error(`Download failed with status: ${downloadResponse.status}`);
  }

  // Save downloaded file

  // Create a writable stream to the target file path
  // This stream will receive binary data chunks and write them to disk.
  const writeStream = createWriteStream(downloadPath);
  // Convert the Web ReadableStream into a Node.js-readable stream
  const readableStream = Readable.fromWeb(downloadResponse.stream as any);

  // Pipe the readable (input) stream into the writable (output) stream
  // This transfers the file data chunk by chunk and closes the write stream automatically
  // when finished.
  return new Promise((resolve, reject) => {
    readableStream.pipe(writeStream);
    writeStream.on('finish', async () => {
      const { size } = await import('node:fs/promises').then((fs) =>
        fs.stat(downloadPath)
      );
      const mime =
        downloadResponse.contentType === null
          ? undefined
          : downloadResponse.contentType;

      resolve({
        path: downloadPath,
        size,
        mime, // if available
      });
    });
    writeStream.on('error', reject);
  });
}
// --8<-- [end:download-file]

// --8<-- [start:verify-download]
// Compares an original file with a downloaded file byte-for-byte
export async function verifyDownload(
  originalPath: string,
  downloadedPath: string
): Promise<boolean> {
  const originalBuffer = await import('node:fs/promises').then((fs) =>
    fs.readFile(originalPath)
  );
  const downloadedBuffer = await import('node:fs/promises').then((fs) =>
    fs.readFile(downloadedPath)
  );

  return originalBuffer.equals(downloadedBuffer);
}
// --8<-- [end:verify-download]

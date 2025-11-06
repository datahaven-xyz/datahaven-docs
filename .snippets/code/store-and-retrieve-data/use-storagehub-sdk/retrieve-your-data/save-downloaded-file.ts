import { Readable } from 'node:stream';
import { createWriteStream } from 'node:fs';

// Define the local path where the downloaded file will be saved
// Here it is resolved relative to the current module’s URL.
const downloadPath = new URL(
  '../../files/filename_downloaded.png',
  import.meta.url
).pathname;

// Create a writable stream to the target file path
// This stream will receive binary data chunks and write them to disk.
const writeStream = createWriteStream(downloadPath);

// Convert the Web ReadableStream into a Node.js-readable stream
const readableStream = Readable.fromWeb(downloadResponse.stream as any);

// Pipe the readable (input) stream into the writable (output) stream
// This transfers the file data chunk by chunk and closes the write stream automatically when finished.
readableStream.pipe(writeStream);

console.log('Downloaded file saved to:', downloadPath);

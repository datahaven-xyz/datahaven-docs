import { createReadStream, statSync } from 'node:fs';
import { FileManager } from '@storagehub-sdk/core';
import { Readable } from 'node:stream';

// Specify the file name of the file to be uploaded
const fileName = 'filename.jpeg';

// Specify the file path of to file to be uploaded relative to the location of // your index.ts file
const filePath = new URL(`./files/${fileName}`, import.meta.url).pathname;
const fileSize = statSync(filePath).size;

// Initialize a FileManager instance with file metadata and a readable stream.
// The stream converts the local file into a Web-compatible ReadableStream,
// which the SDK uses to handle file uploads to the network.
const fileManager = new FileManager({
  size: fileSize,
  stream: () =>
    Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>,
});

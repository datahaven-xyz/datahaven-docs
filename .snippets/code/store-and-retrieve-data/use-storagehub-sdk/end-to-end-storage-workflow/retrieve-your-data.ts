// Prior section code here

// Must be authenticated to download files
const downloadResponse: DownloadResult = await mspClient.files.downloadFile(
  fileKey.toHex()
);

// Check if the download response was successful
if (downloadResponse.status !== 200) {
  throw new Error(`Download failed with status: ${downloadResponse.status}`);
}

// Sanitize the filename to prevent path traversal attacks
// Extract only the base filename without any directory separators
const sanitizedFileName = path.basename(fileName);

// Define the local path where the downloaded file will be saved
// Here it is resolved relative to the current module's URL.
const downloadPath = new URL(
  `../../files/${sanitizedFileName}_downloaded.jpg`, // make sure the file extension matches the original file
  import.meta.url
).pathname;

// Ensure the directory exists before writing the file
const downloadDir = path.dirname(downloadPath);
mkdirSync(downloadDir, { recursive: true });

// Create a writable stream to the target file path
// This stream will receive binary data chunks and write them to disk.
const writeStream = createWriteStream(downloadPath);

// Convert the Web ReadableStream into a Node.js-readable stream
const readableStream = Readable.fromWeb(downloadResponse.stream as any);

// Pipe the readable (input) stream into the writable (output) stream
// This transfers the file data chunk by chunk and closes the write stream automatically
// when finished.
readableStream.pipe(writeStream);

// Wait for the write stream to finish before proceeding
await new Promise<void>((resolve, reject) => {
  writeStream.on('finish', resolve);
  writeStream.on('error', reject);
});

console.log('Downloaded file saved to:', downloadPath);

// Final code here to Disconnect the Polkadot API and run the function 
// You already configured this in the first section code.
// Retrieve the file as a binary Blob to prepare it for upload
const fileBlob = await fileManager.getFileBlob();

// Upload file to MSP
const uploadReceipt = await mspClient.files.uploadFile(
  bucketId,
  fileKey.toHex(),
  fileBlob,
  address,
  fileName
);

console.log('File upload receipt:', uploadReceipt);

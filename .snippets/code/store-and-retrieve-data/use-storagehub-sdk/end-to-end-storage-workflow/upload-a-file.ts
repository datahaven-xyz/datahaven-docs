// Prior section code

// --- Upload file to MSP ---
const fileBlob = await fileManager.getFileBlob();
const uploadReceipt = await mspClient.files.uploadFile(
    bucketId,
    fileKey.toHex(),
    fileBlob,
    address,
    fileName
);
console.log('File upload receipt:', uploadReceipt);
if (uploadReceipt.status !== 'upload_successful') {
    throw new Error('File upload to MSP failed');
}

// Next section code here
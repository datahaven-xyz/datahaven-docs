if (uploadReceipt.status !== 'upload_successful') {
  throw new Error('File upload to MSP failed');
}

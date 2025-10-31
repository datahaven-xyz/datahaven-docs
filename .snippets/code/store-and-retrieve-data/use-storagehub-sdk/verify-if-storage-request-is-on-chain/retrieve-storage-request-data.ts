// Verify storage request on chain
const storageRequest = await substrateApi.query.fileSystem.storageRequests(
  fileKey
);
if (!storageRequest.isSome) {
  throw new Error('Storage request not found on chain');
}

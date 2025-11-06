import { DownloadResult } from '@storagehub-sdk/msp-client';

const downloadResponse: DownloadResult = await mspClient.files.downloadFile(
  fileKey.toHex()
);

// Check if the download response was successful
if (downloadResponse.status !== 200) {
  throw new Error(`Download failed with status: ${downloadResponse.status}`);
}

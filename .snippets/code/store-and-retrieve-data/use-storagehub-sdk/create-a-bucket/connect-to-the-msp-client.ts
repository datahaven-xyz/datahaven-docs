import { MspClient } from '@storagehub-sdk/msp-client';
import { initWasm, HttpClientConfig } from '@storagehub-sdk/core';
import '@storagehub/api-augment';

async function run() {
  // for anything from @storagehub-sdk/core to work initWasm() is required on top of the file
  await initWasm();

  const baseUrl = 'https://deo-dh-backend.stagenet.datahaven-infra.network/';
  const httpConfig: HttpClientConfig = { baseUrl: baseUrl };

  // connect to MSP Client
  const mspClient = await MspClient.connect(httpConfig);
}

await run();

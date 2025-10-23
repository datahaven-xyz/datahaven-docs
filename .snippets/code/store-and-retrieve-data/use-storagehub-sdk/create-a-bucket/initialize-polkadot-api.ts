import '@storagehub/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from '@storagehub/types-bundle';

const provider = new WsProvider('TODO');
const polkadotApi: ApiPromise = await ApiPromise.create({
  provider,
  typesBundle: types,
  noInitWarn: true,
});

// Add this line to the end of the run function after everything else has executed
await polkadotApi.disconnect();

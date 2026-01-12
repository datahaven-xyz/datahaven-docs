import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { types } from '@storagehub/types-bundle';

// Make sure WASM crypto is initialized *before* we create any keypairs
await cryptoWaitReady();

// Create signer from secret URI
const walletKeyring = new Keyring({ type: 'ethereum' });
const signer = walletKeyring.addFromUri('INSERT_PRIVATE_KEY');

// Make sure to use the BSP's seed phrase here
// generated from following the "Run a BSP Node" steps
const bspEvmKeyring = new Keyring({ type: 'ethereum' });
// BSP EVM signer
const bspEvmSigner = bspEvmKeyring.addFromUri('INSERT_BSP_RAW_SEED');

const bspSubstrateKeyring = new Keyring({ type: 'ecdsa' });
// BSP Substrate signer
const bspSubstrateSigner = bspSubstrateKeyring.addFromUri(
  'INSERT_BSP_RAW_SEED'
);
// If running BSP node on your local machine
// create Polkadot API client, but for your actively running BSP node
const localBSPwsUrl = `ws://127.0.0.1:9946`;
const provider = new WsProvider(localBSPwsUrl);
const polkadotApiBsp: ApiPromise = await ApiPromise.create({
  provider,
  typesBundle: types,
  noInitWarn: true,
});

export { signer, bspEvmSigner, bspSubstrateSigner, polkadotApiBsp };

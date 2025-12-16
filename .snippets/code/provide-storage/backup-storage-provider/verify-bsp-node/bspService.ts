import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';

// Make sure WASM crypto is initialized *before* we create any keypairs
await cryptoWaitReady();

// Create signer from secret URI
const walletKeyring = new Keyring({ type: 'ethereum' });
const signer = walletKeyring.addFromUri('INSERT_PRIVATE_KEY');

// Create BSP signer from seed phrase
const bspKeyring = new Keyring({ type: 'ecdsa' });
// Make sure to use the BSP's seed phrase here
// generated from following the "Run a BSP Node" steps
const bspSigner = bspKeyring.addFromUri('INSERT_BSP_SEED_PHRASE');

export { signer, bspSigner };

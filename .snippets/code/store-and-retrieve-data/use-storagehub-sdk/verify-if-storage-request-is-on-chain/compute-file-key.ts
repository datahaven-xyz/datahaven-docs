import { TypeRegistry } from '@polkadot/types';
import { AccountId20, H256 } from '@polkadot/types/interfaces';

// Compute file key
const registry = new TypeRegistry();
const owner = registry.createType(
  'AccountId20',
  account.address
) as AccountId20;
const bucketIdH256 = registry.createType('H256', bucketId) as H256;
const fileKey = await fileManager.computeFileKey(owner, bucketIdH256, fileName);
console.log('Computed file key:', fileKey.toHex());

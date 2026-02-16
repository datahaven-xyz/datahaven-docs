// --8<-- [start:imports]
import { Bucket, FileListResponse } from '@storagehub-sdk/msp-client';
import {
  account,
  address,
  publicClient,
  walletClient,
  polkadotApi,
  chain,
} from '../services/clientService.js';
import { getMspInfo, getValueProps, mspClient } from '../services/mspService.js';
import { toHex } from 'viem';
import fileSystemAbi from '../abis/FileSystemABI.json' with { type: 'json' };
import { NETWORK } from '../config/networks.js';
// --8<-- [end:imports]

// --8<-- [start:update-bucket-privacy]
export async function updateBucketPrivacy(
  bucketId: string,
  isPrivate: boolean
): Promise<boolean> {
  // Update bucket privacy on chain by calling the FileSystem precompile directly
  const txHash = await walletClient.writeContract({
    account,
    address: NETWORK.filesystemContractAddress,
    abi: fileSystemAbi,
    functionName: 'updateBucketPrivacy',
    args: [bucketId as `0x${string}`, isPrivate],
    chain: chain,
  });
  console.log('updateBucketPrivacy() txHash:', txHash);
  if (!txHash) {
    throw new Error(
      'updateBucketPrivacy() did not return a transaction hash'
    );
  }

  // Wait for transaction receipt
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log('updateBucketPrivacy() txReceipt:', receipt);
  if (receipt.status !== 'success') {
    throw new Error(`Bucket privacy update failed: ${txHash}`);
  }

  console.log(
    `Bucket ${bucketId} privacy updated to ${isPrivate ? 'private' : 'public'}`
  );
  return true;
}
// --8<-- [end:update-bucket-privacy]

// --8<-- [start:verify-bucket]
// Verify bucket creation on chain and return bucket data
export async function verifyBucketCreation(bucketId: string) {
  const { mspId } = await getMspInfo();

  const bucket = await polkadotApi.query.providers.buckets(bucketId);

  if (bucket.isEmpty) {
    throw new Error('Bucket not found on chain after creation');
  }

  const bucketData = bucket.unwrap().toHuman();
  console.log(
    'Bucket userId matches initial bucket owner address',
    bucketData.userId === address
  );
  console.log(
    `Bucket MSPId matches initial MSPId: ${bucketData.mspId === mspId}`
  );
  return bucketData;
}
// --8<-- [end:verify-bucket]

// --8<-- [start:imports]
import {
  walletClient,
  address,
  publicClient,
  account,
  chain,
} from '../services/clientService.js';
import fileSystemAbi from '../abis/FileSystemABI.json' with { type: 'json' };
import { NETWORK } from '../config/networks.js';
// --8<-- [end:imports]

// --8<-- [start:revoke-storage-request]
export async function revokeStorageRequest(
  fileKey: string
): Promise<boolean> {
  // Revoke a pending storage request by calling the FileSystem precompile directly
  const txHash = await walletClient.writeContract({
    account,
    address: NETWORK.filesystemContractAddress,
    abi: fileSystemAbi,
    functionName: 'revokeStorageRequest',
    args: [fileKey as `0x${string}`],
    chain: chain,
  });
  console.log('revokeStorageRequest() txHash:', txHash);
  if (!txHash) {
    throw new Error(
      'revokeStorageRequest() did not return a transaction hash'
    );
  }

  // Wait for transaction receipt
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log('revokeStorageRequest() txReceipt:', receipt);
  if (receipt.status !== 'success') {
    throw new Error(`Storage request revocation failed: ${txHash}`);
  }

  console.log(
    `Storage request for file key ${fileKey} revoked successfully`
  );
  return true;
}
// --8<-- [end:revoke-storage-request]

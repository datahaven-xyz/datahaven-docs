// --8<-- [start:imports]
import '@storagehub/api-augment';
import { initWasm, FileManager, ReplicationLevel } from '@storagehub-sdk/core';
import { createReadStream, statSync } from 'node:fs';
import { Readable } from 'node:stream';
import { TypeRegistry } from '@polkadot/types';
import { AccountId20, H256 } from '@polkadot/types/interfaces';
import {
  account,
  publicClient,
  walletClient,
  polkadotApi,
  chain,
} from './services/clientService.js';
import { getMspInfo } from './services/mspService.js';
import { toHex } from 'viem';
import fileSystemAbi from './abis/FileSystemABI.json' with { type: 'json' };
import { NETWORK } from './config/networks.js';
import { revokeStorageRequest } from './operations/fileOperations.js';
// --8<-- [end:imports]

async function run() {
  await initWasm();

  const bucketId = 'INSERT_BUCKET_ID'; // `0x${string}`

  // --8<-- [start:issue-storage-request]
  // 1. Issue a storage request (without uploading the file to the MSP)
  const fileName = 'helloworld.txt';
  const filePath = new URL(`./files/${fileName}`, import.meta.url).pathname;

  const fileSize = statSync(filePath).size;
  const fileManager = new FileManager({
    size: fileSize,
    stream: () =>
      Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>,
  });

  const fingerprint = await fileManager.getFingerprint();
  const fileSizeBigInt = BigInt(fileManager.getFileSize());
  const { mspId, multiaddresses } = await getMspInfo();

  if (!multiaddresses?.length) {
    throw new Error('MSP multiaddresses are missing');
  }
  const peerIds: string[] = (multiaddresses ?? [])
    .map((addr: string) => addr.split('/p2p/').pop())
    .filter((id): id is string => !!id);
  if (peerIds.length === 0) {
    throw new Error('MSP multiaddresses had no /p2p/<peerId> segment');
  }

  const replicationLevel = ReplicationLevel.Custom;
  const replicas = 1;

  // Issue storage request by calling the FileSystem precompile directly
  const txHash = await walletClient.writeContract({
    account,
    address: NETWORK.filesystemContractAddress,
    abi: fileSystemAbi,
    functionName: 'issueStorageRequest',
    args: [
      bucketId as `0x${string}`,
      toHex(fileName),
      fingerprint.toHex() as `0x${string}`,
      fileSizeBigInt,
      mspId as `0x${string}`,
      peerIds.map((id) => toHex(id)),
      replicationLevel,
      replicas,
    ],
    chain: chain,
  });
  console.log('issueStorageRequest() txHash:', txHash);

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  if (receipt.status !== 'success') {
    throw new Error(`Storage request failed: ${txHash}`);
  }
  // --8<-- [end:issue-storage-request]

  // --8<-- [start:compute-file-key]
  // 2. Compute the file key so we can revoke
  const registry = new TypeRegistry();
  const owner = registry.createType(
    'AccountId20',
    account.address
  ) as AccountId20;
  const bucketIdH256 = registry.createType('H256', bucketId) as H256;
  const fileKey = await fileManager.computeFileKey(
    owner,
    bucketIdH256,
    fileName
  );
  console.log(`Computed file key: ${fileKey.toHex()}`);
  // --8<-- [end:compute-file-key]

  // --8<-- [start:verify-request-exists]
  // 3. Verify the storage request exists on chain before revoking
  const storageRequest =
    await polkadotApi.query.fileSystem.storageRequests(fileKey);
  if (!storageRequest.isSome) {
    throw new Error(
      'Storage request not found on chain — nothing to revoke'
    );
  }
  console.log(
    'Storage request confirmed on chain — proceeding to revoke\n'
  );
  // --8<-- [end:verify-request-exists]

  // --8<-- [start:revoke-request]
  // 4. Revoke the storage request
  await revokeStorageRequest(fileKey.toHex());
  // --8<-- [end:revoke-request]

  // --8<-- [start:verify-revoked]
  // 5. Verify the storage request no longer exists on chain
  const storageRequestAfter =
    await polkadotApi.query.fileSystem.storageRequests(fileKey);
  if (storageRequestAfter.isNone) {
    console.log(
      'Storage request successfully removed from chain after revocation'
    );
  } else {
    console.log(
      'WARNING: Storage request still exists on chain after revocation'
    );
  }
  // --8<-- [end:verify-revoked]

  await polkadotApi.disconnect();
}

await run();

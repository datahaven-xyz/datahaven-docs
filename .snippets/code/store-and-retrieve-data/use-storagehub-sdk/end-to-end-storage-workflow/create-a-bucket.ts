// Assumes the following are available in scope:
// - mspClient, storageHubClient, publicClient, walletClient (with an account)

const createBucket = async (
  bucketName: string,
  isPrivate = false
): Promise<`0x${string}`> => {
  const owner = walletClient.account.address;

  // Derive deterministic bucket ID from owner + name
  const bucketId = (await storageHubClient.deriveBucketId(
    owner,
    bucketName
  )) as `0x${string}`;
  console.log('Derived bucket ID:', bucketId);

  // Get MSP params
  const { mspId } = await mspClient.info.getInfo();
  const valueProps = await mspClient.info.getValuePropositions();
  if (!valueProps?.length)
    throw new Error('No value props available from this MSP.');
  const valuePropId = valueProps[0].id as `0x${string}`;

  // Create bucket
  const txHash = await storageHubClient.createBucket(
    mspId as `0x${string}`,
    bucketName,
    isPrivate,
    valuePropId
  );
  console.log('createBucket() txHash:', txHash);
  if (!txHash)
    throw new Error('createBucket() did not return a transaction hash');

  // Wait for finality
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  if (receipt.status !== 'success')
    throw new Error(`Bucket creation failed: ${txHash}`);

  console.log('Bucket created:', bucketId);
  return bucketId;
};

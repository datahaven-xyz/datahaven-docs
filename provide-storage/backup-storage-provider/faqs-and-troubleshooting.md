---
title: BSP FAQs and Troubleshooting
description: Conversational style BSP-related FAQs and their answers. Includes most common pitfalls, best practices, and proof submission monitoring.
---

# BSP FAQs and Troubleshooting

## What if my BSP registration failed?

Make sure to check the following:

1. Account has sufficient balance (200+ HAVE)
2. BCSV key is correctly inserted
3. Capacity meets minimum (2 data units)
4. Provider ID is correctly calculated

## What if my BSP is not receiving files from the MSP?

Make sure to check the following:

1. BSP is registered on-chain
2. `--bsp-upload-file-task` flag is enabled
3. Storage capacity not exceeded
4. Node is fully synced
5. Network connectivity to MSPs

## What if my BSP's proof submission is failing?

Make sure to check the following:

1. `--bsp-submit-proof-task` flag is enabled
2. Node is fully synced
3. Sufficient balance for transaction fees
4. Files are correctly stored and accessible
5. Check logs for specific errors

## What if fee charging is not working?

Make sure to check the following:

1. `--bsp-charge-fees-task` flag is enabled
2. Users have sufficient debt to charge
3. Node is synced and connected

## What if I change my mind about BSP registration before confirming?

You can cancel the registration by executing `await polkadotApi.tx.Providers.cancel_sign_up()`.

## Are storage proofs submitted automatically?

BSPs automatically submit proofs when `--bsp-submit-proof-task` is enabled.

## What does the proof submission flow look like?

The proof submission flow is as follows:

1. **Challenge received**: BSP receives storage proof challenge from ProofsDealer pallet.
2. **Proof generation**: BSP generates Merkle proof for challenged data.
3. **Proof submission**: BSP submits proof via `proofsDealer.submitProof` extrinsic.
4. **Verification**: ProofsDealer pallet verifies proof on-chain.
5. **Reward/Penalty**: BSP receives reward for valid proof or penalty for invalid/missing proof.

## How can I monitor proof submissions?

Run the following command in terminal:

```bash
# Check pending proofs
curl -s -H "Content-Type: application/json" \
  -d '{"id":1, "jsonrpc":"2.0", "method": "storageprovider_getPendingProofs"}' \
  http://localhost:9946 | jq
```

## What are best practices I should keep in mind?

1. Use production-grade storage (NVMe SSD recommended).
2. Monitor storage capacity proactively.
3. Enable all BSP tasks for full functionality.
4. Keep node software updated.
5. Implement monitoring and alerting for proof submissions.
6. Set reasonable `bsp-submit-proof-max-attempts` (3-5).
7. Document operational procedures.
8. Monitor network connectivity to MSPs.

## How do I perform a health check for my BSP?

Run the following commands:

```bash
# Check node health
curl -s -H "Content-Type: application/json" \
  -d '{"id":1, "jsonrpc":"2.0", "method": "system_health"}' \
  http://localhost:9946 | jq

# Check provider status
curl -s -H "Content-Type: application/json" \
  -d '{"id":1, "jsonrpc":"2.0", "method": "storageprovider_getStatus"}' \
  http://localhost:9946 | jq
```

## How do I check BSP logs?

A collection of helpful Docker Compose commands you’ll use while developing or debugging your BSP node. Copy the specific command you need:

- Run the container in the background:
  ```bash
  docker compose up -d
  ```

- Stop and remove the container:
  ```bash
  docker compose down
  ```

- Check status and logs while the container is running:
  ```bash
  docker compose ps
  ```

- Continuously tail logs in terminal:
  ```bash
  docker compose logs -f
  ```

- Continuously display logs in terminal and save them into a file:
  ```bash
  docker compose logs -f | tee bsp.log
  ```

- Continuously stream and continuously save all logs into a file:
  ```bash
  docker compose logs -f > bsp.log
  ```

- Filter logs for storage-related events:
  ```bash
  docker compose logs 2>&1 | grep -i "storage\|proof\|file"
  ```

- Monitor storage proof submissions:
  ```bash
  docker compose logs 2>&1 | grep -i "proof"
  ```

## What are key metrics to monitor?

- Storage capacity usage
- Number of stored files
- Proof submission success rate
- File upload success rate from MSPs
- Fee collection status
- Bucket migration status

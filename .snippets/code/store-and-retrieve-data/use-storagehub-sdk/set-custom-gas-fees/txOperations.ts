import { EvmWriteOptions } from '@storagehub-sdk/core';
import { publicClient } from '../services/clientService';

// Build custom gas transaction options
export async function buildGasTxOpts(): Promise<EvmWriteOptions> {
  const gas = BigInt('1500000');

  // EIP-1559 fees based on latest block
  const latestBlock = await publicClient.getBlock({ blockTag: 'latest' });
  const baseFeePerGas = latestBlock.baseFeePerGas;
  if (baseFeePerGas == null) {
    throw new Error(
      'RPC did not return baseFeePerGas for the latest block. Cannot build EIP-1559 fees.',
    );
  }

  const maxPriorityFeePerGas = BigInt('1500000000'); // 1.5 gwei

  // maxFeePerGas = baseFeePerGas * safeMarginMultiplier + maxPriorityFeePerGas
  // safeMarginMultiplier should be some value that protects you from fee spikes (e.g., 1.5x or 2x)
  const maxFeePerGas = baseFeePerGas * BigInt(2) + maxPriorityFeePerGas;

  return { gas, maxFeePerGas, maxPriorityFeePerGas };
}

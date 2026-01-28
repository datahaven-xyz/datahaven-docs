// --8<-- [start:imports]
import { formatEther } from 'viem';
import { publicClient } from '../services/clientService.js';
import {
  PaymentStreamInfo,
  PaymentStreamsResponse,
} from '@storagehub-sdk/msp-client';
// --8<-- [end:imports]

// --8<-- [start:calculate-time-remaining]
interface TimeRemaining {
  ticks: bigint;
  seconds: bigint;
  formatted: string;
}

const TICK_DURATION_SECONDS = 6n; // 6 seconds per block
const DECIMALS = 18;

const calculateTimeRemaining = (
  balanceInWei: bigint,
  streams: PaymentStreamsResponse,
): TimeRemaining => {
  // Sum all costPerTick values
  const totalCostPerTick = streams.streams.reduce(
    (sum: bigint, stream: PaymentStreamInfo) =>
      sum + BigInt(stream.costPerTick),
    0n,
  );

  if (totalCostPerTick === 0n) {
    return { ticks: 0n, seconds: 0n, formatted: 'No active streams' };
  }

  // Ticks remaining = balance / total cost per tick
  const ticksRemaining = balanceInWei / totalCostPerTick;
  const secondsRemaining = ticksRemaining * TICK_DURATION_SECONDS;

  return {
    ticks: ticksRemaining,
    seconds: secondsRemaining,
    formatted: formatDuration(secondsRemaining),
  };
};
// --8<-- [end:calculate-time-remaining]

// --8<-- [start:format-duration]
const formatDuration = (totalSeconds: bigint): string => {
  const SECONDS_PER_MINUTE = 60n;
  const SECONDS_PER_HOUR = 3600n;
  const SECONDS_PER_DAY = 86400n;
  const SECONDS_PER_MONTH = 2629746n; // ~30.44 days
  const SECONDS_PER_YEAR = 31556952n; // ~365.25 days

  const years = totalSeconds / SECONDS_PER_YEAR;
  const months = (totalSeconds % SECONDS_PER_YEAR) / SECONDS_PER_MONTH;

  if (years > 0n) {
    return `${years} years, ${months} months`;
  }

  const days = totalSeconds / SECONDS_PER_DAY;
  const hoursWithinDay = (totalSeconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR;

  if (days > 0n) {
    return `${days} days, ${hoursWithinDay} hours`;
  }

  const hours = totalSeconds / SECONDS_PER_HOUR;
  const minutes = (totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE;

  if (hours > 0n) {
    return `${hours} hours, ${minutes} minutes`;
  }
  return `${minutes} minutes`;
};
// --8<-- [end:format-duration]

// --8<-- [start:get-balance]
const getBalance = async (address: `0x${string}`): Promise<bigint> => {
  // Query balance
  // const balance = parseFloat(formatEther(await publicClient.getBalance({ address })));
  const balanceWei = await publicClient.getBalance({ address });
  console.log(`Address: ${address}`);
  console.log(`Balance: ${balanceWei} (wei)`);
  console.log(`Balance: ${Number(formatEther(balanceWei))} (MOCK)`);

  return balanceWei;
};
// --8<-- [end:get-balance]

export { calculateTimeRemaining, formatDuration, getBalance };

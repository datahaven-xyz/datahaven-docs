import { HealthStatus } from '@storagehub-sdk/msp-client';

const mspHealth: HealthStatus = await mspClient.info.getHealth();

console.log('MSP service health:', mspHealth);

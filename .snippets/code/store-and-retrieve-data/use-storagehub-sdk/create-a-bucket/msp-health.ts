import { HealthStatus } from '@storagehub-sdk/msp-client';

const health: HealthStatus = await mspClient.getHealth();
console.log('MSP service health:', health);

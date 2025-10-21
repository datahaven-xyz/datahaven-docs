import { type InfoResponse, type ValueProp } from '@storagehub-sdk/msp-client';

// Get basic MSP information from the MSP including its ID
const mspInfo: InfoResponse = await mspClient.getInfo();
const mspId = mspInfo.mspId as `0x${string}`;
console.log('MSP ID:', mspId);

// Choose one of the Value Props retrieved from the MSP
const valueProps: ValueProp[] = await mspClient.getValuePropositions();
if (!Array.isArray(valueProps) || valueProps.length === 0) {
  throw new Error('No value props availabile from this MSP.');
}
const valuePropId = valueProps[0].id as `0x${string}`;
console.log('Chosen value prop id: ', valuePropId);

// Define if bucket should be private or public
const isPrivate = false;

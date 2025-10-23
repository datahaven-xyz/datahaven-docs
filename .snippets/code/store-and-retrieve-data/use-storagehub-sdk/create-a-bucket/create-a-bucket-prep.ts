import { InfoResponse, ValueProp } from '@storagehub-sdk/msp-client';

// Get basic MSP information from the MSP including its ID
const mspInfo: InfoResponse = await mspClient.info.getInfo();
const mspId = mspInfo.mspId as `0x${string}`;
console.log('MSP ID:', mspId);

// Choose one of the Value Props retrieved from the MSP
const valueProps: ValueProp[] = await mspClient.info.getValuePropositions();
if (!Array.isArray(valueProps) || valueProps.length === 0) {
  throw new Error('No value props available from this MSP.');
}
// For simplicity, we will just choose the first valueProp in the list
const valueProp = valueProps[0];
console.log('Chosen value prop: ', valueProp);
// Get the id of the chosen value prop
const valuePropId = valueProp.id as `0x${string}`;
console.log('Chosen value prop id: ', valuePropId);

// Define if bucket should be private or public
const isPrivate = false;

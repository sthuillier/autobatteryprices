import { AxiosRequestConfig } from 'axios';
import { AmazonConfig } from '../config/amazon';

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function generateHMAC(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyBuffer = encoder.encode(key);
  const dataBuffer = encoder.encode(data);

  const importedKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', importedKey, dataBuffer);

  return Array.from(new Uint8Array(signature))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function signRequest(config: AxiosRequestConfig, amazonConfig: AmazonConfig): AxiosRequestConfig {
  const timestamp = new Date().toISOString();
  const date = timestamp.split('T')[0];

  // Create canonical request
  const canonicalRequest = [
    config.method?.toUpperCase() || 'GET',
    config.url || '/',
    '',
    'content-type:application/json',
    `host:webservices.amazon.${amazonConfig.region}`,
    `x-amz-date:${timestamp}`,
    '',
    'content-type;host;x-amz-date',
    await hashData(JSON.stringify(config.data) || '')
  ].join('\n');

  // Create string to sign
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    `${date}/${amazonConfig.region}/ProductAdvertisingAPI/aws4_request`,
    await hashData(canonicalRequest)
  ].join('\n');

  // Calculate signature using HMAC
  let key = `AWS4${amazonConfig.secretAccessKey}`;
  key = await generateHMAC(key, date);
  key = await generateHMAC(key, amazonConfig.region);
  key = await generateHMAC(key, 'ProductAdvertisingAPI');
  key = await generateHMAC(key, 'aws4_request');

  const signature = await generateHMAC(key, stringToSign);

  // Add authentication headers
  config.headers = {
    ...config.headers,
    'X-Amz-Date': timestamp,
    'Authorization': [
      'AWS4-HMAC-SHA256',
      `Credential=${amazonConfig.accessKeyId}/${date}/${amazonConfig.region}/ProductAdvertisingAPI/aws4_request`,
      `SignedHeaders=content-type;host;x-amz-date`,
      `Signature=${signature}`
    ].join(', ')
  };

  return config;
}
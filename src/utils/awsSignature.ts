import crypto from 'crypto';
import { AxiosRequestConfig } from 'axios';
import { AmazonConfig } from '../config/amazon';

export function signRequest(config: AxiosRequestConfig, amazonConfig: AmazonConfig): AxiosRequestConfig {
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
    crypto.createHash('sha256').update(JSON.stringify(config.data) || '').digest('hex')
  ].join('\n');

  // Create string to sign
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    `${date}/${amazonConfig.region}/ProductAdvertisingAPI/aws4_request`,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');

  // Calculate signature
  let key = `AWS4${amazonConfig.secretAccessKey}`;
  key = crypto.createHmac('sha256', key).update(date).digest('hex');
  key = crypto.createHmac('sha256', key).update(amazonConfig.region).digest('hex');
  key = crypto.createHmac('sha256', key).update('ProductAdvertisingAPI').digest('hex');
  key = crypto.createHmac('sha256', key).update('aws4_request').digest('hex');
  
  const signature = crypto.createHmac('sha256', key).update(stringToSign).digest('hex');

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
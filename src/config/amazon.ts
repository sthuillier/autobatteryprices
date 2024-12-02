export interface AmazonConfig {
  accessKeyId: string;
  secretAccessKey: string;
  partnerTag: string;
  region: string;
}

export const amazonConfig: AmazonConfig = {
  accessKeyId: import.meta.env.VITE_AMAZON_ACCESS_KEY_ID || 'AKIAJOMJQWHN6G4IEKIA',
  secretAccessKey: import.meta.env.VITE_AMAZON_SECRET_ACCESS_KEY || '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',
  partnerTag: import.meta.env.VITE_AMAZON_PARTNER_TAG || 'keilani0b-20',
  region: import.meta.env.VITE_AMAZON_REGION || 'us-east-1'
};
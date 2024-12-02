import cron from 'node-cron';
import winston from 'winston';
import { ProductAdvertisingAPIv1 } from 'paapi5-nodejs-sdk';
import { amazonConfig } from '../config/amazon.js';
import { db } from '../db/database.js';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/price-updates.log' }),
    new winston.transports.Console()
  ]
});

// Initialize Amazon API client
const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
defaultClient.accessKey = amazonConfig.accessKeyId;
defaultClient.secretKey = amazonConfig.secretAccessKey;
defaultClient.region = amazonConfig.region;
defaultClient.host = 'webservices.amazon.com';

const api = new ProductAdvertisingAPIv1.DefaultApi();

async function updatePrices() {
  try {
    logger.info('Starting price update');
    
    const searchRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();
    searchRequest.PartnerTag = amazonConfig.partnerTag;
    searchRequest.PartnerType = 'Associates';
    searchRequest.Keywords = 'car battery';
    searchRequest.SearchIndex = 'Automotive';
    searchRequest.ItemCount = 10;
    searchRequest.Resources = ['ItemInfo.Title', 'Offers.Listings.Price'];

    const response = await api.searchItems(searchRequest);
    
    if (response.SearchResult?.Items) {
      await db.transaction('rw', db.batteries, db.priceHistory, async () => {
        for (const item of response.SearchResult.Items) {
          const asin = item.ASIN;
          const title = item.ItemInfo?.Title?.DisplayValue;
          const price = item.Offers?.Listings?.[0]?.Price?.Amount;
          
          if (asin && price) {
            await db.batteries.put({
              asin,
              title: title || 'Unknown Battery',
              currentPrice: price,
              lastUpdated: new Date()
            });
            
            await db.priceHistory.add({
              asin,
              price,
              timestamp: new Date()
            });
            
            logger.info(`Updated price for ${title}: $${price}`);
          }
        }
      });
    }
    
    logger.info('Price update completed successfully');
  } catch (error) {
    logger.error('Error updating prices:', error);
  }
}

// Schedule cron job to run every 6 hours
cron.schedule('0 */6 * * *', () => {
  updatePrices();
});

// Run initial update
updatePrices();

// Keep the script running
process.stdin.resume();
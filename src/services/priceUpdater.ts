import { amazonConfig } from '../config/amazon';
import { db } from '../db/database';
import { isStale } from '../utils/dateUtils';
import { fetchBatteryPage } from './battery/batteryService';
import { updateBatteryRecord } from './db/batteryStorage';

const MAX_PAGES = 10;

async function shouldUpdate(): Promise<boolean> {
  try {
    const lastUpdate = await db.batteries
      .orderBy('lastUpdated')
      .last();
    return !lastUpdate || isStale(lastUpdate.lastUpdated);
  } catch (error) {
    console.error('Error checking update status:', error);
    return true;
  }
}

export async function checkAndUpdatePrices(): Promise<void> {
  try {
    if (!await shouldUpdate()) {
      console.log('Prices are up to date');
      return;
    }

    if (!amazonConfig.accessKeyId || !amazonConfig.secretAccessKey) {
      console.log('Amazon API not properly configured, skipping price update');
      return;
    }

    console.log('Starting price update');

    // Process pages sequentially to avoid overwhelming the system
    for (let page = 1; page <= MAX_PAGES; page++) {
      const batteries = await fetchBatteryPage(page);
      
      if (batteries.length === 0) {
        break;
      }

      // Process each battery sequentially within a transaction
      await db.transaction('rw', db.batteries, db.priceHistory, async () => {
        for (const battery of batteries) {
          if (battery.price > 0) {
            await updateBatteryRecord(battery);
            console.log(`Updated price for ${battery.title}: $${battery.price}`);
          }
        }
      });

      // Add a small delay between pages to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('Price update completed successfully');
  } catch (error) {
    console.error('Error updating prices:', error);
  }
}
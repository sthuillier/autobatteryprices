import { db } from '../../db/database';
import { Battery } from '../../types/battery';

export async function updateBatteryRecord(battery: Battery) {
  const asin = battery.affiliateLink.split('/dp/')[1].split('?')[0];
  
  await db.batteries.put({
    asin,
    title: battery.title,
    currentPrice: battery.price,
    lastUpdated: new Date(),
    bciGroup: battery.bciGroup,
    dimensions: battery.dimensions,
    ampHours: battery.ampHours,
    coldCrankingAmps: battery.coldCrankingAmps,
    crankingAmps: battery.crankingAmps,
    reserveCapacity: battery.reserveCapacity,
    type: battery.type,
    warrantyYears: battery.warrantyYears
  });

  await db.priceHistory.add({
    asin,
    price: battery.price,
    timestamp: new Date()
  });
}
import Dexie, { Table } from 'dexie';

export interface BatteryRecord {
  id?: number;
  asin: string;
  title: string;
  currentPrice: number;
  lastUpdated: Date;
  bciGroup: string;
  dimensions: string;
  ampHours: number;
  coldCrankingAmps: number;
  crankingAmps: number;
  reserveCapacity: number;
  type: string;
  warrantyYears: number;
}

export interface PriceHistory {
  id?: number;
  asin: string;
  price: number;
  timestamp: Date;
}

export class BatteryDatabase extends Dexie {
  batteries!: Table<BatteryRecord>;
  priceHistory!: Table<PriceHistory>;

  constructor() {
    super('BatteryDatabase');
    this.version(2).stores({
      batteries: '++id, asin, type, bciGroup, ampHours, coldCrankingAmps, lastUpdated',
      priceHistory: '++id, asin, timestamp'
    });

    // Add hooks for date conversion
    this.batteries.hook('reading', (battery) => {
      if (battery.lastUpdated) {
        battery.lastUpdated = new Date(battery.lastUpdated);
      }
      return battery;
    });

    this.priceHistory.hook('reading', (record) => {
      if (record.timestamp) {
        record.timestamp = new Date(record.timestamp);
      }
      return record;
    });
  }
}

export const db = new BatteryDatabase();
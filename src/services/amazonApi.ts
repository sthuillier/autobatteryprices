import { Battery } from '../types/battery';
import { SAMPLE_DATA } from '../constants/sampleData';
import { fetchBatteryPage, filterBatteries } from './battery/batteryService';

export async function searchBatteries(params: {
  group?: string;
  type?: string;
  minAh?: number;
  minCCA?: number;
}): Promise<Battery[]> {
  try {
    // In development, use sample data
    if (process.env.NODE_ENV === 'development') {
      return filterBatteries(SAMPLE_DATA, params);
    }

    // Fetch first page of results
    const batteries = await fetchBatteryPage(1);
    return filterBatteries(batteries, params);

  } catch (error) {
    console.error('Error fetching batteries:', error);
    // Fallback to sample data
    return filterBatteries(SAMPLE_DATA, params);
  }
}
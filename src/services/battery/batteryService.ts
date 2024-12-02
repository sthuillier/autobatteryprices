import { Battery } from '../../types/battery';
import { amazonApi, createSearchParams } from '../api/amazonClient';
import { extractBatteryData } from '../../utils/extractors';
import { BatterySearchResponse, BatterySearchParams } from './types';
import { mapToBattery } from './batteryMapper';
import { SAMPLE_DATA } from '../../constants/sampleData';

export function filterBatteries(batteries: Battery[], params: BatterySearchParams): Battery[] {
  return batteries.filter(battery => {
    if (params.group && params.group !== 'all' && battery.bciGroup !== params.group) return false;
    if (params.type && params.type !== 'all' && battery.type !== params.type) return false;
    if (params.minAh && battery.ampHours < params.minAh) return false;
    if (params.minCCA && battery.coldCrankingAmps < params.minCCA) return false;
    return true;
  });
}

export async function fetchBatteryPage(page: number): Promise<Battery[]> {
  if (process.env.NODE_ENV === 'development') {
    console.log('Using sample data in development mode');
    return SAMPLE_DATA;
  }

  try {
    const searchParams = createSearchParams(page);
    const response = await amazonApi.post<BatterySearchResponse>('', searchParams);
    
    if (!response.data?.SearchResult?.Items) {
      console.warn('No items found in Amazon response');
      return [];
    }

    return response.data.SearchResult.Items
      .filter(item => {
        const price = item.Offers?.Listings?.[0]?.Price?.Amount;
        return price && price > 0;
      })
      .map(item => {
        const batteryData = extractBatteryData(item);
        return mapToBattery(batteryData, item.ASIN);
      });
  } catch (error) {
    console.error('Error fetching batteries from Amazon:', error);
    if (process.env.NODE_ENV === 'development') {
      console.log('Falling back to sample data');
      return SAMPLE_DATA;
    }
    return [];
  }
}
// import { Battery } from '../../types/battery';
import { amazonApi, createSearchParams, createSearchParamsRapidApi, rapidApi } from '../api/amazonClient';
import { extractBatteryData, RapidApiProduct } from '../../utils/extractors';
import { BatterySearchParams } from './types';
import { mapToBattery } from './batteryMapper';
import { SAMPLE_DATA } from '../../constants/sampleData';
import { Battery } from '../../types/battery';

export function filterBatteries(batteries: Battery[], params: BatterySearchParams): Battery[] {
  return batteries.filter(battery => {
    if (params.group && params.group !== 'all' && battery.bciGroup !== params.group) return false;
    if (params.type && params.type !== 'all' && battery.type !== params.type) return false;
    if (params.minAh && battery.ampHours < params.minAh) return false;
    if (params.minCCA && battery.coldCrankingAmps < params.minCCA) return false;
    return true;
  });
}

// export async function fetchBatteryPage(page: number): Promise<Battery[]> {
//   // if (process.env.NODE_ENV === 'development') {
//   //   console.log('Using sample data in development mode');
//   //   return SAMPLE_DATA;
//   // }

//   try {
//     const searchParams = createSearchParamsRapidApi(page);
//     const response = await rapidApi.get<BatterySearchResponse>('', searchParams);

//     if (!response.data?.SearchResult?.Items) {
//       console.warn('No items found in Amazon response');
//       return [];
//     }

//     return response.data.SearchResult.Items
//       .filter(item => {
//         const price = item.Offers?.Listings?.[0]?.Price?.Amount;
//         return price && price > 0;
//       })
//       .map(item => {
//         const batteryData = extractBatteryData(item);
//         return mapToBattery(batteryData, item.ASIN);
//       });
//   } catch (error) {
//     console.error('Error fetching batteries from Amazon:', error);
//     if (process.env.NODE_ENV === 'development') {
//       console.log('Falling back to sample data');
//       return SAMPLE_DATA;
//     }
//     return [];
//   }
// }

interface BatterySearchResponse {
  country: string;
  domain: string;
  products: RapidApiProduct[];
  total_products: number;
}

export async function fetchBatteryPage(page: number): Promise<Battery[]> {
  // if (process.env.NODE_ENV === 'development') {
  //   console.log('Using sample data in development mode');
  //   return SAMPLE_DATA;
  // }

  try {
    const searchParams = createSearchParamsRapidApi(page);
    const response = await rapidApi.get<{ data: BatterySearchResponse }>('/search', { params: searchParams });

    if (!response.data) {
      console.warn('No items found in Amazon response');
      return [];
    }

    return response.data.data.products
      .filter(item => {
        const price = item.product_price.replace('$', '');
        return parseInt(price) && parseInt(price) > 0;
      })
      .map(item => {
        // const batteryData = extractBatteryData(item);
        return mapToBattery(item, item.asin);
      });
  } catch (error) {
    console.error('Error fetching batteries from Amazon:', error);
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('Falling back to sample data');
    //   return SAMPLE_DATA;
    // }
    return [];
  }
}
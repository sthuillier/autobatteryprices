import axios from 'axios';
import { amazonConfig } from '../../config/amazon';
import { signRequest } from '../../utils/awsSignature';

export const amazonApi = axios.create({
  baseURL: `https://webservices.amazon.${amazonConfig.region}/paapi5/searchitems`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const rapidApi = axios.create({
  baseURL: `https://real-time-amazon-data.p.rapidapi.com`,
  headers: {
    'Content-Type': 'application/json',
    'x-rapidapi-host': "real-time-amazon-data.p.rapidapi.com",
    'x-rapidapi-key': "ad6bdcd158mshb6b803358e7d221p14689ajsne08fb14bd14f",
  }
});

// Add request signing
amazonApi.interceptors.request.use(async config => {
  if (process.env.NODE_ENV === 'development') {
    return config;
  }
  return signRequest(config, amazonConfig);
});

export const createSearchParams = (page: number = 1) => ({
  Keywords: 'car battery automotive',
  SearchIndex: 'Automotive',
  ItemCount: 10,
  ItemPage: page,
  PartnerTag: amazonConfig.partnerTag,
  PartnerType: 'Associates',
  Resources: [
    'ItemInfo.Title',
    'Offers.Listings.Price',
    'ItemInfo.Features',
    'ItemInfo.TechnicalDetails',
    'ItemInfo.ContentInfo',
    'ItemInfo.ProductInfo',
    'BrowseNodeInfo.BrowseNodes'
  ],
  BrowseNodeId: '15684181', // Automotive Batteries category
  Merchant: 'Amazon',
  MinReviewsRating: 3,
  Availability: 'Available',
  DeliveryFlags: ['Prime'],
  Condition: 'New',
  MaxPrice: 50000, // $500.00
  MinPrice: 5000,  // $50.00
  SortBy: 'Featured'
});

export const createSearchParamsRapidApi = (page: number): Record<string, string | number | boolean> => ({
  query: 'car battery automotive',
  page,
  country: 'US',
  sort_by: 'RELEVANCE',
  product_condition: 'ALL',
  is_prime: true,
  deals_and_discounts: 'NONE',
  category: 'ALL',
  min_price: 50,
  max_price: 500,
  brand: '',
  seller_id: '',
  additional_filters: "SortBy=Featured,Condition=New",
});
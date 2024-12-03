import axios from 'axios';
import { amazonConfig } from '../../config/amazon';
import { signRequest } from '../../utils/awsSignature';

export const amazonApi = axios.create({
  baseURL: `https://cors-anywhere.herokuapp.com/https://webservices.amazon.${amazonConfig.region}/paapi5/searchitems`,
  headers: {
    'Content-Type': 'application/json'
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
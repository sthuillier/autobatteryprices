import { Battery } from '../types/battery';
import { amazonConfig } from '../config/amazon';

const ASIN_LIST = [
  { asin: "B002NGNY3O", title: "Optima RedTop 24F Starting Battery" },
  { asin: "B000MS9VZK", title: "Odyssey 34-PC1500T Automotive Battery" },
  { asin: "B00DTNWF2A", title: "ACDelco 47AGM Professional AGM Battery" },
  { asin: "B00DG6QV5G", title: "DieHard Advanced Gold AGM Battery" },
  { asin: "B07DXNP4KQ", title: "Bosch S6 High Performance EFB Battery" }
];

export const SAMPLE_DATA: Battery[] = [
  {
    price: 89.99,
    bciGroup: "24",
    dimensions: "242x175x190",
    ampHours: 60,
    coldCrankingAmps: 650,
    crankingAmps: 810,
    reserveCapacity: 100,
    type: "Lead Acid",
    affiliateLink: `https://www.amazon.com/dp/${ASIN_LIST[0].asin}?tag=keilani0b-20`,
    title: ASIN_LIST[0].title,
    warrantyYears: 3
  },
  {
    price: 129.99,
    bciGroup: "34",
    dimensions: "260x173x200",
    ampHours: 70,
    coldCrankingAmps: 750,
    crankingAmps: 900,
    reserveCapacity: 120,
    type: "AGM",
    affiliateLink: `https://www.amazon.com/dp/${ASIN_LIST[1].asin}?tag=keilani0b-20`,
    title: ASIN_LIST[1].title,
    warrantyYears: 4
  },
  {
    price: 95.99,
    bciGroup: "47",
    dimensions: "242x175x190",
    ampHours: 65,
    coldCrankingAmps: 700,
    crankingAmps: 850,
    reserveCapacity: 110,
    type: "Lead Acid",
    affiliateLink: `https://www.amazon.com/dp/${ASIN_LIST[2].asin}?tag=keilani0b-20`,
    title: ASIN_LIST[2].title,
    warrantyYears: 3
  },
  {
    price: 145.99,
    bciGroup: "48",
    dimensions: "278x175x190",
    ampHours: 80,
    coldCrankingAmps: 800,
    crankingAmps: 950,
    reserveCapacity: 140,
    type: "AGM",
    affiliateLink: `https://www.amazon.com/dp/${ASIN_LIST[3].asin}?tag=keilani0b-20`,
    title: ASIN_LIST[3].title,
    warrantyYears: 4
  },
  {
    price: 159.99,
    bciGroup: "49",
    dimensions: "352x175x190",
    ampHours: 95,
    coldCrankingAmps: 850,
    crankingAmps: 1000,
    reserveCapacity: 160,
    type: "EFB",
    affiliateLink: `https://www.amazon.com/dp/${ASIN_LIST[4].asin}?tag=keilani0b-20`,
    title: ASIN_LIST[4].title,
    warrantyYears: 5
  }
];
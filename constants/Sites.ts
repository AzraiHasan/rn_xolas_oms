import { Site, SiteStatus, SiteOption } from '@/types/models/Site';

/**
 * Mock site data for Johor Bahru shopping malls
 */
export const MOCK_SITES: Site[] = [
  {
    "siteId": "JBMALL01",
    "siteName": "Johor Bahru City Square",
    "siteAddress": {
      "street": "106-108, Jalan Wong Ah Fook",
      "latitude": 1.4622,
      "longitude": 103.7639,
      "city": "Johor Bahru",
      "state": "Johor",
      "country": "Malaysia"
    },
    "status": SiteStatus.Active
  },
  {
    "siteId": "JBMALL02",
    "siteName": "KSL City Mall",
    "siteAddress": {
      "street": "33, Jalan Seladang, Taman Abad",
      "latitude": 1.4825,
      "longitude": 103.7609,
      "city": "Johor Bahru",
      "state": "Johor",
      "country": "Malaysia"
    },
    "status": SiteStatus.Active
  },
  {
    "siteId": "JBMALL03",
    "siteName": "Paradigm Mall Johor Bahru",
    "siteAddress": {
      "street": "Jalan Skudai",
      "latitude": 1.5104,
      "longitude": 103.6931,
      "city": "Johor Bahru",
      "state": "Johor",
      "country": "Malaysia"
    },
    "status": SiteStatus.Active
  },
  {
    "siteId": "JBMALL04",
    "siteName": "AEON Mall Tebrau City",
    "siteAddress": {
      "street": "No 1, Jalan Desa Tebrau, Taman Desa Tebrau",
      "latitude": 1.5499,
      "longitude": 103.7957,
      "city": "Johor Bahru",
      "state": "Johor",
      "country": "Malaysia"
    },
    "status": SiteStatus.Support
  },
  {
    "siteId": "JBMALL05",
    "siteName": "The Mall, Mid Valley Southkey",
    "siteAddress": {
      "street": "No. 1, Persiaran Southkey 1, Kota Southkey",
      "latitude": 1.4886,
      "longitude": 103.7736,
      "city": "Johor Bahru",
      "state": "Johor",
      "country": "Malaysia"
    },
    "status": SiteStatus.Active
  },
  {
    "siteId": "JBMALL06",
    "siteName": "Toppen Shopping Centre",
    "siteAddress": {
      "street": "No. 33A, Jalan Harmonium, Taman Desa Tebrau",
      "latitude": 1.5535,
      "longitude": 103.7971,
      "city": "Johor Bahru",
      "state": "Johor",
      "country": "Malaysia"
    },
    "status": SiteStatus.Active
  },
  {
    "siteId": "JBMALL07",
    "siteName": "AEON Mall Bukit Indah",
    "siteAddress": {
      "street": "8, Jalan Indah 15/2, Taman Bukit Indah",
      "latitude": 1.4820,
      "longitude": 103.6550,
      "city": "Johor Bahru",
      "state": "Johor",
      "country": "Malaysia"
    },
    "status": SiteStatus.NotActive
  },
  {
    "siteId": "JBMALL08",
    "siteName": "R&F Mall Johor Bahru",
    "siteAddress": {
      "street": "Jalan Tanjung Puteri, R&F, Tanjung Puteri",
      "latitude": 1.4603,
      "longitude": 103.7718,
      "city": "Johor Bahru",
      "state": "Johor",
      "country": "Malaysia"
    },
    "status": SiteStatus.Active
  },
  {
    "siteId": "JBMALL09",
    "siteName": "Sunway Big Box Retail Park",
    "siteAddress": {
      "street": "Pusat Komersial Sunway Marketplace, Persiaran Medini 5, Sunway City Iskandar Puteri",
      "latitude": 1.4209,
      "longitude": 103.6372,
      "city": "Iskandar Puteri",
      "state": "Johor",
      "country": "Malaysia"
    },
    "status": SiteStatus.Support
  },
  {
    "siteId": "JBMALL10",
    "siteName": "Plaza Angsana",
    "siteAddress": {
      "street": "Pusat Bandar Tampoi, 5, Jalan Tampoi",
      "latitude": 1.5051,
      "longitude": 103.7093,
      "city": "Johor Bahru",
      "state": "Johor",
      "country": "Malaysia"
    },
    "status": SiteStatus.Active
  }
];

/**
 * Convert sites to dropdown options
 */
export const getSiteOptions = (): SiteOption[] => {
  return MOCK_SITES.map(site => ({
    value: site.siteId,
    label: site.siteName
  }));
};

/**
 * Find site by ID
 */
export const findSiteById = (siteId: string): Site | undefined => {
  return MOCK_SITES.find(site => site.siteId === siteId);
};
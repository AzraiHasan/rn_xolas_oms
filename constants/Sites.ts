import { Site, SiteStatus, SiteOption } from '@/types/models/Site';

/**
 * Mock site data with diverse statuses from various locations
 */
export const MOCK_SITES: Site[] = [
  {
    "siteId": "JDC0849LSR130DNB",
    "siteName": "IWK NUSA BESTARI 2",
    "siteAddress": {
      "street": "Jalan Nusa Bestari, Taman Nusa Bestari",
      "latitude": 1.492282,
      "longitude": 103.64925
    },
    "status": SiteStatus.Active,
    "group": ""
  },
  {
    "siteId": "JDC0673TW160",
    "siteName": "KAMPUNG PAYA MENGKUANG",
    "siteAddress": {
      "street": "Kampung Paya Mengkuang",
      "latitude": 1.370325,
      "longitude": 103.584875
    },
    "status": SiteStatus.Active,
    "group": ""
  },
  {
    "siteId": "JDA0256LP130",
    "siteName": "TAMAN REDANG",
    "siteAddress": {
      "street": "Taman Redang",
      "latitude": 1.5141,
      "longitude": 103.79287
    },
    "status": SiteStatus.Active,
    "group": ""
  },
  {
    "siteId": "JDA0257MR124",
    "siteName": "SURAU AUSTIN PERDANA",
    "siteAddress": {
      "street": "Surau Austin Perdana",
      "latitude": 1.54184,
      "longitude": 103.78392
    },
    "status": SiteStatus.Active,
    "group": ""
  },
  {
    "siteId": "JDC0491MPT145",
    "siteName": "LEISURE FARM (GATE 4)",
    "siteAddress": {
      "street": "Leisure Farm Gate 4",
      "latitude": 1.404925,
      "longitude": 103.614657
    },
    "status": SiteStatus.Active,
    "group": ""
  },
  {
    "siteId": "JDN0674SQ130D",
    "siteName": "MASJID JAMEK CHAAH",
    "siteAddress": {
      "street": "Masjid Jamek Chaah",
      "latitude": 2.24887,
      "longitude": 103.039568
    },
    "status": SiteStatus.Active,
    "group": ""
  },
  {
    "siteId": "JDR0905LSR130D",
    "siteName": "PERINDUSTRIAN BAKRI MUAR",
    "siteAddress": {
      "street": "Kawasan Perindustrian Bakri",
      "latitude": 2.019363,
      "longitude": 102.667949
    },
    "status": SiteStatus.Active,
    "group": ""
  },
  {
    "siteId": "JDB0260LP130",
    "siteName": "TAMAN CAHAYA MASAI 3 LP",
    "siteAddress": {
      "street": "Taman Cahaya Masai 3",
      "latitude": 1.50598,
      "longitude": 103.93228
    },
    "status": SiteStatus.Active,
    "group": ""
  },
  {
    "siteId": "JDK0493PR126",
    "siteName": "PERKIM, BATU PAHAT",
    "siteAddress": {
      "street": "PERKIM, Batu Pahat",
      "latitude": 1.840995,
      "longitude": 102.933589
    },
    "status": SiteStatus.Active,
    "group": ""
  },
  {
    "siteId": "JDS0910LSR130D",
    "siteName": "KM 57 SDE (KIM LOONG PLANTATION)",
    "siteAddress": {
      "street": "KM 57 SDE, Kim Loong Plantation",
      "latitude": 1.548522,
      "longitude": 104.096874
    },
    "status": SiteStatus.Active,
    "group": ""
  },
  {
    "siteId": "J10D",
    "siteName": "T1 SAJ Bukit Skudai",
    "siteAddress": {
      "street": "SAJ Bukit Skudai",
      "latitude": 1.541347,
      "longitude": 103.676351
    },
    "status": SiteStatus.Dismantled,
    "group": ""
  },
  {
    "siteId": "LR047",
    "siteName": "RAPID LOT 42, Pengerang",
    "siteAddress": {
      "street": "Rapid Lot 42, Pengerang",
      "latitude": 1.370306,
      "longitude": 104.1772
    },
    "status": SiteStatus.Dismantled,
    "group": ""
  },
  {
    "siteId": "J325D",
    "siteName": "Taman Sierra Perdana LP2",
    "siteAddress": {
      "street": "Taman Sierra Perdana",
      "latitude": 1.476258,
      "longitude": 103.872919
    },
    "status": SiteStatus.Dismantled,
    "group": ""
  },
  {
    "siteId": "J191D",
    "siteName": "Horizon Hill",
    "siteAddress": {
      "street": "Horizon Hill",
      "latitude": 1.460989,
      "longitude": 103.654522
    },
    "status": SiteStatus.Dismantled,
    "group": ""
  },
  {
    "siteId": "J01368",
    "siteName": "T3 FELCRA BKT KEPONG",
    "siteAddress": {
      "street": "FELCRA Bukit Kepong",
      "latitude": 0,
      "longitude": 0
    },
    "status": SiteStatus.Candidate,
    "group": ""
  },
  {
    "siteId": "LR005",
    "siteName": "JBA Larkin",
    "siteAddress": {
      "street": "JBA Larkin",
      "latitude": 1.497586,
      "longitude": 103.7255728
    },
    "status": SiteStatus.NotActive,
    "group": ""
  },
  {
    "siteId": "LR075",
    "siteName": "Kampung Tengah Renggam",
    "siteAddress": {
      "street": "Kampung Tengah Renggam",
      "latitude": 1.84437,
      "longitude": 103.41088
    },
    "status": SiteStatus.NotActive,
    "group": ""
  },
  {
    "siteId": "LR082",
    "siteName": "Ladang Kekayaan",
    "siteAddress": {
      "street": "Ladang Kekayaan",
      "latitude": 2.19569,
      "longitude": 103.28526
    },
    "status": SiteStatus.NotActive,
    "group": ""
  },
  {
    "siteId": "JDC0254MP145",
    "siteName": "Felda Ulu Tebrau",
    "siteAddress": {
      "street": "Felda Ulu Tebrau",
      "latitude": 1.63431,
      "longitude": 103.76186
    },
    "status": SiteStatus.Support,
    "group": "LIMITLESS"
  },
  {
    "siteId": "JDH0255TW145",
    "siteName": "GE Kota Tinggi",
    "siteAddress": {
      "street": "GE Kota Tinggi",
      "latitude": 1.75601,
      "longitude": 103.88677
    },
    "status": SiteStatus.Support,
    "group": "LIMITLESS"
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
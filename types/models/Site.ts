/**
 * Site-related type definitions for location management
 */

export interface SiteAddress {
  /** Street address */
  street: string;
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
  /** City name */
  city: string;
  /** State/Province */
  state: string;
  /** Country name */
  country: string;
}

export interface Site {
  /** Unique site identifier */
  siteId: string;
  /** Human-readable site name */
  siteName: string;
  /** Physical address and coordinates */
  siteAddress: SiteAddress;
  /** Operational status */
  status: SiteStatus;
}

export enum SiteStatus {
  Active = "Active",
  Support = "Support",
  NotActive = "Not Active"
}

export type SiteOption = {
  value: string;
  label: string;
}
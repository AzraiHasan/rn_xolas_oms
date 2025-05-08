/**
 * Strategic domain models that define the core business capabilities
 * of the Order Management System
 */

/**
 * Order lifecycle states that represent key business process stages
 */
export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  FULFILLED = 'FULFILLED',
  CANCELED = 'CANCELED',
  ON_HOLD = 'ON_HOLD',
}

/**
 * Customer entity representing the business relationship
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

/**
 * Order entity - the central business object that drives 
 * revenue operations and customer fulfillment
 */
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string; // Denormalized for display efficiency
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
}

/**
 * Order summary statistics for executive dashboard visibility
 */
export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  fulfilled: number;
  canceled: number;
  onHold: number;
}

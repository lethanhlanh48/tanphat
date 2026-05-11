/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ProductStatus {
  SHOW = 'Đang kinh doanh',
  HIDE = 'Ngừng kinh doanh',
}

export interface Category {
  id: string | number;
  name: string;
  description: string;
  status: ProductStatus;
}
export type Brand = string;

export interface Supplier {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  address: string;
  category: string;
}

export interface Product {
  id: string | number;
  image: string;
  code: string;
  name: string;
  category: string;
  brand: Brand;
  unit: string;
  price: number;
  costPrice: number;
  stock: number;
  status: ProductStatus;
  qrCode: string;
}

export interface OrderItem {
  productId: string | number;
  productName: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  COMPLETED = 'Đã hoàn thành',
  PENDING = 'Chờ xử lý',
  CANCELLED = 'Đã hủy',
}

export interface Order {
  id: string | number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface AdminAccount {
  id: string | number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  avatar?: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  orderQuery: string;
  orderPhone: string;
  orderDate: string;
  status: string;
  stockStatus: string;
  orderStatus: string;
}

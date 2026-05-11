/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Brand, ProductStatus, Supplier, Order, OrderStatus, AdminAccount } from './types.ts';

export const INITIAL_ACCOUNTS: AdminAccount[] = [
  {
    id: 1,
    username: 'admin',
    fullName: 'Nguyễn Văn A',
    email: 'admin@hethong.vn',
    role: 'Quản trị viên',
    status: 'active',
    lastLogin: '2024-03-25 08:30:00',
    avatar: '',
  },
  {
    id: 2,
    username: 'manager_sale',
    fullName: 'Trần Thị B',
    email: 'sale.manager@hethong.vn',
    role: 'Quản lý bán hàng',
    status: 'active',
    lastLogin: '2024-03-24 15:20:00',
    avatar: '',
  }
];

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Điện thoại', description: 'Các loại điện thoại thông minh', status: ProductStatus.SHOW },
  { id: 2, name: 'Laptop', description: 'Máy tính xách tay văn phòng, gaming', status: ProductStatus.SHOW },
  { id: 3, name: 'Phụ kiện', description: 'Tai nghe, cáp sạc, bao da', status: ProductStatus.SHOW },
  { id: 4, name: 'Đồng hồ', description: 'Đồng hồ thông minh, thời trang', status: ProductStatus.SHOW },
  { id: 5, name: 'Máy tính bảng', description: 'iPad, Samsung Tab', status: ProductStatus.SHOW },
];

export const BRANDS: Brand[] = [
  'Tất cả thương hiệu',
  'Apple',
  'Samsung',
  'Oppo',
  'Xiaomi',
  'Garmin',
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 1, name: 'Apple Vietnam', phone: '028 1234 5678', email: 'contact@apple.vn', address: 'Quận 1, TP.HCM', category: 'Thiết bị điện tử' },
  { id: 2, name: 'Samsung Vina', phone: '028 8765 4321', email: 'sales@samsung.vn', address: 'Quận 7, TP.HCM', category: 'Thiết bị gia dụng' },
  { id: 3, name: 'Xiaomi Official', phone: '024 1122 3344', email: 'support@xiaomi.vn', address: 'Quận Cầu Giấy, Hà Nội', category: 'Phụ kiện' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d256e?w=800&auto=format&fit=crop&q=60',
    code: 'SP0001',
    name: 'iPhone 15 Pro Max 256GB',
    category: 'Điện thoại',
    brand: 'Apple',
    unit: 'Cái',
    price: 34990000,
    costPrice: 28000000,
    stock: 23,
    status: ProductStatus.SHOW,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SP0001',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1517336712461-481bf488dfc2?w=800&auto=format&fit=crop&q=60',
    code: 'SP0002',
    name: 'MacBook Air M2 13 inch',
    category: 'Laptop',
    brand: 'Apple',
    unit: 'Cái',
    price: 24990000,
    costPrice: 20000000,
    stock: 15,
    status: ProductStatus.SHOW,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SP0002',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1588423770570-226829f07866?w=800&auto=format&fit=crop&q=60',
    code: 'SP0003',
    name: 'Tai nghe AirPods Pro 2',
    category: 'Phụ kiện',
    brand: 'Apple',
    unit: 'Cái',
    price: 6490000,
    costPrice: 4500000,
    stock: 50,
    status: ProductStatus.SHOW,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SP0003',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1544117518-30dd0575cfa4?w=800&auto=format&fit=crop&q=60',
    code: 'SP0004',
    name: 'Apple Watch Series 9',
    category: 'Đồng hồ',
    brand: 'Apple',
    unit: 'Cái',
    price: 10990000,
    costPrice: 8500000,
    stock: 18,
    status: ProductStatus.SHOW,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SP0004',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60',
    code: 'SP0005',
    name: 'iPad Air M1 64GB',
    category: 'Máy tính bảng',
    brand: 'Apple',
    unit: 'Cái',
    price: 15990000,
    costPrice: 13000000,
    stock: 12,
    status: ProductStatus.HIDE,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SP0005',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 1,
    orderCode: 'DH0001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    items: [
      { productId: 1, productName: 'iPhone 15 Pro Max 256GB', quantity: 1, price: 34990000 },
      { productId: 3, productName: 'Tai nghe AirPods Pro 2', quantity: 1, price: 6490000 },
    ],
    totalAmount: 41480000,
    status: OrderStatus.COMPLETED,
    createdAt: '2024-03-20 10:30:00',
  },
  {
    id: 2,
    orderCode: 'DH0002',
    customerName: 'Trần Thị B',
    customerPhone: '0912345678',
    items: [
      { productId: 2, productName: 'MacBook Air M2 13 inch', quantity: 1, price: 24990000 },
    ],
    totalAmount: 24990000,
    status: OrderStatus.PENDING,
    createdAt: '2024-03-21 14:15:00',
  },
  {
    id: 3,
    orderCode: 'DH0003',
    customerName: 'Lê Văn C',
    customerPhone: '0987654321',
    items: [
      { productId: 4, productName: 'Apple Watch Series 9', quantity: 2, price: 10990000 },
    ],
    totalAmount: 21980000,
    status: OrderStatus.CANCELLED,
    createdAt: '2024-03-22 09:45:00',
  },
];

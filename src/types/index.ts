export interface User {
  _id: string;
  email: string;
  role: 'user' | 'admin';
  businessName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  productId: string;
  userId: string;
  customerName: string;
  customerContact: string;
  quantity: number;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  scheduledDate?: string;
  autoComplete: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  title: string;
  description: string;
  price: number;
  unit: string;
}

export interface CreateOrderDto {
  productId: string;
  customerName: string;
  customerContact: string;
  quantity: number;
  scheduledDate?: string;
  autoComplete: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  businessName: string;
}

export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
}

// Re-export settings types
export * from './iSettings';
export * from './iBilling';
export * from './iVehicle';
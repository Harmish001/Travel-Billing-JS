import axiosInstance from '@/src/lib/axios';
import { Order, CreateOrderDto, ApiResponse } from '@/src/types';

export const orderService = {
  async getOrders(userId?: string): Promise<Order[]> {
    const url = userId ? `/orders?userId=${userId}` : '/orders';
    const response = await axiosInstance.get<ApiResponse<Order[]>>(url);
    return response.data.data!;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await axiosInstance.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data!;
  },

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const response = await axiosInstance.post<ApiResponse<Order>>(
      '/orders',
      orderData
    );
    return response.data.data!;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const response = await axiosInstance.patch<ApiResponse<Order>>(
      `/orders/${id}/status`,
      { status }
    );
    return response.data.data!;
  },

  async completeOrder(id: string): Promise<Order> {
    const response = await axiosInstance.patch<ApiResponse<Order>>(
      `/orders/${id}/complete`
    );
    return response.data.data!;
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await axiosInstance.patch<ApiResponse<Order>>(
      `/orders/${id}/cancel`
    );
    return response.data.data!;
  },

  async getOrdersByProduct(productId: string): Promise<Order[]> {
    const response = await axiosInstance.get<ApiResponse<Order[]>>(
      `/orders/product/${productId}`
    );
    return response.data.data!;
  },
};
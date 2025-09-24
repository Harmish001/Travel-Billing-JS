import axiosInstance from '@/src/lib/axios';
import { Product, CreateProductDto, ApiResponse } from '@/src/types';

export const productService = {
  async getProducts(userId?: string): Promise<Product[]> {
    const url = userId ? `/products?userId=${userId}` : '/products';
    const response = await axiosInstance.get<ApiResponse<Product[]>>(url);
    return response.data.data!;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const response = await axiosInstance.post<ApiResponse<Product>>(
      '/products',
      productData
    );
    return response.data.data!;
  },

  async updateProduct(id: string, productData: Partial<CreateProductDto>): Promise<Product> {
    const response = await axiosInstance.put<ApiResponse<Product>>(
      `/products/${id}`,
      productData
    );
    return response.data.data!;
  },

  async deleteProduct(id: string): Promise<void> {
    await axiosInstance.delete(`/products/${id}`);
  },

  async generateProductImage(title: string): Promise<{ imageUrl: string }> {
    const response = await axiosInstance.post<ApiResponse<{ imageUrl: string }>>(
      '/products/generate-image',
      { title }
    );
    return response.data.data!;
  },
};
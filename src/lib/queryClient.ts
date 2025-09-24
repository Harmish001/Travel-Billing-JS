import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  user: ['user'] as const,
  
  // Products
  products: ['products'] as const,
  product: (id: string) => ['product', id] as const,
  userProducts: (userId: string) => ['products', 'user', userId] as const,
  
  // Orders
  orders: ['orders'] as const,
  order: (id: string) => ['order', id] as const,
  userOrders: (userId: string) => ['orders', 'user', userId] as const,
  productOrders: (productId: string) => ['orders', 'product', productId] as const,
  
  // Analytics
  analytics: ['analytics'] as const,
  monthlyStats: (month: string, year: string) => ['analytics', 'monthly', month, year] as const,
};
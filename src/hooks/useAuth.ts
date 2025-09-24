import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/src/services";
import { LoginCredentials, RegisterData } from "@/src/types";
import { queryKeys } from "@/src/lib/queryClient";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => authService.getCurrentUser(),
    staleTime: Infinity, // 10 minutes
    gcTime: Infinity, // 10 minutes
    retry: false,
  });
};

import axiosInstance from "@/src/lib/axios";
import { LoginCredentials, RegisterData, User, ApiResponse } from "@/src/types";

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<{ token: string; user: User }> {
    const response = await axiosInstance.post<
      ApiResponse<{ token: string; user: User }>
    >("/auth/login", credentials);
    return response.data.data!;
  },

  async register(
    userData: RegisterData
  ): Promise<{ token: string; user: User }> {
    const response = await axiosInstance.post<
      ApiResponse<{ token: string; user: User }>
    >("/auth/register", userData);
    return response.data.data!;
  },

  async logout(): Promise<void> {
    await axiosInstance.post("/auth/logout");
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await axiosInstance.post<ApiResponse<{ token: string }>>(
      "/auth/refresh"
    );
    return response.data.data!;
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>("/auth/me");
    return response.data.data!;
  },

  async forgotPassword(email: string): Promise<{ resetToken?: string }> {
    const response = await axiosInstance.post<
      ApiResponse<{ resetToken?: string }>
    >("/auth/forgot-password", { email });
    return response.data.data!;
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await axiosInstance.post<ApiResponse<null>>(
      "/auth/reset-password",
      { token, newPassword }
    );
    return response.data.data!;
  },
};

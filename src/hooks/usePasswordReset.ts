import { useMutation } from "@tanstack/react-query";
import { authService } from "@/src/services";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onError: (error) => {
      console.error("Forgot password failed:", error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => authService.resetPassword(token, newPassword),
    onError: (error) => {
      console.error("Reset password failed:", error);
    },
  });
};

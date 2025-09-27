import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { SettingsService } from "@/src/services/settings";
import { CreateSettingsRequest, UpdateSettingsRequest, SettingsResponse } from "@/src/types/iSettings";
import { QUERY_KEYS } from "@/src/constants/queryKey";

interface ApiError {
	response?: {
		data?: {
			message?: string;
		};
	};
	message?: string;
}

// Get settings query
export const useSettings = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.SETTINGS.DETAILS],
		queryFn: SettingsService.get,
		retry: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Create settings mutation
export const useCreateSettings = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<SettingsResponse, Error, CreateSettingsRequest>({
		mutationFn: SettingsService.create,
		onSuccess: (data) => {
			// Invalidate and refetch settings
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS.DETAILS] });

			api.success({
				message: "Success",
				description: data.message || "Settings created successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message || "Failed to create settings";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};

// Update settings mutation
export const useUpdateSettings = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<SettingsResponse, Error, UpdateSettingsRequest>({
		mutationFn: SettingsService.update,
		onSuccess: (data) => {
			// Invalidate and refetch settings
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS.DETAILS] });

			api.success({
				message: "Success",
				description: data.message || "Settings updated successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message || "Failed to update settings";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};

// Delete settings mutation
export const useDeleteSettings = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<SettingsResponse, Error, void>({
		mutationFn: SettingsService.delete,
		onSuccess: (data) => {
			// Invalidate and refetch settings
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS.DETAILS] });

			api.success({
				message: "Success",
				description: data.message || "Settings deleted successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message || "Failed to delete settings";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};
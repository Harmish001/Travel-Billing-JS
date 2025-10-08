import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { DriverService } from "@/src/services/driver";
import {
	DriverCreateRequest,
	DriverUpdateRequest,
	DriverSearchParams,
	DriverResponse,
	DriverListResponse
} from "@/src/types/iDriver";
import { QUERY_KEYS } from "../constants/queryKey";

interface ApiError {
	response?: {
		data?: {
			message?: string;
		};
	};
	message?: string;
}

// Get all drivers with search and pagination
export const useDrivers = (params?: DriverSearchParams) => {
	return useQuery<DriverListResponse>({
		queryKey: [QUERY_KEYS.DRIVER.ALL, params],
		queryFn: () => DriverService.getAll(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2
	});
};

// Get driver by ID
export const useDriver = (id: string, enabled = true) => {
	return useQuery<DriverResponse>({
		queryKey: [QUERY_KEYS.DRIVER.BY_ID, id],
		queryFn: () => DriverService.getById(id),
		enabled: enabled && !!id,
		staleTime: 5 * 60 * 1000,
		retry: 2
	});
};

// Create driver mutation
export const useCreateDriver = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<DriverResponse, Error, DriverCreateRequest>({
		mutationFn: DriverService.create,
		onSuccess: (data) => {
			// Invalidate and refetch driver queries
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DRIVER.ALL] });

			api.success({
				message: "Success",
				description: data.message || "Driver created successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to create driver";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};

// Update driver mutation
export const useUpdateDriver = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<
		DriverResponse,
		Error,
		{ id: string; data: DriverUpdateRequest }
	>({
		mutationFn: ({ id, data }) => DriverService.update(id, data),
		onSuccess: (data, variables) => {
			// Invalidate and refetch driver queries
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DRIVER.ALL] });
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.DRIVER.BY_ID, variables.id]
			});

			api.success({
				message: "Success",
				description: data.message || "Driver updated successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to update driver";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};

// Delete driver mutation
export const useDeleteDriver = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<DriverResponse, Error, string>({
		mutationFn: DriverService.delete,
		onSuccess: (data) => {
			// Invalidate and refetch driver queries
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DRIVER.ALL] });

			api.success({
				message: "Success",
				description: data.message || "Driver deleted successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to delete driver";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};
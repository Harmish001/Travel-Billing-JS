import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { VehicleService } from "@/src/services/vehicle";
import {
	VehicleCreateRequest,
	VehicleUpdateRequest,
	VehicleSearchParams,
	VehicleResponse,
	VehicleListResponse,
	VehicleStatsResponse
} from "@/src/types/iVehicle";
import { QUERY_KEYS } from "../constants/queryKey";

interface ApiError {
	response?: {
		data?: {
			message?: string;
		};
	};
	message?: string;
}

interface ApiError {
	response?: {
		data?: {
			message?: string;
		};
	};
	message?: string;
}

// Get all vehicles with search and pagination
export const useVehicles = (params?: VehicleSearchParams) => {
	return useQuery<VehicleListResponse>({
		queryKey: [QUERY_KEYS.VEHICLE.ALL, params],
		queryFn: () => VehicleService.getAll(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2
	});
};

// Get vehicle by ID
export const useVehicle = (id: string, enabled = true) => {
	return useQuery<VehicleResponse>({
		queryKey: [QUERY_KEYS.VEHICLE.BY_ID, id],
		queryFn: () => VehicleService.getById(id),
		enabled: enabled && !!id,
		staleTime: 5 * 60 * 1000,
		retry: 2
	});
};

// Get vehicle statistics
export const useVehicleStats = () => {
	return useQuery<VehicleStatsResponse>({
		queryKey: [QUERY_KEYS.VEHICLE.STATS],
		queryFn: VehicleService.getStats,
		staleTime: 10 * 60 * 1000, // 10 minutes
		retry: 2
	});
};

// Create vehicle mutation
export const useCreateVehicle = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<VehicleResponse, Error, VehicleCreateRequest>({
		mutationFn: VehicleService.create,
		onSuccess: (data) => {
			// Invalidate and refetch vehicle queries
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLE.ALL] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLE.STATS] });

			api.success({
				message: "Success",
				description: data.message || "Vehicle created successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to create vehicle";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};

// Update vehicle mutation
export const useUpdateVehicle = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<
		VehicleResponse,
		Error,
		{ id: string; data: VehicleUpdateRequest }
	>({
		mutationFn: ({ id, data }) => VehicleService.update(id, data),
		onSuccess: (data, variables) => {
			// Invalidate and refetch vehicle queries
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLE.ALL] });
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.VEHICLE.BY_ID, variables.id]
			});
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLE.STATS] });

			api.success({
				message: "Success",
				description: data.message || "Vehicle updated successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to update vehicle";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};

// Delete vehicle mutation
export const useDeleteVehicle = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<VehicleResponse, Error, string>({
		mutationFn: VehicleService.delete,
		onSuccess: (data) => {
			// Invalidate and refetch vehicle queries
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLE.ALL] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLE.STATS] });

			api.success({
				message: "Success",
				description: data.message || "Vehicle deleted successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to delete vehicle";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};

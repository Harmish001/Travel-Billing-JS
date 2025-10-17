import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { DutyService } from "@/src/services/duty";
import {
	IDutyCreateRequest,
	IDutyUpdateRequest,
	IDutyStatusUpdateRequest,
	IDutySearchParams,
	IDutyResponse,
	IDutyListResponse,
	IDutyGenerateBillingRequest,
	IDutyGenerateBillingResponse
} from "@/src/types/iDuty";
import { QUERY_KEYS } from "../constants/queryKey";

interface ApiError {
	response?: {
		data?: {
			message?: string;
		};
	};
	message?: string;
}

// Get all duties with search and pagination
export const useDuties = (params?: IDutySearchParams) => {
	return useQuery<IDutyListResponse>({
		queryKey: [QUERY_KEYS.DUTY.ALL, params],
		queryFn: () => DutyService.getAll(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2
	});
};

// Get duty by ID
export const useDuty = (id: string, enabled = true) => {
	return useQuery<IDutyResponse>({
		queryKey: [QUERY_KEYS.DUTY.BY_ID, id],
		queryFn: () => DutyService.getById(id),
		enabled: enabled && !!id,
		staleTime: 5 * 60 * 1000,
		retry: 2
	});
};

// Create duty mutation
export const useCreateDuty = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<IDutyResponse, Error, IDutyCreateRequest>({
		mutationFn: DutyService.create,
		onSuccess: (data) => {
			// Invalidate and refetch duty queries
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DUTY.ALL] });

			api.success({
				message: "Success",
				description: data.message || "Duty created successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to create duty";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};

// Update duty mutation
export const useUpdateDuty = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<
		IDutyResponse,
		Error,
		{ id: string; data: IDutyUpdateRequest }
	>({
		mutationFn: ({ id, data }) => DutyService.update(id, data),
		onSuccess: (data, variables) => {
			// Invalidate and refetch duty queries
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DUTY.ALL] });
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.DUTY.BY_ID, variables.id]
			});

			api.success({
				message: "Success",
				description: data.message || "Duty updated successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to update duty";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};

// Update duty status mutation
export const useUpdateDutyStatus = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<
		IDutyResponse,
		Error,
		{ id: string; data: IDutyStatusUpdateRequest }
	>({
		mutationFn: ({ id, data }) => DutyService.updateStatus(id, data),
		onSuccess: (data, variables) => {
			// Invalidate and refetch duty queries
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DUTY.ALL] });
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.DUTY.BY_ID, variables.id]
			});

			api.success({
				message: "Success",
				description: data.message || "Duty status updated successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to update duty status";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};

// Delete duty mutation
export const useDeleteDuty = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<IDutyResponse, Error, string>({
		mutationFn: DutyService.delete,
		onSuccess: (data) => {
			// Invalidate and refetch duty queries
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DUTY.ALL] });

			api.success({
				message: "Success",
				description: data.message || "Duty deleted successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to delete duty";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};

// Generate billing from duty mutation
export const useGenerateBillingFromDuty = () => {
	const queryClient = useQueryClient();
	const [api, contextHolder] = notification.useNotification();

	const mutation = useMutation<
		IDutyGenerateBillingResponse,
		Error,
		IDutyGenerateBillingRequest
	>({
		mutationFn: DutyService.generateBilling,
		onSuccess: (data) => {
			// Invalidate and refetch duty queries
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DUTY.ALL] });

			api.success({
				message: "Success",
				description: data.message || "Billing generated successfully",
				placement: "topRight"
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to generate billing";
			api.error({
				message: "Error",
				description: errorMessage,
				placement: "topRight"
			});
		}
	});

	return { ...mutation, contextHolder };
};
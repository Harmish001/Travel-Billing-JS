import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { createBilling, getAllBillings, getBillingById, updateBilling, deleteBilling, calculateBillingAmounts, getBillingAnalytics } from "@/src/services/billing";
import { IBillingRequest, IGetAllBillingsResponse, IBillingAnalyticsResponse } from "@/src/types/iBilling";
import { QUERY_KEYS } from "../constants/queryKey";

interface ApiError {
	response?: {
		data?: {
			message?: string;
		};
	};
}

export const useCreateBilling = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: createBilling,
		onSuccess: (data) => {
			message.success(data.message || "Billing created successfully!");
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLING.ALL] });
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message || "Failed to create billing";
			message.error(errorMessage);
		}
	});
};

export const useGetAllBillings = () => {
	return useQuery<IGetAllBillingsResponse>({
		queryKey: [QUERY_KEYS.BILLING.ALL],
		queryFn: getAllBillings
	});
};

export const useGetBillingById = (id: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.BILLING.BY_ID, id],
		queryFn: () => getBillingById(id),
		enabled: !!id
	});
};

export const useUpdateBilling = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<IBillingRequest> }) => 
			updateBilling(id, data),
		onSuccess: (data) => {
			message.success(data.message || "Billing updated successfully!");
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLING.ALL] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLING.BY_ID] });
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message || "Failed to update billing";
			message.error(errorMessage);
		}
	});
};

export const useDeleteBilling = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: deleteBilling,
		onSuccess: (data) => {
			message.success(data.message || "Billing deleted successfully!");
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLING.ALL] });
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message || "Failed to delete billing";
			message.error(errorMessage);
		}
	});
};

export const useCalculateBillingAmounts = () => {
	return useMutation({
		mutationFn: ({ quantity, rate }: { quantity: number; rate: number }) => 
			calculateBillingAmounts(quantity, rate)
	});
};

// Add the new hook for billing analytics
export const useBillingAnalytics = () => {
	return useQuery<IBillingAnalyticsResponse>({
		queryKey: [QUERY_KEYS.BILLING.ANALYTICS],
		queryFn: getBillingAnalytics
	});
};

import {
	IBillingRequest,
	ICreateBillingResponse,
	IBillingResponse
} from "@/src/types/iBilling";
import axiosInstance from "../lib/axios";

export const createBilling = async (
	billingData: IBillingRequest
): Promise<ICreateBillingResponse> => {
	const { data } = await axiosInstance.post<ICreateBillingResponse>(
		"/api/billings",
		billingData
	);
	return data;
};

export const getAllBillings = async (): Promise<IBillingResponse[]> => {
	const { data } = await axiosInstance.get<IBillingResponse[]>("/api/billings");
	return data;
};

export const getBillingById = async (id: string): Promise<IBillingResponse> => {
	const { data } = await axiosInstance.get<IBillingResponse>(
		`/api/billings/${id}`
	);
	return data;
};

export const updateBilling = async (
	id: string,
	billingData: Partial<IBillingRequest>
): Promise<ICreateBillingResponse> => {
	const { data } = await axiosInstance.put<ICreateBillingResponse>(
		`/api/billings/${id}`,
		billingData
	);
	return data;
};

export const deleteBilling = async (
	id: string
): Promise<{ success: boolean; message: string }> => {
	const { data } = await axiosInstance.delete<{
		success: boolean;
		message: string;
	}>(`/api/billings/${id}`);
	return data;
};

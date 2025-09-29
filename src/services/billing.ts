import {
	IBillingRequest,
	ICreateBillingResponse,
	IBillingResponse,
	IGetAllBillingsResponse
} from "@/src/types/iBilling";
import axiosInstance from "../lib/axios";

export const createBilling = async (
	billingData: IBillingRequest
): Promise<ICreateBillingResponse> => {
	const { data } = await axiosInstance.post<ICreateBillingResponse>(
		"/billings",
		billingData
	);
	return data;
};

export const getAllBillings = async (): Promise<IGetAllBillingsResponse> => {
	const { data } = await axiosInstance.get<IGetAllBillingsResponse>("/billings");
	return data;
};

export const getBillingById = async (id: string): Promise<IBillingResponse> => {
	const { data } = await axiosInstance.get<IBillingResponse>(
		`/billings/${id}`
	);
	return data;
};

export const updateBilling = async (
	id: string,
	billingData: Partial<IBillingRequest>
): Promise<ICreateBillingResponse> => {
	const { data } = await axiosInstance.put<ICreateBillingResponse>(
		`/billings/${id}`,
		billingData
	);
	return data;
};

export const deleteBilling = async (
	id: string
): Promise<{ status: boolean; message: string }> => {
	const { data } = await axiosInstance.delete<{
		status: boolean;
		message: string;
	}>(`/billings/${id}`);
	return data;
};

export const calculateBillingAmounts = async (
	quantity: number,
	rate: number
): Promise<{ status: boolean; message: string; data: { quantity: number; rate: number; totalAmount: number } }> => {
	const { data } = await axiosInstance.post<{
		status: boolean;
		message: string;
		data: { quantity: number; rate: number; totalAmount: number };
	}>("/billings/calculate", { quantity, rate });
	return data;
};
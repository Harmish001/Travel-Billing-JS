import {
	IDutyCreateRequest,
	IDutyUpdateRequest,
	IDutyStatusUpdateRequest,
	IDutyResponse,
	IDutyListResponse,
	IDutySearchParams,
	IDutyGenerateBillingRequest,
	IDutyGenerateBillingResponse
} from "@/src/types/iDuty";
import axiosInstance from "../lib/axios";

const BASE_ENDPOINT = "/duties";

export const DutyService = {
	// Create a new duty
	create: async (data: IDutyCreateRequest): Promise<IDutyResponse> => {
		const response = await axiosInstance.post<IDutyResponse>(
			BASE_ENDPOINT,
			data
		);
		return response.data;
	},

	// Get all duties with search and pagination
	getAll: async (params?: IDutySearchParams): Promise<IDutyListResponse> => {
		const queryParams = new URLSearchParams();

		if (params?.search) {
			queryParams.append("search", params.search);
		}
		if (params?.page) {
			queryParams.append("page", params.page.toString());
		}
		if (params?.limit) {
			queryParams.append("limit", params.limit.toString());
		}
		if (params?.status) {
			queryParams.append("status", params.status);
		}
		if (params?.driverId) {
			queryParams.append("driverId", params.driverId);
		}
		if (params?.vehicleId) {
			queryParams.append("vehicleId", params.vehicleId);
		}
		if (params?.companyName) {
			queryParams.append("companyName", params.companyName);
		}
		if (params?.isBilled !== undefined) {
			queryParams.append("isBilled", params.isBilled.toString());
		}
		if (params?.startDate) {
			queryParams.append("startDate", params.startDate);
		}
		if (params?.endDate) {
			queryParams.append("endDate", params.endDate);
		}
		if (params?.sortBy) {
			queryParams.append("sortBy", params.sortBy);
		}
		if (params?.sortOrder) {
			queryParams.append("sortOrder", params.sortOrder);
		}

		const url = queryParams.toString()
			? `${BASE_ENDPOINT}?${queryParams.toString()}`
			: BASE_ENDPOINT;

		const response = await axiosInstance.get<IDutyListResponse>(url);
		return response.data;
	},

	// Get duties by date range
	getByDateRange: async (
		startDate: string,
		endDate: string,
		params?: Omit<IDutySearchParams, "startDate" | "endDate">
	): Promise<IDutyListResponse> => {
		const queryParams = new URLSearchParams();
		queryParams.append("startDate", startDate);
		queryParams.append("endDate", endDate);

		if (params?.search) {
			queryParams.append("search", params.search);
		}
		if (params?.page) {
			queryParams.append("page", params.page.toString());
		}
		if (params?.limit) {
			queryParams.append("limit", params.limit.toString());
		}

		const url = `${BASE_ENDPOINT}/range?${queryParams.toString()}`;
		const response = await axiosInstance.get<IDutyListResponse>(url);
		return response.data;
	},

	// Get duty by ID
	getById: async (id: string): Promise<IDutyResponse> => {
		const response = await axiosInstance.get<IDutyResponse>(
			`${BASE_ENDPOINT}/${id}`
		);
		return response.data;
	},

	// Update duty
	update: async (
		id: string,
		data: IDutyUpdateRequest
	): Promise<IDutyResponse> => {
		const response = await axiosInstance.put<IDutyResponse>(
			`${BASE_ENDPOINT}/${id}`,
			data
		);
		return response.data;
	},

	// Update duty status
	updateStatus: async (
		id: string,
		data: IDutyStatusUpdateRequest
	): Promise<IDutyResponse> => {
		const response = await axiosInstance.patch<IDutyResponse>(
			`${BASE_ENDPOINT}/${id}/status`,
			data
		);
		return response.data;
	},

	// Delete duty
	delete: async (id: string): Promise<IDutyResponse> => {
		const response = await axiosInstance.delete<IDutyResponse>(
			`${BASE_ENDPOINT}/${id}`
		);
		return response.data;
	},

	// Generate billing from duty
	generateBilling: async (
		data: IDutyGenerateBillingRequest
	): Promise<IDutyGenerateBillingResponse> => {
		const response = await axiosInstance.post<IDutyGenerateBillingResponse>(
			`${BASE_ENDPOINT}/billing/generate-from-duty`,
			data
		);
		return response.data;
	}
};
import {
	DriverCreateRequest,
	DriverUpdateRequest,
	DriverResponse,
	DriverListResponse,
	DriverSearchParams
} from "@/src/types/iDriver";
import axiosInstance from "../lib/axios";

const BASE_ENDPOINT = "/drivers";

export const DriverService = {
	// Create a new driver
	create: async (data: DriverCreateRequest): Promise<DriverResponse> => {
		const response = await axiosInstance.post<DriverResponse>(
			BASE_ENDPOINT,
			data
		);
		return response.data;
	},

	// Get all drivers with search and pagination
	getAll: async (
		params?: DriverSearchParams
	): Promise<DriverListResponse> => {
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

		const url = queryParams.toString()
			? `${BASE_ENDPOINT}?${queryParams.toString()}`
			: BASE_ENDPOINT;

		const response = await axiosInstance.get<DriverListResponse>(url);
		return response.data;
	},

	// Get driver by ID
	getById: async (id: string): Promise<DriverResponse> => {
		const response = await axiosInstance.get<DriverResponse>(
			`${BASE_ENDPOINT}/${id}`
		);
		return response.data;
	},

	// Update driver
	update: async (
		id: string,
		data: DriverUpdateRequest
	): Promise<DriverResponse> => {
		const response = await axiosInstance.put<DriverResponse>(
			`${BASE_ENDPOINT}/${id}`,
			data
		);
		return response.data;
	},

	// Delete driver
	delete: async (id: string): Promise<DriverResponse> => {
		const response = await axiosInstance.delete<DriverResponse>(
			`${BASE_ENDPOINT}/${id}`
		);
		return response.data;
	}
};
import {
	VehicleCreateRequest,
	VehicleUpdateRequest,
	VehicleResponse,
	VehicleListResponse,
	VehicleSearchParams,
	VehicleStatsResponse
} from "@/src/types/iVehicle";
import axiosInstance from "../lib/axios";

const BASE_ENDPOINT = "/vehicles";

export const VehicleService = {
	// Create a new vehicle
	create: async (data: VehicleCreateRequest): Promise<VehicleResponse> => {
		const response = await axiosInstance.post<VehicleResponse>(
			BASE_ENDPOINT,
			data
		);
		return response.data;
	},

	// Get all vehicles with search and pagination
	getAll: async (
		params?: VehicleSearchParams
	): Promise<VehicleListResponse> => {
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

		const response = await axiosInstance.get<VehicleListResponse>(url);
		return response.data;
	},

	// Get vehicle by ID
	getById: async (id: string): Promise<VehicleResponse> => {
		const response = await axiosInstance.get<VehicleResponse>(
			`${BASE_ENDPOINT}/${id}`
		);
		return response.data;
	},

	// Update vehicle
	update: async (
		id: string,
		data: VehicleUpdateRequest
	): Promise<VehicleResponse> => {
		const response = await axiosInstance.put<VehicleResponse>(
			`${BASE_ENDPOINT}/${id}`,
			data
		);
		return response.data;
	},

	// Delete vehicle
	delete: async (id: string): Promise<VehicleResponse> => {
		const response = await axiosInstance.delete<VehicleResponse>(
			`${BASE_ENDPOINT}/${id}`
		);
		return response.data;
	},

	// Get vehicle statistics
	getStats: async (): Promise<VehicleStatsResponse> => {
		const response = await axiosInstance.get<VehicleStatsResponse>(
			`${BASE_ENDPOINT}/stats`
		);
		return response.data;
	}
};

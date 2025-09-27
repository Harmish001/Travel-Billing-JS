import axiosInstance from "@/src/lib/axios";
import {
	Settings,
	CreateSettingsRequest,
	UpdateSettingsRequest,
	SettingsResponse
} from "@/src/types/iSettings";

export const SettingsService = {
	// Create new settings
	create: async (data: CreateSettingsRequest): Promise<SettingsResponse> => {
		const response = await axiosInstance.post<SettingsResponse>(
			"/settings",
			data
		);
		return response.data;
	},

	// Get settings for authenticated user
	get: async (): Promise<SettingsResponse> => {
		const response = await axiosInstance.get<SettingsResponse>("/settings");
		return response.data;
	},

	// Update existing settings
	update: async (data: UpdateSettingsRequest): Promise<SettingsResponse> => {
		const response = await axiosInstance.put<SettingsResponse>(
			"/settings",
			data
		);
		return response.data;
	},

	// Delete settings
	delete: async (): Promise<SettingsResponse> => {
		const response = await axiosInstance.delete<SettingsResponse>("/settings");
		return response.data;
	}
};

export const {
	create: createSettings,
	get: getSettings,
	update: updateSettings,
	delete: deleteSettings
} = SettingsService;

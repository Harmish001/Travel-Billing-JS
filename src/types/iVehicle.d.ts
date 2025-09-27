export interface Vehicle {
	_id: string;
	userId: string;
	vehicleNumber: string;
	createdAt: string;
	updatedAt: string;
	vehicleType: string
}

export interface VehicleCreateRequest {
	vehicleNumber: string;
}

export interface VehicleUpdateRequest {
	vehicleNumber: string;
}

export interface VehicleResponse {
	status: boolean;
	message: string;
	data: Vehicle | null;
}

export interface VehiclePagination {
	currentPage: number;
	totalPages: number;
	totalVehicles: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface VehicleListResponse {
	status: boolean;
	message: string;
	data: {
		vehicles: Vehicle[];
		pagination: VehiclePagination;
	} | null;
}

export interface VehicleSearchParams {
	search?: string;
	page?: number;
	limit?: number;
}

export interface VehicleStats {
	totalVehicles: number;
	recentVehicles: Vehicle[];
}

export interface VehicleStatsResponse {
	status: boolean;
	message: string;
	data: VehicleStats | null;
}

export interface VehicleErrorResponse {
	status: false;
	message: string;
	data: null;
}
export interface Driver {
	_id: string;
	userId: string;
	driverName: string;
	driverPhoneNumber: string;
	createdAt: string;
	updatedAt: string;
}

export interface DriverCreateRequest {
	driverName: string;
	driverPhoneNumber: string;
}

export interface DriverUpdateRequest {
	driverName: string;
	driverPhoneNumber: string;
}

export interface DriverResponse {
	status: boolean;
	message: string;
	data: Driver | null;
}

export interface DriverPagination {
	currentPage: number;
	totalPages: number;
	totalDrivers: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface DriverListResponse {
	status: boolean;
	message: string;
	data: {
		drivers: Driver[];
		pagination: DriverPagination;
	} | null;
}

export interface DriverSearchParams {
	search?: string;
	page?: number;
	limit?: number;
}

export interface DriverStats {
	totalDrivers: number;
	recentDrivers: Driver[];
}

export interface DriverStatsResponse {
	status: boolean;
	message: string;
	data: DriverStats | null;
}

export interface DriverErrorResponse {
	status: false;
	message: string;
	data: null;
}
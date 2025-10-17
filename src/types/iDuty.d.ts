export interface IDuty {
	_id: string;
	userId: string;
	driverId: {
		_id: string;
		driverName: string;
		driverPhoneNumber: string;
	};
	vehicleId: {
		_id: string;
		vehicleNumber: string;
		vehicleType: string;
	};
	companyName?: string;
	clientName?: string;
	clientPhoneNumber?: string;
	dutyType: string;
	startDate: string;
	endDate?: string;
	startTime?: string;
	endTime?: string;
	pickupLocation: string;
	dropLocation: string;
	distanceTraveled?: number;
	ratePerKm?: number;
	baseRate?: number;
	extraCharges?: number;
	expenses?: Array<{
		_id: string;
		expenseType: string;
		amount: number;
		date?: string;
	}>;
	totalExpenses?: number;
	calculatedAmount?: number;
	finalAmount?: number;
	status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
	billingId?: string;
	isBilled: boolean;
	createdAt: string;
	updatedAt: string;
	durationInDays?: number;
}

export interface IDutyCreateRequest {
	driverId: string;
	vehicleId: string;
	companyName?: string;
	clientName?: string;
	clientPhoneNumber?: string;
	dutyType: string;
	startDate: string;
	endDate?: string;
	startTime?: string;
	endTime?: string;
	pickupLocation: string;
	dropLocation: string;
	distanceTraveled?: number;
	ratePerKm?: number;
	baseRate?: number;
	extraCharges?: number;
}

export interface IDutyUpdateRequest {
	driverId?: string;
	vehicleId?: string;
	companyName?: string;
	clientName?: string;
	clientPhoneNumber?: string;
	dutyType?: string;
	startDate?: string;
	endDate?: string;
	startTime?: string;
	endTime?: string;
	pickupLocation?: string;
	dropLocation?: string;
	distanceTraveled?: number;
	ratePerKm?: number;
	baseRate?: number;
	extraCharges?: number;
	expenses?: Array<{
		expenseType: string;
		amount: number;
		date?: string;
	}>;
	status?: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
}

export interface IDutyStatusUpdateRequest {
	status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
}

export interface IDutyResponse {
	status: boolean;
	message: string;
	data: IDuty | null;
}

export interface IDutyPagination {
	currentPage: number;
	totalPages: number;
	totalDuties: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface IDutyListResponse {
	status: boolean;
	message: string;
	data: {
		duties: IDuty[];
		pagination: IDutyPagination;
	} | null;
}

export interface IDutySearchParams {
	page?: number;
	limit?: number;
	status?: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
	driverId?: string;
	vehicleId?: string;
	companyName?: string;
	isBilled?: boolean;
	startDate?: string;
	endDate?: string;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface IDutyGenerateBillingRequest {
	dutyIds: string[]; // Exactly one ID
	companyName: string;
	recipientName: string;
	recipientAddress: string;
	workingTime: string;
	period: string;
	projectLocation: string;
	placeOfSupply: string;
	gstEnabled?: boolean;
	bankDetails: {
		bankName: string;
		branch: string;
		accountNumber: string;
		ifscCode: string;
	};
}

export interface IDutyGenerateBillingResponse {
	status: boolean;
	message: string;
	data: {
		billing: any; // IBillingResponse type would be imported
		dutyUpdated: boolean;
		totalAmount: number;
		gstAmount: number;
		finalAmount: number;
	};
}

export interface IDutyErrorResponse {
	status: false;
	message: string;
	data: null;
}
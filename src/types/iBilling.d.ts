export interface IBillingItem {
	description: string;
	hsnSac: string;
	unit: string;
	quantity: number;
	rate: number;
	totalAmount?: number;
}

export interface IBankDetails {
	bankName: string;
	branch: string;
	accountNumber: string;
	ifscCode: string;
}

export interface IBillingRequest {
	companyName: string;
	vehicleIds: string[];
	billingDate?: Date;
	recipientName: string;
	recipientAddress: string;
	workingTime: string;
	period: string;
	projectLocation: string;
	placeOfSupply: string;
	billingItems: IBillingItem[];
	bankDetails: IBankDetails;
}

export interface IBillingResponse {
	_id: string;
	userId: string;
	companyName: string;
	vehicleIds: Array<{
		_id: string;
		vehicleNumber: string;
		vehicleType: string;
	}>;
	billingDate: Date;
	recipientName: string;
	recipientAddress: string;
	workingTime: string;
	period: string;
	projectLocation: string;
	placeOfSupply: string;
	billingItems: IBillingItem[];
	totalInvoiceValue: number;
	bankDetails: IBankDetails;
	isCompleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IBillingPagination {
	currentPage: number;
	totalPages: number;
	totalBills: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface IGetAllBillingsResponse {
	status: boolean;
	message: string;
	data: {
		bills: IBillingResponse[];
		pagination: IBillingPagination;
	};
}

export interface ICreateBillingResponse {
	status: boolean;
	message: string;
	data: IBillingResponse;
}

// Add the new analytics interface
export interface IBillingAnalyticsResponse {
	status: boolean;
	message: string;
	data: {
		totalBills: number;
		revenueThisMonth: number;
		totalVehicles: number;
		totalRevenue: number;
	};
}

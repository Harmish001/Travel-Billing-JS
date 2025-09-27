export interface IBillingRequest {
	companyName: string;
	vehicleIds: string[]; // Changed from single vehicleId to array of vehicleIds
	billingDate?: Date;
	recipientName: string;
	recipientAddress: string;
	workingTime: string;
	hsnCode?: string;
	quantity?: number;
	rate: number;
}

export interface IBillingResponse {
	id: string;
	companyName: string;
	vehicleId: string;
	billingDate: Date;
	recipientName: string;
	recipientAddress: string;
	workingTime: string;
	hsnCode: string;
	quantity: number;
	rate: number;
	subtotal: number;
	taxAmount: number;
	totalAmount: number;
	invoiceNumber: string;
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
	success: boolean;
	message: string;
	data: IBillingResponse;
}
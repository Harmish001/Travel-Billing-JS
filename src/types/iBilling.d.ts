export interface IBillingRequest {
	companyName: string;
	vehicleId: string;
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

export interface ICreateBillingResponse {
	success: boolean;
	message: string;
	data: IBillingResponse;
}
export interface BankDetails {
	bankName: string;
	ifscCode: string;
	accountNumber: string;
	branchName: string;
}

export interface Settings {
	_id?: string;
	userId?: string;
	companyName: string;
	gstNumber: string;
	panNumber: string;
	proprietorName: string;
	bankDetails: BankDetails;
	contactNumber: string;
	companyAddress: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateSettingsRequest {
	companyName: string;
	gstNumber: string;
	panNumber: string;
	proprietorName: string;
	bankDetails: {
		bankName: string;
		ifscCode: string;
		accountNumber: string;
		branchName: string;
	};
	contactNumber: string;
	companyAddress: string;
}

export interface UpdateSettingsRequest {
	companyName?: string;
	gstNumber?: string;
	panNumber?: string;
	proprietorName?: string;
	bankDetails?: {
		bankName?: string;
		ifscCode?: string;
		accountNumber?: string;
		branchName?: string;
	};
	contactNumber?: string;
	companyAddress?: string;
}

export interface SettingsResponse {
	status: boolean;
	message: string;
	data: Settings | null;
}

export interface SettingsFormData {
	companyName: string;
	gstNumber: string;
	panNumber: string;
	proprietorName: string;
	bankName: string;
	ifscCode: string;
	accountNumber: string;
	branchName: string;
	contactNumber: string;
	companyAddress: string;
}
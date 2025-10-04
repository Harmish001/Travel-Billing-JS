import axios from "axios";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Create axios instance with base configuration
const axiosInstance = axios.create({
	baseURL: `${API_BASE_URL}/api`,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json"
	}
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Handle unauthorized access
			localStorage.removeItem("token");
			window.location.href = "/landingpage";
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;

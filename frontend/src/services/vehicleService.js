import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create new vehicle entry
export const createVehicleEntry = async (vehicleData) => {
    try {
        const response = await axios.post(`${API_URL}/vehicles`, vehicleData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to create vehicle entry' };
    }
};

// Get vehicle details by ID
export const getVehicleDetails = async (vehicleId) => {
    try {
        const response = await axios.get(`${API_URL}/vehicles/${vehicleId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to fetch vehicle details' };
    }
};

// Update vehicle details
export const updateVehicleDetails = async (vehicleId, vehicleData) => {
    try {
        const response = await axios.put(`${API_URL}/vehicles/${vehicleId}`, vehicleData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to update vehicle details' };
    }
};

// Update vehicle exit and calculate payment
export const updateVehicleExit = async (vehicleId) => {
    try {
        const response = await axios.put(`${API_URL}/vehicles/${vehicleId}/exit`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to update vehicle exit' };
    }
};

// Get all active vehicles in parking
export const getActiveVehicles = async () => {
    try {
        const response = await axios.get(`${API_URL}/vehicles/active`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to fetch active vehicles' };
    }
};

// Get vehicle history
export const getVehicleHistory = async (vehicleId) => {
    try {
        const response = await axios.get(`${API_URL}/vehicles/${vehicleId}/history`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to fetch vehicle history' };
    }
};

// Process payment for vehicle
export const processPayment = async (vehicleId, paymentData) => {
    try {
        const response = await axios.post(`${API_URL}/vehicles/${vehicleId}/payment`, paymentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to process payment' };
    }
};

// Generate QR code for vehicle
export const generateVehicleQR = async (vehicleId) => {
    try {
        const response = await axios.get(`${API_URL}/vehicles/${vehicleId}/qr`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to generate QR code' };
    }
}; 
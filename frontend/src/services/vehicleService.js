const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Create a new vehicle entry
 * @param {Object} vehicleData - The vehicle data to create
 * @returns {Promise} Promise object with created vehicle
 */
export const createVehicle = async (vehicleData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vehicleData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create vehicle entry');
        }
        
        return response.json();
    } catch (error) {
        console.error('Error creating vehicle:', error);
        throw error;
    }
};

/**
 * Get vehicle details by ID
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise} Promise object with vehicle details
 */
export const getVehicleDetails = async (vehicleId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch vehicle details');
        }
        
        return response.json();
    } catch (error) {
        console.error(`Error fetching vehicle ${vehicleId}:`, error);
        throw error;
    }
};

/**
 * Update vehicle details
 * @param {string} vehicleId - The vehicle ID
 * @param {Object} vehicleData - The updated vehicle data
 * @returns {Promise} Promise object with updated vehicle
 */
export const updateVehicleDetails = async (vehicleId, vehicleData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vehicleData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update vehicle details');
        }
        
        return response.json();
    } catch (error) {
        console.error(`Error updating vehicle ${vehicleId}:`, error);
        throw error;
    }
};

/**
 * Delete vehicle entry
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise} Promise object with success message
 */
export const deleteVehicle = async (vehicleId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete vehicle entry');
        }
        
        return response.json();
    } catch (error) {
        console.error(`Error deleting vehicle ${vehicleId}:`, error);
        throw error;
    }
};

/**
 * Update vehicle exit and calculate payment
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise} Promise object with exit details
 */
export const updateVehicleExit = async (vehicleId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/exit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update vehicle exit');
        }
        
        return response.json();
    } catch (error) {
        console.error(`Error updating vehicle exit ${vehicleId}:`, error);
        throw error;
    }
};

/**
 * Get all active vehicles in parking
 * @returns {Promise} Promise object with active vehicles
 */
export const getActiveVehicles = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/active`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch active vehicles');
        }
        
        return response.json();
    } catch (error) {
        console.error('Error fetching active vehicles:', error);
        throw error;
    }
};

/**
 * Get vehicle history
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise} Promise object with vehicle history
 */
export const getVehicleHistory = async (vehicleId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/history`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch vehicle history');
        }
        
        return response.json();
    } catch (error) {
        console.error(`Error fetching vehicle history ${vehicleId}:`, error);
        throw error;
    }
};

// Process payment for vehicle
export const processPayment = async (vehicleId, paymentData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to process payment');
        }
        
        return response.json();
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
};

// Generate QR code for vehicle
export const generateVehicleQR = async (vehicleId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/qr`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate QR code');
        }
        
        return response.json();
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

export const checkActiveVehicle = async (numberPlate) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/active/${numberPlate}`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data && data.isActive; // Adjust based on your backend response
  } catch {
    return false;
  }
}; 
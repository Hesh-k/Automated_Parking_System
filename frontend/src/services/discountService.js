// src/services/discountService.js

/**
 * Service for handling discount API operations
*/
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get all discounts
 * @returns {Promise} Promise object with discounts data
 */
export const getAllDiscounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/discounts`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch discounts');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching discounts:', error);
    throw error;
  }
};

/**
 * Get a specific discount by ID
 * @param {string|number} id - The discount ID
 * @returns {Promise} Promise object with discount data
 */
export const getDiscountById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/discounts/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch discount');
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching discount ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new discount
 * @param {Object} discountData - The discount data to create
 * @returns {Promise} Promise object with created discount
 */
export const createDiscount = async (discountData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/discounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discountData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create discount');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating discount:', error);
    throw error;
  }
};

/**
 * Update an existing discount
 * @param {string|number} id - The discount ID to update
 * @param {Object} discountData - The updated discount data
 * @returns {Promise} Promise object with updated discount
 */
export const updateDiscount = async (id, discountData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/discounts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discountData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update discount');
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error updating discount ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a discount
 * @param {string|number} id - The discount ID to delete
 * @returns {Promise} Promise object with success message
 */
export const deleteDiscount = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/discounts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete discount');
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error deleting discount ${id}:`, error);
    throw error;
  }
};
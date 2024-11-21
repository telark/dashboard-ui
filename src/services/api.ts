// src/services/api.js
import axios from 'axios';

// The URL of your Go API
const API_URL = 'http://localhost:56085/api/v1/scopes/groupers/fetch'; 

// Function to fetch groupers data from the Go API
export const fetchGroupersData = async () => {
  try {
    const response = await axios.get(API_URL);  // Sending GET request to your API
    if (response.data && response.data.items) {
      return response.data.items.items;  // Return the items from the response data
    } else {
      console.error('Invalid data structure received from API.');
      return [];  // Return an empty array if data structure is invalid
    }
  } catch (error) {
    console.error('Error fetching groupers data:', error);  // Handle errors
    return [];  // Return empty array in case of error
  }
};

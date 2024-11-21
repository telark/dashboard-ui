// src/services/api.js
import axios from 'axios';


export const fetchGroupersData = async () => {
  const response = await fetch('http://localhost:63968/api/v1/scopes/groupers/fetch');
  if (!response.ok) {
    throw new Error('Failed to fetch groupers');
  }
  return response.json();
};

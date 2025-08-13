// src/api/productsApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL ;

console.log(`API_BASE: ${API_BASE}`);


export const fetchProducts = (params) => axios.get(`${API_BASE}/products`, { params });
export const importCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_BASE}/products/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const exportCSV = () => axios.get(`${API_BASE}/products/export`, { responseType: 'blob' });
export const updateProduct = (id, data) => axios.put(`${API_BASE}/products/${id}`, data);
export const getProductHistory = (id) => axios.get(`${API_BASE}/products/${id}/history`);

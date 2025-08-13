// src/api/productsApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const fetchProducts = (params) => axios.get(`${API_BASE}/products`, { params });
export const fetchCategories = () => axios.get(`${API_BASE}/products/categories`);
export const createProduct = (data) => axios.post(`${API_BASE}/products`, data);
export const deleteProduct = (id) => axios.delete(`${API_BASE}/products/${id}`);
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

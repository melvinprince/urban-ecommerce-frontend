import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor: Standardize responses
adminApi.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (!res.success) {
      const error = new Error(res.message || "Unknown API error");
      error.response = res;
      throw error;
    }
    return res;
  },
  (error) => {
    const customError = new Error(
      error.response?.data?.message || error.message || "Server Error"
    );
    customError.response = error.response?.data;
    return Promise.reject(customError);
  }
);

const adminApiService = {
  products: {
    getAll: () => adminApi.get("/api/admin/products"),
    getById: (id) => adminApi.get(`/api/admin/products/${id}`),
    create: (formData) =>
      adminApi.post("/api/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      adminApi.put(`/api/admin/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => adminApi.delete(`/api/admin/products/${id}`),
    getReviews: (productId) =>
      adminApi.get(`/api/admin/products/${productId}/reviews`),
    deleteReview: (reviewId) =>
      adminApi.delete(`/api/admin/products/reviews/${reviewId}`),
  },

  categories: {
    getAll: () => adminApi.get("/api/admin/categories"),
    getById: (id) => adminApi.get(`/api/admin/categories/${id}`),
    create: (formData) =>
      adminApi.post("/api/admin/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      adminApi.put(`/api/admin/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => adminApi.delete(`/api/admin/categories/${id}`),
  },

  orders: {
    getAll: () => adminApi.get("/api/admin/orders"),
    getById: (id) => adminApi.get(`/api/admin/orders/${id}`),
    update: (id, data) => adminApi.patch(`/api/admin/orders/${id}`, data),
    updatePayment: (id, data) =>
      adminApi.patch(`/api/admin/orders/${id}/payment`, data),
    cancel: (id) => adminApi.patch(`/api/admin/orders/${id}/cancel`),
    delete: (id) => adminApi.delete(`/api/admin/orders/${id}`),
  },

  coupons: {
    getAll: () => adminApi.get("/api/admin/coupons"),
    getById: (id) => adminApi.get(`/api/admin/coupons/${id}`),
    create: (data) => adminApi.post("/api/admin/coupons", data),
    update: (id, data) => adminApi.put(`/api/admin/coupons/${id}`, data),
    delete: (id) => adminApi.delete(`/api/admin/coupons/${id}`),
  },

  tickets: {
    getAll: () => adminApi.get("/api/admin/tickets"),
    getById: (id) => adminApi.get(`/api/admin/tickets/${id}`),
    reply: (id, formData) =>
      adminApi.post(`/api/admin/tickets/${id}/reply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    updateStatus: (id, data) =>
      adminApi.patch(`/api/admin/tickets/${id}/status`, data),
    deleteMessage: (id, messageIndex) =>
      adminApi.delete(`/api/admin/tickets/${id}/message/${messageIndex}`),
  },

  users: {
    getAll: () => adminApi.get("/api/admin/users"),
    getById: (id) => adminApi.get(`/api/admin/users/${id}`),
    create: (data) => adminApi.post("/api/admin/users", data),
    update: (id, data) => adminApi.put(`/api/admin/users/${id}`, data),
    toggleBan: (id) => adminApi.patch(`/api/admin/users/${id}/ban`),
    delete: (id) => adminApi.delete(`/api/admin/users/${id}`),
  },
};

export default adminApiService;

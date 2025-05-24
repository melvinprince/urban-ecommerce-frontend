import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor: Standardize responses
api.interceptors.response.use(
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

// 🧩 Grouped API Service
const apiService = {
  auth: {
    register: (data) => api.post("/api/auth/register", data),
    login: (data) => api.post("/api/auth/login", data),
  },

  products: {
    getAll: (params) => api.get("/api/products", { params }),
    getBySlug: (slug) => api.get(`/api/products/${slug}`),
    search: (filters) => api.get("/api/products/search", { params: filters }),
    getByIds: (ids) =>
      api.post("/api/products/by-ids", { ids }).then((res) => res.data),
  },

  categories: {
    getAll: () => api.get("/api/categories"),
  },

  cart: {
    get: () => api.get("/api/cart"),
    addOrUpdate: (item) => api.post("/api/cart", item),
    remove: (id) => api.delete(`/api/cart/${id}`),
    update: (id, item) => api.put(`/api/cart/${id}`, item),
    clear: () => api.delete("/api/cart/clear"),
  },

  wishlist: {
    get: () => api.get("/api/wishlist"),
    add: (product) => api.post("/api/wishlist", product),
    remove: (id) => api.delete(`/api/wishlist/${id}`),
    clear: () => api.post("/api/wishlist/clear"),
  },

  orders: {
    place: (data) => api.post("/api/orders", data),
    getMine: () => api.get("/api/orders/my-orders").then((res) => res.data),
    getById: (id) => api.get(`/api/orders/${id}`).then((res) => res.data),
    getByCustomId: (id) =>
      api.get(`/api/orders/by-custom/${id}`).then((res) => res.data),
    getByEmail: (email) =>
      api.get(`/api/orders/email/${email}`).then((res) => res.data),
    cancel: (id) =>
      api.patch(`/api/orders/${id}/cancel`).then((res) => res.data),
    cancelAsGuest: ({ customOrderId, email }) =>
      api
        .patch("/api/orders/cancel-guest", { customOrderId, email })
        .then((res) => res.data),
    edit: (customOrderId, data) =>
      api.patch(`/api/orders/edit/${customOrderId}`, data),
  },

  paypal: {
    createOrder: (totalAmount) =>
      api.post("/api/paypal/create", { totalAmount }),
    captureOrder: (orderId) => api.post(`/api/paypal/capture/${orderId}`),
  },

  addresses: {
    get: () => api.get("/api/user/addresses"),
    add: (data) => api.post("/api/user/addresses", data),
    update: (index, data) =>
      api.put(`/api/user/addresses/${index}`, { address: data }),
    delete: (index) => api.delete(`/api/user/addresses/${index}`),
  },

  tickets: {
    create: (formData) =>
      api.post("/api/tickets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    getMine: () => api.get("/api/tickets/my-tickets").then((res) => res.data),
    getById: (id) => api.get(`/api/tickets/${id}`).then((res) => res.data),
    reply: (id, formData) =>
      api.patch(`/api/tickets/${id}/reply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  },

  reviews: {
    getForProduct: (productId) =>
      api.get(`/api/reviews/${productId}`).then((res) => res.data),
    submit: (data) => api.post("/api/reviews", data).then((res) => res.data),
  },

  coupons: {
    apply: (code, subtotal, email) =>
      api.post("/api/coupons/apply", { code, subtotal, email }),
  },
};

export default apiService;

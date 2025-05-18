import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
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

// --- API Functions ---

// Auth
export const registerUser = (credentials) =>
  api.post("/api/auth/register", credentials);
export const loginUser = (credentials) =>
  api.post("/api/auth/login", credentials);

// Products
export const getProducts = (params = {}) =>
  api.get("/api/products", { params });
export const getProductBySlug = (slug) => api.get(`/api/products/${slug}`);

// Categories
export const getCategories = () => api.get("/api/categories");

// Cart (Protected)
export const getCart = () => api.get("/api/cart");
export const addOrUpdateCartItem = (item) => api.post("/api/cart", item);
export const removeCartItem = (itemId) => api.delete(`/api/cart/${itemId}`);
export const updateCartItem = (itemId, item) =>
  api.put(`/api/cart/${itemId}`, item);
export const clearCartServerSide = () => api.delete("/api/cart/clear");

// Wishlist (Protected)
export const getWishlist = () => api.get("/api/wishlist");
export const addToWishlist = (product) => api.post("/api/wishlist", product);
export const removeFromWishlist = (itemId) =>
  api.delete(`/api/wishlist/${itemId}`);
export const clearWishlist = () => api.post("/api/wishlist/clear");

// Orders
export const placeOrder = (payload) => api.post("/api/orders", payload);
export const createPaypalOrder = (totalAmount) =>
  api.post("/api/paypal/create", { totalAmount }); // totalAmount is number or string, fine.
export const capturePaypalOrder = async (orderId) =>
  api.post(`/api/paypal/capture/${orderId}`);

//Fetch all orders
export const getMyOrders = async () => {
  const res = await api.get("/api/orders/my-orders");
  return res.data;
};
export const getOrderById = async (id) => {
  const res = await api.get(`/api/orders/${id}`);
  return res.data;
};
export const getOrderByCustomId = async (customId) => {
  const res = await api.get(`/api/orders/by-custom/${customId}`);
  return res.data;
};

export default api;

import { create } from "zustand";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

// Set the base API URL
const API_URL = "http://localhost:5000/api/v1/users";

// Axios configuration
axios.defaults.withCredentials = true;

export const userStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  dashboardData: null,
  workouts: [],
  progress: null,

  // Register a user
  registerUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error registering user", isLoading: false });
    }
  },

  // Login a user
  loginUser: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      if (error.response?.data?.message === 'Refresh token is expired or used') {
        const navigate = useNavigate();
        navigate('/login');
      }
      set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
    }
  },

  // Logout a user
  logoutUser: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
    }
  },

  // Refresh access token
  refreshAccessToken: async () => {
    try {
      const response = await axios.post(`${API_URL}/refresh-token`);
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      set({ error: "Error refreshing access token" });
    }
  },

  // Get current user details
  getCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/current-user`);
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: "Error fetching current user", isLoading: false });
    }
  },

  // Fetch dashboard data
  getUserDashboard: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/dashboard`);
      set({ dashboardData: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Error fetching dashboard data", isLoading: false });
    }
  },

  // Get workouts by date
  getWorkoutsByDate: async (date) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/workout`, {
        params: { date },
      });
      set({ workouts: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Error fetching workouts by date", isLoading: false });
    }
  },

  // Add a new workout
  addWorkout: async (workoutString) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/workout`, { workoutString });
      set((state) => ({ workouts: [...state.workouts, response.data], isLoading: false }));
    } catch (error) {
      set({ error: "Error adding workout", isLoading: false });
    }
  },

  // Calculate progress
  calculateProgress: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/progress/${userId}`);
      set({ progress: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Error calculating progress", isLoading: false });
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  // Reset password function
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },


}));

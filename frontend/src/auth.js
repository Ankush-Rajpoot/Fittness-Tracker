import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/users"; // Base URL for user routes

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials, {
    withCredentials: true, // Allows cookies to be set for session tokens
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await axios.post(
    `${API_URL}/refresh-token`,
    {},
    { withCredentials: true } // Includes refreshToken in cookies
  );
  return response.data;
};

// Get Current User
export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/current-user`, {
    withCredentials: true,
  });
  return response.data;
};



// Get Dashboard Data
export const getUserDashboard = async () => {
  const response = await axios.get(`${API_URL}/dashboard`, {
    withCredentials: true,
  });
  return response.data;
};

// Get Workouts by Date
export const getWorkoutsByDate = async (date) => {
  const response = await axios.get(`${API_URL}/workout`, {
    params: { date },
    withCredentials: true,
  });
  return response.data;
};

// Add Workout
export const addWorkout = async (workoutString) => {
  const response = await axios.post(
    `${API_URL}/workout`,
    { workoutString },
    { withCredentials: true }
  );
  return response.data;
};

// Calculate Progress
export const calculateProgress = async (userId) => {
  const response = await axios.get(`${API_URL}/progress/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};


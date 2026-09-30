import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";

const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    userData,
    {
      withCredentials: true,
    },
  );

  return response.data;
};

const loginUser = async (credentials) => {
  const response = await axios.post(
    `${API_URL}/login`,
    credentials,
    {
      withCredentials: true,
    },
  );

  return response.data;
};

const refreshAccessToken = async () => {
  const response = await axios.post(
    `${API_URL}/refresh`,
    {},
    {
      withCredentials: true,
    },
  );

  return response.data;
};

const getCurrentUser = async (accessToken) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  return response.data;
};

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
};
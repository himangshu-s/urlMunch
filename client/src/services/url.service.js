import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/urls`;

const createShortUrl = async (urlData, accessToken) => {
  const response = await axios.post(API_URL, urlData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  return response.data;
};

const getMyUrls = async (accessToken) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  return response.data;
};

const deleteUrl = async (urlId, accessToken) => {
  const response = await axios.delete(`${API_URL}/${urlId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  return response.data;
};

const updateUrl = async (urlId, updates, accessToken) => {
  const response = await axios.patch(`${API_URL}/${urlId}`, updates, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  return response.data;
};

export { createShortUrl, getMyUrls, deleteUrl, updateUrl };

import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/urls`;

const getUrlAnalytics = async (urlId, accessToken) => {
  const response = await axios.get(`${API_URL}/${urlId}/analytics`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  return response.data;
};

export { getUrlAnalytics };

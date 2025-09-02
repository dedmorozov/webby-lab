import { getAuthToken } from "./config";

import axios, { type CreateAxiosDefaults } from "axios";

const options: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

const axiosPublic = axios.create(options);
const axiosPrivate = axios.create(options);

axiosPublic.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (config.headers && token) {
    config.headers.Authorization = token;
  }

  return config;
});

axiosPrivate.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (config.headers && token) {
    config.headers.Authorization = token;
  }

  return config;
});

export { axiosPublic, axiosPrivate };

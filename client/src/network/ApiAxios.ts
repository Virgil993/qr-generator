import axios, { AxiosError, AxiosResponse } from "axios";

const instance = axios.create({ baseURL: import.meta.env.VITE_SERVER_API_URL });

instance.interceptors.request.use(async (config) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/auth/login";
    }
    return error;
  }
);

export const getAllCodes = async () => await instance.get("/codes");

export const createCode = async (title: string, url: string) =>
  await instance.post("/codes", { title, url });

export const getCode = async (id: string) => await instance.get(`/codes/${id}`);

export const updateCode = async (id: string, title: string, url: string) =>
  await instance.put(`/codes/${id}`, { title, url });

export const deleteCode = async (id: string) =>
  await instance.delete(`/codes/${id}`);

import axios, { AxiosError, AxiosResponse } from "axios";
import { User } from "../models/user";

const instance = axios.create({ baseURL: import.meta.env.VITE_SERVER_API_URL });

instance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("apiToken");
  config.headers.Authorization = token ? `${token}` : "";
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

export const checkToken = async () => await instance.get("/auth/check-token");

export const register = async (user: User) =>
  await instance.post("/auth/register", user);

export const login = async (email: string, password: string) =>
  await instance.post("/auth/login", { email, password });

export const logout = async () => await instance.post("/auth/logout");

export const getAllCodes = async () => await instance.get("/codes");

export const createCode = async (title: string, codeText: string) =>
  await instance.post("/codes", { title, codeText });

export const getCode = async (id: string) => await instance.get(`/codes/${id}`);

export const updateCode = async (id: string, title: string, codeText: string) =>
  await instance.put(`/codes/${id}`, { title, codeText });

export const deleteCode = async (id: string) =>
  await instance.delete(`/codes/${id}`);

export const getTrackingData = async (codeId: string) =>
  await instance.get(`/track/data/${codeId}`);

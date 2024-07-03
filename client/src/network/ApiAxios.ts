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
      if (window.location.pathname !== "/auth/login")
        window.location.replace("/auth/login");
    }
    return error;
  }
);

export const checkToken = async () => await instance.get("/auth/check-token");

export const register = async (user: User) =>
  await instance.post("/auth/register", user);

//  TODO 8: Implement the login function to make a POST request to /auth/login
export const login = async (email: string, password: string) => {};

export const logout = async () => await instance.post("/auth/logout");

export const getAllCodes = async () => await instance.get("/codes");

// TODO 9: Implement the createCode function to make a POST request to /codes
export const createCode = async (title: string, url: string) => {};

// TODO 10: Implement the getCode function to make a GET request to /codes/:id
export const getCode = async (id: string) => {};

// TODO 11: Implement the updateCode function to make a PUT request to /codes/:id
export const updateCode = async (id: string, title: string, url: string) => {};

// TODO 12: Implement the deleteCode function to make a DELETE request to /codes/:id
export const deleteCode = async (id: string) => {};

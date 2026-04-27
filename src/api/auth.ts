import { api } from "./client";
import type { ApiUser } from "@/types";

export const userApi = {
    list: () => api.get<ApiUser[]>("/users"),
    get: (id: number) => api.get<ApiUser>(`/users/${id}`),
}

export interface LoginPayload {
  username: string
  password: string
}

export const authApi = {
  login: (payload: LoginPayload) => api.post<{ token: string }>('/auth/login', payload),
}
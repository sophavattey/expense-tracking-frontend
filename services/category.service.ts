import { apiFetch } from "./api-client";
import type { Category, CategoryRequest } from "../types/category.types";

export const categoryService = {
  getAll: () =>
    apiFetch<Category[]>("/api/categories"),

  create: (data: CategoryRequest) =>
    apiFetch<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: CategoryRequest) =>
    apiFetch<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" }),
};
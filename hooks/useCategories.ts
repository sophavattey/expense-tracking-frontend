"use client";

import { useState, useEffect, useCallback } from "react";
import { categoryService } from "../services/category.service";
import type { Category, CategoryRequest } from "../types/category.types";

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCategory: (data: CategoryRequest) => Promise<Category>;
  updateCategory: (id: number, data: CategoryRequest) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (e: any) {
      setError(e.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const createCategory = useCallback(async (data: CategoryRequest) => {
    const created = await categoryService.create(data);
    setCategories(prev => [...prev, created]);
    return created;
  }, []);

  const updateCategory = useCallback(async (id: number, data: CategoryRequest) => {
    const updated = await categoryService.update(id, data);
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    await categoryService.delete(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
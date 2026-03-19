"use client";

import { useState, useEffect, useCallback } from "react";
import { categoryService } from "../services/category.service";
import { cache } from "@/lib/cache";
import type { Category, CategoryRequest } from "../types/category.types";

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCategory: (data: CategoryRequest) => Promise<Category>;
  updateCategory: (id: string, data: CategoryRequest) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
}

const CACHE_KEY = "categories";
const TTL       = 120_000; // 2 min — categories rarely change

export function useCategories(): UseCategoriesReturn {
  const cached = cache.get<Category[]>(CACHE_KEY);
  const [categories, setCategories] = useState<Category[]>(cached ?? []);
  const [loading,    setLoading]    = useState(!cached);
  const [error,      setError]      = useState<string | null>(null);

  const fetchCategories = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      cache.set(CACHE_KEY, data, TTL);
      setCategories(data);
    } catch (e: any) {
      if (!silent) setError(e.message || "Failed to load categories");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(!!cached); }, []);

  const refetch = useCallback(async () => {
    cache.invalidate(CACHE_KEY);
    await fetchCategories(false);
  }, [fetchCategories]);

  const createCategory = useCallback(async (data: CategoryRequest) => {
    const created = await categoryService.create(data);
    cache.invalidate(CACHE_KEY);
    setCategories(prev => [...prev, created]);
    return created;
  }, []);

  const updateCategory = useCallback(async (id: string, data: CategoryRequest) => {
    const updated = await categoryService.update(id, data);
    cache.invalidate(CACHE_KEY);
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await categoryService.delete(id);
    cache.invalidate(CACHE_KEY);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return { categories, loading, error, refetch, createCategory, updateCategory, deleteCategory };
}
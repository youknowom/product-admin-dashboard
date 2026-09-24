"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { productService } from "@/services/product.service";
import {
  applyLocalMutations,
  getLocalCreatedProducts,
  markProductDeleted,
} from "@/lib/productStorage";

export function useProducts({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  sortBy = "",
  order = "asc",
}) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store active AbortController to cancel previous requests
  const abortControllerRef = useRef(null);

  const fetchProducts = useCallback(() => {
    // 1. Cancel previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 2. Create new controller for current request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const safePage = Math.max(1, Number.isInteger(Number(page)) ? Number(page) : 1);
    const safeLimit = [10, 20, 50].includes(Number(limit)) ? Number(limit) : 10;
    const skip = (safePage - 1) * safeLimit;

    Promise.resolve().then(async () => {
      if (controller.signal.aborted) return;
      setLoading(true);
      setError(null);

      try {
        const data = await productService.getAll({
          limit: safeLimit,
          skip,
          search,
          category,
          sortBy,
          order,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          let list = data.products || [];

          // Merge local mutations (edited products & remove deleted products)
          list = applyLocalMutations(list);

          // If on page 1 and no search/category filter, prepend newly created products
          if (safePage === 1 && !search && (!category || category === "all")) {
            const created = getLocalCreatedProducts();
            const existingIds = new Set(list.map((p) => p.id));
            const newToAdd = created.filter((p) => !existingIds.has(p.id));
            list = [...newToAdd, ...list];
          }

          setProducts(list);
          setTotal(data.total || 0);
        }
      } catch (err) {
        if (axios.isCancel(err) || err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          return;
        }
        if (!controller.signal.aborted) {
          setError(
            err.response?.data?.message || "Failed to load products. Please check your connection."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    });
  }, [page, limit, search, category, sortBy, order]);

  useEffect(() => {
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const deleteProductLocally = useCallback((id) => {
    markProductDeleted(id);
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    setTotal((prev) => Math.max(0, prev - 1));
  }, []);

  return {
    products,
    setProducts,
    total,
    loading,
    error,
    refetch: fetchProducts,
    deleteProductLocally,
  };
}

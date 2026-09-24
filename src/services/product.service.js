import api from "@/lib/axios";

export const productService = {
  /**
   * Fetch products with pagination, search, category filter, and sorting.
   * Accepts an AbortSignal to cancel stale requests.
   */
  getAll: async ({
    limit = 10,
    skip = 0,
    search = "",
    category = "",
    sortBy = "",
    order = "asc",
    signal,
  } = {}) => {
    let endpoint = "/products";
    const params = { limit, skip };

    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || "asc";
    }

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      // 1. Search endpoint takes precedence
      endpoint = "/products/search";
      params.q = trimmedSearch;
    } else if (category && category !== "all") {
      // 2. Category filter endpoint
      endpoint = `/products/category/${encodeURIComponent(category)}`;
    }

    const response = await api.get(endpoint, {
      params,
      signal, // Passed to Axios to cancel stale requests!
    });

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/products/add", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

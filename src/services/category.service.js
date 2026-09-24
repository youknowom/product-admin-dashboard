import api from "@/lib/axios";

export const categoryService = {
  getAll: async () => {
    const response = await api.get("/products/categories");
    const data = response.data;

    // Normalize: Handle both array of strings ["beauty", ...] and array of objects [{slug, name}, ...]
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === "string") {
          return {
            slug: item,
            name: item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " "),
          };
        }
        return {
          slug: item.slug || item,
          name: item.name || item.slug || item,
        };
      });
    }
    return [];
  },
};

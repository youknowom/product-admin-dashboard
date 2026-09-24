"use client";

import { useState, useEffect } from "react";
import { categoryService } from "@/services/category.service";

export default function ProductForm({
  initialData = null,
  isSubmitting = false,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price !== undefined ? String(initialData.price) : "",
    stock: initialData?.stock !== undefined ? String(initialData.stock) : "",
    category: initialData?.category || "",
    brand: initialData?.brand || "",
    thumbnail: initialData?.thumbnail || "",
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;
    categoryService.getAll().then((data) => {
      if (active) setCategories(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    const priceNum = parseFloat(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Price must be a valid number greater than 0.";
    }

    const stockNum = parseInt(formData.stock, 10);
    if (!formData.stock || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = "Stock must be a non-negative integer.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double-clicks
    if (!validate()) return;

    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      thumbnail:
        formData.thumbnail.trim() ||
        "https://cdn.dummyjson.com/product-images/default.jpg",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
        >
          Product Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Wireless Noise-Cancelling Headphones"
          className={`w-full px-3.5 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
            errors.title
              ? "border-red-500 focus:ring-red-200"
              : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.title}
          </p>
        )}
      </div>

      {/* Grid: Category & Brand */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3.5 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all cursor-pointer ${
              errors.category
                ? "border-red-500 focus:ring-red-200"
                : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Brand
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g. Sony, Apple, Samsung"
            className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Grid: Price & Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Price (USD $) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            className={`w-full px-3.5 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
              errors.price
                ? "border-red-500 focus:ring-red-200"
                : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            className={`w-full px-3.5 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
              errors.stock
                ? "border-red-500 focus:ring-red-200"
                : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.stock}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail URL */}
      <div>
        <label
          htmlFor="thumbnail"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
        >
          Image Thumbnail URL
        </label>
        <input
          id="thumbnail"
          name="thumbnail"
          type="url"
          value={formData.thumbnail}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of the product features, specs, and materials..."
          className={`w-full px-3.5 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
            errors.description
              ? "border-red-500 focus:ring-red-200"
              : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.description}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving...
            </>
          ) : (
            "Save Product"
          )}
        </button>
      </div>
    </form>
  );
}

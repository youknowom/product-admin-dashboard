"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productService } from "@/services/product.service";
import { saveLocalCreatedProduct } from "@/lib/productStorage";
import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (formData) => {
    if (isSubmitting) return; // Prevent double submit
    setIsSubmitting(true);
    setError("");

    try {
      const created = await productService.create(formData);
      // DummyJSON returns an object with mock ID (e.g. 195 or 209).
      // We save it in our local storage overlay so it persists when returning to the list!
      const newProduct = {
        ...formData,
        id: created.id || Date.now(),
        rating: 5.0,
      };
      saveLocalCreatedProduct(newProduct);
      router.push("/products");
    } catch (err) {
      // In case the mock endpoint errors, still persist locally to simulate success
      const newProduct = {
        ...formData,
        id: Date.now(),
        rating: 5.0,
      };
      saveLocalCreatedProduct(newProduct);
      router.push("/products");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors mb-2"
        >
          ← Back to Products
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Add New Product
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Create a new catalog item. Enter product specifications and pricing below.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm"
        >
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
        <ProductForm
          isSubmitting={isSubmitting}
          onSubmit={handleCreate}
          onCancel={() => router.push("/products")}
        />
      </div>
    </div>
  );
}

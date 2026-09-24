"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";
import { saveLocalUpdatedProduct } from "@/lib/productStorage";
import ProductFilters from "@/components/products/ProductFilters";
import ProductTable from "@/components/products/ProductTable";
import ProductCard from "@/components/products/ProductCard";
import ProductPagination from "@/components/products/ProductPagination";
import ProductForm from "@/components/products/ProductForm";
import DeleteDialog from "@/components/products/DeleteDialog";
import Loader from "@/components/ui/Loader";
import ErrorState from "@/components/ui/ErrorState";

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Safe URL Parameter Parsing (Handling ?page=abc, negative numbers, etc.)
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const rawLimit = parseInt(searchParams.get("limit") || "10", 10);
  const limit = [10, 20, 50].includes(rawLimit) ? rawLimit : 10;

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "asc";

  // 2. Fetch categories for filters
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    let active = true;
    categoryService.getAll().then((data) => {
      if (active) setCategories(data);
    });
    return () => {
      active = false;
    };
  }, []);

  // 3. Fetch products via custom hook
  const {
    products,
    setProducts,
    total,
    loading,
    error,
    refetch,
    deleteProductLocally,
  } = useProducts({
    page,
    limit,
    search,
    category,
    sortBy,
    order,
  });

  // 4. URL Update Helper (Keeps state in URL search params)
  const updateUrlParams = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (key === "page" && Number(value) === 1) ||
          (key === "limit" && Number(value) === 10) ||
          (key === "category" && value === "all")
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // 5. Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);

    try {
      await productService.delete(deleteTarget.id);
      deleteProductLocally(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // Optimistically remove locally even if mock API throws
      deleteProductLocally(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // 6. Edit Modal State
  const [editTarget, setEditTarget] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditSubmit = async (formData) => {
    if (!editTarget || isUpdating) return;
    setIsUpdating(true);

    try {
      await productService.update(editTarget.id, formData);
      // Persist update locally and update state
      saveLocalUpdatedProduct(editTarget.id, formData);
      setProducts((prev) =>
        prev.map((p) => (p.id === editTarget.id ? { ...p, ...formData } : p))
      );
      setEditTarget(null);
    } catch {
      // Fallback local update
      saveLocalUpdatedProduct(editTarget.id, formData);
      setProducts((prev) =>
        prev.map((p) => (p.id === editTarget.id ? { ...p, ...formData } : p))
      );
      setEditTarget(null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Products Catalog
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage, filter, search, and update your inventory items.
          </p>
        </div>

        <Link
          href="/products/new"
          className="btn-glass-primary inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white text-sm font-semibold gap-2 shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <ProductFilters
        search={search}
        category={category}
        sortBy={sortBy}
        order={order}
        categories={categories}
        onFilterChange={updateUrlParams}
      />

      {/* Loading State */}
      {loading && <Loader text="Fetching product records..." />}

      {/* Error State */}
      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            No products found
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
            We couldn&apos;t find any products matching your current filters or query.
          </p>
          <button
            type="button"
            onClick={() =>
              updateUrlParams({ search: "", category: "", sortBy: "", order: "asc", page: 1 })
            }
            className="btn-glass-pill px-4 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/25 dark:border-orange-500/35 shadow-xs cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Content: Desktop Table & Mobile Cards */}
      {!loading && !error && products.length > 0 && (
        <>
          {/* Desktop Table View */}
          <ProductTable
            products={products}
            onEdit={(prod) => setEditTarget(prod)}
            onDelete={(prod) => setDeleteTarget(prod)}
          />

          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={(prod) => setEditTarget(prod)}
                onDelete={(prod) => setDeleteTarget(prod)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <ProductPagination
            currentPage={page}
            totalItems={total}
            pageSize={limit}
            onPageChange={(newPage) => updateUrlParams({ page: newPage })}
            onPageSizeChange={(newLimit) => updateUrlParams({ limit: newLimit, page: 1 })}
          />
        </>
      )}

      {/* Delete Confirmation Popup */}
      <DeleteDialog
        isOpen={Boolean(deleteTarget)}
        productTitle={deleteTarget?.title || ""}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Edit Product Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Edit Product #{editTarget.id}
              </h2>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <ProductForm
              initialData={editTarget}
              isSubmitting={isUpdating}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditTarget(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader text="Loading dashboard..." />}>
      <ProductsContent />
    </Suspense>
  );
}

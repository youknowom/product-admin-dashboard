"use client";

import { useEffect, useState, use } from "react";
import { useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { productService } from "@/services/product.service";
import {
  getLocalCreatedProducts,
  getLocalUpdatedProducts,
  markProductDeleted,
  saveLocalUpdatedProduct,
} from "@/lib/productStorage";
import { formatCurrency } from "@/lib/utils";
import Loader from "@/components/ui/Loader";
import DeleteDialog from "@/components/products/DeleteDialog";
import ProductForm from "@/components/products/ProductForm";

export default function ProductDetailPage({ params }) {
  // In Next.js 15+, params is a Promise that can be unwrapped with React.use()
  const resolvedParams = use(params);
  const id = resolvedParams?.id;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      // 1. Check if ID is a locally created product
      const created = getLocalCreatedProducts();
      const localMatch = created.find((p) => String(p.id) === String(id));

      if (localMatch) {
        if (!active) return;
        const updates = getLocalUpdatedProducts()[id] || {};
        const merged = { ...localMatch, ...updates };
        setProduct(merged);
        setSelectedImage(merged.images?.[0] || merged.thumbnail || "");
        setLoading(false);
        return;
      }

      // 2. Otherwise fetch from API
      try {
        const data = await productService.getById(id);
        if (!active) return;
        const updates = getLocalUpdatedProducts()[id] || {};
        const merged = { ...data, ...updates };
        setProduct(merged);
        setSelectedImage(merged.images?.[0] || merged.thumbnail || "");
      } catch (err) {
        if (!active) return;
        // If 404 or invalid ID, trigger Next.js notFound()
        if (err.response?.status === 404 || isNaN(Number(id))) {
          notFound();
        } else {
          notFound();
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const handleDeleteConfirm = async () => {
    if (!product || isDeleting) return;
    setIsDeleting(true);

    try {
      await productService.delete(product.id);
    } catch {
      // Ignore API mock failure
    } finally {
      markProductDeleted(product.id);
      setIsDeleting(false);
      router.replace("/products");
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!product || isUpdating) return;
    setIsUpdating(true);

    try {
      await productService.update(product.id, formData);
    } catch {
      // Ignore API mock failure
    } finally {
      saveLocalUpdatedProduct(product.id, formData);
      setProduct((prev) => ({ ...prev, ...formData }));
      setIsUpdating(false);
      setShowEditModal(false);
    }
  };

  if (loading) {
    return <Loader text="Loading product details..." />;
  }

  if (!product) {
    return null;
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : product.thumbnail
    ? [product.thumbnail]
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          ← Back to Catalog
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 text-sm font-medium border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
          >
            Edit Product
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Main Product Showcase Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="w-full aspect-square rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 overflow-hidden flex items-center justify-center p-4">
            {selectedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-contain transition-all duration-300"
              />
            ) : (
              <span className="text-sm text-zinc-400">No Image Available</span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-lg bg-zinc-50 dark:bg-zinc-800 shrink-0 border-2 overflow-hidden transition-all cursor-pointer ${
                    selectedImage === img
                      ? "border-blue-600 shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Specifications */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                {product.category}
              </span>
              {product.brand && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Brand: {product.brand}
                </span>
              )}
              {product.sku && (
                <span className="text-xs text-zinc-400">SKU: {product.sku}</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {product.title}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(product.price)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center text-amber-500 font-bold">
                <span className="text-base mr-1">★</span>
                <span>{typeof product.rating === "number" ? product.rating.toFixed(1) : "N/A"}</span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                Stock:{" "}
                <strong className={product.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}>
                  {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </strong>
              </span>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Description
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Quick Details Table */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl text-xs text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="text-zinc-400 block">Warranty</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {product.warrantyInformation || "1 Year Standard"}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block">Shipping</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {product.shippingInformation || "Free Express Shipping"}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block">Return Policy</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {product.returnPolicy || "30 Days Return"}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block">Availability</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {product.availabilityStatus || "In Stock"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
          Customer Reviews
          <span className="text-xs font-normal text-zinc-400">
            ({product.reviews?.length || 0})
          </span>
        </h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.reviews.map((rev, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {rev.reviewerName}
                    </span>
                    <span className="text-xs text-amber-500 font-semibold">
                      ★ {rev.rating}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 italic">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
                <span className="text-[11px] text-zinc-400 mt-3 block">
                  {new Date(rev.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-400">No customer reviews yet for this product.</p>
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={showDeleteModal}
        productTitle={product.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Edit Product #{product.id}
              </h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <ProductForm
              initialData={product}
              isSubmitting={isUpdating}
              onSubmit={handleEditSubmit}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

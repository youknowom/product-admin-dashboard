"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm flex flex-col justify-between">
      <div className="flex gap-4">
        {/* Product Thumbnail */}
        <div className="w-20 h-20 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-center">
          {product.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-xs text-zinc-400">No img</span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 capitalize mb-1">
            {product.category}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="block font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 text-sm line-clamp-1"
          >
            {product.title}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              {formatCurrency(product.price)}
            </span>
            <span className="text-xs text-amber-500 font-medium flex items-center gap-0.5">
              ★ {typeof product.rating === "number" ? product.rating.toFixed(1) : "N/A"}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Stock: <span className="font-medium text-zinc-700 dark:text-zinc-300">{product.stock}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end gap-3 text-xs font-medium">
        <Link
          href={`/products/${product.id}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          View
        </Link>
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

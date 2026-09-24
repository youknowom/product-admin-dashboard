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
            className="block font-semibold text-zinc-900 dark:text-zinc-100 hover:text-orange-600 dark:hover:text-orange-400 text-sm line-clamp-1"
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
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end gap-2 text-xs font-semibold">
        <Link
          href={`/products/${product.id}`}
          className="btn-glass-pill inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/25 dark:border-orange-500/35 shadow-xs"
        >
          <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </Link>
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="btn-glass-pill inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100/70 dark:bg-zinc-800/60 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/70 border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="btn-glass-pill inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 dark:border-rose-500/35 shadow-xs cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="hidden md:block overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-800/40 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-16">Image</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
              >
                {/* Image */}
                <td className="py-3 px-4">
                  <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-200/60 dark:border-zinc-700/60">
                    {product.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[10px] text-zinc-400">No img</span>
                    )}
                  </div>
                </td>

                {/* Title & Brand */}
                <td className="py-3 px-4 max-w-xs">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-orange-600 dark:hover:text-orange-400 line-clamp-1"
                  >
                    {product.title}
                  </Link>
                  {product.brand && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {product.brand}
                    </span>
                  )}
                </td>

                {/* Category */}
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 capitalize">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(product.price)}
                </td>

                {/* Rating */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-amber-500 font-medium text-xs">
                    <span>★</span>
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {typeof product.rating === "number" ? product.rating.toFixed(1) : "N/A"}
                    </span>
                  </div>
                </td>

                {/* Stock status badge */}
                <td className="py-3 px-4">
                  {product.stock > 10 ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {product.stock} in stock
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Low ({product.stock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                      Out of stock
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProductFilters({
  search = "",
  category = "",
  sortBy = "",
  order = "asc",
  categories = [],
  onFilterChange,
}) {
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [prevSearch, setPrevSearch] = useState(search);
  if (prevSearch !== search) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  // Trigger search update when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      onFilterChange({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, search, onFilterChange]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    // When category is changed, clear search and reset to page 1
    onFilterChange({
      category: newCategory,
      search: "",
      page: 1,
    });
    setSearchInput("");
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (!value) {
      onFilterChange({ sortBy: "", order: "asc", page: 1 });
      return;
    }
    const [sortField, sortOrder] = value.split("-");
    onFilterChange({ sortBy: sortField, order: sortOrder, page: 1 });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    onFilterChange({
      search: "",
      category: "",
      sortBy: "",
      order: "asc",
      page: 1,
    });
  };

  const currentSortValue = sortBy ? `${sortBy}-${order}` : "";
  const hasActiveFilters = Boolean(search || category || sortBy);

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative sm:col-span-2 lg:col-span-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products by title or brand..."
            className="w-full pl-10 pr-9 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <svg
            className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onFilterChange({ search: "", page: 1 });
              }}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={category || ""}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <select
            value={currentSortValue}
            onChange={handleSortChange}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
          </select>
        </div>
      </div>

      {/* Active Filter Indicators & Reset */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Active filters:</span>
            {search && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
                Search: &quot;{search}&quot;
              </span>
            )}
            {category && (
              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium">
                Category: {category}
              </span>
            )}
            {sortBy && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium">
                Sort: {sortBy} ({order})
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-red-600 dark:text-red-400 hover:underline font-medium cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

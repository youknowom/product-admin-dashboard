import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-16">
      <div className="max-w-md w-full text-center bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-black text-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-900">
          404
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
          Product Not Found
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          The requested product ID does not exist or has been removed from the catalog.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          ← Return to Products Catalog
        </Link>
      </div>
    </div>
  );
}

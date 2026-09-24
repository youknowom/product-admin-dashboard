"use client";

export default function DeleteDialog({
  isOpen,
  productTitle,
  isDeleting,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Confirm Delete
            </h3>
            <p className="text-xs text-zinc-500">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6">
          Are you sure you want to delete{" "}
          <strong className="text-zinc-900 dark:text-white">&quot;{productTitle}&quot;</strong>?
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="btn-glass-pill px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100/70 dark:bg-zinc-800/60 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/70 border border-zinc-200/80 dark:border-zinc-700/60 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn-glass-danger px-5 py-2 text-xs sm:text-sm font-semibold rounded-full flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
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
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

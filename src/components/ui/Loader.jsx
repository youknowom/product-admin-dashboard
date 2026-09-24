export default function Loader({ text = "Loading products..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-950 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">{text}</p>
    </div>
  );
}

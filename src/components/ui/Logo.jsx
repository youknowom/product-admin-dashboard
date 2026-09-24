export default function Logo({
  size = "md",
  showText = true,
  className = "",
  textClassName = "",
}) {
  const sizeMap = {
    sm: { icon: 28, text: "text-base", gap: "gap-2" },
    md: { icon: 34, text: "text-lg", gap: "gap-2.5" },
    lg: { icon: 44, text: "text-2xl", gap: "gap-3" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {/* Modern 3D Geometric Isometric Stock / Product Icon in Orange Theme */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105 select-none drop-shadow-sm"
        aria-hidden="true"
      >
        <defs>
          {/* Orange Theme Gradients */}
          <linearGradient id="ps-top" x1="6" y1="6" x2="34" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>

          <linearGradient id="ps-left" x1="4" y1="13" x2="20" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>

          <linearGradient id="ps-right" x1="20" y1="13" x2="36" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C2410C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>

          {/* Soft ambient orange glow */}
          <filter id="ps-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#EA580C" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Ambient glow container */}
        <g filter="url(#ps-glow)">
          {/* Top Diamond Facet */}
          <path
            d="M20 5.5L34 13.5L20 21.5L6 13.5L20 5.5Z"
            fill="url(#ps-top)"
          />

          {/* Left Isometric Facet */}
          <path
            d="M6 14.5L19.5 22.2V35L6 27.2V14.5Z"
            fill="url(#ps-left)"
          />

          {/* Right Isometric Facet */}
          <path
            d="M20.5 22.2L34 14.5V27.2L20.5 35V22.2Z"
            fill="url(#ps-right)"
          />

          {/* Internal Stock / Layer Line Accents */}
          <path
            d="M6 20.8L19.5 28.5M20.5 28.5L34 20.8"
            stroke="#FED7AA"
            strokeWidth="1.2"
            strokeOpacity="0.65"
            strokeLinecap="round"
          />

          {/* Top Facet Center Stylized Product Node */}
          <path
            d="M20 9.8L27 13.8L20 17.8L13 13.8L20 9.8Z"
            fill="#FFF7ED"
            fillOpacity="0.4"
          />

          {/* Center Vertical Crisp Highlight */}
          <line
            x1="20"
            y1="22"
            x2="20"
            y2="34.5"
            stroke="#FED7AA"
            strokeWidth="1.2"
            strokeOpacity="0.7"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Brand Typography */}
      {showText && (
        <span
          className={`font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5 ${currentSize.text} ${textClassName}`}
        >
          <span>Product</span>
          <span className="font-extrabold bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
            Stock
          </span>
        </span>
      )}
    </div>
  );
}

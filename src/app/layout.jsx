import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Product Stock - Admin Dashboard",
  description: "Product Stock inventory and administration management dashboard",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("theme") || 
                  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

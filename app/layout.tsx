import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jai Jawan CHS - Building Our Future, Together",
  description: "Modern real estate and construction company website",
  keywords: ["real estate", "construction", "society", "property", "residential"],
  authors: [{ name: "Jai Jawan CHS" }],
  creator: "Jai Jawan CHS",
  publisher: "Jai Jawan CHS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Jai Jawan CHS - Building Our Future, Together",
    description: "Modern real estate and construction company website",
    type: "website",
    locale: "en_IN",
    siteName: "Jai Jawan CHS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}


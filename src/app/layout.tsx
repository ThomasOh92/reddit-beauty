import type { Metadata } from "next";
import "./globals.css";
import Banner from "@/components/banner";
import { open_sans } from './fonts'
import Footer from "@/components/footer";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    default: "Reddit Beauty and Skincare - Reviews from Real Redditors",
    template: "%s | Reddit Beauty",
  },
  description: "Discover the most talked-about skincare and beauty products on Reddit.",
  keywords: [
    "Reddit beauty",
    "Reddit skincare",
    "Reddit product reviews",
    "best skincare Reddit",
    "beauty products ranked by Reddit",
    "Reddit beauty tips"
  ],
  metadataBase: new URL("https://redditbeauty.com"),
  alternates: {
    canonical: "https://redditbeauty.com",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={open_sans.className}>
      <body>
        <Banner />
        {children}
        <Footer/>
        <Analytics />
      </body>
    </html>
  );
}

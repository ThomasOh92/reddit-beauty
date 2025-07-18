import type { Metadata } from "next";
import "./globals.css";
import Banner from "@/components/banner";
import { open_sans } from './fonts'
import Footer from "@/components/footer";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: {
    default: "Reddit Beauty and Skincare",
    template: "%s | Reddit Beauty and Skincare",
  },
  description: "Discover the most talked about skincare and beauty products on Reddit.",
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
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Reddit Beauty and Skincare",
    url: "https://redditbeauty.com",
    description:
      "Discover the most talked about skincare and beauty products on Reddit.",
  };

  return (
    <html lang="en" className={open_sans.className}>
      <meta property="og:site_name" content="Reddit Beauty and Skincare" />
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
      />
      <body>
        <Banner />
        {children}
        <Footer/>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-HV12NWBY2Z" />
    </html>
  );
}

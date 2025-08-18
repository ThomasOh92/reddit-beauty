import type { Metadata } from "next";
import "./globals.css";
import Banner from "@/components/banner";
import { open_sans } from './fonts'
import Footer from "@/components/footer";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: {
    default: "Beauty Aggregate",
    template: "%s | Beauty Aggregate",
  },
  description: "Discover the most talked about skincare and beauty products on Reddit.",
  keywords: [
    "Beauty Aggregate",
    "Beauty Aggregate skincare",
    "Beauty Aggregate product reviews",
    "best skincare Beauty Aggregate",
    "beauty products ranked by Beauty Aggregate",
    "Beauty Aggregate beauty tips"
  ],
  metadataBase: new URL("https://www.beautyaggregate.com"),
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
    name: "Beauty Aggregate",
    url: "https://www.beautyaggregate.com",
    description: "Discover the most talked about skincare and beauty products on Reddit.",
    alternateName: ["Beauty Aggregate", "BeautyAggregate", "Beauty Aggregate & Skincare"],
  };

  return (
    <html lang="en" className={open_sans.className}>
      <head>
        <meta property="og:site_name" content="Beauty Aggregate" />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
        />
      </head>
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

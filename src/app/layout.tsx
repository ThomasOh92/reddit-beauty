import type { Metadata } from "next";
import "./globals.css";
import Banner from "@/components/banner";
import { open_sans } from './fonts'
import Footer from "@/components/footer";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: {
    default: "Thorough Beauty",
    template: "%s | Thorough Beauty",
  },
  description: "Discover the most talked about skincare and beauty products on Reddit.",
  keywords: [
    "Thorough Beauty",
    "Thorough Beauty skincare",
    "Thorough Beauty product reviews",
    "best skincare Thorough Beauty",
    "beauty products ranked by Thorough Beauty",
    "beauty tips by Thorough Beauty"
  ],
  metadataBase: new URL("https://www.thoroughbeauty.com"),
  openGraph: {
    title: "Thorough Beauty",
    description: "Discover the most talked about skincare and beauty products on Reddit.",
    url: "https://www.thoroughbeauty.com",
    siteName: "Thorough Beauty",
    type: "website",
    locale: "en_US"
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
    name: "Thorough Beauty",
    url: "https://www.thoroughbeauty.com",
    description: "Discover the most talked about skincare and beauty products on Reddit.",
    alternateName: ["Thorough Beauty", "ThoroughBeauty", "Thorough Beauty & Skincare"],
  };

  return (
    <html lang="en" className={open_sans.className}>
      <head>
        <meta property="og:site_name" content="Thorough Beauty" />
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

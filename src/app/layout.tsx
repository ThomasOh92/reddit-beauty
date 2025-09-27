import type { Metadata } from "next";
import "./globals.css";
import Banner from "@/components/banner";
import { open_sans } from './fonts'
import Footer from "@/components/footer";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title:  "Thorough Beauty | Reddit Skincare and Beauty Reviews",
  description: "Discover the most talked about skincare and beauty products on Reddit.",
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
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "T Beauty",
  },
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

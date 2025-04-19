import type { Metadata } from "next";
import "./globals.css";
import Banner from "@/components/banner";
import { open_sans } from './fonts'
import Footer from "@/components/footer";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "Reddit Beauty",
  description: "Beauty and Skincare Recommendations from Reddit",
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

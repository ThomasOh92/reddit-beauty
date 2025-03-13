import type { Metadata } from "next";
import "./globals.css";
import Banner from "./banner";
import { open_sans } from './fonts'

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
      </body>
    </html>
  );
}

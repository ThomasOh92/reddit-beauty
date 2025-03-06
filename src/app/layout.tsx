import type { Metadata } from "next";
import "./globals.css";
import Banner from "./banner";

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
    <html lang="en">
      <body>
        <Banner />
        {children}
      </body>
    </html>
  );
}

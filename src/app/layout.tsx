import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Car Showcase | Jacobs Entertainment",
  description: "Interactive car display kiosk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="kiosk-mode">{children}</body>
    </html>
  );
}

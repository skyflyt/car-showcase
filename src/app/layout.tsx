import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Garage | Jacobs Entertainment",
    template: "%s | The Garage",
  },
  description: "Interactive car display kiosk for Jacobs Entertainment",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "The Garage",
  },
  openGraph: {
    title: "The Garage | Jacobs Entertainment",
    description: "Interactive car display kiosk",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
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

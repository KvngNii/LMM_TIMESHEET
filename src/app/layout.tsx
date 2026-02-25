import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lavitta Marketing Management — Time Tracking",
  description:
    "Employee time tracking, timesheets, and workforce analytics for Lavitta Marketing Management.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARCFORM | Architecture, Design & BIM",
  description:
    "Award-winning architecture, interior design, and BIM consultancy. We shape spaces that inspire.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-arch-cream text-arch-black antialiased">
        {children}
      </body>
    </html>
  );
}

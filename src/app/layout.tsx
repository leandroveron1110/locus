import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Locus | La plataforma de tu ciudad",
  description:
    "Locus es la plataforma que centraliza todos los negocios de tu ciudad. Encontrá todo lo que buscás y hacé tus pedidos online desde un solo lugar.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Locus | La plataforma de tu ciudad",
    description:
      "Locus centraliza todos los negocios de tu ciudad para que encuentres lo que buscás y hagas tus pedidos online fácilmente.",
    url: "https://locus-drab.vercel.app/",
    siteName: "Locus",
    images: [
      {
        url: "/locu-g.png", // ✅ PNG o JPG, no SVG
        width: 1200,
        height: 630,
        alt: "Locus - La plataforma de tu ciudad",
      },
    ],
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Locus | La plataforma de tu ciudad",
    description:
      "Descubrí y pedí online en todos los negocios de tu ciudad con Locus.",
    images: ["/locu-g.png"], // ✅ PNG también para Twitter
    creator: "@locus",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.className}>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

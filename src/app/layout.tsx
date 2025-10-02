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
    "Descubrí, reservá y disfrutá lo mejor de tu ciudad. Locus te conecta con bares, salas, clases, desayunos y mucho más, todo en un solo lugar.",
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
      "Con Locus podés explorar y reservar salas, pedir en tu bar favorito, tomar clases o descubrir experiencias únicas en tu ciudad.",
    url: "https://locus-drab.vercel.app/",
    siteName: "Locus",
    images: [
      {
        url: "/favicon.svg", // ✅ tenés que poner esta imagen en /public
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
      "Descubrí y reservá lo mejor de tu ciudad en un solo lugar: bares, salas, desayunos, clases y más.",
    images: ["/favicon.svgg"], // misma imagen que OpenGraph
    creator: "@locus", // opcional
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

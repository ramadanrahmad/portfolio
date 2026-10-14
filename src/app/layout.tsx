import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://rahmadramadan.vercel.app"
  ),
  title: {
    default: "Rahmad Ramadan | Web Fullstack & Game Developer",
    template: "%s | Rahmad Ramadan",
  },
  description:
    "Personal portfolio of Rahmad Ramadan, Informatics Engineering Student at Universitas Sriwijaya specializing in fullstack web architecture and interactive game development.",
  keywords: [
    "Rahmad Ramadan",
    "Web Developer",
    "Game Developer",
    "Universitas Sriwijaya",
    "Next.js",
    "React",
    "Supabase",
    "Unity",
    "Godot",
    "Palembang",
    "Fullstack Developer Indonesia",
  ],
  authors: [{ name: "Rahmad Ramadan", url: "https://github.com/ramadanrahmad" }],
  creator: "Rahmad Ramadan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Rahmad Ramadan Portfolio",
    title: "Rahmad Ramadan | Web Fullstack & Game Developer",
    description:
      "Explore web applications and interactive games developed by Rahmad Ramadan, Informatics Engineering Student at Universitas Sriwijaya.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rahmad Ramadan - Web Fullstack & Game Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahmad Ramadan | Web Fullstack & Game Developer",
    description:
      "Explore web applications and interactive games developed by Rahmad Ramadan, Informatics Engineering Student at Universitas Sriwijaya.",
    images: ["/og-image.jpg"],
    creator: "@ramadanrahmad",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
        {children}
      </body>
    </html>
  );
}

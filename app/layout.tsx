import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Gaegu } from "next/font/google";
import "./globals.css";
import { SparksEffect } from "../components/SparksEffect";

const gaegu = Gaegu({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
});

import { PageTransition } from "./PageTransition";

export const metadata: Metadata = {
  title: "Letrinha",
  description: "O jogo das palavras certas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${gaegu.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased animated-bg h-[100dvh] overflow-hidden overscroll-none`}
        suppressHydrationWarning
      >
        <div className="bg-texture" />
        <PageTransition>{children}</PageTransition>
        <SparksEffect />
      </body>
    </html>
  );
}

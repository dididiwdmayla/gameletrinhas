import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { SparksEffect } from "../components/SparksEffect";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

import { PageTransition } from "./PageTransition";

export const metadata: Metadata = {
  title: "Letrinha",
  description: "Jogo de adivinhação de palavras com 6 modos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${oswald.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased animated-bg h-[100dvh] overflow-hidden overscroll-none`}
        suppressHydrationWarning
      >
        <div className="vignette" />
        <PageTransition>{children}</PageTransition>
        <SparksEffect />
      </body>
    </html>
  );
}

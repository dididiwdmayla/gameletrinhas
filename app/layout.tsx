import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { SparksEffect } from "../components/SparksEffect";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

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
        className={`${spaceGrotesk.variable} ${inter.variable} font-body antialiased animated-bg h-[100dvh] overflow-hidden overscroll-none`}
        suppressHydrationWarning
      >
        {children}
        <SparksEffect />
      </body>
    </html>
  );
}

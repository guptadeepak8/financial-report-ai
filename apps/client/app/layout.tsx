import { Fraunces, JetBrains_Mono } from "next/font/google";
import './globals.css'
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono-label",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
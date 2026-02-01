import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const noto = Noto_Sans_TC({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto" });

export const metadata: Metadata = {
  title: "顧問治理工作空間",
  description: "Consultant-Controlled Governance Workspace (Prototype)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${noto.variable}`}>
      <body className="antialiased flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </body>
    </html>
  );
}
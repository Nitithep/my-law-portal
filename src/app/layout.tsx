import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "LAW — ระบบกลางทางกฎหมาย | รับฟังความคิดเห็นร่างกฎหมาย",
  description:
    "แพลตฟอร์มสำหรับประชาชนในการเข้าถึง อ่าน และแสดงความคิดเห็นต่อร่างกฎหมายแบบรายมาตรา ตามมาตรา 77 ของรัฐธรรมนูญ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${prompt.variable} antialiased min-h-screen flex flex-col font-sans`}>
        <Providers>
          <Header />
          <main className="flex-1 bg-[#f5f7fa]">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}

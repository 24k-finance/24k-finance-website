/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 18:31:16
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-07 19:41:08
 * @FilePath: /24k-finance-website/app/layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import type { Metadata } from "next";
import Header from "@/app/[locale]/components/Header";
import Footer from "@/app/[locale]/components/Footer"; // 导入 Footer 组件
import { Geist, Geist_Mono } from "next/font/google";
import WalletContextProvider from "@/app/[locale]/provider/WalletContextProvider"; // 导入 WalletContextProvider
import { getMessages } from "./utils/index"
import "./globals.css";
import '@solana/wallet-adapter-react-ui/styles.css';
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "24K Finance Web",
//   description: "24K Finance Web",
// };

// export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
//   return {
//     title: locale === 'zh' ? '24K 金融网站' : '24K Finance Web',
//     description: locale === 'zh' ? '区块链矿场质押-融资平台' : 'Blockchain Mining Staking-Financing Platform',
//   };
// }

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  return {
    title: locale === 'zh' ? '24K 金融网站' : '24K Finance Web',
    description: locale === 'zh' ? '区块链矿场质押-融资平台' : 'Blockchain Mining Staking-Financing Platform',
  };
}
export const locales = ["zh", "en"];
export const defaultLocale = "zh";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main>
            <WalletContextProvider>
              {children}
            </WalletContextProvider>
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}
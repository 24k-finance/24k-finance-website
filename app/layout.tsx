/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 18:31:16
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-05 19:53:29
 * @FilePath: /24k-finance-website/app/layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer"; // 导入 Footer 组件
import { Geist, Geist_Mono } from "next/font/google";
import WalletContextProvider from "@/app/provider/WalletContextProvider"; // 导入 WalletContextProvider
import "./globals.css";
import '@solana/wallet-adapter-react-ui/styles.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "24K Finance Web",
  description: "24K Finance Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Header /> {/* 在这里添加 Header 组件 */}
         <main>
            <WalletContextProvider>
               {children} {/* 子组件将在这里渲染 */}
            </WalletContextProvider>
         </main> {/* 主要页面内容 */}
         <Footer /> {/* 在这里添加 Footer 组件 */}
      </body>
    </html>
  );
}

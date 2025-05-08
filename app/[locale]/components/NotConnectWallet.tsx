/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-08 08:51:07
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-08 09:03:18
 * @FilePath: /24k-finance-website/app/[locale]/components/NotConnectWallet.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const SolanaConnectButton = dynamic(
    () => import('../components/SolanaConnectButton').then((mod) => mod.SolanaConnectButton),
    {
      ssr: false, // 关键：禁用服务器端渲染
      loading: () => <p></p> // 可选：添加加载状态指示器
    }
  );

export function NotConnectWallet() {
 const t = useTranslations('common'); 
  return (
    <motion.div 
      className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 mb-8 text-center flex flex-col justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
       <p className="text-gray-300 mb-4">{t('connectWalletPrompt')}</p>
      <SolanaConnectButton />
    </motion.div>
  )
}
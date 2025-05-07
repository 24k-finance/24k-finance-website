/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-07 17:36:24
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-07 20:36:52
 * @FilePath: /24k-finance-website/app/utils/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { locales } from '@/next-intl.config';
// import type { WalletContextState } from '@solana/wallet-adapter-react';
// import type { Wallet } from '@coral-xyz/anchor';

export async function getMessages(locale: string) {
  // 确保语言代码有效
  if (!locales.includes(locale as any)) {
    return {};
  }
  
  // 动态导入语言文件
  const messages = {
    index: (await import(`@/locales/${locale}/index.json`)).default,
    header: (await import(`@/locales/${locale}/header.json`)).default,
    // launch: (await import(`@/locales/${locale}/launch.json`)).default,
  };
  
  return messages;
}

/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-07 17:36:24
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-09 22:01:07
 * @FilePath: /24k-finance-website/app/utils/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { locales } from '@/next-intl.config';
import BN from 'bn.js';
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
    miningPlatform: (await import(`@/locales/${locale}/miningPlatform.json`)).default,
    footers: (await import(`@/locales/${locale}/footers.json`)).default,
    common: (await import(`@/locales/${locale}/common.json`)).default,
    cta: (await import(`@/locales/${locale}/cta.json`)).default,
    kyc: (await import(`@/locales/${locale}/kyc.json`)).default,
    staking: (await import(`@/locales/${locale}/staking.json`)).default,
    launchPage: (await import(`@/locales/${locale}/launchPage.json`)).default,
    home: (await import(`@/locales/${locale}/home.json`)).default,
    market: (await import(`@/locales/${locale}/market.json`)).default,
    "connect-us": (await import(`@/locales/${locale}/connect-us.json`)).default,
    launching: (await import(`@/locales/${locale}/launching.json`)).default,
    points: (await import(`@/locales/${locale}/points.json`)).default,
  };
  
  return messages;
}


// 时间格式转换
export const toDate = (bn: BN) => new Date(bn.toNumber() * 1000).toLocaleString();

// 金额处理（假设为 USDT，保留 6 位小数）
export const formatBNDecimal = (bn: BN, decimals: number) => {
  const raw = bn.toString().padStart(decimals + 1, '0');
  return `${raw.slice(0, -decimals)}.${raw.slice(-decimals)}`;
};

export function containsChinese(str: string) {
  return /[\u4e00-\u9fa5]/.test(str);
}
/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 18:31:16
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-11 13:43:05
 * @FilePath: /24k-finance-website/next.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { config } from 'process';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['j7vjbcs7d1nu3sfb.public.blob.vercel-storage.com'],
  },
  // 您的其他 Next.js 配置
};

export default withNextIntl(nextConfig);
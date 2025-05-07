import { config } from 'process';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 您的其他 Next.js 配置
};

export default withNextIntl(nextConfig);
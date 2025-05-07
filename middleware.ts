import createMiddleware from 'next-intl/middleware';
// import { locales, defaultLocale } from './next-intl.config.js';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 匹配所有路径，除了以下路径
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
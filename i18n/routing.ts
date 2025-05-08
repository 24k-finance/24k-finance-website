/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-07 19:36:15
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-08 17:16:04
 * @FilePath: /24k-finance-website/i18n/routing.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {defineRouting} from 'next-intl/routing';
import { locales, defaultLocale } from '../next-intl.config.js';
 
export const routing = defineRouting({
  locales,
 
  defaultLocale,
  // 可选：配置语言检测策略
  localeDetection: true,
  
  // 可选：配置语言前缀策略
  localePrefix: 'always' // 'as-needed' | 'always' | 'never'
});
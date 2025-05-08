/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-07 17:33:33
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-08 17:15:53
 * @FilePath: /24k-finance-website/middleware.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 匹配所有路径，除了以下路径
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
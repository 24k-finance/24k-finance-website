/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 19:29:08
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-10 10:06:10
 * @FilePath: /24k-finance-website/app/[locale]/components/CallToAction.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const CallToAction: React.FC = () => {
  const t = useTranslations('cta');

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#1c1c24]/80 backdrop-blur-sm p-12 my-16 shadow-lg">
      {/* 背景视觉效果 */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-purple-600 via-teal-500 to-indigo-600 blur-3xl -z-10"></div>

      <div className="relative z-10 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight font-sans"  style={{
          fontFamily: 'auto'
        }} >
          {t('title1')}
          <br className="hidden sm:block" />
          {t('title2')}
          <br className="hidden sm:block" />
          {t('title3')}
        </h2>
        {/* <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full transition-colors duration-300">
          {t('button')}
        </button> */}
      </div>
    </div>
  );
};

export default CallToAction;

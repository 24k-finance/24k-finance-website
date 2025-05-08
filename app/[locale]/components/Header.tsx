/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 19:07:58
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-08 13:42:56
 * @FilePath: /24k-finance-website/app/components/Header.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const t = useTranslations('header.header');
  
  const navItems = [
    { name: t('home'), href: '/' },
    { name: t('kyc'), href: '/kyc' },
    { name: t('launch'), href: '/launch' },
    { name: t('market'), href: '/market' },
    { name: t('staking'), href: '/staking' },
  ];

  return (
    // 将 px-8 sm:px-16 应用到 header 元素
    <header className="sticky top-0 z-50 w-full bg-[#161616]/80 backdrop-blur-sm border-b border-gray-800 px-8 sm:px-16">
      {/* 移除这里的 px-8 sm:px-16 */}
      <div className="max-w-6xl mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* 保持 Logo 尺寸，如果需要可以调整 */}
            <Image
              src="/24K_Logo.png" // 确保 public 目录下有这个 logo 文件
              alt="24K Logo"
              width={62} // 保持宽度，或根据视觉效果调整
              height={24} // 保持高度，或根据视觉效果调整
              priority
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center"
              >
                {item.name}
                <span className="ml-1 text-xs">▾</span>
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
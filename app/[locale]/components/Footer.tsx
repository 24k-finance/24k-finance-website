/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 19:25:10
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-08 13:43:33
 * @FilePath: /24k-finance-website/app/components/Footer.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { Youtube, Twitter, Github, Send, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  const t = useTranslations('footers');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 关闭下拉菜单的点击外部处理器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const socialLinks = [
    { Icon: Youtube, href: '#', label: 'YouTube' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    // { Icon: Discord, href: '#', label: 'Discord' },
    { Icon: Github, href: '#', label: 'GitHub' },
    { Icon: Send, href: '#', label: 'Telegram' },
  ];

  const footerLinks = {
    [t('company')]: [
      { name: t('about'), href: '#' },
      { name: t('roadmap'), href: '#' },
      { name: t('media'), href: '#' },
      { name: t('joinUs'), href: '#' },
      { name: t('disclaimer'), href: '#' },
      { name: t('privacy'), href: '#' },
    ],
    [t('contact')]: [
      { name: t('blog'), href: '#' },
      { name: t('newsletter'), href: '#' },
      { name: t('contactUs'), href: '#' },
    ],
  };

  return (
    <footer className="bg-[#0a0a10] text-gray-400 border-t border-gray-800 px-8 sm:px-16 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Section: Logo, Socials, Copyright */}
        <div className="md:col-span-1 space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">{t('administrator')}</p>
          <Link href="/" className="inline-block">
            <Image
              src="/24K_Logo.png"
              alt="24K Logo"
              width={75}
              height={36}
            />
          </Link>
          <div className="flex space-x-3">
            {socialLinks.map(({ Icon, href, label }) => (
              <Link key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <Icon size={16} className="text-gray-400" />
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-500 pt-4">
            © {new Date().getFullYear()} {t('copyright')}
          </p>
        </div>

        {/* Right Section: Links */}
        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-gray-200 mb-4 uppercase">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
           {/* 语言选择器 */}
           <div ref={dropdownRef} className="relative">
             <h3 className="text-sm font-semibold text-gray-200 mb-4 uppercase">{t('language')}</h3>
             <button 
               onClick={toggleDropdown}
               className="flex items-center text-sm hover:text-white transition-colors"
             >
               <Globe size={16} className="mr-2" />
               {locale === "zh" ? "中文" : "English"}
               <span className="ml-1 text-xs">▾</span>
             </button>
             
             {isOpen && (
               <div className="absolute mt-2 w-32 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
                 <button
                   onClick={() => handleLanguageChange("zh")}
                   className={`block w-full text-left px-4 py-2 text-sm ${
                     locale === "zh"
                       ? "bg-purple-900/50 text-white"
                       : "text-gray-300 hover:bg-gray-800"
                   }`}
                 >
                   中文
                 </button>
                 <button
                   onClick={() => handleLanguageChange("en")}
                   className={`block w-full text-left px-4 py-2 text-sm ${
                     locale === "en"
                       ? "bg-purple-900/50 text-white"
                       : "text-gray-300 hover:bg-gray-800"
                   }`}
                 >
                   English
                 </button>
               </div>
             )}
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
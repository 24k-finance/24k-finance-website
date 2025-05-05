/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 19:25:10
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-05 19:25:16
 * @FilePath: /24k-finance-website/app/components/Footer.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Youtube, Twitter, Github, Send, Globe } from 'lucide-react'; // 导入一些社交图标和地球图标

const Footer: React.FC = () => {
  const socialLinks = [
    { Icon: Youtube, href: '#', label: 'YouTube' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    // { Icon: Discord, href: '#', label: 'Discord' }, // 需要找到合适的 Discord 图标或使用文字
    { Icon: Github, href: '#', label: 'GitHub' },
    { Icon: Send, href: '#', label: 'Telegram' }, // 使用 Send 图标代替 Telegram
  ];

  const footerLinks = {
    '24K Finance': [ // 使用你的项目名称
      { name: '关于我们', href: '#' },
      { name: '路线图', href: '#' },
      { name: '媒体资料', href: '#' },
      { name: '加入我们', href: '#' },
      { name: '免责声明', href: '#' },
      { name: '隐私政策', href: '#' },
    ],
    '取得联系': [
      { name: '博客', href: '#' },
      { name: '新闻通讯', href: '#' },
      { name: '联系我们', href: '#' },
    ],
  };

  return (
    <footer className="bg-[#0a0a10] text-gray-400 border-t border-gray-800 px-8 sm:px-16 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Section: Logo, Socials, Copyright */}
        <div className="md:col-span-1 space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">管理者</p>
          <Link href="/" className="inline-block">
            {/* 使用你的 Logo */}
            <Image
              src="/24k.svg" // 确保 public 目录下有这个 logo 文件
              alt="24K Logo"
              width={150} // 调整尺寸
              height={36} // 调整尺寸
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
            © {new Date().getFullYear()} 24K Finance 版权所有
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
           {/* Language Selector Placeholder */}
           <div>
             <h3 className="text-sm font-semibold text-gray-200 mb-4 uppercase invisible">语言</h3> {/* Invisible title for alignment */}
             <button className="flex items-center text-sm hover:text-white transition-colors">
               <Globe size={16} className="mr-2" />
               ZH
               <span className="ml-1 text-xs">▾</span>
             </button>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
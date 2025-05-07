/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-07 17:21:15
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-07 20:10:15
 * @FilePath: /24k-finance-website/app/[locale]/components/LanguageSwitcher.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useState, useEffect, useRef } from "react";

export default function LanguageSwitcher() {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-sm border border-gray-600 rounded-full px-3 py-1 text-gray-300 hover:bg-white/10 hover:border-white transition-colors flex items-center gap-1"
      >
        {locale === "zh" ? "中文" : "English"}
        <span className="text-xs">▾</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
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
  );
}
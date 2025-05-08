'use client';
/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 18:31:16
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-08 23:09:23
 * @FilePath: /24k-finance-website/app/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Image from "next/image"; // 保留 Image 组件导入，可能之后会用到
import dynamic from 'next/dynamic'; // 导入 dynamic
import CaseStudyCard from "@/app/[locale]/components/CaseStudyCard"; // 导入 CaseStudyCard 组件
import CallToAction from "@/app/[locale]/components/CallToAction"; 
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
// import { MiningPlatformHero } from "@/app/components/MiningPlatformHero"; // 导入 MiningPlatformHero 组件

const MiningPlatformHero = dynamic(
  () => import('./components/MiningPlatformHero').then((mod) => mod.MiningPlatformHero),
  {
    ssr: false, // 关键：禁用服务器端渲染
    loading: () => <p></p> // 可选：添加加载状态指示器
  }
);

const SolanaConnectButton = dynamic(
  () => import('./components/SolanaConnectButton').then((mod) => mod.SolanaConnectButton),
  {
    ssr: false, // 关键：禁用服务器端渲染
    loading: () => <p></p> // 可选：添加加载状态指示器
  }
);

const IdlViewer = dynamic(
  () => import('./components/IdlViewer').then((mod) => mod.default),
  {
    ssr: false, // 关键：禁用服务器端渲染
    loading: () => <p></p> // 可选：添加加载状态指示器
  }
);




export default function Home() {
  const t = useTranslations('home'); // 使用 index 命名空间的翻译
  // 定义卡片数据，方便管理和渲染
  const caseStudies = [
    {
      tag: t('caseStudies.item1.tag'),
      title: t('caseStudies.item1.title'),
      description: t('caseStudies.item1.description'),
      imageUrl: "/assets_5.png", // 替换为实际图片路径
      large: true, // 标记这个卡片是否是大尺寸的
      href: '/market', // 替换为实际的链接
    },
    {
      tag: t('caseStudies.item2.tag'),
      title: t('caseStudies.item2.title'),
      description: t('caseStudies.item2.description'),
      imageUrl: "/assets_6.jpg", // 替换为实际图片路径
      large: false,
      href: '/market', // 替换为实际的链接
    },
    {
      tag: t('caseStudies.item3.tag'),
      title: t('caseStudies.item3.title'),
      description: t('caseStudies.item3.description'),
      imageUrl: "/assets_7.jpg", // 替换为实际图片路径
      large: false,
      href: '/market', // 替换为实际的链接
    },
    {
      tag: t('caseStudies.item4.tag'),
      title: t('caseStudies.item4.title'),
      description: t('caseStudies.item4.description'),
      imageUrl: "/assets_8.jpg", // 替换为实际图片路径
      large: false,
      href: '/market', // 替换为实际的链接
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
    <div className="max-w-6xl mx-auto">
      {/* <IdlViewer programId="91N4aCumtu3x4E4SgqS8cKfKXk3LdHuHqN5xZ1qnunkV" /> */}
      <MiningPlatformHero />
      <div className="mt-8">
      <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{t('marketTitle')}</h2>
          <Link href="/market" className="text-sm border border-gray-600 rounded-full px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white transition-colors flex items-center gap-2">
            {t('goToMarket')} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 大卡片 */}
          <div className="lg:col-span-2">
             <CaseStudyCard {...caseStudies[0]} />
          </div>
          {/* 小卡片 */}
          <CaseStudyCard {...caseStudies[1]} />
          <CaseStudyCard {...caseStudies[2]} />
          <CaseStudyCard {...caseStudies[3]} />
        </div>
      </div>

      {/* 加入我们 Section */}
      <div className="mt-16"> {/* 添加一些顶部间距 */}
        <CallToAction />
      </div>
    </div>
    {/* 你可以在这里添加页脚或其他部分 */}
  </div>
  );
}

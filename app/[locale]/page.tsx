'use client';
/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 18:31:16
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-08 18:22:10
 * @FilePath: /24k-finance-website/app/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Image from "next/image"; // 保留 Image 组件导入，可能之后会用到
import dynamic from 'next/dynamic'; // 导入 dynamic
import CaseStudyCard from "@/app/[locale]/components/CaseStudyCard"; // 导入 CaseStudyCard 组件
import CallToAction from "@/app/[locale]/components/CallToAction"; 
import { Link } from "@/i18n/navigation";
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

// 定义 “我的金矿” 卡片数据
const goldMineItems = [
  {
    tag: "矿场 #1",
    title: "活跃矿机",
    description: "当前运行: 5 台 / 总计: 10 台",
    imageUrl: "/assets_1.webp", // 替换为实际图片路径
    large: false, // 金矿卡片不需要大尺寸
  },
  {
    tag: "收益",
    title: "今日预估",
    description: "0.005 BTC / 150 USDT",
    imageUrl: "/assets_2.webp", // 替换为实际图片路径
    large: false,
  },
];


// 定义卡片数据，方便管理和渲染
const caseStudies = [
  {
    tag: "金矿",
    title: "马里 库雷马莱 #01",
    description: "马里库雷马莱金矿黄金储量约 40 吨，品位约 5克/吨",
    imageUrl: "/assets_5.png", // 替换为实际图片路径
    large: true, // 标记这个卡片是否是大尺寸的
  },
  {
    tag: "金矿",
    title: "科特迪瓦 丁博克罗 #02",
    description: "科特迪瓦丁博克罗金矿储量50吨+，年产量4-6吨，品位1.2-2.5克/吨",
    imageUrl: "/assets_6.jpg", // 替换为实际图片路径
    large: false,
  },
  {
    tag: "金矿",
    title: "肯尼亚 #03",
    description: "肯尼亚金矿储量30吨+，年产量1-2吨，品位0.8-2克/吨。",
    imageUrl: "/assets_7.jpg", // 替换为实际图片路径
    large: false,
  },
  {
    tag: "金矿",
    title: "塔吉克斯坦 #04",
    description: "塔吉克斯坦金矿储量500吨+，年产量6-8吨，品位1.5-4克/吨。",
    imageUrl: "/assets_8.jpg", // 替换为实际图片路径
    large: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
    <div className="max-w-6xl mx-auto">
      {/* <IdlViewer programId="91N4aCumtu3x4E4SgqS8cKfKXk3LdHuHqN5xZ1qnunkV" /> */}
      <MiningPlatformHero />
      {/* 我的金矿 Section */}
      {/* <div className="mb-12 mt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">我的金矿</h2>
          <SolanaConnectButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goldMineItems.map((item, index) => (
            <CaseStudyCard key={`gold-${index}`} {...item} />
          ))}
        </div>
      </div> */}
      <div className="mt-8">
      <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">金矿市场</h2>
          <Link href="/market" className="text-sm border border-gray-600 rounded-full px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white transition-colors flex items-center gap-2">
            前往金矿市场 <span aria-hidden="true">→</span>
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

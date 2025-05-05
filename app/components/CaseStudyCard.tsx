/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 18:57:17
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-05 19:03:56
 * @FilePath: /24k-finance-website/app/components/CaseStudyCard.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'; // 导入 React 以便使用 FC

// 定义 Props 接口
interface CaseStudyCardProps {
  tag: string;
  title: string;
  description: string;
  imageUrl: string; // 假设 imageUrl 是一个字符串路径或 URL
  large: boolean;
}

// 使用接口更新组件签名
const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ tag, title, description, imageUrl, large }) => (
    <div
      className={`relative rounded-xl overflow-hidden p-6 flex flex-col justify-between text-white bg-gradient-to-br from-[#1a1a2e] to-[#161625] shadow-lg ${
        large ? "lg:col-span-2 min-h-[250px]" : "min-h-[200px]" // 调整 large 样式应用逻辑，确保它只影响布局相关的类
      } hover:shadow-purple-500/30 transition-shadow duration-300`}
      style={{
        // 可以用背景图片代替渐变色
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 模拟背景视觉效果 - 可以替换为真实图片 */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-tr from-purple-600 via-teal-500 to-indigo-600 blur-3xl"></div>

      <div className="relative z-10">
        <span className="inline-block bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
          {tag}
        </span>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
      <div className="relative z-10 self-end mt-4">
        <button className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center text-gray-300 hover:bg-white/10 hover:border-white transition-colors">
          →
        </button>
      </div>
    </div>
  );

export default CaseStudyCard; // 导出组件
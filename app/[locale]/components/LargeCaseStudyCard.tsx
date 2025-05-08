/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-08 17:44:20
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-08 17:44:38
 * @FilePath: /24k-finance-website/app/[locale]/components/LargeCaseStudyCard.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// LargeCaseStudyCard.tsx
import Image from "next/image";

export default function LargeCaseStudyCard({ tag, title, description }: { tag: string, title: string, description: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl h-full min-h-[300px] group">
      <div className="absolute inset-0 z-0">
        <Image
          src="/mining-excavator.webp"
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ 
            objectPosition: "center",
            filter: "hue-rotate(180deg) saturate(1.5)" // 添加特效
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
      </div>
      
      <div className="relative z-10 p-6 flex flex-col h-full justify-end">
        <span className="text-xs font-medium bg-white/20 text-white px-2 py-1 rounded-full w-fit mb-4">
          {tag}
        </span>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
}
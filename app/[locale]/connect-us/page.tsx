"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

// 团队成员数据
const teamMembers = [
  {
    id: 1,
    name: "Ben Huang",
    title: "总裁 (创始合伙人)",
    photo: "/team/ben-huang.jpg", // 请确保图片路径正确
    bio: "一个充满激情的企业家，拥有10年的创业经验。专注于区块链和金融科技领域，致力于将创新技术应用于实际业务。曾在多家知名科技公司担任高管职位，带领团队成功开发了多个具有影响力的产品。相信技术的力量可以改变金融世界。"
  },
  {
    id: 2,
    name: "David Chen",
    title: "技术总监",
    photo: "/team/david-chen.jpg", // 请确保图片路径正确
    bio: "资深技术专家，拥有丰富的区块链开发经验。曾参与多个大型区块链项目的架构设计和实现。精通Solana、Ethereum等主流区块链技术，对智能合约和去中心化应用有深入研究。"
  },
  {
    id: 3,
    name: "Sarah Li",
    title: "市场总监",
    photo: "/team/sarah-li.jpg", // 请确保图片路径正确
    bio: "市场营销专家，拥有超过8年的数字营销和品牌建设经验。曾在多家知名科技公司负责市场策略制定和执行，擅长社区建设和用户增长。对加密货币市场有独到见解。"
  }
];

export default function CompanyPage() {
  const [activeTeamMember, setActiveTeamMember] = useState(1);

  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-8 sm:p-16">
      <div className="max-w-6xl mx-auto">
        {/* 公司介绍部分 */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-12 text-center">公司</h1>
            
            <div className="space-y-6 text-gray-300">
              <p className="leading-relaxed">
                24K金融是一家创新型区块链金融科技公司，致力于将传统金融与区块链技术相结合，为用户提供安全、透明、高效的数字资产管理服务。我们的使命是通过区块链技术重塑金融基础设施，让金融服务更加普惠、便捷和高效。
              </p>
              
              <p className="leading-relaxed">
                作为区块链领域的先行者，我们拥有一支由金融专家和技术精英组成的专业团队。团队成员来自全球顶尖金融机构和科技公司，拥有丰富的行业经验和深厚的技术积累。我们相信，只有将金融专业知识与前沿技术相结合，才能真正实现金融创新。
              </p>
              
              <p className="leading-relaxed">
                我们的核心业务包括数字资产挖矿、质押和交易服务。通过自主研发的智能合约和风险控制系统，我们为用户提供全方位的数字资产增值解决方案。我们特别关注用户体验和安全性，所有产品都经过严格的安全审计和测试，确保用户资产的安全。
              </p>
              
              <p className="leading-relaxed">
                24K金融秉持"开放、透明、创新"的价值观，积极拥抱监管，合规经营。我们相信，只有在合规的框架下，区块链金融才能健康可持续发展。我们致力于与监管机构、行业伙伴和用户共同构建一个更加开放、包容的金融生态系统。
              </p>
              
              <p className="leading-relaxed">
                展望未来，我们将继续探索区块链技术在金融领域的创新应用，不断优化产品和服务，为用户创造更大的价值。我们坚信，区块链技术将重塑金融的未来，而24K金融将成为这一变革的重要推动者。
              </p>
            </div>
          </motion.div>
        </section>

        {/* 团队介绍部分 */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-center">团队</h2>
            <p className="text-center text-gray-400 mb-16">我们由来自全球的精英组成专业团队。</p>

            {/* 团队成员展示 - 大图 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="md:col-span-1 flex flex-col justify-center space-y-6">
                <h3 className="text-2xl font-bold">{teamMembers[activeTeamMember - 1].name}</h3>
                <p className="text-gray-400">{teamMembers[activeTeamMember - 1].title}</p>
                <p className="text-gray-300 leading-relaxed">
                  {teamMembers[activeTeamMember - 1].bio}
                </p>
              </div>
              <div className="md:col-span-1 flex justify-center">
                <div className="relative w-full max-w-md aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={teamMembers[activeTeamMember - 1].photo}
                    alt={teamMembers[activeTeamMember - 1].name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* 团队成员缩略图 */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {teamMembers.map((member) => (
                <div 
                  key={member.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeTeamMember === member.id 
                      ? "opacity-100 scale-105" 
                      : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setActiveTeamMember(member.id)}
                >
                  <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 联系我们部分 */}
        <section className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-900/50 p-8 rounded-xl border border-gray-800"
          >
            <h2 className="text-2xl font-bold mb-6">联系我们</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-300 mb-4">如果您有任何问题或建议，欢迎随时联系我们。我们的团队将竭诚为您服务。</p>
                <ul className="space-y-3 text-gray-400">
                  <li>邮箱: contact@24k-finance.com</li>
                  <li>电话: +86 123 4567 8910</li>
                  <li>地址: 中国上海市浦东新区张江高科技园区</li>
                </ul>
              </div>
              <div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      您的姓名
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      电子邮箱
                    </label>
                    <input
                      type="email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="请输入您的电子邮箱"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      留言内容
                    </label>
                    <textarea
                      rows={4}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="请输入您的留言内容"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium"
                  >
                    提交留言
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
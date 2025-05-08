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
    titleKey: "team.members.0.title",
    photo: "/avatar_0.jpg", // 请确保图片路径正确
    bioKey: "team.members.0.bio"
  },
  {
    id: 2,
    name: "David Chen",
    titleKey: "team.members.1.title",
    photo: "/avatar_1.png", // 请确保图片路径正确
    bioKey: "team.members.1.bio"
  },
  {
    id: 3,
    name: "Sarah Li",
    titleKey: "team.members.2.title",
    photo: "/avatar_2.jpg", // 请确保图片路径正确
    bioKey: "team.members.2.bio"
  }
];

export default function CompanyPage() {
  const [activeTeamMember, setActiveTeamMember] = useState(1);
  const t = useTranslations('connect-us');

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
            <h1 className="text-4xl font-bold mb-12 text-center">{t('company.title')}</h1>
            
            <div className="space-y-6 text-gray-300">
              <p className="leading-relaxed">
                {t('company.description.paragraph1')}
              </p>
              
              <p className="leading-relaxed">
                {t('company.description.paragraph2')}
              </p>
              
              <p className="leading-relaxed">
                {t('company.description.paragraph3')}
              </p>
              
              <p className="leading-relaxed">
                {t('company.description.paragraph4')}
              </p>
              
              <p className="leading-relaxed">
                {t('company.description.paragraph5')}
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
            <h2 className="text-4xl font-bold mb-12 text-center">{t('team.title')}</h2>
            <p className="text-center text-gray-400 mb-16">{t('team.subtitle')}</p>

            {/* 团队成员展示 - 大图 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="md:col-span-1 flex flex-col justify-center space-y-6">
                <h3 className="text-2xl font-bold">{t(`team.members.${activeTeamMember - 1}.name`)}</h3>
                <p className="text-gray-400">{t(`team.members.${activeTeamMember - 1}.title`)}</p>
                <p className="text-gray-300 leading-relaxed">
                  {t(`team.members.${activeTeamMember - 1}.bio`)}
                </p>
              </div>
              <div className="md:col-span-1 flex justify-center">
                <div className="relative w-full max-w-md aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={teamMembers[activeTeamMember - 1].photo}
                    alt={t(`team.members.${activeTeamMember - 1}.name`)}
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
                      alt={t(`team.members.${member.id - 1}.name`)}
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
            <h2 className="text-2xl font-bold mb-6">{t('contact.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-300 mb-4">{t('contact.description')}</p>
                <ul className="space-y-3 text-gray-400">
                  <li>{t('contact.info.email')}</li>
                  <li>{t('contact.info.phone')}</li>
                  <li>{t('contact.info.address')}</li>
                </ul>
              </div>
              <div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      {t('contact.form.nameLabel')}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      {t('contact.form.emailLabel')}
                    </label>
                    <input
                      type="email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      {t('contact.form.messageLabel')}
                    </label>
                    <textarea
                      rows={4}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                      placeholder={t('contact.form.messagePlaceholder')}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium"
                  >
                    {t('contact.form.submitButton')}
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
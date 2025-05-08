/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-08 09:35:56
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-08 09:36:27
 * @FilePath: /24k-finance-website/app/[locale]/components/MarketStatsCards.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl'; // 导入 useTranslations

interface MarketStatsCardsProps {
    // 这些应该是从API获取或计算得出的动态数据
    availableMachinesCount: number;
    averageRoiMonths: number;
    machineTypesCount: number;
  }

export const MarketStatsCards: React.FC<MarketStatsCardsProps> = ({
    availableMachinesCount,
    averageRoiMonths,
    machineTypesCount,
  }) => {
    const t = useTranslations('marketPage.stats');
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div
          className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-xl border border-purple-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-gray-400 mb-2">{t('availableMachinesLabel')}</h3>
          <p className="text-3xl font-bold">{t('availableMachinesCount', { count: availableMachinesCount })}</p>
        </motion.div>
  
        <motion.div
          className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-xl border border-blue-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-gray-400 mb-2">{t('avgRoiPeriodLabel')}</h3>
          <p className="text-3xl font-bold">{t('avgRoiPeriodValue', { period: averageRoiMonths })}</p>
        </motion.div>
  
        <motion.div
          className="bg-gradient-to-br from-cyan-900/50 to-green-900/50 p-6 rounded-xl border border-cyan-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-gray-400 mb-2">{t('machineTypesLabel')}</h3>
          <p className="text-3xl font-bold">{t('machineTypesCount', { count: machineTypesCount })}</p>
        </motion.div>
      </div>
    );
  };
  
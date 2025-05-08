/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-08 09:33:12
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-08 09:35:27
 * @FilePath: /24k-finance-website/app/[locale]/components/MiningMachineCard.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl'; // 导入 useTranslations

interface MiningMachine {
    id: number;
    nameKey: string;
    image: string;
    price: string;
    hashRate: string;
    powerConsumption: string;
    dailyReturnKey: string;
    roiKey: string;
    available: number;
    total: number;
    type: string;
  }

  
// 矿机卡片组件 Props
interface MiningMachineCardProps {
    machine: MiningMachine;
    onPurchase: (machineId: number) => void;
    isConnected: boolean;
  }
  
  const MiningMachineCard: React.FC<MiningMachineCardProps> = ({
    machine,
    onPurchase,
    isConnected,
  }) => {
    const t = useTranslations('marketPage.card');
    const tMachineNames = useTranslations('marketPage.machineNames');
    const tMachineDetails = useTranslations('marketPage.machineDetails');
  
    return (
      <motion.div
        key={machine.id}
        className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-800/50 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-48 bg-gray-800 relative">
          <Image
            src={machine.image}
            alt={tMachineNames(machine.nameKey)}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{tMachineNames(machine.nameKey)}</h3>
            <span className="text-xl font-bold text-purple-400">{machine.price}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-400 text-sm">{t('hashRateLabel')}</p>
              <p className="font-medium">{machine.hashRate}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t('powerConsumptionLabel')}</p>
              <p className="font-medium">{machine.powerConsumption}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t('dailyReturnLabel')}</p>
              <p className="font-medium text-green-400">{tMachineDetails(machine.dailyReturnKey)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t('roiLabel')}</p>
              <p className="font-medium">{tMachineDetails(machine.roiKey)}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {t('stockLabel')}: <span className="text-white">{machine.available}</span>/{machine.total}
            </div>
            <button
              onClick={() => onPurchase(machine.id)}
              disabled={!isConnected || machine.available === 0}
              className={`px-4 py-2 rounded-lg font-medium ${
                isConnected && machine.available > 0
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {machine.available > 0 ? t('purchaseButtonLabel') : t('soldOutButtonLabel')}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  
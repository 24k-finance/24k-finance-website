"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const SolanaConnectButton = dynamic(
    () => import('../components/SolanaConnectButton').then((mod) => mod.SolanaConnectButton),
    {
      ssr: false, // 关键：禁用服务器端渲染
      loading: () => <p></p> // 可选：添加加载状态指示器
    }
);

// 模拟矿机数据
const miningMachines = [
  {
    id: 1,
    name: "库雷马莱",
    image: "/assets_5.png", // 确保有此图片
    price: "5,000,000 USD",
    hashRate: "2 g/t",
    powerConsumption: "40 Tonnes",
    dailyReturn: "20%",
    roi: "预计12个月",
    available: 150000,
    total: 5000000,
    type: "btc",
  },
  {
    id: 2,
    name: "科特迪瓦",
    image: "/assets_6.jpg", // 确保有此图片
    price: "3,000,000 USD",
    hashRate: "3 g/t",
    ppowerConsumption: "40 Tonnes",
    dailyReturn: "20%",
    roi: "预计14个月",
    available: 800,
    total: 3000000,
    type: "eth",
  },
  {
    id: 3,
    name: "肯尼亚",
    image: "/assets_7.jpg", // 确保有此图片
    price: "2,500,000 USD",
    hashRate: "3 g/t",
    ppowerConsumption: "50 Tonnes",
    dailyReturn: "20%",
    roi: "预计10个月",
    available: 2000000,
    total: 4000000,
    type: "sol",
  },
  {
    id: 4,
    name: "塔吉克斯坦",
    image: "/assets_8.jpg", // 确保有此图片
    price: "2,800,000 USD",
    hashRate: "3 g/t",
    ppowerConsumption: "50 Tonnes",
    dailyReturn: "30%",
    roi: "预计13个月",
    available: 2500000,
    total: 5000000,
    type: "other",
  },
];

export default function MarketIndex() {
  const t = useTranslations('market'); // 添加这一行
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedMachine, setSelectedMachine] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const { connected } = useWallet();

  // 处理购买操作
  const handlePurchase = (machineId: number) => {
    if (!connected) {
      alert(t('alerts.connectWalletFirst'));
      return;
    }
    setSelectedMachine(machineId);
    setQuantity(1);
  };

  // 确认购买
  const confirmPurchase = () => {
    if (!connected) {
      alert(t('alerts.connectWalletFirst'));
      return;
    }
    
    // 这里可以添加购买逻辑
    const machine = miningMachines.find(m => m.id === selectedMachine);
    console.log(`购买 ${quantity} 台 ${machine?.name}`);
    
    // 购买成功后重置状态
    setSelectedMachine(null);
    setQuantity(1);
    
    // 显示成功消息
    alert(t('alerts.purchaseSuccess'));
  };

  // 过滤矿机
  const filteredMachines = activeFilter === "all" 
    ? miningMachines 
    : miningMachines.filter(machine => machine.type === activeFilter);

  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-8 sm:p-16">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题和连接钱包按钮 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('pageTitle')}</h1>
            <p className="text-gray-400">{t('pageSubtitle')}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <SolanaConnectButton />
          </div>
        </div>

        {/* 市场统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div 
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-xl border border-purple-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-gray-400 mb-2">{t('stats.availableMachinesLabel')}</h3>
            <p className="text-3xl font-bold">{t('stats.availableMachinesCount')}</p>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-xl border border-blue-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-gray-400 mb-2">{t('stats.avgRoiPeriodLabel')}</h3>
            <p className="text-3xl font-bold">{t('stats.avgRoiPeriodValue')}</p>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-cyan-900/50 to-green-900/50 p-6 rounded-xl border border-cyan-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-gray-400 mb-2">{t('stats.machineTypesLabel')}</h3>
            <p className="text-3xl font-bold">{t('stats.machineTypesCount')}</p>
          </motion.div>
        </div>

        {/* 过滤器 */}
        <div className="flex flex-wrap border-b border-gray-800 mb-6 gap-2">
          <button
            className={`py-2 px-4 font-medium cursor-pointer ${
              activeFilter === "all"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            {t('filters.all')}
          </button>
          <button
            className={`py-2 px-4 font-medium cursor-pointer ${
              activeFilter === "btc"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("btc")}
          >
            {t('filters.mali')}
          </button>
          <button
            className={`py-2 px-4 font-medium cursor-pointer ${
              activeFilter === "eth"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("eth")}
          >
            {t('filters.cotedivoire')}
          </button>
          <button
            className={`py-2 px-4 font-medium cursor-pointer ${
              activeFilter === "sol"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("sol")}
          >
            {t('filters.kenya')}
          </button>
          <button
            className={`py-2 px-4 font-medium cursor-pointer ${
              activeFilter === "other"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("other")}
          >
            {t('filters.tajikistan')}
          </button>
        </div>

        {/* 矿机列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredMachines.map((machine) => (
            <motion.div
              key={machine.id}
              className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-800/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* 矿机图片 */}
              <div className="h-48 bg-gray-800 relative">
                {machine.image ? (
                  <Image
                    src={machine.image}
                    alt={machine.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-600">
                    {machine.name.charAt(0)}
                  </div>
                )}
              </div>
              
              {/* 矿机信息 */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{machine.name}</h3>
                  <span className="text-xl font-bold text-purple-400">{machine.price}</span>
                </div>
                
                {/* 矿机规格 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm">{t('machineCard.gradeLabel')}</p>
                    <p className="font-medium">{machine.hashRate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{t('machineCard.reservesLabel')}</p>
                    <p className="font-medium">{machine.powerConsumption}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{t('machineCard.annualReturnLabel')}</p>
                    <p className="font-medium text-green-400">{machine.dailyReturn}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{t('machineCard.stakingPeriodLabel')}</p>
                    <p className="font-medium">{machine.roi}</p>
                  </div>
                </div>
                
                {/* 库存和购买按钮 */}
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    {t('machineCard.remainingQuotaLabel')}: <span className="text-white">{machine.available}</span>/{machine.total}
                  </div>
                  <button
                    onClick={() => handlePurchase(machine.id)}
                    disabled={!connected || machine.available === 0}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      connected && machine.available > 0
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {machine.available > 0 ? t('machineCard.stakeButton') : t('machineCard.soldOutButton')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 购买表单 - 仅在选中时显示 */}
        {selectedMachine !== null && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedMachine(null)}
          >
            <motion.div 
              className="bg-gray-900 rounded-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">
                {t('purchaseModal.buyTitle')} {miningMachines.find(m => m.id === selectedMachine)?.name}
              </h3>
              
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">{t('purchaseModal.quantityLabel')}</label>
                <div className="flex items-center">
                  <button 
                    className="bg-gray-800 px-3 py-1 rounded-l-lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="bg-gray-800 text-center w-16 py-1 border-x border-gray-700"
                  />
                  <button 
                    className="bg-gray-800 px-3 py-1 rounded-r-lg"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">{t('purchaseModal.unitPriceLabel')}:</span>
                  <span>{miningMachines.find(m => m.id === selectedMachine)?.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">{t('purchaseModal.quantityCountLabel')}:</span>
                  <span>{quantity} 台</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>{t('purchaseModal.totalPriceLabel')}:</span>
                  <span className="text-purple-400">
                    {parseInt(miningMachines.find(m => m.id === selectedMachine)?.price.replace(/,/g, '').split(' ')[0] || "0") * quantity} USDT
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={confirmPurchase}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg font-medium"
                >
                  {t('purchaseModal.confirmStakeButton')}
                </button>
                <button
                  onClick={() => setSelectedMachine(null)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium"
                >
                  {t('purchaseModal.cancelButton')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 底部说明 */}
        <div className="mt-10 bg-gray-900/30 p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold mb-3">{t('footer.title')}</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            {JSON.parse(t('footer.items')).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
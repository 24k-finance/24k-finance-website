"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useFetchMineApplications } from "../hooks/useFetchMineApplications";

const SolanaConnectButton = dynamic(
  () => import('../components/SolanaConnectButton').then((mod) => mod.SolanaConnectButton),
  {
    ssr: false, // 关键：禁用服务器端渲染
    loading: () => <p>...</p> // 可选：添加加载状态指示器
  }
);

export default function StakingIndex() {
  const t = useTranslations('staking');
  const [activeTab, setActiveTab] = useState("active");
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const { connected, publicKey } = useWallet();
  const { applications, loading: appsLoading } = useFetchMineApplications();

  // 模拟质押数据
  const [stakingPools, setStakingPools] = useState([
    {
      id: 1,
      name: t('pools.0.name'),
      icon: "/assets_5.png", // 确保有此图标
      apr: "12.5%",
      totalStaked: "5,000,000 USDT",
      yourStake: "5,000 USDT",
      rewards: "625 USDT",
      duration: t('pools.0.duration'),
      status: t('pools.0.status'),
      auditResult: true, // 默认值，将根据应用程序数据更新
    },
    {
      id: 2,
      name: t('pools.1.name'),
      icon: "/assets_6.jpg", // 确保有此图标
      apr: "10.2%",
      totalStaked: "980,000 USDT",
      yourStake: "2,500 USDT",
      rewards: "255 USDT",
      duration: t('pools.1.duration'),
      status: t('pools.1.status'),
      auditResult: true, // 默认值，将根据应用程序数据更新
    },
    {
      id: 3,
      name: t('pools.2.name'),
      icon: "/assets_7.jpg", // 确保有此图标
      apr: "15.8%",
      totalStaked: "750,000 USDT",
      yourStake: "0 USDT",
      rewards: "0 USDT",
      duration: t('pools.2.duration'),
      status: t('pools.2.status'),
      auditResult: false, // 默认值，将根据应用程序数据更新
    },
    {
      id: 4,
      name: t('pools.3.name'),
      icon: "/assets_8.jpg", // 确保有此图标
      apr: "15.8%",
      totalStaked: "750,000 USDT",
      yourStake: "0 USDT",
      rewards: "0 USDT",
      duration: t('pools.3.duration'),
      status: t('pools.3.status'),
      auditResult: false, // 默认值，将根据应用程序数据更新
    },
  ]);

  // 模拟历史记录数据
  const [stakingHistory, setStakingHistory] = useState([
    {
      id: 1,
      poolName: "Mali Kouremale",
      action: t('stakeAction'),
      amount: "5,000 USDT",
      time: "2023-10-15 14:30",
    },
    {
      id: 2,
      poolName: "Côte d'Ivoire Dimbokro",
      action: t('stakeAction'),
      amount: "2,500 USDT",
      time: "2023-10-10 09:15",
    },
    {
      id: 3,
      poolName: "Mali Kouremale",
      action: t('harvestAction'),
      amount: "312.5 USDT",
      time: "2023-11-15 16:45",
    },
  ]);

  // 根据应用程序数据更新质押池的 auditResult
  useEffect(() => {
    if (applications && applications.length > 0) {
      console.log("应用程序数据：", applications);
      const updatedPools = stakingPools.map((pool, index) => {
        // 假设应用程序数据和池按顺序对应，或者使用其他匹配逻辑
        if (index < applications.length) {
          return {
            ...pool,
            auditResult: applications[index].account.auditResult,
            status: applications[index].account.auditResult ? t('statusActive') : t('statusComing')
          };
        }
        return pool;
      });
      console.log("更新后的质押池：", updatedPools);
      setStakingPools(updatedPools);
    }
  }, [applications, t]);

  // 处理质押操作
  const handleStake = (poolId: number) => {
    if (!connected) {
      alert(t('connectWalletAlert'));
      return;
    }
    
    // 查找对应的池
    const pool = stakingPools.find(p => p.id === poolId);
    
    // 检查池是否存在且 auditResult 为 true
    if (!pool || !pool.auditResult) {
      alert(t('poolNotAvailable'));
      return;
    }
    
    setSelectedPool(poolId);
    console.log(t('consoleMessages.stakeToPool', { poolId, amount: stakeAmount }));
  };

  // 处理提取操作
  const handleWithdraw = (poolId: number) => {
    if (!connected) {
      alert(t('connectWalletAlert'));
      return;
    }
    console.log(t('consoleMessages.withdrawFromPool', { poolId }));
  };

  // 处理收获奖励操作
  const handleHarvest = (poolId: number) => {
    if (!connected) {
      alert(t('connectWalletAlert'));
      return;
    }
    console.log(t('consoleMessages.harvestFromPool', { poolId }));
  };

  // 处理质押表单提交
  const handleStakeSubmit = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      return;
    }
  
    
    // 重置表单
    setStakeAmount("");
    setSelectedPool(null);
  };

  // 处理取消质押
  const handleStakeCancel = () => {
    setStakeAmount("");
    setSelectedPool(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-8 sm:p-16">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题和连接钱包按钮 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
            <p className="text-gray-400">{t('subtitle')}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <SolanaConnectButton />
          </div>
        </div>

        {/* 质押统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 p-6 rounded-xl border border-purple-800/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-gray-400 mb-2">{t('totalStaked')}</h3>
            <p className="text-2xl font-bold">6,750,000 USDT</p>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 p-6 rounded-xl border border-blue-800/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-gray-400 mb-2">{t('totalRewards')}</h3>
            <p className="text-2xl font-bold">880 USDT</p>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-green-900/30 to-green-800/10 p-6 rounded-xl border border-green-800/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-gray-400 mb-2">{t('activePools')}</h3>
            <p className="text-2xl font-bold">2</p>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-amber-900/30 to-amber-800/10 p-6 rounded-xl border border-amber-800/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h3 className="text-gray-400 mb-2">{t('activeStaking')}</h3>
            <p className="text-2xl font-bold">{connected ? "2" : "0"}</p>
          </motion.div>
        </div>

        {/* 标签切换 */}
        <div className="flex border-b border-gray-800 mb-8">
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === "active"
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("active")}
          >
            {t('activeStaking')}
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === "history"
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("history")}
          >
            {t('history')}
          </button>
        </div>

        {/* 质押池列表 */}
        {activeTab === "active" && (
          <div className="space-y-6">
            {stakingPools.map((pool) => (
              <motion.div
                key={pool.id}
                className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-800/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    {/* 池信息 */}
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                        <Image
                          src={pool.icon}
                          alt={pool.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{pool.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-green-400 font-medium mr-4">APR: {pool.apr}</span>
                          <span className="text-gray-400 text-sm">{pool.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* 质押状态 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">{t('totalPoolStaked')}</p>
                        <p className="font-medium">{pool.totalStaked}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">{t('yourStake')}</p>
                        <p className="font-medium">{connected ? pool.yourStake : "-- USDT"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">{t('pendingRewards')}</p>
                        <p className="font-medium text-green-400">{connected ? pool.rewards : "-- USDT"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">{t('status')}</p>
                        <p className={`font-medium ${pool.auditResult ? "text-green-400" : "text-yellow-400"}`}>
                          {pool.auditResult ? t('statusActive') : t('statusComing')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleStake(pool.id)}
                      disabled={!pool.auditResult || !connected}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pool.auditResult && connected
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {pool.auditResult ? t('stake') : t('statusComing')}
                    </button>
                    <button
                      onClick={() => handleWithdraw(pool.id)}
                      disabled={pool.yourStake === "0 USDT" || !connected || !pool.auditResult}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pool.yourStake !== "0 USDT" && connected && pool.auditResult
                          ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                          : "bg-gray-800 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {t('withdraw')}
                    </button>
                    <button
                      onClick={() => handleHarvest(pool.id)}
                      disabled={pool.rewards === "0 USDT" || !connected || !pool.auditResult}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pool.rewards !== "0 USDT" && connected && pool.auditResult
                          ? "bg-green-900/50 hover:bg-green-800 text-green-400 border border-green-800/50"
                          : "bg-gray-800 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {t('harvest')}
                    </button>
                  </div>
                </div>

                {/* 质押表单 - 仅在选中时显示 */}
                {selectedPool === pool.id && (
                  <div className="bg-gray-800/50 p-6 border-t border-gray-700">
                    <h4 className="font-medium mb-4">{t('stakeTo')} {pool.name}</h4>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-grow">
                        <input
                          type="number"
                          placeholder={t('enterStakeAmount')}
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleStakeSubmit}
                          disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            stakeAmount && parseFloat(stakeAmount) > 0
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "bg-gray-700 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {t('confirm')}
                        </button>
                        <button
                          onClick={handleStakeCancel}
                          className="px-4 py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-600"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-4">
                      {t('estimatedAnnualReturn')}: {stakeAmount ? (parseFloat(stakeAmount) * parseFloat(pool.apr.replace('%', '')) / 100).toFixed(2) : '0'} USDT
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* 历史记录标签内容 */}
        {activeTab === "history" && (
          <div>
            {!connected ? (
              <div className="text-center py-12">
                <p className="text-gray-400">{t('connectWalletToViewHistory')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 font-medium text-gray-400">{t('poolName')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">{t('action')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">{t('amount')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">{t('time')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stakingHistory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-900/30">
                        <td className="py-4 px-4">{item.poolName}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              item.action === t('stakeAction')
                                ? "bg-purple-900/30 text-purple-400"
                                : "bg-green-900/30 text-green-400"
                            }`}
                          >
                            {item.action}
                          </span>
                        </td>
                        <td className="py-4 px-4">{item.amount}</td>
                        <td className="py-4 px-4 text-gray-400">{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-12 bg-gray-900/30 p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold mb-4">{t('stakingNotes')}</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">•</span>
              {t('stakingNote1')}
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">•</span>
              {t('stakingNote2')}
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">•</span>
              {t('stakingNote3')}
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">•</span>
              {t('stakingNote4')}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
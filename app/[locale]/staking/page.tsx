"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useFetchMineApplications } from "../hooks/useFetchMineApplications";
import { useStake } from "../hooks/useStake";
import { USDT_MINT } from "../constant";
import BN from "bn.js";
import { toast } from "react-hot-toast";

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
  const [stakingPools, setStakingPools] = useState<any[]>([]);
  const { stake, loading: stakeLoading, error: stakeError } = useStake();

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

  // 根据应用程序数据更新质押池
  useEffect(() => {
    if (applications && applications.length > 0) {
      console.log("应用程序数据：", applications);
      
      // 将应用程序数据转换为质押池数据
      const pools = applications.map((app, index) => {
        const account = app.account;
        // 计算每个池的质押总额（示例值）
        const totalStaked = (1000000 + index * 500000).toLocaleString() + " " + account.currency;
        // 计算用户质押额（示例值）
        const yourStake = connected ? ((index === 0 || index === 1) ? (5000 - index * 2500).toLocaleString() : "0") + " " + account.currency : "-- " + account.currency;
        // 计算奖励（示例值）
        const rewards = connected ? ((index === 0 || index === 1) ? (625 - index * 370).toLocaleString() : "0") + " " + account.currency : "-- " + account.currency;
        
        return {
          publicKey: app.publicKey,
          id: index + 1,
          mineCode: account.mineCode,
          name: account.name,
          operator: account.operator,
          relationship: account.relationship,
          approval1: account.approval1,
          approval2: account.approval2,
          approval3: account.approval3,
          scale: account.scale,
          location: account.location,
          currency: account.currency,
          financeScale: account.financeScale,
          startDate: account.startDate,
          endDate: account.endDate,
          signDate: account.signDate,
          rate: account.rate,
          frozenMonth: account.frozenMonth,
          auditResult: account.auditResult,
          isSigned: account.isSigned,
          owner: account.owner,
          // 质押池特定属性
          apr: (account.rate / 10000).toFixed(1) + "%",
          totalStaked: totalStaked,
          yourStake: yourStake,
          rewards: rewards,
          duration: account.frozenMonth + " " + t('months'),
          status: account.auditResult ? t('statusActive') : t('statusComing'),
        };
      });
      setStakingPools(pools);
    }
  }, [applications, connected, t]);

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
    const handleStakeSubmit = async () => {
      if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
        return;
      }
  
      const pool = stakingPools.find((p) => p.id === selectedPool);
      if (!pool) {
        toast.error(t('poolNotFound'));
        return;
      }

      console.log("质押结果:", pool);
      
      try {
        // 将输入的金额转换为最小单位 (假设 USDC/USDT 有 6 位小数)
        const amountInSmallestUnit = new BN(parseFloat(stakeAmount) * 1000000);
        
        // 创建质押参数
        const stakeParams = {
          amount: amountInSmallestUnit,
          stableCoin: 'USDT',
          txnHash: ""  // 可以留空，或者在交易后更新
        };
        
        // 这里需要用户的代币账户和池子的金库地址
        // 在实际应用中，您需要获取这些地址
        // 以下是示例代码，您需要根据实际情况修改
         // 获取用户的代币账户
         const userTokenAccount = await getAssociatedTokenAddress(
          USDT_MINT, // 代币的铸币地址
          publicKey! // 用户的钱包地址
        );
        
        
        // 调用质押函数
        const result = await stake(
          pool.mineCode,
          stakeParams,
          userTokenAccount,
          USDT_MINT
        );

        
        
        if (result) {
          toast.success(t('success'));
          console.log("质押交易签名:", result.txSignature);
          
          // 重置表单
          setStakeAmount("");
          setSelectedPool(null);
          
          // 可以在这里刷新用户的质押数据
          // 例如重新获取矿池数据或用户质押记录
        }
      } catch (error) {
        console.error("质押失败:", error);
        toast.error(error instanceof Error ? error.message : String(error));
      }
    };

  // 处理取消质押
  const handleStakeCancel = () => {
    setStakeAmount("");
    setSelectedPool(null);
  };

  // 计算活跃池数量
  const activePools = stakingPools.filter(pool => pool.auditResult).length;
  
  // 计算用户活跃质押数量
  const activeStakings = connected ? stakingPools.filter(pool => 
    pool.auditResult && pool.yourStake && !pool.yourStake.startsWith("0") && !pool.yourStake.startsWith("--")
  ).length : 0;
  
  // 计算总质押金额（示例）
  const totalStaked = stakingPools.reduce((sum, pool) => {
    const amount = pool.totalStaked ? parseFloat(pool.totalStaked.replace(/[^0-9.]/g, '')) : 0;
    return sum + amount;
  }, 0).toLocaleString();
  
  // 计算总奖励（示例）
  const totalRewards = connected ? stakingPools.reduce((sum, pool) => {
    const amount = pool.rewards && !pool.rewards.startsWith("--") ? parseFloat(pool.rewards.replace(/[^0-9.]/g, '')) : 0;
    return sum + amount;
  }, 0).toLocaleString() : "0";

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
            <p className="text-2xl font-bold">{totalStaked} {stakingPools[0]?.currency || 'USDT'}</p>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 p-6 rounded-xl border border-blue-800/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-gray-400 mb-2">{t('totalRewards')}</h3>
            <p className="text-2xl font-bold">{totalRewards} {stakingPools[0]?.currency || 'USDT'}</p>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-green-900/30 to-green-800/10 p-6 rounded-xl border border-green-800/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-gray-400 mb-2">{t('activePools')}</h3>
            <p className="text-2xl font-bold">{activePools}</p>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-amber-900/30 to-amber-800/10 p-6 rounded-xl border border-amber-800/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h3 className="text-gray-400 mb-2">{t('activeStaking')}</h3>
            <p className="text-2xl font-bold">{activeStakings}</p>
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

        {/* 加载中状态 */}
        {appsLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* 质押池列表 */}
        {activeTab === "active" && !appsLoading && (
          <div className="space-y-6">
            {stakingPools.length === 0 ? (
              <div className="bg-gray-800/50 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-2xl font-bold mb-2">{t('noPoolsAvailable')}</h2>
                {/* <p className="text-gray-400 mb-6">{t('checkBackLater')}</p> */}
              </div>
            ) : (
              stakingPools.map((pool) => (
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
                          {pool.approval1 ? (
                            <Image
                              src={pool.approval1}
                              alt={pool.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700/50 rounded-lg flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
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
                          <p className="font-medium">{connected ? pool.yourStake : `-- ${pool.currency}`}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">{t('pendingRewards')}</p>
                          <p className="font-medium text-green-400">{connected ? pool.rewards : `-- ${pool.currency}`}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">{t('status')}</p>
                          <p className={`font-medium ${pool.auditResult ? "text-green-400" : "text-yellow-400"}`}>
                            {pool.status}
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
                        disabled={!pool.yourStake || pool.yourStake.startsWith("0") || pool.yourStake.startsWith("--") || !connected || !pool.auditResult}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          pool.yourStake && !pool.yourStake.startsWith("0") && !pool.yourStake.startsWith("--") && connected && pool.auditResult
                            ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                            : "bg-gray-800 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {t('withdraw')}
                      </button>
                      <button
                        onClick={() => handleHarvest(pool.id)}
                        disabled={!pool.rewards || pool.rewards.startsWith("0") || pool.rewards.startsWith("--") || !connected || !pool.auditResult}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          pool.rewards && !pool.rewards.startsWith("0") && !pool.rewards.startsWith("--") && connected && pool.auditResult
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
                        {t('estimatedAnnualReturn')}: {stakeAmount ? (parseFloat(stakeAmount) * parseFloat(pool.apr.replace('%', '')) / 100).toFixed(2) : '0'} {pool.currency}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))
            )}
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
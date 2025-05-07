"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
// import SolanaConnectButton from "@/app/components/SolanaConnectButton";

const SolanaConnectButton = dynamic(
  () => import('../components/SolanaConnectButton').then((mod) => mod.SolanaConnectButton),
  {
    ssr: false, // 关键：禁用服务器端渲染
    loading: () => <p>正在加载登录组件...</p> // 可选：添加加载状态指示器
  }
);

// 模拟质押数据
const stakingPools = [
  {
    id: 1,
    name: "BTC 矿机质押池",
    icon: "/btc-icon.svg", // 确保有此图标
    apr: "12.5%",
    totalStaked: "1,250,000 USDT",
    yourStake: "5,000 USDT",
    rewards: "625 USDT",
    duration: "30天",
    status: "活跃",
  },
  {
    id: 2,
    name: "ETH 矿机质押池",
    icon: "/eth-icon.svg", // 确保有此图标
    apr: "10.2%",
    totalStaked: "980,000 USDT",
    yourStake: "2,500 USDT",
    rewards: "255 USDT",
    duration: "60天",
    status: "活跃",
  },
  {
    id: 3,
    name: "SOL 矿机质押池",
    icon: "/sol-icon.svg", // 确保有此图标
    apr: "15.8%",
    totalStaked: "750,000 USDT",
    yourStake: "0 USDT",
    rewards: "0 USDT",
    duration: "90天",
    status: "即将开放",
  },
];

export default function StakingIndex() {
  const [activeTab, setActiveTab] = useState("active");
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const { connected } = useWallet();

  // 处理质押操作
  const handleStake = (poolId: number) => {
    if (!connected) {
      alert("请先连接钱包");
      return;
    }
    setSelectedPool(poolId);
    // 这里可以添加质押逻辑
    console.log(`质押到池 ${poolId}, 金额: ${stakeAmount}`);
  };

  // 处理提取操作
  const handleWithdraw = (poolId: number) => {
    if (!connected) {
      alert("请先连接钱包");
      return;
    }
    // 这里可以添加提取逻辑
    console.log(`从池 ${poolId} 提取`);
  };

  // 处理收获奖励操作
  const handleHarvest = (poolId: number) => {
    if (!connected) {
      alert("请先连接钱包");
      return;
    }
    // 这里可以添加收获奖励逻辑
    console.log(`从池 ${poolId} 收获奖励`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-8 sm:p-16">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题和连接钱包按钮 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">我的质押</h1>
            <p className="text-gray-400">安全、高收益的矿机质押服务</p>
          </div>
          <div className="mt-4 md:mt-0">
            <SolanaConnectButton />
          </div>
        </div>

        {/* 质押统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div 
            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-xl border border-purple-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-gray-400 mb-2">总质押金额</h3>
            <p className="text-3xl font-bold">{connected ? "7,500 USDT" : "-- USDT"}</p>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-xl border border-blue-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-gray-400 mb-2">累计收益</h3>
            <p className="text-3xl font-bold">{connected ? "880 USDT" : "-- USDT"}</p>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-cyan-900/50 to-green-900/50 p-6 rounded-xl border border-cyan-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-gray-400 mb-2">活跃质押池</h3>
            <p className="text-3xl font-bold">{connected ? "2" : "--"}</p>
          </motion.div>
        </div>

        {/* 标签切换 */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "active"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("active")}
          >
            活跃质押
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "history"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("history")}
          >
            历史记录
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
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                        {/* 替换为实际图标 */}
                        <div className="text-2xl font-bold">{pool.name.charAt(0)}</div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{pool.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded">
                            APR {pool.apr}
                          </span>
                          <span className="text-sm text-gray-400 ml-2">
                            {pool.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 质押状态 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">总质押</p>
                        <p className="font-medium">{pool.totalStaked}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">您的质押</p>
                        <p className="font-medium">{connected ? pool.yourStake : "-- USDT"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">待领取奖励</p>
                        <p className="font-medium text-green-400">{connected ? pool.rewards : "-- USDT"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">状态</p>
                        <p className={`font-medium ${pool.status === "活跃" ? "text-green-400" : "text-yellow-400"}`}>
                          {pool.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleStake(pool.id)}
                      disabled={pool.status !== "活跃" || !connected}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pool.status === "活跃" && connected
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      质押
                    </button>
                    <button
                      onClick={() => handleWithdraw(pool.id)}
                      disabled={pool.yourStake === "0 USDT" || !connected}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pool.yourStake !== "0 USDT" && connected
                          ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                          : "bg-gray-800 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      提取
                    </button>
                    <button
                      onClick={() => handleHarvest(pool.id)}
                      disabled={pool.rewards === "0 USDT" || !connected}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pool.rewards !== "0 USDT" && connected
                          ? "bg-green-900/50 hover:bg-green-800 text-green-400 border border-green-800/50"
                          : "bg-gray-800 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      收获奖励
                    </button>
                  </div>
                </div>

                {/* 质押表单 - 仅在选中时显示 */}
                {selectedPool === pool.id && (
                  <div className="p-6 bg-gray-800/50 border-t border-gray-700">
                    <h4 className="font-medium mb-3">质押到 {pool.name}</h4>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="输入质押金额"
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        onClick={() => handleStake(pool.id)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg font-medium"
                      >
                        确认
                      </button>
                      <button
                        onClick={() => setSelectedPool(null)}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium"
                      >
                        取消
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      预计年化收益: {parseFloat(stakeAmount || "0") * parseFloat(pool.apr.replace("%", "")) / 100} USDT
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* 历史记录标签内容 */}
        {activeTab === "history" && (
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            {connected ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-800">
                      <th className="pb-3 font-medium text-gray-400">池名称</th>
                      <th className="pb-3 font-medium text-gray-400">操作</th>
                      <th className="pb-3 font-medium text-gray-400">金额</th>
                      <th className="pb-3 font-medium text-gray-400">时间</th>
                      <th className="pb-3 font-medium text-gray-400">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <td className="py-4">BTC 矿机质押池</td>
                      <td className="py-4">质押</td>
                      <td className="py-4">2,500 USDT</td>
                      <td className="py-4">2025-04-15 14:30</td>
                      <td className="py-4 text-green-400">成功</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4">ETH 矿机质押池</td>
                      <td className="py-4">质押</td>
                      <td className="py-4">1,500 USDT</td>
                      <td className="py-4">2025-04-10 09:15</td>
                      <td className="py-4 text-green-400">成功</td>
                    </tr>
                    <tr>
                      <td className="py-4">BTC 矿机质押池</td>
                      <td className="py-4">收获奖励</td>
                      <td className="py-4">125 USDT</td>
                      <td className="py-4">2025-04-05 16:45</td>
                      <td className="py-4 text-green-400">成功</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-4">请连接钱包查看您的质押历史记录</p>
                <SolanaConnectButton />
              </div>
            )}
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-10 bg-gray-900/30 p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold mb-3">质押说明</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>质押期间，您的资金将用于购买和运营矿机，获取挖矿收益</li>
            <li>质押收益根据矿机运行状况和市场行情可能有所波动</li>
            <li>提前解除质押可能会产生一定的手续费</li>
            <li>请确保您已了解质押风险，并在充分了解的情况下进行操作</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
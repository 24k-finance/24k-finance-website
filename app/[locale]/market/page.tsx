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
      loading: () => <p></p> // 可选：添加加载状态指示器
    }
  );

// 模拟矿机数据
const miningMachines = [
  {
    id: 1,
    name: "比特币矿机 Pro",
    image: "/btc-miner.jpg", // 确保有此图片
    price: "5,000 USDT",
    hashRate: "100 TH/s",
    powerConsumption: "3,250 W",
    dailyReturn: "~0.0005 BTC",
    roi: "预计12个月",
    available: 15,
    total: 50,
    type: "btc",
  },
  {
    id: 2,
    name: "以太坊矿机 Elite",
    image: "/eth-miner.jpg", // 确保有此图片
    price: "3,800 USDT",
    hashRate: "750 MH/s",
    powerConsumption: "1,200 W",
    dailyReturn: "~0.005 ETH",
    roi: "预计14个月",
    available: 8,
    total: 30,
    type: "eth",
  },
  {
    id: 3,
    name: "Solana 验证节点",
    image: "/sol-node.jpg", // 确保有此图片
    price: "2,500 USDT",
    hashRate: "N/A",
    powerConsumption: "750 W",
    dailyReturn: "~0.5 SOL",
    roi: "预计10个月",
    available: 20,
    total: 40,
    type: "sol",
  },
  {
    id: 4,
    name: "比特币矿机 Lite",
    image: "/btc-miner-lite.jpg", // 确保有此图片
    price: "2,800 USDT",
    hashRate: "60 TH/s",
    powerConsumption: "2,100 W",
    dailyReturn: "~0.0003 BTC",
    roi: "预计13个月",
    available: 25,
    total: 50,
    type: "btc",
  },
  {
    id: 5,
    name: "Filecoin 存储矿机",
    image: "/fil-miner.jpg", // 确保有此图片
    price: "4,200 USDT",
    hashRate: "10 TB",
    powerConsumption: "500 W",
    dailyReturn: "~0.2 FIL",
    roi: "预计15个月",
    available: 12,
    total: 25,
    type: "other",
  },
  {
    id: 6,
    name: "Dogecoin 矿机",
    image: "/doge-miner.jpg", // 确保有此图片
    price: "1,800 USDT",
    hashRate: "2.5 GH/s",
    powerConsumption: "1,000 W",
    dailyReturn: "~30 DOGE",
    roi: "预计11个月",
    available: 18,
    total: 30,
    type: "other",
  },
];

export default function MarketIndex() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedMachine, setSelectedMachine] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const { connected } = useWallet();

  // 处理购买操作
  const handlePurchase = (machineId: number) => {
    if (!connected) {
      alert("请先连接钱包");
      return;
    }
    setSelectedMachine(machineId);
    setQuantity(1);
  };

  // 确认购买
  const confirmPurchase = () => {
    if (!connected) {
      alert("请先连接钱包");
      return;
    }
    
    // 这里可以添加购买逻辑
    const machine = miningMachines.find(m => m.id === selectedMachine);
    console.log(`购买 ${quantity} 台 ${machine?.name}`);
    
    // 购买成功后重置状态
    setSelectedMachine(null);
    setQuantity(1);
    
    // 显示成功消息
    alert(`购买成功！您已购买 ${quantity} 台 ${machine?.name}`);
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
            <h1 className="text-4xl font-bold mb-2">金矿市场</h1>
            <p className="text-gray-400">加入投资金矿的高收益机会</p>
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
            <h3 className="text-gray-400 mb-2">开采中</h3>
            <p className="text-3xl font-bold">98 台</p>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-xl border border-blue-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-gray-400 mb-2">平均年化</h3>
            <p className="text-3xl font-bold">20%</p>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-cyan-900/50 to-green-900/50 p-6 rounded-xl border border-cyan-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-gray-400 mb-2">金矿类型</h3>
            <p className="text-3xl font-bold">6 种</p>
          </motion.div>
        </div>

        {/* 过滤器 */}
        <div className="flex flex-wrap border-b border-gray-800 mb-6 gap-2">
          <button
            className={`py-2 px-4 font-medium ${
              activeFilter === "all"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            全部矿机
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeFilter === "btc"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("btc")}
          >
            比特币矿机
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeFilter === "eth"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("eth")}
          >
            以太坊矿机
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeFilter === "sol"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("sol")}
          >
            Solana节点
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeFilter === "other"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("other")}
          >
            其他矿机
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
                {/* 如果有图片，可以替换下面的div */}
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-600">
                  {machine.name.charAt(0)}
                </div>
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
                    <p className="text-gray-400 text-sm">算力</p>
                    <p className="font-medium">{machine.hashRate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">功耗</p>
                    <p className="font-medium">{machine.powerConsumption}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">日收益</p>
                    <p className="font-medium text-green-400">{machine.dailyReturn}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">回本周期</p>
                    <p className="font-medium">{machine.roi}</p>
                  </div>
                </div>
                
                {/* 库存和购买按钮 */}
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    剩余额度: <span className="text-white">{machine.available}</span>/{machine.total}
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
                    {machine.available > 0 ? "质押" : "售罄"}
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
                购买 {miningMachines.find(m => m.id === selectedMachine)?.name}
              </h3>
              
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">数量</label>
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
                  <span className="text-gray-400">单价:</span>
                  <span>{miningMachines.find(m => m.id === selectedMachine)?.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">数量:</span>
                  <span>{quantity} 台</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>总价:</span>
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
                  确认购买
                </button>
                <button
                  onClick={() => setSelectedMachine(null)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 底部说明 */}
        <div className="mt-10 bg-gray-900/30 p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold mb-3">金矿质押说明</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>所有矿机均由专业团队维护，确保7*24小时稳定运行</li>
            <li>购买后矿机将在24小时内完成部署并开始产生收益</li>
            <li>矿机收益将根据网络难度和币价有所波动</li>
            <li>矿机托管费用已包含在购买价格中，无需额外支付</li>
            <li>矿机保修期为12个月，期间硬件故障免费维修</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
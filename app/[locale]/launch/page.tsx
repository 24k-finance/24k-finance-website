"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

const SolanaConnectButton = dynamic(
    () => import('../components/SolanaConnectButton').then((mod) => mod.SolanaConnectButton),
    {
      ssr: false, // 关键：禁用服务器端渲染
      loading: () => <p>正在加载登录组件...</p> // 可选：添加加载状态指示器
    }
  );

// 矿场类型枚举
enum MiningType {
  BTC = "比特币",
  ETH = "以太坊",
  SOL = "Solana",
  FIL = "Filecoin",
  DOGE = "Dogecoin",
  OTHER = "其他"
}

// 矿场表单数据类型
interface MiningFarmForm {
  name: string;
  type: MiningType;
  description: string;
  hashRate: string;
  powerConsumption: string;
  location: string;
  price: string;
  roi: string;
  duration: string;
  totalUnits: number;
  minInvestment: string;
  contactEmail: string;
  contactPhone: string;
}

export default function LaunchPage() {
  const { connected } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<MiningFarmForm>({
    name: "",
    type: MiningType.BTC,
    description: "",
    hashRate: "",
    powerConsumption: "",
    location: "",
    price: "",
    roi: "",
    duration: "12",
    totalUnits: 100,
    minInvestment: "",
    contactEmail: "",
    contactPhone: "",
  });

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 处理数字输入变化
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setFormData({
      ...formData,
      [name]: numValue,
    });
  };

  // 处理封面图片上传
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(file);
          setCoverPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 表单验证
  const validateForm = () => {
    // 必填字段验证
    const requiredFields = [
      'name', 'description', 'hashRate', 'powerConsumption', 
      'location', 'price', 'roi', 'minInvestment', 'contactEmail'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof MiningFarmForm]) {
        alert(`请填写${getFieldLabel(field)}`);
        return false;
      }
    }
    
    // 验证封面图片
    if (!coverImage) {
      alert('请上传矿场封面图片');
      return false;
    }
    
    return true;
  };

  // 获取字段标签
  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      name: '矿场名称',
      description: '矿场描述',
      hashRate: '算力',
      powerConsumption: '功耗',
      location: '矿场位置',
      price: '价格',
      roi: '预期回报率',
      duration: '合约期限',
      totalUnits: '总份额',
      minInvestment: '最小投资额',
      contactEmail: '联系邮箱',
      contactPhone: '联系电话'
    };
    
    return labels[field] || field;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      alert("请先连接钱包");
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟API请求
    setTimeout(() => {
      console.log('提交的矿场数据:', formData);
      console.log('封面图片:', coverImage);
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // 5秒后重置表单
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: "",
          type: MiningType.BTC,
          description: "",
          hashRate: "",
          powerConsumption: "",
          location: "",
          price: "",
          roi: "",
          duration: "12",
          totalUnits: 100,
          minInvestment: "",
          contactEmail: "",
          contactPhone: "",
        });
        setCoverImage(null);
        setCoverPreview(null);
      }, 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-8 sm:p-16">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题和连接钱包按钮 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">LAUNCH矿场</h1>
            <p className="text-gray-400">发布您的矿场项目，吸引投资者参与</p>
          </div>
          <div className="mt-4 md:mt-0">
            <SolanaConnectButton />
          </div>
        </div>

        {/* 成功提示 */}
        {isSuccess && (
          <motion.div 
            className="bg-green-900/30 p-6 rounded-xl border border-green-800/50 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  矿场发布成功！
                </h3>
                <p className="text-gray-300">您的矿场项目已成功提交，我们将在24小时内审核。审核通过后，您的矿场将在市场中展示。</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 未连接钱包提示 */}
        {!connected && !isSuccess && (
          <motion.div 
            className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-gray-300 mb-4">请先连接您的钱包以发布矿场项目</p>
            <SolanaConnectButton />
          </motion.div>
        )}

        {/* 矿场发布表单 */}
        {connected && !isSuccess && (
          <motion.form 
            onSubmit={handleSubmit}
            className="bg-gray-900/50 p-6 rounded-xl border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800">矿场信息</h2>
            
            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  矿场名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="请输入矿场名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  矿场类型 <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                  {Object.values(MiningType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  矿场描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="请详细描述您的矿场项目，包括优势、特点等"
                />
              </div>
            </div>
            
            {/* 封面图片上传 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                矿场封面图片 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                {coverPreview ? (
                  <div className="relative">
                    <img 
                      src={coverPreview} 
                      alt="矿场封面预览" 
                      className="max-h-60 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage(null);
                        setCoverPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-gray-400 mb-2">点击上传或拖拽文件到此处</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="w-full opacity-0 absolute inset-0 cursor-pointer"
                    />
                    <div className="bg-gray-800 text-gray-300 py-2 px-4 rounded inline-block">
                      选择文件
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                支持JPG, PNG格式，建议尺寸1200x630，文件大小不超过5MB
              </p>
            </div>
            
            {/* 技术规格 */}
            <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800">技术规格</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  算力 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="hashRate"
                  value={formData.hashRate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="例如: 100 TH/s"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  功耗 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="powerConsumption"
                  value={formData.powerConsumption}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="例如: 3,200 W"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  矿场位置 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="例如: 美国德克萨斯州"
                />
              </div>
            </div>
            
            {/* 投资信息 */}
            <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800">投资信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  价格 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="例如: 5,000 USDT"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  预期回报率 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="roi"
                  value={formData.roi}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="例如: 12% 年化"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  合约期限 (月)
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                  <option value="6">6个月</option>
                  <option value="12">12个月</option>
                  <option value="24">24个月</option>
                  <option value="36">36个月</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  总份额
                </label>
                <input
                  type="number"
                  name="totalUnits"
                  value={formData.totalUnits}
                  onChange={handleNumberChange}
                  min="1"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="例如: 100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  最小投资额 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="minInvestment"
                  value={formData.minInvestment}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="例如: 500 USDT"
                />
              </div>
            </div>
            
            {/* 联系信息 */}
            <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800">联系信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  联系邮箱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="例如: contact@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  联系电话
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="例如: +86 123 4567 8901"
                />
              </div>
            </div>
            
            {/* 提交按钮 */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isSubmitting
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    提交中...
                  </span>
                ) : (
                  "发布矿场"
                )}
              </button>
            </div>
          </motion.form>
        )}

        {/* 底部说明 */}
        <div className="mt-10 bg-gray-900/30 p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold mb-3">矿场发布说明</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>所有矿场项目需要经过平台审核，审核通常需要1-2个工作日</li>
            <li>请确保提供真实、准确的矿场信息，虚假信息将导致项目被拒绝</li>
            <li>发布矿场需要支付0.1 SOL的上链费用，用于确保项目真实性</li>
            <li>矿场上线后，平台将收取5%的管理费用</li>
            <li>如有任何问题，请联系我们的客服团队: support@24k-finance.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
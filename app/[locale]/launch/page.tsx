"use client";
import BN from 'bn.js';
import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useApplyMine } from "../hooks/useApplyMine";
import { Link } from '@/i18n/navigation';
// import { BN } from "@project-serum/anchor";

const SolanaConnectButton = dynamic(
    () => import('../components/SolanaConnectButton').then((mod) => mod.SolanaConnectButton),
    {
      ssr: false, // 关键：禁用服务器端渲染
      loading: () => <p></p> // 可选：添加加载状态指示器
    }
  );

  const NotConnectWallet = dynamic(
    () => import('../components/NotConnectWallet').then((mod) => mod.NotConnectWallet),
    {
      ssr: false, // 关键：禁用服务器端渲染
      loading: () => <p></p> // 可选：添加加载状态指示器
    }
  );

function LaunchPageFooter() {
  const t = useTranslations('launchPage'); // 初始化翻译函数 (launchPage 命名空间)
  return (
          <div className="mt-10 bg-gray-900/30 p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-bold mb-3">{t('instructions.title')}</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>{t('instructions.item1')}</li>
            <li>{t('instructions.item2')}</li>
            <li>{t('instructions.item3')}</li>
            <li>{t('instructions.item4')}</li>
            <li>{t('instructions.item5', { email: 'support@24k-finance.com' })}</li>
          </ul>
        </div>
  )
}

// Define keys for mining types
const MINING_TYPE_KEYS = {
  BTC: "BTC",
  ETH: "ETH",
  // SOL: "SOL",
  // FIL: "FIL",
  // DOGE: "DOGE",
  OTHER: "OTHER",
} as const;

type MiningType = typeof MINING_TYPE_KEYS[keyof typeof MINING_TYPE_KEYS];

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

  const t = useTranslations('launchPage'); // 初始化翻译函数 (launchPage 命名空间)
  const tCommon = useTranslations('common'); // 初始化翻译函数 (common 命名空间)

  const { applyMine, loading, error } = useApplyMine();
  const { connected } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [formData, setFormData] = useState<MiningFarmForm>({
    name: "",
    type: MINING_TYPE_KEYS.BTC,
    description: "",
    hashRate: "",
    powerConsumption: "",
    location: "",
    price: "",
    roi: "",
    duration: "12",
    totalUnits: 50000,
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
        console.log(tCommon('alert.fillRequiredField') + ` ${getFieldLabel(field)}`);
        return false;
      }
    }
    
    // 验证封面图片
    if (!coverImage) {
      console.log(tCommon('alert.uploadCoverImage'));
      return false;
    }
    
    return true;
  };

  // 获取字段标签 - 用于验证提示
  const getFieldLabel = (field: string): string => {
    const fieldToTranslationKey: Record<string, string> = {
      name: 'name',
      description: 'description',
      hashRate: 'hashRate',
      powerConsumption: 'powerConsumption',
      location: 'location',
      price: 'price',
      roi: 'roi',
      duration: 'duration',
      totalUnits: 'totalUnits',
      minInvestment: 'minInvestment',
      contactEmail: 'email',
      contactPhone: 'phone'
    };
    const translationKey = fieldToTranslationKey[field] || field;
    return tCommon(translationKey as any); // Use 'any' or ensure keys are strictly typed for t()
  };


  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      console.log(tCommon('alert.connectWalletFirst'));
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    // 计算明天的时间戳（加上 86400 秒，即 1 天）
    const tomorrowTimestamp = currentTimestamp + 86400;  // 明天的时间戳
    // 计算一年后的时间戳（加上 365 天的秒数）
    const oneYearLaterTimestamp = tomorrowTimestamp + (365 * 86400);  // 一年后的时间戳
    const processedFormData = {
      mineCode: 'mine' + Date.now(),
      name: formData.name,
      operator: 'Lee',
      relationship: 'owner',
      scale: 'medium',
      location: formData.location,
      approval1: '',
      approval2: '',
      approval3: '',
      financeScale: new BN(formData.price), // u128
      currency: 'USD',
      startDate: new BN(tomorrowTimestamp),     // i64
      endDate: new BN(oneYearLaterTimestamp),       // i64
      rate: +formData.roi,                          // u32
      frozenMonth: 13.5,                     // u8
    }
    
    try {
      setIsSubmitting(true);
      // 在这里添加你的API请求逻辑
      // 例如，使用fetch或axios发送POST请求到你的后端API
      const result = await applyMine(processedFormData);

      if (result && result.txSignature) {
        setTxSignature(result.txSignature);
      }

      setIsSuccess(true);
      setFormData({
        name: "",
        type: MINING_TYPE_KEYS.BTC,
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
     
    } catch (error) {
      console.log('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

   // 获取Solana浏览器链接
   const getSolanaExplorerLink = (signature: string) => {
    // 根据环境选择正确的浏览器URL
    const baseUrl = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet' 
      ? 'https://explorer.solana.com/tx/' 
      : 'https://explorer.solana.com/tx/?cluster=devnet';
    
    return `${baseUrl}${signature}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-8 sm:p-16">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题和连接钱包按钮 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
            <p className="text-gray-400">
              <span className="">{t('subtitle')}</span>
              <Link href="/launching">
                <span className='bg-purple-600 hover:bg-purple-700 text-white font-medium ml-3 py-1 px-2 rounded-xs'>
                  {t('applyButton')}
                </span>
              </Link>
            </p>
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
                  {t('successMessage.title')}
                </h3>
                <p className="text-gray-300">{t('successMessage.description')}</p>
                {txSignature && txSignature !== 'Transaction already processed' && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-1">{t('successMessage.viewTransaction')}:</p>
                    <a 
                      href={getSolanaExplorerLink(txSignature)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                    >
                      {t('successMessage.viewOnExplorer')} 🔗
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* 未连接钱包提示 */}
        {!connected && !isSuccess && <NotConnectWallet />}

        {/* 矿场发布表单 */}
        {connected && !isSuccess && (
              <motion.form
                  onSubmit={handleSubmit}
                  className="bg-gray-900/50 p-6 rounded-xl border border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800">{t('formSectionTitles.farmInfo')}</h2>
      
                  {/* 基本信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                        placeholder={t('placeholders.farmName')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.type')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                      >
                        {Object.values(MINING_TYPE_KEYS).map((type) => (
                          <option key={type} value={type}>{t(`miningTypes.${type}`)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.description')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                        placeholder={t('placeholders.farmDescription')}
                      />
                    </div>
                  </div>
      
                  {/* 封面图片上传 */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {t('formLabels.coverImage')} <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center relative">
                      {coverPreview ? (
                        <div className="relative">
                          <img
                            src={coverPreview}
                            alt={t('altTexts.coverPreview')}
                            className="max-h-60 mx-auto rounded"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="text-gray-400 mb-2">{t('coverImage.uploadPrompt')}</div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            className="w-full opacity-0 absolute inset-0 cursor-pointer"
                          />
                          <div className="bg-gray-800 text-gray-300 py-2 px-4 rounded inline-block">
                            {t('coverImage.selectFile')}
                          </div>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('coverImage.requirements')}
                    </p>
                  </div>
      
                  {/* 技术规格 */}
                  <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800">{t('formSectionTitles.techSpecs')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.hashRate')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="hashRate"
                        value={formData.hashRate}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                        placeholder={t('placeholders.hashRate')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.powerConsumption')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="powerConsumption"
                        value={formData.powerConsumption}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                        placeholder={t('placeholders.powerConsumption')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.location')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                        placeholder={t('placeholders.location')}
                      />
                    </div>
                  </div>
      
                  {/* 投资信息 */}
                  <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800">{t('formSectionTitles.investmentInfo')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.price')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                        placeholder={t('placeholders.price')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.roi')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="roi"
                        value={formData.roi}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                        placeholder={t('placeholders.roi')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.duration')}
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                      >
                        <option value="6">{t('durations.6months')}</option>
                        <option value="12">{t('durations.12months')}</option>
                        <option value="24">{t('durations.24months')}</option>
                        <option value="36">{t('durations.36months')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.totalUnits')}
                      </label>
                      <input
                        type="number"
                        name="totalUnits"
                        value={formData.totalUnits}
                        onChange={handleNumberChange}
                        min="1"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                        placeholder={t('placeholders.totalUnits')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.minInvestment')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="minInvestment"
                        value={formData.minInvestment}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                        placeholder={t('placeholders.minInvestment')}
                      />
                    </div>
                  </div>
      
                  {/* 联系信息 */}
                  <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800">{t('formSectionTitles.contactInfo')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.contactEmail')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                        placeholder={t('placeholders.contactEmail')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {t('formLabels.contactPhone')}
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                        placeholder={t('placeholders.contactPhone')}
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
                          {tCommon('submitting')}
                        </span>
                      ) : (
                        t('submitButton')
                      )}
                    </button>
                  </div>
                </motion.form>
        )}
        <LaunchPageFooter />
      </div>
    </div>
  );
}
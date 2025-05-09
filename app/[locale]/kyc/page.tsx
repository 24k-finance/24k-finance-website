"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const NotConnectWallet = dynamic(
    () => import('../components/NotConnectWallet').then((mod) => mod.NotConnectWallet),
    {
      ssr: false, // 关键：禁用服务器端渲染
      loading: () => <p></p> // 可选：添加加载状态指示器
    }
  );

const SolanaConnectButton = dynamic(
    () => import('../components/SolanaConnectButton').then((mod) => mod.SolanaConnectButton),
    {
      ssr: false, // 关键：禁用服务器端渲染
      loading: () => <p></p> // 可选：添加加载状态指示器
    }
  );

// KYC状态枚举
// enum KycStatus {
//   NOT_STARTED = "未开始",
//   PENDING = "审核中",
//   APPROVED = "已通过",
//   REJECTED = "已拒绝"
// }

// KYC状态枚举
enum KycStatus {
  NOT_STARTED = "notStarted",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export default function KycPage() {
  const t = useTranslations('kyc'); 
  const tCommon = useTranslations('common');
  const { connected } = useWallet();
  const [kycStatus, setKycStatus] = useState<KycStatus>(KycStatus.NOT_STARTED);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    idType: t('formDefaults.idType'),
    idNumber: "",
    country: t('formDefaults.country'),
    address: "",
    phone: "",
    email: "",
  });
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'front' | 'back' | 'selfie') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (fileType === 'front') {
            setIdFrontFile(file);
            setIdFrontPreview(reader.result);
          } else if (fileType === 'back') {
            setIdBackFile(file);
            setIdBackPreview(reader.result);
          } else {
            setSelfieFile(file);
            setSelfiePreview(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 提交KYC申请
  const submitKyc = async () => {
    if (!connected) {
      alert(tCommon('alert.connectWalletFirst'));
      return;
    }

    setIsSubmitting(true);
    
    // 模拟API请求
    setTimeout(() => {
      setKycStatus(KycStatus.PENDING);
      setIsSubmitting(false);
      // 重置表单
      setActiveStep(1);
    }, 2000);
  };

  // 进入下一步
  const nextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else {
      submitKyc();
    }
  };

  // 返回上一步
  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  // 检查当前步骤是否可以继续
  const canProceed = () => {
    if (activeStep === 1) {
      return formData.fullName && formData.idType && formData.idNumber && 
             formData.country && formData.address;
    } else if (activeStep === 2) {
      return idFrontFile && idBackFile;
    } else {
      return selfieFile;
    }
  };

  // 渲染KYC状态卡片
  const renderStatusCard = () => {
    let statusColor = "";
    let statusBg = "";
    let statusIcon = "";
    let statusMessage = "";

    switch (kycStatus) {
      case KycStatus.PENDING:
        statusColor = "text-yellow-400";
        statusBg = "bg-yellow-900/30";
        statusIcon = "⏳";
        statusMessage = t('statusMessages.pending');
        break;
      case KycStatus.APPROVED:
        statusColor = "text-green-400";
        statusBg = "bg-green-900/30";
        statusIcon = "✅";
        statusMessage = t('statusMessages.approved');
        break;
      case KycStatus.REJECTED:
        statusColor = "text-red-400";
        statusBg = "bg-red-900/30";
        statusIcon = "❌";
        statusMessage = t('statusMessages.rejected');
        break;
      default:
        return null;
    }

    return (
      <motion.div 
        className={`p-6 rounded-xl border ${statusBg} mb-8`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start">
          <span className="text-2xl mr-3">{statusIcon}</span>
          <div>
            <h3 className={`text-xl font-bold ${statusColor} mb-2`}>
              {t('statusLabels.title')}: {t(`kycStatus.${kycStatus}`)}
            </h3>
            <p className="text-gray-300">{statusMessage}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === activeStep 
                  ? "bg-purple-600 text-white" 
                  : step < activeStep 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-700 text-gray-400"
              }`}
            >
              {step < activeStep ? "✓" : step}
            </div>
            {step < 3 && (
              <div 
                className={`w-16 h-1 ${
                  step < activeStep ? "bg-green-600" : "bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // 渲染个人信息表单
  const renderPersonalInfoForm = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h3 className="text-xl font-bold mb-4">{t('steps.step1.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('steps.step1.fields.fullName.label')}
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder={t('steps.step1.fields.fullName.placeholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('steps.step1.fields.idType.label')}
            </label>
            <select
              name="idType"
              value={formData.idType}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="身份证">{t('steps.step1.fields.idType.options.idCard')}</option>
              <option value="护照">{t('steps.step1.fields.idType.options.passport')}</option>
              <option value="驾照">{t('steps.step1.fields.idType.options.driverLicense')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('steps.step1.fields.idNumber.label')}
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder={t('steps.step1.fields.idNumber.placeholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('steps.step1.fields.country.label')}
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="中国">{t('steps.step1.fields.country.options.china')}</option>
              <option value="美国">{t('steps.step1.fields.country.options.usa')}</option>
              <option value="日本">{t('steps.step1.fields.country.options.japan')}</option>
              <option value="韩国">{t('steps.step1.fields.country.options.korea')}</option>
              <option value="新加坡">{t('steps.step1.fields.country.options.singapore')}</option>
              <option value="其他">{t('steps.step1.fields.country.options.other')}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('steps.step1.fields.address.label')}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder={t('steps.step1.fields.address.placeholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('steps.step1.fields.phone.label')}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder={t('steps.step1.fields.phone.placeholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t('steps.step1.fields.email.label')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder={t('steps.step1.fields.email.placeholder')}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  // 渲染证件上传表单
  const renderIdDocumentsForm = () => {
    const items = t('steps.step2.requirements.items');
    const requirements = JSON.parse(items);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h3 className="text-xl font-bold mb-4">{t('steps.step2.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t('steps.step2.fields.idFront.label')}
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center relative">
              {idFrontPreview ? (
                <div className="relative">
                  <img 
                    src={idFrontPreview} 
                    alt={t('steps.step2.fields.idFront.previewAlt')} 
                    className="max-h-40 mx-auto rounded"
                  />
                  <button
                    onClick={() => {
                      setIdFrontFile(null);
                      setIdFrontPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-gray-400 mb-2">{t('steps.step2.fields.idFront.uploadText')}</div>
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'front')}
                      className="hidden"
                    />
                    <div className="bg-gray-800 text-gray-300 py-2 px-4 rounded inline-block">
                      {t('steps.step2.fields.idFront.buttonText')}
                    </div>
                  </label>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('steps.step2.fields.idFront.supportText')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t('steps.step2.fields.idBack.label')}
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center relative">
              {idBackPreview ? (
                <div className="relative">
                  <img 
                    src={idBackPreview} 
                    alt={t('steps.step2.fields.idBack.previewAlt')} 
                    className="max-h-40 mx-auto rounded"
                  />
                  <button
                    onClick={() => {
                      setIdBackFile(null);
                      setIdBackPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-gray-400 mb-2">{t('steps.step2.fields.idBack.uploadText')}</div>
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'back')}
                      className="hidden"
                    />
                    <div className="bg-gray-800 text-gray-300 py-2 px-4 rounded inline-block">
                      {t('steps.step2.fields.idBack.buttonText')}
                    </div>
                  </label>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('steps.step2.fields.idBack.supportText')}
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
          <h4 className="font-medium text-blue-400 mb-2">{t('steps.step2.requirements.title')}</h4>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            {requirements.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  };

  // 渲染自拍照上传表单
   // 渲染自拍照上传表单
   const renderSelfieForm = () => {
    const items = t('steps.step3.requirements.items');
    const requirements = JSON.parse(items);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h3 className="text-xl font-bold mb-4">{t('steps.step3.title')}</h3>
        <div className="max-w-md mx-auto">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center relative">
            {selfiePreview ? (
              <div className="relative">
                <img 
                  src={selfiePreview} 
                  alt={t('steps.step3.fields.selfie.previewAlt')} 
                  className="max-h-60 mx-auto rounded"
                />
                <button
                  onClick={() => {
                    setSelfieFile(null);
                    setSelfiePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="text-gray-400 mb-2">{t('steps.step3.fields.selfie.uploadText')}</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'selfie')}
                  className="w-full opacity-0 absolute inset-0 cursor-pointer"
                />
                <div className="bg-gray-800 text-gray-300 py-2 px-4 rounded inline-block">
                  {t('steps.step3.fields.selfie.buttonText')}
                </div>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {t('steps.step3.fields.selfie.supportText')}
          </p>
        </div>
        <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
          <h4 className="font-medium text-blue-400 mb-2">{t('steps.step3.requirements.title')}</h4>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            {requirements.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-800/30">
          <div className="flex items-start">
            <span className="text-yellow-500 mr-2">⚠️</span>
            <p className="text-sm text-gray-300">
              {t('steps.step3.disclaimer')}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const instructions = t('instructions.items');
  const instructionsList = JSON.parse(instructions);

  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-8 sm:p-16">
    <div className="max-w-4xl mx-auto">
      {/* 页面标题和连接钱包按钮 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t('pageTitle')}</h1>
          <p className="text-gray-400">{t('pageDescription')}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <SolanaConnectButton />
        </div>
      </div>

      {/* KYC状态卡片 */}
      {kycStatus !== KycStatus.NOT_STARTED && renderStatusCard()}

      {/* 未连接钱包提示 */}
      {!connected && kycStatus === KycStatus.NOT_STARTED && <NotConnectWallet />}

      {/* KYC表单 */}
      {connected && kycStatus === KycStatus.NOT_STARTED && (
        <motion.div 
          className="bg-gray-900/50 p-6 rounded-xl border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* 步骤指示器 */}
          {renderStepIndicator()}

          {/* 表单内容 */}
          <div className="mb-8">
            {activeStep === 1 && renderPersonalInfoForm()}
            {activeStep === 2 && renderIdDocumentsForm()}
            {activeStep === 3 && renderSelfieForm()}
          </div>

          {/* 导航按钮 */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={activeStep === 1}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeStep === 1
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {t('navigation.prev')}
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed() || isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium ${
                canProceed() && !isSubmitting
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
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
                activeStep === 3 ? t('navigation.submit') : t('navigation.next')
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* KYC说明 */}
      <div className="mt-10 bg-gray-900/30 p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-bold mb-3">{t('instructions.title')}</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          {instructionsList.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  );
}
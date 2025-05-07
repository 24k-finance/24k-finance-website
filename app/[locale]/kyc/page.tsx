"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
// import SolanaConnectButton from "@/app/components/SolanaConnectButton";
// import Image from "next/image";

const SolanaConnectButton = dynamic(
    () => import('../components/SolanaConnectButton').then((mod) => mod.SolanaConnectButton),
    {
      ssr: false, // 关键：禁用服务器端渲染
      loading: () => <p></p> // 可选：添加加载状态指示器
    }
  );

// KYC状态枚举
enum KycStatus {
  NOT_STARTED = "未开始",
  PENDING = "审核中",
  APPROVED = "已通过",
  REJECTED = "已拒绝"
}

export default function KycPage() {
  const { connected } = useWallet();
  const [kycStatus, setKycStatus] = useState<KycStatus>(KycStatus.NOT_STARTED);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    idType: "身份证",
    idNumber: "",
    country: "中国",
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
      alert("请先连接钱包");
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
        statusMessage = "您的KYC申请正在审核中，请耐心等待。审核通常需要1-3个工作日。";
        break;
      case KycStatus.APPROVED:
        statusColor = "text-green-400";
        statusBg = "bg-green-900/30";
        statusIcon = "✅";
        statusMessage = "恭喜！您的KYC申请已通过审核。您现在可以使用平台的所有功能。";
        break;
      case KycStatus.REJECTED:
        statusColor = "text-red-400";
        statusBg = "bg-red-900/30";
        statusIcon = "❌";
        statusMessage = "很遗憾，您的KYC申请未通过审核。请检查您提供的信息是否准确，然后重新提交。";
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
              KYC状态: {kycStatus}
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
        <h3 className="text-xl font-bold mb-4">步骤 1: 个人信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              全名
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder="请输入您的全名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              证件类型
            </label>
            <select
              name="idType"
              value={formData.idType}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="身份证">身份证</option>
              <option value="护照">护照</option>
              <option value="驾照">驾照</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              证件号码
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder="请输入您的证件号码"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              国家/地区
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="中国">中国</option>
              <option value="美国">美国</option>
              <option value="日本">日本</option>
              <option value="韩国">韩国</option>
              <option value="新加坡">新加坡</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              居住地址
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder="请输入您的详细地址"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              手机号码
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder="请输入您的手机号码"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              电子邮箱
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder="请输入您的电子邮箱"
            />
          </div>
        </div>
      </motion.div>
    );
  };

  // 渲染证件上传表单
  const renderIdDocumentsForm = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h3 className="text-xl font-bold mb-4">步骤 2: 上传证件照片</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              证件正面照片
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
              {idFrontPreview ? (
                <div className="relative">
                  <img 
                    src={idFrontPreview} 
                    alt="证件正面预览" 
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
                  <div className="text-gray-400 mb-2">点击上传或拖拽文件到此处</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'front')}
                    className="w-full opacity-0 absolute inset-0 cursor-pointer"
                  />
                  <div className="bg-gray-800 text-gray-300 py-2 px-4 rounded inline-block">
                    选择文件
                  </div>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              支持JPG, PNG格式，文件大小不超过5MB
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              证件背面照片
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
              {idBackPreview ? (
                <div className="relative">
                  <img 
                    src={idBackPreview} 
                    alt="证件背面预览" 
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
                  <div className="text-gray-400 mb-2">点击上传或拖拽文件到此处</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'back')}
                    className="w-full opacity-0 absolute inset-0 cursor-pointer"
                  />
                  <div className="bg-gray-800 text-gray-300 py-2 px-4 rounded inline-block">
                    选择文件
                  </div>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              支持JPG, PNG格式，文件大小不超过5MB
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
          <h4 className="font-medium text-blue-400 mb-2">证件照片要求:</h4>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>证件必须是有效的，未过期</li>
            <li>照片必须清晰可见，无反光或阴影</li>
            <li>证件的所有四个角都必须在照片中可见</li>
            <li>不要裁剪或编辑照片</li>
          </ul>
        </div>
      </motion.div>
    );
  };

  // 渲染自拍照上传表单
  const renderSelfieForm = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h3 className="text-xl font-bold mb-4">步骤 3: 上传自拍照</h3>
        <div className="max-w-md mx-auto">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
            {selfiePreview ? (
              <div className="relative">
                <img 
                  src={selfiePreview} 
                  alt="自拍照预览" 
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
                <div className="text-gray-400 mb-2">点击上传或拖拽文件到此处</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'selfie')}
                  className="w-full opacity-0 absolute inset-0 cursor-pointer"
                />
                <div className="bg-gray-800 text-gray-300 py-2 px-4 rounded inline-block">
                  选择文件
                </div>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            支持JPG, PNG格式，文件大小不超过5MB
          </p>
        </div>
        <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
          <h4 className="font-medium text-blue-400 mb-2">自拍照要求:</h4>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>面部必须清晰可见，无遮挡</li>
            <li>照片必须是最近拍摄的</li>
            <li>光线充足，背景简单</li>
            <li>不要佩戴墨镜或面具</li>
          </ul>
        </div>
        <div className="mt-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-800/30">
          <div className="flex items-start">
            <span className="text-yellow-500 mr-2">⚠️</span>
            <p className="text-sm text-gray-300">
              提交KYC申请即表示您同意我们根据隐私政策处理您的个人信息。我们将安全地存储您的数据，并且仅用于验证您的身份。
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-8 sm:p-16">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题和连接钱包按钮 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">KYC认证</h1>
            <p className="text-gray-400">完成身份验证，解锁平台全部功能</p>
          </div>
          <div className="mt-4 md:mt-0">
            <SolanaConnectButton />
          </div>
        </div>

        {/* KYC状态卡片 */}
        {kycStatus !== KycStatus.NOT_STARTED && renderStatusCard()}

        {/* 未连接钱包提示 */}
        {!connected && kycStatus === KycStatus.NOT_STARTED && (
          <motion.div 
            className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-gray-300 mb-4">请先连接您的钱包以开始KYC认证流程</p>
            <SolanaConnectButton />
          </motion.div>
        )}

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
                上一步
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
                    提交中...
                  </span>
                ) : (
                  activeStep === 3 ? "提交" : "下一步"
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* KYC说明 */}
        <div className="mt-10 bg-gray-900/30 p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold mb-3">KYC认证说明</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>KYC（了解您的客户）是一项法律要求，用于防止欺诈和洗钱活动</li>
            <li>您的个人信息将被安全存储，并且仅用于身份验证目的</li>
            <li>完成KYC认证后，您将能够使用平台的所有功能，包括高额交易和提款</li>
            <li>认证过程通常需要1-3个工作日完成</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
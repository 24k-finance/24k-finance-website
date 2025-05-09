'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
// import { SolanaConnectButton } from '../../components/SolanaConnectButton';
import Link from 'next/link';
// import { useFetchMineApplications } from '@/hooks/useFetchMineApplications';
import dynamic from 'next/dynamic';
import { useFetchMineApplications } from '../hooks/useFetchMineApplications';

const SolanaConnectButton = dynamic(
    () => import('../components/SolanaConnectButton').then((mod) => mod.SolanaConnectButton),
    {
      ssr: false, // 关键：禁用服务器端渲染
      loading: () => <p></p> // 可选：添加加载状态指示器
    }
  );

// 申请状态类型
type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'signed';

// 申请状态标签组件
const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      label: '审核中'
    },
    approved: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/50',
      text: 'text-green-400',
      label: '已批准'
    },
    rejected: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      text: 'text-red-400',
      label: '已拒绝'
    },
    signed: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      label: '已签约'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.border} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default function LaunchingPage() {
  const t = useTranslations('launching');
  const tCommon = useTranslations('common');
  const { connected, publicKey } = useWallet();
  const { applications, loading, error, fetchApplications } = useFetchMineApplications();
  
  // 筛选当前用户的申请
  const myApplications = applications.filter(app => 
    connected && publicKey && app.account.owner.toString() === publicKey.toString()
  );

  // 获取申请状态
  const getApplicationStatus = (app: any): ApplicationStatus => {
    if (app.account.is_signed) return 'signed';
    if (app.account.audit_result) return 'approved';
    // 这里可以添加拒绝的逻辑，如果有相关字段
    return 'pending';
  };

  // 格式化日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 刷新列表
  const handleRefresh = () => {
    fetchApplications();
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
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button 
              onClick={handleRefresh}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('refresh')}
            </button>
            <Link href="/launch">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('newApplication')}
              </button>
            </Link>
            <SolanaConnectButton />
          </div>
        </div>

        {/* 未连接钱包提示 */}
        {!connected && (
          <div className="bg-gray-800/50 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-2">{tCommon('connectWalletPrompt')}</h2>
            <p className="text-gray-400 mb-6">{t('connectWalletDescription')}</p>
            <SolanaConnectButton />
          </div>
        )}

        {/* 加载中状态 */}
        {connected && loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* 错误状态 */}
        {connected && error && (
          <div className="bg-red-900/30 p-6 rounded-xl border border-red-800/50 mb-8">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-2">{t('errorLoading')}</h3>
                <p className="text-gray-300">{error.message}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-4 bg-red-800/50 hover:bg-red-700/50 text-white font-medium py-1 px-3 rounded transition-colors duration-200"
                >
                  {t('tryAgain')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 无申请记录 */}
        {connected && !loading && !error && myApplications.length === 0 && (
          <div className="bg-gray-800/50 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-2">{t('noApplications')}</h2>
            <p className="text-gray-400 mb-6">{t('noApplicationsDescription')}</p>
            <Link href="/launch">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                {t('createFirstApplication')}
              </button>
            </Link>
          </div>
        )}

        {/* 申请列表 */}
        {connected && !loading && !error && myApplications.length > 0 && (
          <div className="space-y-6">
            {myApplications.map((app, index) => (
              <motion.div
                key={app.publicKey.toString()}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-bold mr-3">{app.account.name}</h3>
                      <StatusBadge status={getApplicationStatus(app)} />
                    </div>
                    <p className="text-gray-400 mb-4">{app.account.mineCode}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">{t('location')}</p>
                        <p>{app.account.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('operator')}</p>
                        <p>{app.account.operator}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('scale')}</p>
                        <p>{app.account.scale}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">{t('financeScale')}</p>
                        <p>{app.account.financeScale.toString()} {app.account.currency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('rate')}</p>
                        <p>{(Number(app.account.rate) / 100).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('period')}</p>
                        <p>{app.account.frozenMonth} {t('months')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                    <div className="text-right mb-4">
                      <p className="text-sm text-gray-500">{t('applicationDate')}</p>
                      <p>{app.account.startDate}</p>
                    </div>

                    <div className="text-right mb-4">
                      <p className="text-sm text-gray-500">{t('endDate')}</p>
                      <p>{app.account.endDate}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200 cursor-pointer">
                        {t('viewDetails')}
                      </button>
                      
                      {getApplicationStatus(app) === 'approved' && (
                        <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
                          {t('sign')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
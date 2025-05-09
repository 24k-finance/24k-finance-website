'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
// import { SolanaConnectButton } from '@/components/SolanaConnectButton';

const SolanaConnectButton = dynamic(
    () => import('../components/SolanaConnectButton').then((mod) => mod.SolanaConnectButton),
    {
      ssr: false, // 关键：禁用服务器端渲染
      loading: () => <p></p> // 可选：添加加载状态指示器
    }
);

// 排行榜用户类型
interface LeaderboardUser {
  rank: number;
  address: string;
  displayName: string | null;
  points: number;
  isCurrentUser: boolean;
}

export default function LeaderboardPage() {
  const t = useTranslations('points');
  const { connected, publicKey } = useWallet();
  
  // 排行榜状态
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'allTime'>('allTime');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);

  // 模拟获取排行榜数据
  useEffect(() => {
    setIsLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 生成模拟数据
      const mockData: LeaderboardUser[] = Array.from({ length: 100 }, (_, i) => {
        const address = `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`;
        const isCurrentUser = i === 41; // 假设当前用户排名第42
        
        return {
          rank: i + 1,
          address,
          displayName: isCurrentUser ? '你' : Math.random() > 0.7 ? `User${Math.floor(Math.random() * 1000)}` : null,
          points: Math.floor(10000 / (i + 1)) + Math.floor(Math.random() * 100),
          isCurrentUser
        };
      });
      
      setLeaderboard(mockData);
      
      // 找到当前用户的排名
      const currentUser = mockData.find(user => user.isCurrentUser);
      if (currentUser) {
        setCurrentUserRank(currentUser);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [timeframe]);

  // 处理时间范围切换
  const handleTimeframeChange = (newTimeframe: 'daily' | 'weekly' | 'allTime') => {
    setTimeframe(newTimeframe);
  };

  // 截断地址显示
  const truncateAddress = (address: string) => {
    if (address.includes('...')) return address; // 已经截断的地址
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-8 sm:p-16">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题和连接钱包按钮 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('leaderboard.title')}</h1>
            <p className="text-gray-400">{t('leaderboard.subtitle')}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            {/* <Link href="/points" className="text-purple-400 hover:text-purple-300 mr-4">
              ← {t('backToPoints')}
            </Link> */}
            <SolanaConnectButton />
          </div>
        </div>

        {/* 时间范围选择器 */}
        <div className="flex space-x-2 mb-6">
          <button 
            onClick={() => handleTimeframeChange('daily')}
            className={`px-4 py-2 rounded-lg ${timeframe === 'daily' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            {t('leaderboard.daily')}
          </button>
          <button 
            onClick={() => handleTimeframeChange('weekly')}
            className={`px-4 py-2 rounded-lg ${timeframe === 'weekly' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            {t('leaderboard.weekly')}
          </button>
          <button 
            onClick={() => handleTimeframeChange('allTime')}
            className={`px-4 py-2 rounded-lg ${timeframe === 'allTime' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            {t('leaderboard.allTime')}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* 前三名展示 */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {leaderboard.slice(1, 2).map((user) => (
                <motion.div 
                  key={user.rank}
                  className="col-start-2 bg-gradient-to-b from-yellow-700/30 to-yellow-900/30 rounded-xl p-6 border border-yellow-600/30 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-2xl font-bold">
                      {user.rank}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl">
                    {user.displayName || truncateAddress(user.address)}
                  </h3>
                  <p className="text-yellow-400 font-bold text-2xl mt-2">{user.points} pts</p>
                </motion.div>
              ))}
              
              {leaderboard.slice(0, 1).map((user) => (
                <motion.div 
                  key={user.rank}
                  className="md:col-start-1 bg-gradient-to-b from-amber-700/30 to-amber-900/30 rounded-xl p-6 border border-amber-600/30 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-xl font-bold">
                      {user.rank}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg">
                    {user.displayName || truncateAddress(user.address)}
                  </h3>
                  <p className="text-amber-400 font-bold text-xl mt-2">{user.points} pts</p>
                </motion.div>
              ))}
              
              {leaderboard.slice(2, 3).map((user) => (
                <motion.div 
                  key={user.rank}
                  className="md:col-start-3 bg-gradient-to-b from-orange-800/30 to-orange-900/30 rounded-xl p-6 border border-orange-700/30 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center text-xl font-bold">
                      {user.rank}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg">
                    {user.displayName || truncateAddress(user.address)}
                  </h3>
                  <p className="text-orange-400 font-bold text-xl mt-2">{user.points} pts</p>
                </motion.div>
              ))}
            </div> */}

            {/* 排行榜表格 */}
            <div className="bg-gray-900/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/70">
                    <th className="py-3 px-4 text-left">{t('leaderboard.rank')}</th>
                    <th className="py-3 px-4 text-left">{t('leaderboard.user')}</th>
                    <th className="py-3 px-4 text-right">{t('leaderboard.points')}</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(0, 20).map((user) => (
                    <tr 
                      key={user.rank}
                      className={`border-b border-gray-800/50 last:border-b-0 ${
                        user.isCurrentUser ? 'bg-purple-900/30' : 'hover:bg-gray-800/30'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className={`
                          inline-flex items-center justify-center w-8 h-8 rounded-full 
                          ${user.rank === 1 ? 'bg-amber-600/50 text-amber-200' : 
                            user.rank === 2 ? 'bg-yellow-700/50 text-yellow-200' : 
                            user.rank === 3 ? 'bg-orange-700/50 text-orange-200' : 
                            'bg-gray-700/50 text-gray-200'}
                        `}>
                          {user.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.isCurrentUser ? (
                          <span className="font-bold text-purple-400">{user.displayName || truncateAddress(user.address)}</span>
                        ) : (
                          <span>{user.displayName || truncateAddress(user.address)}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {user.points} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 当前用户排名（如果不在前20名） */}
            {currentUserRank && currentUserRank.rank > 20 && (
              <div className="mt-4 bg-purple-900/30 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/50 text-gray-200 mr-3">
                      {currentUserRank.rank}
                    </span>
                    <span className="font-bold text-purple-400">
                      {currentUserRank.displayName || truncateAddress(currentUserRank.address)}
                    </span>
                  </div>
                  <span className="font-medium">{currentUserRank.points} pts</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
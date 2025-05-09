/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:49:29
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-09 09:49:33
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useFetchLaunchPools.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { useLaunchpadProgram } from './useLaunchpadProgram';

// 启动池信息类型
export interface LaunchPool {
  publicKey: PublicKey;
  account: {
    mineCode: string;
    authority: PublicKey;
    startDate: BN;
    endDate: BN;
    totalRaised: BN;
    targetAmount: BN;
    minInvestment: BN;
    vault: PublicKey;
    // 其他字段...
  }
}

export const useFetchLaunchPools = () => {
  const { program, loading, setLoading, error, setError } = useLaunchpadProgram();
  const [pools, setPools] = useState<LaunchPool[]>([]);
  
  const fetchPools = useCallback(async () => {
    if (!program) {
      setError(new Error('程序未初始化'));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 获取所有 LaunchPool 账户
      const allPools = await program.account.launchPool.all();
      setPools(allPools as LaunchPool[]);
    } catch (err) {
      console.error('获取启动池列表失败:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [program, setLoading, setError]);
  
  // 初始加载
  useEffect(() => {
    if (program) {
      fetchPools();
    }
  }, [program, fetchPools]);
  
  return {
    pools,
    fetchPools,
    loading,
    error
  };
};
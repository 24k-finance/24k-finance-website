/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:49:16
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-09 09:49:21
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useFetchMineApplications.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useLaunchpadProgram } from './useLaunchpadProgram';

// 金矿申请信息类型
export interface MineApplication {
  publicKey: PublicKey;
  account: {
    owner: PublicKey;
    mineName: string;
    description: string;
    startDate: number;
    endDate: number;
    mineCode: string;
    approved: boolean;
    signed: boolean;
    // 其他字段...
  }
}

export const useFetchMineApplications = () => {
  const { program, loading, setLoading, error, setError } = useLaunchpadProgram();
  const [applications, setApplications] = useState<MineApplication[]>([]);
  
  const fetchApplications = useCallback(async () => {
    if (!program) {
      setError(new Error('程序未初始化'));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 获取所有 MineApplication 账户
      const allApplications = await program.account.mineApplication.all();
      setApplications(allApplications as MineApplication[]);
    } catch (err) {
      console.error('获取金矿申请列表失败:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [program, setLoading, setError]);
  
  // 初始加载
  useEffect(() => {
    if (program) {
      fetchApplications();
    }
  }, [program, fetchApplications]);
  
  return {
    applications,
    fetchApplications,
    loading,
    error
  };
};
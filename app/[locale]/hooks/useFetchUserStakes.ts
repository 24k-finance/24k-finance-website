import { useCallback, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { useLaunchpadProgram } from './useLaunchpadProgram';

// 质押记录类型
export interface StakeRecord {
  publicKey: PublicKey;
  account: {
    investor: PublicKey;
    pool: PublicKey;
    amount: BN;
    stableCoin: string;
    timestamp: BN;
  }
}

export const useFetchUserStakes = () => {
  const { program, loading, setLoading, error, setError, wallet } = useLaunchpadProgram();
  const [stakeRecords, setStakeRecords] = useState<StakeRecord[]>([]);
  
  const fetchUserStakes = useCallback(async () => {
    if (!program || !wallet) {
      setError(new Error('程序未初始化或钱包未连接'));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 获取用户的所有质押记录
      const userStakes = await program.account.stakeRecord.all([
        {
          memcmp: {
            offset: 8, // 跳过账户歧义
            bytes: wallet.publicKey.toBase58()
          }
        }
      ]);
      
      setStakeRecords(userStakes as StakeRecord[]);
    } catch (err) {
      console.error('获取用户质押记录失败:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [program, wallet, setLoading, setError]);
  
  // 当钱包连接时加载
  useEffect(() => {
    if (program && wallet) {
      fetchUserStakes();
    }
  }, [program, wallet, fetchUserStakes]);
  
  return {
    stakeRecords,
    fetchUserStakes,
    loading,
    error
  };
};
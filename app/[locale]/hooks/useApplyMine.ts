/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:47:50
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-09 09:47:56
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useApplyMine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback } from 'react';
import { SystemProgram } from '@solana/web3.js';
import { useLaunchpadProgram, getProgramPDAs } from './useLaunchpadProgram';

// 申请金矿参数类型
export interface ApplyMineParams {
  mineName: string;
  description: string;
  startDate: number; // Unix 时间戳
  endDate: number;   // Unix 时间戳
  mineCode: string;  // 唯一标识符
  // 其他必要参数...
}

export const useApplyMine = () => {
  const { program, loading, setLoading, error, setError, wallet } = useLaunchpadProgram();
  
  const applyMine = useCallback(async (params: ApplyMineParams) => {
    if (!program || !wallet) {
      setError(new Error('请先连接钱包'));
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { mineAppPDA } = getProgramPDAs(params.mineCode);
      
      // 调用合约方法
      const txSignature = await program.methods
        .applyMine(params)
        .accounts({
          application: mineAppPDA,
          owner: wallet.publicKey,
          systemProgram: SystemProgram.programId
        })
        .rpc();
      
      return {
        txSignature,
        mineAppPDA
      };
    } catch (err) {
      console.error('申请金矿失败:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [program, wallet, setLoading, setError]);
  
  return {
    applyMine,
    loading,
    error
  };
};
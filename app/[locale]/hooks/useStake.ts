/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:48:49
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-09 09:48:55
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useStake.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback } from 'react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { BN } from '@project-serum/anchor';
import { useLaunchpadProgram, getProgramPDAs } from './useLaunchpadProgram';

// 质押参数类型
export interface StakeParams {
  amount: BN;          // 质押金额 (以最小单位计算，例如 USDC 的 6 位小数)
  stableCoin: string;  // 稳定币类型 ("USDC" 或 "USDT")
  txnHash?: string;    // 可选的交易哈希
}

export const useStake = () => {
  const { program, loading, setLoading, error, setError, wallet } = useLaunchpadProgram();
  
  const stake = useCallback(async (
    mineCode: string,
    params: StakeParams,
    userTokenAccount: PublicKey,
    poolVault: PublicKey
  ) => {
    if (!program || !wallet) {
      setError(new Error('请先连接钱包'));
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { launchPoolPDA, stakeRecordPDA } = getProgramPDAs(mineCode, wallet.publicKey);
      
      if (!stakeRecordPDA) {
        throw new Error('无法生成质押记录 PDA');
      }
      
      // 调用合约方法
      const txSignature = await program.methods
        .stake(params)
        .accounts({
          pool: launchPoolPDA,
          vault: poolVault,
          from: userTokenAccount,
          record: stakeRecordPDA,
          investor: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId
        })
        .rpc();
      
      return {
        txSignature,
        stakeRecordPDA
      };
    } catch (err) {
      console.error('质押失败:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [program, wallet, setLoading, setError]);
  
  return {
    stake,
    loading,
    error
  };
};
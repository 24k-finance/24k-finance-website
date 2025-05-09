/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:49:04
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-09 09:49:09
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useRelease.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useLaunchpadProgram, getProgramPDAs } from './useLaunchpadProgram';

export const useRelease = () => {
  const { program, loading, setLoading, error, setError, wallet } = useLaunchpadProgram();
  
  const release = useCallback(async (
    mineCode: string,
    vaultPDA: PublicKey,
    receiverTokenAccount: PublicKey
  ) => {
    if (!program || !wallet) {
      setError(new Error('请先连接钱包'));
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { launchPoolPDA } = getProgramPDAs(mineCode);
      
      // 调用合约方法
      const txSignature = await program.methods
        .release()
        .accounts({
          pool: launchPoolPDA,
          vault: vaultPDA,
          receiver: receiverTokenAccount,
          authority: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .rpc();
      
      return {
        txSignature
      };
    } catch (err) {
      console.error('提款失败:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [program, wallet, setLoading, setError]);
  
  return {
    release,
    loading,
    error
  };
};
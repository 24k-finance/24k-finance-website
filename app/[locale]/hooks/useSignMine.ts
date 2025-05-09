/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:48:20
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-09 09:48:24
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useSignMine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback } from 'react';
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useLaunchpadProgram, getProgramPDAs } from './useLaunchpadProgram';

export const useSignMine = () => {
  const { program, loading, setLoading, error, setError, wallet } = useLaunchpadProgram();
  
  const signMine = useCallback(async (
    mineCode: string, 
    usdcMint: PublicKey
  ) => {
    if (!program || !wallet) {
      setError(new Error('请先连接钱包'));
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { mineAppPDA, launchPoolPDA } = getProgramPDAs(mineCode);
      
      // 创建一个新的 Keypair 作为 vault 的签名者
      const vaultKeypair = Keypair.generate();
      
      // 调用合约方法
      const txSignature = await program.methods
        .signMine(mineCode)
        .accounts({
          application: mineAppPDA,
          owner: wallet.publicKey,
          launchPool: launchPoolPDA,
          paymentVault: vaultKeypair.publicKey,
          paymentMint: usdcMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: PublicKey.default // 租金豁免账户
        })
        .signers([vaultKeypair])
        .rpc();
      
      return {
        txSignature,
        launchPoolPDA,
        vaultPDA: vaultKeypair.publicKey
      };
    } catch (err) {
      console.error('签署金矿失败:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [program, wallet, setLoading, setError]);
  
  return {
    signMine,
    loading,
    error
  };
};
/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:48:20
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-15 11:39:50
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useSignMine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback } from 'react';
import { PublicKey, SystemProgram, Keypair, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { useLaunchpadProgram, getProgramPDAs } from './useLaunchpadProgram';
import { useWallet } from '@solana/wallet-adapter-react';

export const useSignMine = () => {
  const { program, loading, setLoading, error, setError, wallet, connection } = useLaunchpadProgram();
  const { wallet: w1 } = useWallet();
  
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
    console.log('开始签署金矿:', wallet);
    try {
      const { mineAppPDA, launchPoolPDA, bumpLaunchPool } = getProgramPDAs(mineCode);

      const poolATA = await getAssociatedTokenAddress(
        usdcMint,
        launchPoolPDA,
        true // allowOwnerOffCurve - 对 PDA 需要设置为 true
      );

      const receiver = await getAssociatedTokenAddress(
        usdcMint,
        wallet.publicKey,
        false
      );

      console.log('使用的关联代币账户:', poolATA.toBase58(), mineCode, bumpLaunchPool);
      const signMineIx = await program.methods
        .signMine(mineCode, bumpLaunchPool)
        .accounts({
          application: mineAppPDA,
          owner: wallet.publicKey,
          launchPool: launchPoolPDA,
          paymentVault: poolATA, 
          paymentMint: usdcMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          receiver,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        })
        // .signers([
        //   connection,
        //   wallet.publicKey
        // ])
        .rpc();
        
        return {
          txSignature: signMineIx,
          launchPoolPDA,
          vaultPDA: poolATA
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
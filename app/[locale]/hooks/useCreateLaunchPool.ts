/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-12 19:22:08
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-12 22:40:52
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useCreateLaunchPool.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// hooks/useCreateLaunchPool.ts
import { useAnchorWallet } from "@solana/wallet-adapter-react";
// import { Program } from "@project-serum/anchor";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Keypair,
  Transaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PROGRAM_ID } from "../constant";
import { getProgramPDAs, useLaunchpadProgram } from "./useLaunchpadProgram";

export const useCreateLaunchPool = () => {
//   const wallet = useAnchorWallet();
  const { program, loading, setLoading, error, setError, wallet } = useLaunchpadProgram();
  const createLaunchPool = async ({
    mineCode,
    usdtMint,
  }: {
    mineCode: string;
    usdtMint: PublicKey;
  }) => {
    try {
      if (!program || !wallet) {
        setError(new Error('请先连接钱包'));
        return null;
      }
  
      // 1. 验证应用状态
      const [mineAppPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("mine_app"), Buffer.from(mineCode)],
        PROGRAM_ID
      );
      const appAccount = await program.account.mineApplication.fetch(mineAppPDA);
      
      if (!appAccount.auditResult) {
        throw new Error('项目尚未通过审核');
      }
      if (appAccount.isSigned) {
        throw new Error('项目已签署过');
      }
  
      // 2. 生成PDA账户
      const [launchPoolPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("launch_pool"), Buffer.from(mineCode)],
        PROGRAM_ID
      );
  
      // 3. 创建关联代币账户
      const paymentVault = await getAssociatedTokenAddress(
        usdtMint,
        launchPoolPDA,
        true,
        TOKEN_PROGRAM_ID
      );
  
      // 调试日志
      console.log('PDA派生验证:', {
        expectedLaunchPool: launchPoolPDA.toBase58(),
        expectedPaymentVault: paymentVault.toBase58()
      });
  
      // 4. 构建ATA创建指令
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        paymentVault,
        launchPoolPDA,
        usdtMint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
  
      // 5. 执行交易
      return await program.methods
        .signMine(mineCode)
        .accounts({
          application: mineAppPDA,
          owner: wallet.publicKey,
          launchPool: launchPoolPDA,
          paymentVault: paymentVault,
          paymentMint: usdtMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        })
        .preInstructions([
          createATAInstruction,
          // 添加租金检查
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: launchPoolPDA,
            lamports: await program.provider.connection.getMinimumBalanceForRentExemption(500)
          })
        ])
        .rpc({
          skipPreflight: false, // 开启预检查
          commitment: "confirmed"
        });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
      console.error('交易失败:', err);
      return null;
    }
  };
  return { createLaunchPool };
};
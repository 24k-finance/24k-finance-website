/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-12 19:22:08
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-12 21:59:03
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
    if (!program || !wallet) {
        setError(new Error('请先连接钱包'));
        return null;
      }
      
    if (!wallet) throw new Error("Wallet not connected");

    const { mineAppPDA, launchPoolPDA } = getProgramPDAs(mineCode);

    // 重要：使用 getAssociatedTokenAddress 获取与 launchPoolPDA 关联的代币账户
    // 第三个参数设为 true 表示这是一个 PDA 拥有的代币账户
    const paymentVault = await getAssociatedTokenAddress(
      usdtMint,  // 使用传入的 usdtMint
      launchPoolPDA,  // 重要：所有者应该是 launchPoolPDA
      true,  // 表示这是一个 PDA 拥有的代币账户
      TOKEN_PROGRAM_ID
    );

    console.log("wallet object:", wallet);
    console.log("wallet.publicKey:", wallet?.publicKey?.toBase58());
    console.log("wallet.signTransaction:", typeof wallet?.signTransaction);
    console.log("launchPoolPDA:", launchPoolPDA.toBase58());
    console.log("paymentVault:", paymentVault.toBase58());
    console.log("usdtMint:", usdtMint.toBase58());
    console.log("mineAppPDA:", mineAppPDA.toBase58());

    const createATAInstruction = createAssociatedTokenAccountInstruction(
      wallet.publicKey,  // 付款人
      paymentVault,      // 关联代币账户地址
      launchPoolPDA,     // 代币账户所有者
      usdtMint,           // 代币铸币厂
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const signature =  await program.methods
      .signMine(mineCode)
      .accounts({
        application: mineAppPDA,
        owner: wallet.publicKey,
        launchPool: launchPoolPDA,
        paymentVault: paymentVault,  // 使用正确的 paymentVault
        paymentMint: usdtMint,  // 使用传入的 usdtMint
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY
      })
      // .preInstructions([
      //   createAssociatedTokenAccountInstruction(
      //     wallet.publicKey,  // 付款人
      //     paymentVault,      // 关联代币账户地址
      //     launchPoolPDA,     // 代币账户所有者
      //     usdtMint           // 代币铸币厂
      //   )
      // ])
      .preInstructions([createATAInstruction])
      .rpc({ skipPreflight: true });

       // 3. 创建交易并添加指令
      //  const transaction = new Transaction()
      //  .add(createATAInstruction)
      //  .add(signMineInstruction);

      //  const signature = await program.provider.sendAndConfirm!(transaction, []);
       console.log("交易成功，签名:", signature);
       return signature;
  };

  return { createLaunchPool };
};
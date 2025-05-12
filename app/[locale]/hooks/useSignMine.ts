/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:48:20
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-12 18:43:25
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useSignMine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback } from 'react';
import { PublicKey, SystemProgram, Keypair, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
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

      const poolATA = await getAssociatedTokenAddress(
        usdcMint,
        launchPoolPDA,
        true // allowOwnerOffCurve - 对 PDA 需要设置为 true
      );
      console.log('使用的关联代币账户:', poolATA.toBase58(), mineCode);
      // 创建一个新的 Keypair 作为临时签名者
      // const vaultKeypair = Keypair.generate();
      
      // 2. 创建一个包含所有指令的单一交易
      const tx = new Transaction();

      try {
        await program.provider.connection.getAccountInfo(poolATA);
        console.log('关联代币账户已存在');
      } catch (e) {
        console.log('创建关联代币账户');
        // 创建关联代币账户的指令
        const createATAIx = createAssociatedTokenAccountInstruction(
          wallet.publicKey, // 付款人
          poolATA, // 关联代币账户地址
          launchPoolPDA, // 所有者
          usdcMint // 代币铸币厂
        );
        tx.add(createATAIx);
      }    
      
      // 添加创建 vault 账户的指令
      // tx.add(createVaultIx);
      
      // 添加 signMine 指令
      const signMineIx = await program.methods
        .signMine(mineCode)
        .accounts({
          application: mineAppPDA,
          owner: wallet.publicKey,
          launchPool: launchPoolPDA,
          paymentVault: poolATA, // 使用 PDA 而不是 keypair
          paymentMint: usdcMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        })
        .instruction();
      
      tx.add(signMineIx);
      
      // 设置最近的区块哈希和付款人
      const { blockhash } = await program.provider.connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = wallet.publicKey;
      
      // 使用钱包签名交易
      if (wallet.signTransaction) {
        const signedTx = await wallet.signTransaction(tx);
        // 添加 vaultKeypair 的签名
        // signedTx.partialSign(vaultKeypair);
        
        // 发送已签名的交易
        const txid = await program.provider.connection.sendRawTransaction(
          signedTx.serialize(),
          { skipPreflight: false, preflightCommitment: 'confirmed' }
        );
        
        // 等待交易确认
        await program.provider.connection.confirmTransaction(txid, 'confirmed');
        
        console.log('交易已确认，签名：', txid, poolATA.toBase58());
        
        return {
          txSignature: txid,
          launchPoolPDA,
          vaultPDA: poolATA // 返回 PDA 而不是临时 keypair
        };
      } else {
        throw new Error('钱包不支持签名交易');
      }
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
/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:47:50
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-09 21:14:22
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useApplyMine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback } from 'react';
import { SystemProgram } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { useLaunchpadProgram, getProgramPDAs } from './useLaunchpadProgram';

// 申请金矿参数类型
export interface ApplyMineParams {
    mine_code: string;    // 平台生成的编号，长度限制：MAX_MINE_CODE_LEN
  name: string;         // 矿产官方名称，长度限制：MAX_NAME_LEN
  operator: string;     // 运营方名称，长度限制：MAX_OPERATOR_LEN
  relationship: string; // 关系证明文件 URI，长度限制：MAX_RELATIONSHIP_LEN
  scale: string;        // 矿产规模，长度限制：MAX_SCALE_LEN
  location: string;     // 矿产位置，长度限制：MAX_LOCATION_LEN
  approval1: string;    // 政府确权文件 URI，长度限制：MAX_APPROVAL_LEN
  approval2: string;    // 施工许可文件 URI，长度限制：MAX_APPROVAL_LEN
  approval3: string;    // 其他政策文件 URI，长度限制：MAX_APPROVAL_LEN
  finance_scale: BN;    // 融资规模（元），类型：u128 (使用 BN 表示)
  currency: string;     // 法币单位，长度限制：MAX_CURRENCY_LEN
  start_date: BN;       // 融资开始时间，类型：i64 (使用 BN 表示)
  end_date: BN;         // 融资结束时间，类型：i64 (使用 BN 表示)
  rate: BN;             // 年化率（实际除以10000），类型：u32 (使用 BN 表示)
  frozen_month: BN;     //
  }

export const useApplyMine = () => {
  const { program, loading, setLoading, error, setError, wallet } = useLaunchpadProgram();
  const { connection } = useConnection();
  
  const applyMine = useCallback(async (params: any) => {
    if (!program || !wallet) {
      setError(new Error('请先连接钱包'));
      return null;
    }
    
    setLoading(true);
    setError(null);

    const { mineAppPDA } = getProgramPDAs(params.mineCode);
    
    try {
      const tx = await program.methods
      .applyMine(params)
      .accounts({
        application: mineAppPDA,
        owner: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .transaction(); // 注意这里不是 rpc()，是 transaction()

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = wallet.publicKey;

    const signed = await wallet.signTransaction(tx);
    const txSig = await connection.sendRawTransaction(signed.serialize());

    await connection.confirmTransaction(txSig);
      
      return {
        txSignature: txSig,
        mineAppPDA
      };
    } catch (err: any) {
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
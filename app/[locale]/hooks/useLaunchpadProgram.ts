/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:46:29
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-09 09:46:44
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useLaunchpadProgram.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Idl, BN } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { useState, useMemo } from 'react';
import { goldmineFactoryIdl } from '@/idl/goldmine_idl';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { PROGRAM_ID } from '../constant';

// PDA 生成工具函数
export const getProgramPDAs = (mineCode: string, userPublicKey?: PublicKey) => {
  // 矿申请 PDA
  const [mineAppPDA] = findProgramAddressSync(
    [Buffer.from("mine_app"), Buffer.from(mineCode)], 
    PROGRAM_ID
  );
  
  // 启动池 PDA
  const [launchPoolPDA] = findProgramAddressSync(
    [Buffer.from("launch_pool"), Buffer.from(mineCode)], 
    PROGRAM_ID
  );
  
  // 质押记录 PDA (如果提供了用户公钥)
  let stakeRecordPDA = null;
  if (userPublicKey) {
    [stakeRecordPDA] = findProgramAddressSync(
      [Buffer.from("stake_record"), Buffer.from(mineCode), userPublicKey.toBuffer()], 
      PROGRAM_ID
    );
  }
  
  return {
    mineAppPDA,
    launchPoolPDA,
    stakeRecordPDA
  };
};

// 使用 Launchpad 程序的 Hook
export const useLaunchpadProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 初始化程序
  const program = useMemo(() => {
    if (!wallet) return null;
    
    const provider = new AnchorProvider(
      connection, 
      wallet, 
      { commitment: 'confirmed' }
    );
    
    return new Program(
      goldmineFactoryIdl as Idl, 
      PROGRAM_ID, 
      provider
    );
  }, [connection, wallet]);
  
  return {
    program,
    loading,
    setLoading,
    error,
    setError,
    wallet,
    connection
  };
};
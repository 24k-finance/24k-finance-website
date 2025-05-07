/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-07 14:29:54
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-07 14:30:00
 * @FilePath: /24k-finance-website/app/hooks/useIdl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState, useEffect } from 'react';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

/**
 * 自定义Hook，用于从Solana获取程序IDL
 * @param programId - Solana程序ID
 * @returns 包含IDL数据、加载状态和错误信息的对象
 */
export const useIdl = (programId: string) => {
  const [idl, setIdl] = useState<Idl | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const wallet = useWallet();
  
  useEffect(() => {
    const fetchIdl = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 创建连接到devnet的Connection对象
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        
        // 创建AnchorProvider
        const provider = new AnchorProvider(
          connection,
          wallet as any,
          { commitment: 'confirmed' }
        );
        
        // 创建程序PublicKey
        const programPubkey = new PublicKey(programId);
        
        // 获取IDL
        const fetchedIdl = await Program.fetchIdl(programPubkey, provider);
        
        if (fetchedIdl) {
          setIdl(fetchedIdl);
        } else {
          throw new Error('无法获取IDL，可能程序ID不正确或IDL不存在');
        }
      } catch (err) {
        console.error('获取IDL时出错:', err);
        setError(err instanceof Error ? err : new Error('获取IDL时发生未知错误'));
      } finally {
        setLoading(false);
      }
    };

    if (wallet.connected) {
      fetchIdl();
    }
  }, [programId, wallet.connected]);

  return { idl, loading, error };
};
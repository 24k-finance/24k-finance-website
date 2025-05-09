/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:48:07
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-09 21:47:10
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useApproveMine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback } from 'react';
import { useLaunchpadProgram, getProgramPDAs } from './useLaunchpadProgram';

export const useApproveMine = () => {
  const { program, loading, setLoading, error, setError, wallet } = useLaunchpadProgram();
  
  const approveMine = useCallback(async (mineCode: string) => {
    if (!program || !wallet) {
      setError(new Error('请先连接钱包'));
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { mineAppPDA } = getProgramPDAs(mineCode);
      
      // 调用合约方法
      const txSignature = await program.methods
        .approveMine(mineCode)
        .accounts({
          application: mineAppPDA,
          // admin: wallet.publicKey.toBase58(),
        })
        .rpc();
      
      return {
        txSignature,
        mineAppPDA
      };
    } catch (err) {
      console.error('审核金矿失败:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [program, wallet, setLoading, setError]);
  
  return {
    approveMine,
    loading,
    error
  };
};
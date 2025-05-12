/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-09 09:49:16
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-12 15:21:41
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useFetchMineApplications.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useLaunchpadProgram } from './useLaunchpadProgram';
import { containsChinese, formatBNDecimal, toDate } from '../utils';

// 金矿申请信息类型
export interface MineApplication {
  publicKey: PublicKey;
  account: {
    owner: PublicKey;
    mineName: string;
    description: string;
    startDate: number;
    endDate: number;
    mineCode: string;
    approved: boolean;
    signed: boolean;
    auditResult: boolean; // 添加 auditResult 字段
  }
}

export const useFetchMineApplications = (isSign: boolean = true) => {
  const { program, loading, setLoading, error, setError } = useLaunchpadProgram();
  const [applications, setApplications] = useState<any[]>([]);
  
  const fetchApplications = useCallback(async () => {
    if (!program) {
      setError(new Error('程序未初始化'));
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      // 获取所有 MineApplication 账户
      const allApplications = await program.account.mineApplication.all();
      
      const fixedApplications = allApplications.map((item: any) => {
        const account = item.account;
        
        // 检查每个字段是否存在，缺失字段使用默认值
        return {
          publicKey: item.publicKey,
          account: {
            mineCode: account.mineCode,
            name: account.name,
            operator: account.operator,
            relationship: account.relationship,
            approval1: account.approval1,
            approval2: account.approval2,
            approval3: account.approval3,
            scale: account.scale,
            location: account.location,
            currency: account.currency,
            financeScale: formatBNDecimal(account.financeScale, 1),
            startDate: toDate(account.startDate),
            endDate: toDate(account.endDate),
            signDate: toDate(account.signDate),
            rate: account.rate * 10000,
            frozenMonth: account.frozenMonth,
            auditResult: account.auditResult,
            isSigned: account.isSigned,
            owner: account.owner.toBase58(),
          }
        };
      });
      setApplications(fixedApplications.filter((item: any) => !containsChinese(item.account.name)).filter((item: any) => item.account.isSigned === isSign));
    } catch (err) {
      // console.error('获取金矿申请列表失败:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [program, setLoading, setError]);
  
  // 初始加载
  useEffect(() => {
    if (program) {
      fetchApplications();
    }
  }, [program, fetchApplications]);
  
  return {
    applications,
    fetchApplications,
    loading,
    error
  };
};
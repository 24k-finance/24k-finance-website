/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 19:55:39
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-08 17:58:17
 * @FilePath: /24k-finance-website/app/components/SolanaConnectButton.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client"; // 客户端组件需要使用 Hooks

import React, { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useTranslations } from 'next-intl';

export const SolanaConnectButton: React.FC = ({ className }: { className?: string }) => {
  const t = useTranslations('common'); 
  // 从 @solana/wallet-adapter-react 获取钱包状态和方法
  const { publicKey, wallet, connecting, connected } = useWallet();
  // 从 @solana/wallet-adapter-react-ui 获取控制模态框的方法
  const { visible, setVisible } = useWalletModal();

  // 处理按钮点击事件
  const handleClick = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  // 格式化公钥以缩短显示
  const formatPublicKey = (key: string | null | undefined): string => {
    if (!key) return '';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  const buttonText = () => {
    if (connecting) {
      return t('connecting');
    }
    if (connected && publicKey) {
      // 显示已连接钱包的部分公钥
      return t('connectedAddress', { address: formatPublicKey(publicKey.toBase58()) });
    }
    if (wallet) {
      // 如果选择了钱包但尚未连接（例如，在模态框中选择了但取消了）
      return t('connectWalletName', { walletName: wallet.adapter.name });
    }
    // 默认状态
    return t('connectWallet');
  };

  return (
    <button
      onClick={handleClick}
      disabled={connecting} // 正在连接时禁用按钮
      className={
        className || "text-sm border border-gray-600 rounded-full px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white transition-colors flex items-center gap-2"
      }
    >
      {buttonText()}
      {
        (connected && publicKey) ? (
          null
        ) : <span aria-hidden="true">→</span>
      }
    </button>
  );
};

export default SolanaConnectButton;
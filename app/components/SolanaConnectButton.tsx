/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 19:55:39
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-05 19:56:59
 * @FilePath: /24k-finance-website/app/components/SolanaConnectButton.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client"; // 客户端组件需要使用 Hooks

import React, { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const SolanaConnectButton: React.FC = () => {
  // 从 @solana/wallet-adapter-react 获取钱包状态和方法
  const { publicKey, wallet, connecting, connected } = useWallet();
  // 从 @solana/wallet-adapter-react-ui 获取控制模态框的方法
  const { visible, setVisible } = useWalletModal();

  // 处理按钮点击事件
  const handleClick = useCallback(() => {
    // 如果模态框可见或正在连接或已连接，则不执行任何操作（或根据需要调整逻辑）
    // 这里我们让按钮在任何状态下都尝试打开模态框，模态框内部会处理连接/断开逻辑
    setVisible(true);
  }, [setVisible]);

  // 格式化公钥以缩短显示
  const formatPublicKey = (key: string | null | undefined): string => {
    if (!key) return '';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  // 决定按钮文本
  const buttonText = () => {
    if (connecting) {
      return "Connecting...";
    }
    if (connected && publicKey) {
      // 显示已连接钱包的部分公钥
      return `Connected: ${formatPublicKey(publicKey.toBase58())}`;
    }
    if (wallet) {
      // 如果选择了钱包但尚未连接（例如，在模态框中选择了但取消了）
      return `Connect (${wallet.adapter.name})`;
    }
    // 默认状态
    return "Connect Wallet";
  };

  return (
    <button
      onClick={handleClick}
      disabled={connecting} // 正在连接时禁用按钮
      className="text-sm border border-gray-600 rounded-full px-4 py-2 text-gray-300 hover:bg-white/10 hover:border-white transition-colors flex items-center gap-2"
    >
      {buttonText()}
      <span aria-hidden="true">→</span>
    </button>
  );
};

export default SolanaConnectButton;
"use client";
/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-05 19:49:08
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-05 19:53:19
 * @FilePath: /24k-finance-website/app/provider/WalletContextProvider.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'; // 根据需要调整钱包列表
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// 引入 Wallet Adapter UI 的 CSS
// require('@solana/wallet-adapter-react-ui/styles.css');

// 定义 Props 类型，包含 children
interface WalletContextProviderProps {
    children: ReactNode;
}

const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
    // 可以选择 'devnet', 'testnet', 或 'mainnet-beta'
    const network = WalletAdapterNetwork.Devnet;

    // 你可以配置 endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets 包含了很多钱包适配器
    // 确保只在这里定义一次，或者从外部传入配置
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            // 添加更多你想要支持的钱包
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children} {/* 渲染子组件 */}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletContextProvider;
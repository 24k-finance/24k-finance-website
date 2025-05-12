import { useCallback, useState } from 'react';
import {
  PublicKey,
  SystemProgram,
  Keypair,
  Transaction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptAccount,
} from '@solana/spl-token';
import {
  useLaunchpadProgram,
  getProgramPDAs,
} from './useLaunchpadProgram';
import { useWallet } from '@solana/wallet-adapter-react';

type SignResult = {
//   txSignature: string;
  launchPoolPDA: PublicKey;
  paymentVaultPDA: PublicKey;
  vaultKeypair: Keypair;
  tx: Transaction;
};

export const useSignMineAndInitVault = () => {
//   const { wallet } = useWallet();
  const { program, setLoading, setError, wallet } = useLaunchpadProgram();
  const [signing, setSigning] = useState(false);

  const signMineAndInitVault = useCallback(
    async (mineCode: string, usdcMint: PublicKey): Promise<SignResult | null> => {
      if (!wallet?.publicKey || !program) {
        setError(new Error('请先连接钱包'));
        return null;
      }

      setSigning(true);
      setError(null);

      try {
        const { launchPoolPDA, mineAppPDA } = getProgramPDAs(mineCode);

        // 派生 vault PDA（可被 stake 等重复获取）
        const [paymentVaultPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from('payment_vault'), launchPoolPDA.toBuffer(), usdcMint.toBuffer()],
          program.programId
        );

        // 临时 vault keypair（只用于 signMine 指令签名）
        const vaultKeypair = Keypair.generate();

        // Step 2: 初始化 PDA（可选：你也可以通过合约完成，而非客户端）
        const lamports =
           await program.provider.connection.getMinimumBalanceForRentExemption(0);

        const createVaultIx = SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: vaultKeypair.publicKey,
            lamports,
            space: 0,
            programId: program.programId,
          });

        // Step 1: 签署合约（通过 signMine）
        const txSignature = await program.methods
          .signMine(mineCode)
          .accounts({
            owner: wallet.publicKey,
            application: mineAppPDA,
            launchPool: launchPoolPDA,
            paymentVault: paymentVaultPDA,
            paymentMint: usdcMint,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([vaultKeypair])
          .instruction()
        //   .rpc();

        const tx = new Transaction().add(createVaultIx).add(txSignature);
        await program.provider.sendAndConfirm!(tx, [vaultKeypair]);

        return {
        //   txSignature,
          launchPoolPDA,
          paymentVaultPDA,
          vaultKeypair,
          tx
        };
      } catch (err) {
        console.error('签署或初始化失败:', err);
        setError(err as Error);
        return null;
      } finally {
        setSigning(false);
      }
    },
    [wallet, program, setError]
  );

  return {
    signMineAndInitVault,
    signing,
  };
};

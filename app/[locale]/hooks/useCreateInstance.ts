/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-07 20:11:36
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-09 09:25:37
 * @FilePath: /24k-finance-website/app/[locale]/hooks/useCreateInstance.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback, useState } from 'react'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { AnchorProvider, Idl, Program, web3 } from '@project-serum/anchor'
// import idl from '@/idl/goldmine_factory.json' // 替换为你的 IDL 路径
import { PublicKey } from '@solana/web3.js'

export const goldmineFactoryIdl = {
    version: "0.1.0",
    name: "goldmine_factory",
    instructions: [
      {
        name: "createInstance",
        accounts: [
          {
            name: "instance",
            isMut: true,
            isSigner: false,
          },
          {
            name: "authority",
            isMut: true,
            isSigner: true,
          },
          {
            name: "systemProgram",
            isMut: false,
            isSigner: false,
          },
        ],
        args: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "programId",
            type: "publicKey",
          },
        ],
      },
    ],
    accounts: [
      {
        name: "instance",
        type: {
          kind: "struct",
          fields: [
            {
              name: "name",
              type: {
                array: ["u8", 32],
              },
            },
            {
              name: "programId",
              type: "publicKey",
            },
            {
              name: "authority",
              type: "publicKey",
            },
          ],
        },
      },
    ],
  };
  

type CreateInstanceResult = {
  txSignature: string
  instancePda: PublicKey
}

export const useCreateInstance = () => {
    const { connection } = useConnection()
    const wallet = useAnchorWallet()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
  
    const createInstance = useCallback(
      async (name: string, programIdStr: string): Promise<CreateInstanceResult | null> => {
        if (!wallet) throw new Error('请先连接钱包')
  
        setLoading(true)
        setError(null)
  
        try {
          const provider = new AnchorProvider(connection, wallet, {
            commitment: 'confirmed',
          })
  
          const programId = new PublicKey(programIdStr)
          const program = new Program(goldmineFactoryIdl as Idl, programId, provider)
  
          const nameSeed = Buffer.from(name)
          if (nameSeed.length > 32) {
            throw new Error('实例名称过长，最多 32 字节')
          }
  
          const [instancePda] = await PublicKey.findProgramAddress(
            [Buffer.from('instance'), nameSeed],
            programId
          )
  
          const targetProgramId = new PublicKey(programIdStr)
  
          const tx = await program.methods
            .createInstance(name, targetProgramId)
            .accounts({
              instance: instancePda,
              authority: provider.wallet.publicKey,
              systemProgram: web3.SystemProgram.programId,
            })
            .rpc()
  
          return { txSignature: tx, instancePda }
        } catch (err) {
          setError(err as Error)
          console.error('创建 instance 失败:', err)
          return null
        } finally {
          setLoading(false)
        }
      },
      [connection, wallet]
    )
  
    return {
      createInstance,
      loading,
      error,
    }
  }
  
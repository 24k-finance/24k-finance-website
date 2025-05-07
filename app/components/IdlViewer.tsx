/*
 * @Author: leelongxi leelongxi@foxmail.com
 * @Date: 2025-05-07 14:30:27
 * @LastEditors: leelongxi leelongxi@foxmail.com
 * @LastEditTime: 2025-05-07 14:35:02
 * @FilePath: /24k-finance-website/app/components/IdlViewer.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client"

import { useIdl } from '@/app/hooks/useIdl';
import { useState } from 'react';

interface IdlViewerProps {
  programId?: string;
}

export default function IdlViewer({ programId = '91N4aCumtu3x4E4SgqS8cKfKXk3LdHuHqN5xZ1qnunkV' }: IdlViewerProps) {
  const { idl, loading, error } = useIdl(programId);
  const [expanded, setExpanded] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="p-4 bg-slate-800 rounded-lg">
        <p className="text-blue-400">正在加载IDL数据...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 rounded-lg border border-red-500">
        <p className="text-red-400">加载IDL时出错: {error.message}</p>
      </div>
    );
  }

  if (!idl) {
    return (
      <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-500">
        <p className="text-yellow-400">未找到IDL数据。请确保程序ID正确且IDL已发布。</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        {/* <h3 className="text-xl font-bold text-white">{idl.metadata} IDL</h3> */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          {expanded ? '收起' : '展开'}
        </button>
      </div>
      
      {expanded ? (
        <pre className="bg-slate-900 p-4 rounded overflow-auto max-h-[500px] text-sm">
          {JSON.stringify(idl, null, 2)}
        </pre>
      ) : (
        <div>
          <p className="text-slate-300 mb-2">程序版本: {idl.address}</p>
          <p className="text-slate-300 mb-2">指令数量: {idl.instructions?.length || 0}</p>
          <p className="text-slate-300 mb-2">账户数量: {idl.accounts?.length || 0}</p>
          <p className="text-slate-300">点击"展开"查看完整IDL</p>
        </div>
      )}
    </div>
  );
}
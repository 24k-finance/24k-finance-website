"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Link } from '@/i18n/navigation'
import { Youtube, Twitter, Github, Send } from 'lucide-react'

export function MiningPlatformHero() {
  const t = useTranslations('miningPlatform');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<any[]>([])
  
  useEffect(() => {
    // 在客户端生成粒子
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: Math.random() * 8 + 4,
      height: Math.random() * 8 + 4,
      yMove: Math.random() * 40 - 20,
      xMove: Math.random() * 40 - 20,
      duration: 1.2 + Math.random() * 2,
      color: i % 3 === 0 ? '#9945FF' : i % 3 === 1 ? '#14F195' : '#00C2FF',
    }))
    
    setParticles(newParticles)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])
  
  // 社交媒体链接
  const socialLinks = [
    { Icon: Youtube, href: '#', label: 'YouTube' },
    { Icon: Twitter, href: 'https://x.com/24K_finance', label: 'Twitter' },
    { Icon: Github, href: 'https://github.com/24k-finance', label: 'GitHub' },
    { Icon: Send, href: 'https://t.me/Finance24K', label: 'Telegram' },
  ];
  
  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl">
      {/* 背景渐变 */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#9945FF] via-[#8752F3] to-[#14F195]"
        style={{
          backgroundPosition: `${mousePosition.x / 50}px ${mousePosition.y / 50}px`
        }}
      />
      
      {/* 光效元素 */}
      <div className="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-[#9945FF] opacity-40 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#14F195] opacity-30 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-[#00C2FF] opacity-25 blur-2xl" />
      
      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      {/* 内容 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(20,241,149,0.5)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t('title')}
        </motion.h1>
        
        <motion.p 
          className="text-lg text-white mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('subtitle')}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex space-x-4"
        >
          {socialLinks.map(({ Icon, href, label }) => (
            <motion.div key={label} whileHover={{ scale: 1.1 }}>
              <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-12 h-12 rounded-full bg-gray-800/50 hover:bg-gray-700/70 flex items-center justify-center transition-colors border border-white/20 backdrop-blur-sm">
                <Icon size={20} className="text-white" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* 浮动粒子效果 - 使用状态中的粒子数据 */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              background: particle.color,
              boxShadow: `0 0 8px ${particle.color}`,
            }}
            animate={{
              y: [0, particle.yMove, 0],
              x: [0, particle.xMove, 0],
              opacity: [0.4, 0.9, 0.4],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* 底部光晕 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#14F195]/30 to-transparent" />
      
      {/* 顶部装饰线 */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#14F195] to-transparent"
        animate={{
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}
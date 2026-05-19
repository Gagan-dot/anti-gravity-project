import React from 'react'
import { motion } from 'framer-motion'

const ProgressRing = ({ percent = 75, color = '#00e5ff', size = 64, strokeWidth = 5, delay = 0 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow behind */}
      <div 
        className="absolute inset-0 rounded-full blur-lg opacity-20"
        style={{ background: color }}
      />
      <svg width={size} height={size} className="relative -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay: delay + 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      {/* Center percentage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-xs font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.8 }}
        >
          {percent}%
        </motion.span>
      </div>
    </div>
  )
}

const ringColors = {
  'gradient-primary': '#00e5ff',
  'bg-emerald-500': '#00ff88',
  'bg-blue-500': '#0077ff',
  'bg-amber-500': '#ffb700',
  'bg-purple-500': '#f000ff',
}

export default function StatCard({ icon: Icon, title, value, change, changeType = 'positive', delay = 0, gradient, ringPercent }) {
  const isPositive = changeType === 'positive'
  const ringColor = ringColors[gradient] || '#00e5ff'
  const percent = ringPercent ?? Math.min(Math.floor(Math.random() * 40 + 60), 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-5 relative overflow-hidden group cursor-default border border-white/5 hover:border-white/10 transition-colors"
    >
      {/* Gradient accent */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ background: ringColor }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <ProgressRing percent={percent} color={ringColor} size={52} strokeWidth={4} delay={delay} />
            <div>
              <p className="text-sm text-slate-400">{title}</p>
              <motion.p 
                className="text-xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.5 }}
              >
                {value}
              </motion.p>
            </div>
          </div>
          {change && (
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${isPositive ? 'badge-success' : 'badge-danger'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

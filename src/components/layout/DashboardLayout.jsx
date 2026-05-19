import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

const pageVariants = {
  initial: { 
    opacity: 0, 
    x: 20,
    filter: 'blur(4px)',
  },
  animate: { 
    opacity: 1, 
    x: 0,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.35, 
      ease: [0.4, 0, 0.2, 1],
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    filter: 'blur(4px)',
    transition: { 
      duration: 0.2, 
      ease: [0.4, 0, 1, 1],
    }
  },
}

export default function DashboardLayout() {
  const { sidebarOpen } = useApp()
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-surface-900 relative">
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <Sidebar />

      <motion.div
        animate={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (sidebarOpen ? 260 : 72) : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen flex flex-col"
      >
        <Navbar />
        <main className="flex-1 p-4 lg:p-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

    </div>
  )
}

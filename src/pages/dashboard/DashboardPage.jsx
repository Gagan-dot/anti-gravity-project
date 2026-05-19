import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, DollarSign, CreditCard, AlertCircle, UserPlus,
  TrendingUp, Calendar, Clock, ArrowUpRight,
  Activity, Zap, MessageSquare, PlusCircle, Dumbbell,
  Flame, Trophy, Sun, Moon, Sunrise, Target
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import StatCard from '../../components/ui/StatCard'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

const gymQuotes = [
  "The only bad workout is the one that didn't happen. 💪",
  "Your body can stand almost anything. It's your mind you have to convince. 🧠",
  "Success starts with self-discipline. 🔥",
  "Champions are made when nobody is watching. 🏆",
  "Push harder than yesterday if you want a different tomorrow. ⚡",
  "Strength doesn't come from what you can do. It comes from overcoming things you thought you couldn't. 💎",
  "The pain you feel today will be the strength you feel tomorrow. 🚀",
]

const floatingIcons = [Dumbbell, Flame, Zap, Trophy, Target, Activity]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-4 py-3 shadow-2xl border border-white/10">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.name.toLowerCase().includes('revenue') ? `₹${(p.value / 1000).toFixed(0)}K` : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { customers, leads, activities, notifications, invoices, updateInvoiceStatus } = useApp()
  const { user } = useAuth()

  const [quoteIndex, setQuoteIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % gymQuotes.length)
    }, 5000)
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => { clearInterval(quoteTimer); clearInterval(clockTimer) }
  }, [])

  const hour = currentTime.getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const GreetingIcon = hour < 12 ? Sunrise : hour < 17 ? Sun : Moon
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Champ'

  const activeCustomers = customers.filter(c => c.status === 'Active' || c.status === 'active').length
  
  const pendingInvoices = invoices.filter(inv => inv.status?.toLowerCase() === 'pending')
  const pendingPaymentsCount = pendingInvoices.length
  
  const newLeads = leads.filter(l => l.stage === 'new').length

  const currentMonth = new Date().getMonth()
  const monthlyRevenue = invoices
    .filter(inv => inv.status?.toLowerCase() === 'paid' && new Date(inv.issue_date || inv.created_at).getMonth() === currentMonth)
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const revenueData = months.map((month, index) => {
    const monthInvoices = invoices.filter(inv => {
      const date = new Date(inv.issue_date || inv.created_at)
      return date.getMonth() === index && inv.status?.toLowerCase() === 'paid'
    })
    const monthRevenue = monthInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0)
    
    const monthCustomers = customers.filter(c => {
      const date = new Date(c.created_at || new Date())
      return date.getMonth() <= index
    }).length

    return { month, revenue: monthRevenue, customers: monthCustomers }
  }).filter((_, i) => i <= currentMonth)

  const leadConversionData = months.map((month, index) => {
    const monthLeads = leads.filter(l => new Date(l.created_at || new Date()).getMonth() === index)
    return {
      month,
      newLeads: monthLeads.filter(l => l.stage?.toLowerCase() === 'new').length,
      converted: monthLeads.filter(l => l.stage?.toLowerCase() === 'converted').length,
      lost: monthLeads.filter(l => l.stage?.toLowerCase() === 'lost').length
    }
  }).filter((_, i) => i <= currentMonth)

  const formattedDate = currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const formattedTime = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

  return (
    <div className="space-y-6">
      {/* Animated Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-white/10"
        style={{
          background: hour < 12
            ? 'linear-gradient(135deg, #002e33 0%, #003d47 30%, #00e5ff10 100%)'
            : hour < 17
            ? 'linear-gradient(135deg, #1a0a2e 0%, #002e33 40%, #00e5ff08 100%)'
            : 'linear-gradient(135deg, #0a0015 0%, #1a002e 40%, #f000ff08 100%)'
        }}
      >
        {/* Animated floating icons */}
        {floatingIcons.map((Icon, i) => {
          const colors = ['#00e5ff', '#f000ff', '#00e5ff', '#f000ff', '#00e5ff', '#f000ff']
          return (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              style={{
                left: `${8 + i * 16}%`,
                top: `${10 + (i % 3) * 28}%`,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, i % 2 === 0 ? 10 : -10, 0],
                rotate: [0, 12, -12, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            >
              <Icon 
                size={36 + i * 6} 
                strokeWidth={1.2} 
                color={colors[i]}
                style={{ opacity: 0.15 }}
              />
            </motion.div>
          )
        })}

        {/* Glowing orbs inside banner */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20"
          style={{ background: hour < 17 ? '#00e5ff' : '#f000ff' }} />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full blur-[80px] opacity-10"
          style={{ background: '#f000ff' }} />

        <div className="relative z-10 px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Greeting */}
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <GreetingIcon size={22} className="text-primary-400" />
                </motion.div>
                <span className="text-sm font-medium text-primary-400 uppercase tracking-wider">{greeting}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl sm:text-3xl font-bold text-white"
              >
                Welcome back, <span className="gradient-text">{userName}</span> 👋
              </motion.h1>

              {/* Rotating motivational quote */}
              <div className="h-7 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-sm text-slate-400 italic"
                  >
                    {gymQuotes[quoteIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Date, Time & Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-start sm:items-end gap-2"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={14} />
                <span className="text-xs">{formattedDate}</span>
              </div>
              <motion.div
                className="font-mono text-2xl sm:text-3xl font-bold tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #00e5ff, #f000ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {formattedTime}
              </motion.div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-400">{activeCustomers} active members</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                  <span className="text-xs text-slate-400">System online</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} title="Total Customers" value={customers.length} change="+12%" delay={0.05} gradient="gradient-primary" />
        <StatCard icon={DollarSign} title="Monthly Revenue" value={`₹${monthlyRevenue.toLocaleString()}`} change="Live" delay={0.1} gradient="bg-emerald-500" />
        <StatCard icon={CreditCard} title="Active Subscriptions" value={activeCustomers} change="Live" delay={0.15} gradient="bg-blue-500" />
        <StatCard icon={AlertCircle} title="Pending Payments" value={pendingPaymentsCount} change="Live" changeType={pendingPaymentsCount > 0 ? "negative" : "positive"} delay={0.2} gradient="bg-amber-500" />
        <StatCard icon={UserPlus} title="New Leads" value={newLeads} change="Live" delay={0.25} gradient="bg-purple-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4 }}
          className="lg:col-span-2 glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors shadow-lg hover:shadow-primary-500/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Revenue Overview</h3>
              <p className="text-xs text-slate-400 mt-1">Monthly revenue and customer growth</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                <span className="text-slate-400">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-400" />
                <span className="text-slate-400">Customers</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f000ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f000ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#00e5ff" strokeWidth={2.5} fill="url(#revenueGradient)" />
              <Area type="monotone" dataKey="customers" name="Customers" stroke="#f000ff" strokeWidth={2} fill="url(#customerGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pending Payments - NEW SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ y: -4 }}
          className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors shadow-lg hover:shadow-amber-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Pending Payments</h3>
              <p className="text-xs text-slate-400 mt-1">Click 'Receive' to update dashboard</p>
            </div>
            <CreditCard size={16} className="text-amber-400" />
          </div>
          <div className="space-y-3">
            {pendingInvoices.length > 0 ? (
              pendingInvoices.map((invoice, i) => {
                const customer = customers.find(c => c.id === invoice.customer_id)
                return (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20 uppercase">
                        {customer ? customer.name[0] : invoice.invoice_number[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{customer ? customer.name : invoice.invoice_number}</p>
                        <p className="text-[10px] text-slate-400">Due: {invoice.due_date} • ₹{Number(invoice.amount).toLocaleString()}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                      className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
                    >
                      Receive
                    </motion.button>
                  </motion.div>
                )
              })
            ) : (
              <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-xs text-slate-500 italic">No pending payments</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>



      {/* Upcoming Renewals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Renewals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ y: -4 }}
          className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors shadow-lg hover:shadow-purple-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Upcoming Renewals</h3>
              <p className="text-xs text-slate-400 mt-1">Memberships expiring soon</p>
            </div>
            <Calendar size={16} className="text-slate-500" />
          </div>
          <div className="space-y-2">
            {customers.filter(c => c.status === 'Active').length > 0 ? (
              customers
                .filter(c => c.status === 'Active')
                .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
                .slice(0, 5)
                .map((customer, i) => {
                  const daysLeft = Math.ceil((new Date(customer.renewalDate) - new Date()) / (1000 * 60 * 60 * 24))
                  return (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + i * 0.05 }}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-white">
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.plan} Plan</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        daysLeft <= 3 ? 'badge-danger' : daysLeft <= 7 ? 'badge-warning' : 'badge-success'
                      }`}>
                        {daysLeft}d left
                      </span>
                    </motion.div>
                  )
                })
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">No upcoming renewals</div>
            )}
          </div>
        </motion.div>


      </div>
    </div>
  )
}

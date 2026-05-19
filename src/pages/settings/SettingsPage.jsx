import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import {
  Building, Bell, CreditCard, Users, Palette,
  Save, Upload, Globe, Mail, Phone, MapPin,
  Moon, Sun, Monitor, Shield, Key, Smartphone, Bot
} from 'lucide-react'
import FileUpload from '../../components/ui/FileUpload'
import Modal from '../../components/ui/Modal'

const tabs = [
  { id: 'business', label: 'Business Profile', icon: Building },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'theme', label: 'Appearance', icon: Palette },
]

export default function SettingsPage() {
  const { theme, setTheme, sidebarOpen, setSidebarOpen } = useApp()
  const [activeTab, setActiveTab] = useState('business')
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [businessData, setBusinessData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    logoUrl: null,
  })
  const [notifications, setNotifications] = useState({
    emailReminders: true, whatsappAlerts: true, paymentNotifs: true,
    leadAlerts: true, renewalReminders: true, marketingEmails: false,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-primary-500/10 text-white border border-primary-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>

            {/* Business Profile */}
            {activeTab === 'business' && (
              <div className="glass rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Business Profile</h2>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 gradient-primary rounded-xl text-sm font-medium text-white flex items-center gap-2 shadow-lg shadow-primary-500/25">
                    <Save size={14} /> Save Changes
                  </motion.button>
                </div>

                <div className="flex items-center gap-6">
                  {businessData.logoUrl ? (
                    <img src={businessData.logoUrl} alt="Logo" className="w-20 h-20 rounded-2xl object-cover shadow-lg border border-white/10" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-white">FL</div>
                  )}
                  <div>
                    <FileUpload 
                      bucket="uploads"
                      pathPrefix="logos"
                      accept="image/*"
                      label="Upload Logo"
                      onUploadSuccess={(url) => setBusinessData(p => ({ ...p, logoUrl: url }))}
                    />
                    <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Building, label: 'Business Name', field: 'name' },
                    { icon: Mail, label: 'Email', field: 'email' },
                    { icon: Phone, label: 'Phone', field: 'phone' },
                    { icon: Globe, label: 'Website', field: 'website' },
                  ].map(({ icon: Icon, label, field }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2"><Icon size={14} className="text-slate-500" />{label}</label>
                      <input type="text" value={businessData[field]} onChange={(e) => setBusinessData(p => ({ ...p, [field]: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2"><MapPin size={14} className="text-slate-500" />Address</label>
                  <input type="text" value={businessData.address} onChange={(e) => setBusinessData(p => ({ ...p, address: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                  <textarea value={businessData.description} onChange={(e) => setBusinessData(p => ({ ...p, description: e.target.value }))}
                    rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white resize-none" />
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="glass rounded-2xl p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Notification Settings</h2>
                <div className="space-y-4">
                  {[
                    { key: 'emailReminders', label: 'Email Reminders', desc: 'Receive renewal and payment reminders via email' },
                    { key: 'whatsappAlerts', label: 'WhatsApp Alerts', desc: 'Get instant alerts via WhatsApp' },
                    { key: 'paymentNotifs', label: 'Payment Notifications', desc: 'Notify when payments are received or overdue' },
                    { key: 'leadAlerts', label: 'New Lead Alerts', desc: 'Alert when new leads are captured' },
                    { key: 'renewalReminders', label: 'Renewal Reminders', desc: 'Automatic reminders for expiring memberships' },
                    { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive product updates and tips' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/3 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-white">{label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                      </div>
                      <button onClick={() => setNotifications(p => ({ ...p, [key]: !p[key] }))}
                        className={`w-11 h-6 rounded-full transition-all relative ${notifications[key] ? 'bg-primary-500' : 'bg-white/10'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications[key] ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subscription */}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">Current Plan</h2>
                    <span className="badge-primary text-sm px-4 py-1.5 rounded-xl font-medium">Pro Plan</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Monthly Cost', value: '₹2,999' },
                      { label: 'Team Members', value: '10' },
                      { label: 'Customers', value: 'Unlimited' },
                      { label: 'Renewal', value: 'Jun 15, 2024' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white/3 rounded-xl p-3">
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className="text-sm font-semibold text-white mt-1">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="px-4 py-2 gradient-primary rounded-xl text-sm font-medium text-white">Upgrade Plan</motion.button>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10">Manage Billing</button>
                  </div>
                </div>

                {/* Integration Placeholders */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Integrations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Razorpay', desc: 'Accept payments via UPI, cards, netbanking', status: 'Connect' },
                      { name: 'Stripe', desc: 'International payment processing', status: 'Connect' },
                      { name: 'WhatsApp API', desc: 'Business messaging integration', status: 'Connected' },
                      { name: 'Email Service', desc: 'Automated email campaigns', status: 'Connect' },
                    ].map(({ name, desc, status }) => (
                      <div key={name} className="flex items-center justify-between p-4 bg-white/3 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-white">{name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                        </div>
                        <button className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                          status === 'Connected' ? 'badge-success' : 'badge-primary'
                        }`}>{status}</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Theme */}
            {activeTab === 'theme' && (
              <div className="glass rounded-2xl p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Appearance</h2>
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-3">Theme Mode</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Moon, label: 'Dark', value: 'dark' },
                      { icon: Sun, label: 'Light', value: 'light' },
                    ].map(({ icon: Icon, label, value }) => (
                      <button key={label}
                        onClick={() => setTheme(value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          theme === value ? 'border-primary-500/50 bg-primary-500/10 text-white' : 'border-white/10 bg-white/3 text-slate-400 hover:bg-white/5'
                        }`}>
                        <Icon size={20} />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-300 mb-3">Sidebar Style</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Expanded', value: true },
                      { label: 'Compact', value: false },
                    ].map(({ label, value }) => (
                      <button key={label}
                        onClick={() => setSidebarOpen(value)}
                        className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                          sidebarOpen === value ? 'border-primary-500/50 bg-primary-500/10 text-white' : 'border-white/10 bg-white/3 text-slate-400 hover:bg-white/5'
                        }`}>{label}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Modal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} title="Upgrade to Enterprise" size="md">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Enterprise Plan</h3>
            <p className="text-slate-400">Unlock all premium features for your business.</p>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
               <Shield className="text-primary-400 shrink-0 mt-0.5" />
               <div>
                 <p className="font-medium text-white">Advanced Security</p>
                 <p className="text-sm text-slate-400">Enterprise-grade security and compliance.</p>
               </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
               <Users className="text-primary-400 shrink-0 mt-0.5" />
               <div>
                 <p className="font-medium text-white">Unlimited Team Members</p>
                 <p className="text-sm text-slate-400">Scale your team without limits.</p>
               </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
               <Bot className="text-primary-400 shrink-0 mt-0.5" />
               <div>
                 <p className="font-medium text-white">Advanced AI Features</p>
                 <p className="text-sm text-slate-400">Priority AI processing and custom models.</p>
               </div>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              alert("Processing upgrade...")
              setIsUpgradeModalOpen(false)
            }}
            className="w-full py-3 gradient-primary rounded-xl font-medium text-white shadow-lg shadow-primary-500/25"
          >
            Upgrade Now - ₹9,999/mo
          </motion.button>
        </div>
      </Modal>
    </div>
  )
}

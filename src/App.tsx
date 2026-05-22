/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, QrCode, Share2, Smartphone, Plus, Check, Clock, X, ChevronLeft,
  LayoutDashboard, Users, Briefcase, Award, Sparkles, Grid, List, Columns,
  Trash, ArrowUpRight, Copy, CheckSquare, Search, LogOut, Code, BadgeAlert, Coins, Bot, PenLine,
  Calendar, TrendingUp, Filter, SlidersHorizontal, Layers, Bookmark, LineChart, Folders, Zap
} from 'lucide-react';

import { ThemeType, ViewMode, UserProfile, ReferralRecord, ProjectRecord, StudioDraft, RewardItem } from './types';
import { INITIAL_USER, INITIAL_REFERRALS, INITIAL_PROJECTS, INITIAL_DRAFTS, INITIAL_REWARDS } from './data';
import { LoginPortal } from './components/LoginPortal';
import { AiSecretary } from './components/AiSecretary';
import { StudioLab } from './components/StudioLab';
import { SovereignQRCode } from './components/SovereignQRCode';
import { SovereignAreaChart, SovereignRadialProgress } from './components/SovereignCharts';
import { chimeEngine } from './components/TactileSound';

// Define theme css variables / styled classes for glassmorphic depth
const SYSTEM_THEMES: Record<ThemeType, {
  bg: string;
  cardBg: string;
  borderColor: string;
  accent: string;
  text: string;
  subtitle: string;
  glow: string;
  badge: string;
}> = {
  luxury: {
    bg: "bg-radial from-[#12110e] via-[#0d0c0a] to-[#050504] text-amber-100",
    cardBg: "bg-[#181613]/80 backdrop-blur-2xl border border-amber-500/10",
    borderColor: "border-amber-500/15",
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    text: "text-amber-100",
    subtitle: "text-amber-200/50",
    glow: "shadow-[0_4px_32px_-4px_rgba(197,160,89,0.15)]",
    badge: "bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 text-amber-300"
  },
  minimal: {
    bg: "bg-gradient-to-tr from-slate-50 via-slate-100 to-[#f3f8f8] text-slate-800",
    cardBg: "bg-white/90 backdrop-blur-2xl border border-slate-200/80 shadow-sm",
    borderColor: "border-slate-200",
    accent: "text-[#208084] bg-[#208084]/5 border-[#208084]/20",
    text: "text-slate-800",
    subtitle: "text-slate-500",
    glow: "shadow-[0_8px_30px_rgb(0,0,0,0.03)]",
    badge: "bg-[#208084]/10 border border-[#208084]/20 text-[#208084]"
  },
  chinese: {
    bg: "bg-radial from-[#1e0a0a] via-[#150505] to-[#090101] text-[#ffd700]",
    cardBg: "bg-[#280d0d]/75 backdrop-blur-2xl border border-[#ffd700]/15",
    borderColor: "border-[#ffd700]/20",
    accent: "text-[#ffd700] bg-[#e63946]/20 border-[#ffd700]/35",
    text: "text-[#ffeb99]",
    subtitle: "text-[#ffeb99]/40",
    glow: "shadow-[0_4px_32px_rgba(230,57,70,0.12)]",
    badge: "bg-gradient-to-r from-[#e53e3e]/20 to-[#ffd700]/10 border border-[#ffd700]/25 text-[#ffd700]"
  },
  cosmos: {
    bg: "bg-radial from-[#090a16] via-[#05060b] to-[#010103] text-indigo-100",
    cardBg: "bg-[#101222]/80 backdrop-blur-2xl border border-indigo-500/15",
    borderColor: "border-indigo-500/20",
    accent: "text-sky-400 bg-sky-500/10 border-sky-400/25",
    text: "text-indigo-100",
    subtitle: "text-indigo-300/40",
    glow: "shadow-[0_4px_32px_rgba(129,140,248,0.15)]",
    badge: "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
  },
  grok: {
    bg: "bg-radial from-[#0a1112] via-[#050809] to-[#010203] text-emerald-100",
    cardBg: "bg-[#0d1718]/85 backdrop-blur-2xl border border-[#208084]/20",
    borderColor: "border-[#208084]/25",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    text: "text-emerald-500",
    subtitle: "text-emerald-200/40",
    glow: "shadow-[0_4px_32px_rgba(32,128,132,0.25)]",
    badge: "bg-[#208084]/15 border border-[#208084]/30 text-emerald-300"
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserProfile>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState<'home' | 'contacts' | 'projects' | 'studio' | 'rewards'>('home');
  const [theme, setTheme] = useState<ThemeType>('grok');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  // Database core state
  const [referrals, setReferrals] = useState<ReferralRecord[]>(INITIAL_REFERRALS);
  const [projects, setProjects] = useState<ProjectRecord[]>(INITIAL_PROJECTS);
  const [drafts, setDrafts] = useState<StudioDraft[]>(INITIAL_DRAFTS);
  const [rewards, setRewards] = useState<RewardItem[]>(INITIAL_REWARDS);

  // Overlay state trackers
  const [isSecretaryOpen, setIsSecretaryOpen] = useState(false);
  const [isCardEditorOpen, setIsCardEditorOpen] = useState(false);
  const [nfcBeaming, setNfcBeaming] = useState(false);

  // New Venture CRM sub-tabs and list states
  const [contactsSubTab, setContactsSubTab] = useState<'vip_list' | 'integrations' | 'calendar'>('vip_list');
  const [projectsSubTab, setProjectsSubTab] = useState<'contracts_ledger' | 'analytics' | 'notes'>('contracts_ledger');
  const [integrationsList, setIntegrationsList] = useState([
    { id: 'slack', name: 'Slack Communication API', status: 'connected', desc: 'مزامنة الإرسال المباشر وتنبيهات القادة لحظياً', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-slack-226532.png', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/15' },
    { id: 'zendesk', name: 'Zendesk Support Platform', status: 'connected', desc: 'معالجة بطاقات الدعم وشكاوى النخبة آلياً', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-zendesk-3629230-3031046.png', color: 'bg-sky-500/10 text-sky-450 border-sky-500/15' },
    { id: 'wordpress', name: 'WordPress Web Builder', status: 'disconnected', desc: 'نشر كروت النخبة وتوزيعها في صفحات الويب', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-wordpress-226538.png', color: 'bg-blue-600/10 text-blue-400 border-blue-500/10' },
    { id: 'google', name: 'Google Search Engine Sync', status: 'connected', desc: 'أرشفة الهوية وتحليل البيانات المفتوحة بجوجل', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png', color: 'bg-red-500/10 text-red-400 border-red-500/15' },
    { id: 'paypal', name: 'PayPal Ledger Platform', status: 'connected', desc: 'تحويل وصرف عمولات الإحالات ونشر الحسابات', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-paypal-226456.png', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/15' },
    { id: 'shopify', name: 'Shopify E-commerce Sync', status: 'disconnected', desc: 'مزامنة مبيعات المتاجر والطلبيات المادية المكونة', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-shopify-226571.png', color: 'bg-emerald-600/10 text-emerald-400 border-emerald-600/15' },
  ]);
  const [notesList, setNotesList] = useState([
    { id: 'note-1', title: 'عشاء عمل وتثبيت بروتوكول الياقوت', desc: 'مراجعة متطلبات ربط نظام NFC الفاخر بحضور وفد صندوق الاستثمارات لتعزيز الاتفاقيات الكبرى.', category: 'Weekly', tagColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/10', date: '٢٤ مايو ٢٠٢٦', members: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80'] },
    { id: 'note-2', title: 'تحليل تكامل بوابة الدفع باي بال', desc: 'متابعة تدفق الأرباح وعمليات التحصيل التلقائية للإحالات السيادية الصادرة من التطبيق.', category: 'Business', tagColor: 'bg-sky-500/15 text-sky-300 border-sky-500/10', date: '٢٦ مايو ٢٠٢٦', members: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80'] },
    { id: 'note-3', title: 'تحديث هوية استوديو الحياكة الذكي', desc: 'تزويد الاستوديو بتصنيفات قوالب مسبوكات الليزر الذهبية ورقاقات النيون الحيوية الفاخرة.', category: 'Product', tagColor: 'bg-amber-500/15 text-amber-300 border-amber-500/10', date: '٢٨ مايو ٢٠٢٦', members: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80'] },
    { id: 'note-4', title: 'جدولة حملة تسويق كروت الذهب العينية', desc: 'دراسة الشرائح المستهدفة لنشر كروت النخبة المصنوعة من الذهب الخالص عيار ٢٤ للشركات الناشئة.', category: 'Marketing', tagColor: 'bg-rose-500/15 text-rose-300 border-rose-500/10', date: '٠١ يونيو ٢٠٢٦', members: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80'] }
  ]);
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionsFilter, setTransactionsFilter] = useState<'all' | 'completed' | 'pending' | 'active'>('all');
  const [transactionsList, setTransactionsList] = useState([
    { id: 'TXN-0012', client: 'الأميرة نورة بنت عبد العزيز', date: '٢٢ مايو ٢٠٢٦', amount: '٤٥,٠٠٠ ريال', status: 'completed' },
    { id: 'TXN-0011', client: 'شركة النخبة للمعادن والذهب', date: '٢٠ مايو ٢٠٢٦', amount: '٦٥,٠٠٠ ريال', status: 'completed' },
    { id: 'TXN-0010', client: 'الجهة السيادية للتقنية المصرفية', date: '١٨ مايو ٢٠٢٦', amount: '١٢٠,٠٠٠ ريال', status: 'active' },
    { id: 'TXN-0009', client: 'نادي الياقوت والزمرد الفخم', date: '١٥ مايو ٢٠٢٦', amount: '٢٠٠,٠٠٠ ريال', status: 'completed' },
    { id: 'TXN-0008', client: 'مشاريع التطوير لشركة الشكور', date: '١٠ مايو ٢٠٢٦', amount: '٨٥,٠٠٠ ريال', status: 'pending' },
  ]);

  // Search parameters
  const [contactSearch, setContactSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');

  // Editing profile state
  const [editedName, setEditedName] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedAvatar, setEditedAvatar] = useState('');

  // Notification Toast tracker
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const themeStyle = SYSTEM_THEMES[theme];

  // Auto notification generator
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleLoginSuccess = (profile: { name: string; title: string; avatar: string; email: string }) => {
    setUserData({
      ...INITIAL_USER,
      name: profile.name,
      title: profile.title,
      avatar: profile.avatar,
      qrValue: `https://mshkur.com/os/card/${encodeURIComponent(profile.name)}`
    });
    setEditedName(profile.name);
    setEditedTitle(profile.title);
    setEditedAvatar(profile.avatar);
    setIsLoggedIn(true);
    triggerToast(`مرحباً بك يا معالي م. عبد الرحمن الشكور. تم توثيق الدخول بنجاح!`);
  };

  // 1. ADD DRAFT (Secretary / Studio Tool outputs)
  const handleAddNewDraft = (newDraft: { cardName: string; templateType: 'Corporate' | 'Futuristic' | 'Golden Minimalist' | 'Oriental Craft' | 'Neon Pulse'; accentColor: string }) => {
    const fresh: StudioDraft = {
      id: `draft-${Date.now()}`,
      cardName: newDraft.cardName,
      templateType: newDraft.templateType,
      accentColor: newDraft.accentColor,
      status: 'Draft',
      lastModified: new Date().toISOString().split('T')[0]
    };
    setDrafts(prev => [fresh, ...prev]);

    // Track Auto-Project trigger upon draft generation to make app integrated
    const freshProject: ProjectRecord = {
      id: `proj-${Date.now()}`,
      title: `هيكلة نموذج: ${newDraft.cardName}`,
      client: "نظام الشكور للتوليد الذكي لبطاقات VIP",
      progress: 30,
      budget: "٣٠,٠٠٠ ريال",
      category: "مخرجات الاستوديو",
      status: "planning",
      tags: ["AI-Generated", "Studio Design"]
    };
    setProjects(prev => [freshProject, ...prev]);
  };

  // 2. ADD PROJECT (AI Generated)
  const handleAddNewProject = (p: { title: string; client: string; budget: string; category: string }) => {
    const fresh: ProjectRecord = {
      id: `proj-${Date.now()}`,
      title: p.title,
      client: p.client,
      progress: 10,
      budget: p.budget,
      category: p.category,
      status: 'active',
      tags: ["VIP Contract", "Mshkur AI"]
    };
    setProjects(prev => [fresh, ...prev]);
  };

  // 3. ADD REFERRAL / TRANSACTION IN LEADGER
  const handleAddNewReferral = (r: { refereeName: string; serviceName: string; pointsReward: number }) => {
    const fresh: ReferralRecord = {
      id: `ref-${Date.now()}`,
      refereeName: r.refereeName,
      serviceName: r.serviceName,
      pointsReward: r.pointsReward,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    setReferrals(prev => [fresh, ...prev]);
    
    // Top-up user points dynamically!
    setUserData(prev => ({
      ...prev,
      points: prev.points + r.pointsReward
    }));

    // Establish associated Project automatically representing the VIP contract
    const freshProject: ProjectRecord = {
      id: `proj-auto-${Date.now()}`,
      title: `عقد ريادي: ${r.serviceName}`,
      client: r.refereeName,
      progress: 100,
      budget: `${(r.pointsReward * 12).toLocaleString()} ريال`,
      category: "إحالة موثقة",
      status: 'completed',
      tags: ["Secured VIP"]
    };
    setProjects(prev => [freshProject, ...prev]);
  };

  // Deleting drafts
  const handleDeleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    chimeEngine.playChime('select');
    triggerToast("تم مسح المسودة من الاستوديو بنجاح.");
  };

  // Publishing drafts
  const handlePublishDraft = (id: string) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status: 'Published' as const } : d));
    chimeEngine.playChime('success');
    triggerToast("تم تعميد وإشهار مسودة الكرت كنسخة سيادية معتمدة!");
  };

  const openCardEditor = () => {
    setEditedName(userData.name);
    setEditedTitle(userData.title);
    setEditedAvatar(userData.avatar);
    setIsCardEditorOpen(true);
    chimeEngine.playChime('select');
  };

  // Updating profile details via card personalizer
  const handleSaveCardDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData(prev => ({
      ...prev,
      name: editedName.trim() || prev.name,
      title: editedTitle.trim() || prev.title,
      avatar: editedAvatar.trim() || prev.avatar
    }));
    setIsCardEditorOpen(false);
    chimeEngine.playChime('success');
    triggerToast("تم تحديث الكرت السيادي وبث التفاصيل بنجاح!");
  };

  const simulateNfcBeam = () => {
    setNfcBeaming(true);
    chimeEngine.playChime('neon');
    
    setTimeout(() => {
      setNfcBeaming(false);
      chimeEngine.playChime('success');
      triggerToast("نجحت محاكاة بث NFC! تم إرسال هويتك الرقمية للأجهزة المجاورة.");
    }, 2800);
  };

  // Claim awards with points balance deductions
  const handleClaimReward = (id: string, cost: number, title: string) => {
    if (userData.points < cost) {
      chimeEngine.playChime('select');
      triggerToast("رصيد نقاط الرتبة الحالية غير كافٍ للحصول على الأصل الفاخر.");
      return;
    }

    setUserData(prev => ({
      ...prev,
      points: prev.points - cost
    }));

    setRewards(prev => prev.map(r => r.id === id ? { ...r, claimedTimes: r.claimedTimes + 1 } : r));
    chimeEngine.playChime('gold');
    triggerToast(`تهانينا! تم اقتطاع النقاط وجدول استلام: "${title}" بالنجاح الشرفي.`);
  };

  if (!isLoggedIn) {
    return (
      <LoginPortal currentTheme={theme} onLoginSuccess={handleLoginSuccess} />
    );
  }

  // Filter lists based on search
  const filteredReferrals = referrals.filter(r =>
    r.refereeName.toLowerCase().includes(contactSearch.toLowerCase()) ||
    r.serviceName.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.client.toLowerCase().includes(projectSearch.toLowerCase())
  );

  return (
    <div className={`min-h-screen w-full transition-all duration-500 pb-24 ${themeStyle.bg}`} style={{ direction: 'rtl' }}>
      
      {/* GLOBAL TOAST ALERT */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 inset-x-4 max-w-md mx-auto z-50 p-4 rounded-2xl bg-neutral-900/90 backdrop-blur-3xl border border-[#208084] shadow-[0_12px_40px_rgba(32,128,132,0.35)] flex items-center gap-3.5 text-right font-medium"
          >
            <div className="w-8 h-8 rounded-full bg-[#208084]/20 flex items-center justify-center border border-[#208084]/45 shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>
            <div className="flex-1 text-xs text-white leading-relaxed font-sans">{toastMessage}</div>
            <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/10 rounded">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NFC BEAM OVERLAY SCREEN */}
      <AnimatePresence>
        {nfcBeaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center gap-6"
          >
            <div className="relative">
              <span className="absolute inset-0 rounded-full border border-[#208084] animate-ping opacity-40 scale-150" />
              <div className="w-24 h-24 rounded-full bg-[#208084]/20 border-2 border-[#208084] flex items-center justify-center text-white text-3xl animate-pulse">
                <Smartphone className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white">جارٍ بث إشارات NFC الآمنة...</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">قرب كارت النخبة المعدني المعتمد من خلف جهاز العميل لنسخ ونقل مصفوفة الاتصال السيادية فورياً.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE FRAME HEADER */}
      <header className="px-4 md:px-8 py-4.5 border-b border-white/5 bg-black/5 flex justify-between items-center z-20 position-sticky top-0 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#208084] flex items-center justify-center text-white text-lg font-black shrink-0 shadow-md shadow-[#208084]/20">
            M
          </div>
          <div className="flex flex-col text-right">
            <h1 className="text-sm font-black text-white tracking-wide">Mshkur Studio</h1>
            <span className="text-[9.5px] opacity-40 mt-0.5 uppercase tracking-widest font-mono">President Cabinet V4</span>
          </div>
        </div>

        {/* Dynamic theme switchers & Logout */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 p-1 rounded-xl bg-black/45 border border-white/5">
            {[
              { id: 'luxury', label: '👑 فخم' },
              { id: 'minimal', label: '⚪ مينيمال' },
              { id: 'chinese', label: '🧧 صيني' },
              { id: 'cosmos', label: '🌌 كوزموس' },
              { id: 'grok', label: '⚡ جروك' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id as any);
                  chimeEngine.playChime('select');
                  triggerToast(`تم تحويل السبيكة المرئية إلى نمط: ${t.label}`);
                }}
                className={`text-[9.5px] font-bold px-2 px-3 py-1.5 rounded-lg outline-none cursor-pointer transition-all ${theme === t.id ? 'bg-[#208084] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setIsLoggedIn(false);
              chimeEngine.playChime('select');
            }}
            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN SCREEN SHELL CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOME PLATINUM DASHBOARD */}
          {activeTab === 'home' && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* LEFT MASTER COLUMN (HERO CARD + ACTIVITY) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* 👑 MASTER HERO CARD 👑 */}
                <div className={`p-8 md:p-12 rounded-[40px] overflow-hidden relative ${themeStyle.cardBg} ${themeStyle.glow} border border-[#208084]/25 bg-gradient-to-b from-[#0a1213]/98 via-[#05090a]/98 to-[#020404]/98 shadow-[0_25px_60px_rgba(0,0,0,0.85)]`}>
                  
                  {/* Decorative premium elements */}
                  <div className="absolute top-5 left-8 text-[9px] font-mono opacity-25 tracking-widest uppercase">Dual Protocol - NFC Crypt Secure</div>
                  <div className="absolute top-5 right-8 text-[9.5px] font-mono text-[#208084] font-black tracking-wide animate-pulse flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> SECURE EXECUTIVE ID
                  </div>

                  {/* Elegant Floating Edit Pencil Button */}
                  <button 
                    onClick={openCardEditor}
                    className="absolute top-14 right-8 z-20 bg-black/50 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/15 text-slate-305 hover:text-amber-450 p-2.5 rounded-full transition-all duration-300 cursor-pointer shadow-lg shadow-black/40 flex items-center justify-center animate-pulse hover:animate-none"
                    title="تعديل تفاصيل الهوية ومعلومات الكرت"
                  >
                    <PenLine className="w-4 h-4" />
                  </button>
                  
                  <div className="flex flex-col items-center text-center pt-6 relative z-10">
                    
                    {/* Big & Outstanding Circular Avatar with multiple animated rings */}
                    <div className="relative group cursor-pointer mb-8" 
                      onClick={() => {
                        setActiveTab('studio');
                        chimeEngine.playChime('gold');
                        triggerToast("تم الانتقال إلى استوديو الحياكة الذكي 🎨");
                      }}
                    >
                      {/* Interactive glowing outer circles and dual spinning orbit rings */}
                      <span className="absolute -inset-7 rounded-full border border-[#208084]/20 animate-spin" style={{ animationDuration: '24s' }} />
                      <span className="absolute -inset-5 rounded-full border border-dashed border-amber-500/20 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
                      <span className="absolute -inset-3 rounded-full border border-[#208084]/40 animate-pulse" style={{ animationDuration: '4s' }} />
                      <div className="absolute -inset-2 bg-gradient-to-tr from-[#208084] via-amber-450 to-emerald-400 rounded-full blur-xl opacity-60 group-hover:opacity-95 group-hover:scale-110 transition-all duration-700" />
                      
                      {/* Enormously prominent master avatar circle with thick border and dynamic scale */}
                      <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-neutral-950 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
                        <img
                          src={userData.avatar}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={userData.name}
                        />
                        {/* Hover Overlay Visual Hint */}
                        <div className="absolute inset-0 bg-neutral-950/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 gap-2">
                          <Sparkles className="w-8 h-8 text-amber-400 animate-bounce" />
                          <span className="text-xs text-white font-black bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-lg">فتح الاستوديو الذكي 🎨</span>
                        </div>
                      </div>

                      {/* Interactive Trigger Badge with gold color scheme */}
                      <div className="absolute bottom-2 right-4 z-25 bg-gradient-to-tr from-[#208084] to-[#125557] text-white p-3 rounded-full border-2 border-neutral-950 shadow-xl shadow-black/90 animate-bounce group-hover:scale-110 group-hover:from-amber-550 group-hover:to-amber-500 transition-all duration-300" title="اضغط لفتح الاستوديو الذكي">
                        <Sparkles className="w-4.5 h-4.5 text-amber-300" />
                      </div>
                    </div>

                    {/* Meta Details: Name, Position, Rank, Points */}
                    <div className="flex flex-col items-center max-w-xl">
                      <h2 className="text-2xl md:text-3xl font-black text-white leading-tight flex items-center justify-center gap-2">
                        {userData.name}
                        <Award className="w-6 h-6 text-amber-400" />
                      </h2>
                      
                      <p className="text-sm text-slate-300 font-medium tracking-wide mt-2 max-w-md">{userData.title}</p>
                      
                      {/* Integrated Glass Balance Bar */}
                      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
                        <span className={`text-[10.5px] px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-sm ${themeStyle.badge}`}>
                          👑 رتبة النخبة: {userData.rankName}
                        </span>
                        <span className="text-[11px] font-mono font-black text-amber-400 bg-amber-500/15 border border-amber-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                          <Coins className="w-4 h-4 animate-pulse text-amber-300" /> {userData.points.toLocaleString()} نقطة
                        </span>
                      </div>
                    </div>

                    {/* Majestic, Highly Visible QR Code Block */}
                    <div className="mt-8 p-5 rounded-2xl bg-black/45 border border-white/5 flex flex-col items-center gap-3 w-full max-w-[200px] hover:border-[#208084]/40 transition-all duration-300 group/qr relative">
                      <div className="relative p-1 bg-white/[0.02] border border-white/10 rounded-xl">
                        <SovereignQRCode value={userData.qrValue} theme={theme} />
                      </div>
                      
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-[#208084] font-mono tracking-wide">{userData.qrValue.replace('https://', '')}</span>
                        <span className="text-[8px] text-slate-500 font-mono tracking-widest">PRESIDENTIAL DIGI-LINK</span>
                      </div>
                    </div>

                  </div>

                  {/* High Quality Interactive Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6 mt-8 relative z-10">
                    <div className="flex gap-2.5 w-full sm:w-auto">
                      <button
                        onClick={simulateNfcBeam}
                        className="flex-1 sm:flex-none justify-center bg-gradient-to-r from-[#208084] to-[#125557] hover:brightness-110 text-white text-xs font-black px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-[#208084]/20 active:scale-95 transition-transform"
                      >
                        <Smartphone className="w-4 h-4 text-emerald-400" /> بث الهوية بموجات NFC
                      </button>
                      
                      <button
                        onClick={() => {
                          setActiveTab('studio');
                          chimeEngine.playChime('gold');
                        }}
                        className="flex-1 sm:flex-none justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#208084]/30 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all cursor-pointer"
                      >
                        🎨 استوديو الحياكة الذكي
                      </button>
                    </div>

                    <button
                      onClick={openCardEditor}
                      className="w-full sm:w-auto justify-center text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 px-4.5 py-3 rounded-xl transition-all cursor-pointer font-bold"
                    >
                      تعديل مظهر كرت النخبة 🖊️
                    </button>
                  </div>

                </div>

                {/* BENTO QUICK TOOLS */}
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">لوحة التحكم السريعة (Master Controls)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Chart preview */}
                    <div className="p-5 rounded-2xl bg-black/35 border border-white/5 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">مؤشر رصيد مبيعات الإحالات المتبادلة</span>
                        <span className="text-[#208084] font-bold">نشط V4</span>
                      </div>
                      <div className="h-[90px] pt-1">
                        <SovereignAreaChart theme={theme} />
                      </div>
                    </div>

                    {/* Statistics ledger bento */}
                    <div className="p-5 rounded-2xl bg-black/35 border border-white/5 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">نطاق التقدم نحو ترقية الإمبراطور</span>
                        <span className="text-amber-400 font-bold font-mono">92%</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <SovereignRadialProgress percent={92} theme={theme} />
                        <div className="flex flex-col text-right">
                          <span className="text-xs font-black text-white">اقتراب تحقيق الرتبة السيادية</span>
                          <span className="text-[10px] text-slate-400 mt-1">تتبقى إحالة شرفية واحدة بقيمة ٣,٠٠٠ نقطة.</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* RIGHT SIDEBAR COLUMN (SMART CONTACTS + FEED) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* SMART KEY VIP CONTACTS */}
                <div className="p-5 rounded-[24px] bg-black/35 border border-white/5 flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5 text-right">
                    <span className="text-xs font-black text-white">سجل النخبة والشبكة (Loyal VIPs)</span>
                    <button
                      onClick={() => setActiveTab('contacts')}
                      className="text-[10px] text-[#208084] hover:underline"
                    >
                      عرض الكل
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {referrals.slice(0, 3).map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#208084]/30 text-right flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <img src={r.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128&auto=format&fit=crop"} className="w-9 h-9 rounded-full object-cover border border-white/10" alt={r.refereeName} />
                          <div className="flex flex-col truncate">
                            <span className="text-xs font-bold text-white group-hover:text-[#208084] transition-colors">{r.refereeName}</span>
                            <span className="text-[10px] text-slate-400 truncate mt-0.5">{r.serviceName}</span>
                          </div>
                        </div>

                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25 font-bold shrink-0">
                          +{r.pointsReward} ن
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ELITE HISTORIC FOOTPRINTS TIMELINE */}
                <div className="p-5 rounded-[24px] bg-black/35 border border-white/5 flex flex-col gap-4 text-right">
                  <span className="text-xs font-black text-slate-400 pb-2 border-b border-white/5">العمليات السيادية اللحظية (Activity Ledger)</span>
                  
                  <div className="flex flex-col gap-4.5 pl-1.5">
                    {[
                      { title: "تم توليد وتصديق كرت الياقوت", time: "اليوم - ١٤:٢٠", type: "system" },
                      { title: "تم اقتطاع ٥,٠٠٠ ن لدومين الويب", time: "أمس - ١٠:٠٠", type: "reward" },
                      { title: "مزامنة API الكروت السيادية", time: "٢٠/٠٥ - ١٨:٠٠", type: "api" }
                    ].map((act, i) => (
                      <div key={i} className="flex gap-3 items-start relative text-right">
                        <span className="w-2 h-2 rounded-full bg-[#208084] mt-1.5 shrink-0 shadow-md shadow-[#208084]" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{act.title}</span>
                          <span className="text-[9px] text-slate-500 mt-0.5 font-mono">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 2: VIP CONTACTS GATE */}
          {activeTab === 'contacts' && (
            <motion.div
              key="contacts-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6 text-right"
            >
              {/* Premium Venture Layout Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a0c0d]/60 p-6 md:p-8 rounded-[30px] border border-white/[0.05] shadow-lg">
                <div>
                  <h3 className="text-xl font-black text-white">إمبراطورية الكيانات والنخبة الرقمية</h3>
                  <p className="text-xs text-slate-400 mt-1">تحليل شبكات التواصل ومطابقة صفقات الإحالة وتكامل البوابات السحابية السيادية.</p>
                </div>

                <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <input
                      type="text"
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      placeholder="البحث بالاسم أو العقد..."
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#208084]/60 text-right pr-9 w-full sm:w-60"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                  </div>
                  
                  <button
                    onClick={() => {
                      chimeEngine.playChime('select');
                      handleAddNewReferral({
                        refereeName: "سمو الأمير فيصل بن خالد",
                        serviceName: "رخصة تكامل API مخصصة",
                        pointsReward: 4500
                      });
                      triggerToast("تمت صياغة توثيق إحالة VIP جديدة لسمو الأمير فيصل بن خالد بنجاح! 👑");
                    }}
                    className="bg-gradient-to-r from-[#208084] to-[#145a5d] text-white text-xs font-black px-4.5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1 shrink-0 hover:brightness-110 transition-all shadow-md shadow-[#208084]/15"
                  >
                    إرسال إحالة للنخبة +
                  </button>
                </div>
              </div>

              {/* Elegant Sub-Tab Navigation Switcher */}
              <div className="flex items-center gap-2 pb-1.5 border-b border-white/[0.05] overflow-x-auto scrollbar-none">
                {[
                  { id: 'vip_list', label: 'سجل النخبة والشركاء', icon: <Users className="w-4 h-4" /> },
                  { id: 'integrations', label: 'التكامل السحابي API', icon: <Layers className="w-4 h-4" /> },
                  { id: 'calendar', label: 'تقويم المقابلات واللقاءات', icon: <Calendar className="w-4 h-4" /> }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setContactsSubTab(sub.id as any);
                      chimeEngine.playChime('select');
                    }}
                    className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${contactsSubTab === sub.id ? 'bg-[#208084]/15 border border-[#208084]/35 text-[#208084] shadow-sm' : 'bg-black/25 border border-white/[0.03] text-slate-400 hover:text-white'}`}
                  >
                    {sub.icon}
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>

              {/* CONDITIONAL SUB-VIEW RENDERING */}
              
              {/* SUB-VIEW 1: STANDARD PARTNERS GRID */}
              {contactsSubTab === 'vip_list' && (
                <>
                  {filteredReferrals.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 text-xs bg-black/10 rounded-2xl border border-white/5">لا توجد سجلات مطابقة لمعايير البحث الحالية.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                      {filteredReferrals.map((r) => (
                        <div
                          key={r.id}
                          className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between text-right hover:border-[#208084]/45 transition-colors relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <img src={r.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80"} className="w-12 h-12 rounded-full object-cover border border-white/10" alt="Avatar" />
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-white group-hover:text-[#208084] transition-colors">{r.refereeName}</span>
                                <span className="text-[11px] text-slate-400 mt-1">{r.serviceName}</span>
                              </div>
                            </div>

                            <span className="text-[10px] font-mono bg-[#208084]/10 text-emerald-450 border border-[#208084]/20 px-3 py-1 rounded-full">{r.date}</span>
                          </div>

                          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 text-xs">
                            <span className="text-slate-400">حافز العقد الصندوقي:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#208084] font-mono">+{r.pointsReward.toLocaleString()} ن</span>
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* SUB-VIEW 2: INTEGRATIONS SATELLITE WITH DYNAMIC INTERACTIVE SWITCHES */}
              {contactsSubTab === 'integrations' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {integrationsList.map((item) => {
                    const isConnected = item.status === 'connected';
                    return (
                      <div
                        key={item.id}
                        className="p-6 rounded-[24px] bg-black/45 border border-white/[0.04] flex flex-col justify-between hover:border-[#208084]/40 transition-all duration-300 group shadow-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border border-white/10 ${item.color} text-[#208084] shrink-0`}>
                              {item.id === 'slack' && <Zap className="w-5 h-5 text-emerald-400" />}
                              {item.id === 'zendesk' && <BadgeAlert className="w-5 h-5 text-sky-400" />}
                              {item.id === 'wordpress' && <Code className="w-5 h-5 text-blue-400" />}
                              {item.id === 'google' && <Search className="w-5 h-5 text-red-400" />}
                              {item.id === 'paypal' && <Coins className="w-5 h-5 text-indigo-400" />}
                              {item.id === 'shopify' && <Layers className="w-5 h-5 text-green-400" />}
                            </div>

                            <div className="flex flex-col text-right">
                              <span className="text-xs font-black text-white group-hover:text-[#208084] transition-colors">{item.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">API Protocol</span>
                            </div>
                          </div>

                          {/* Beautiful Interactive Switch for connections */}
                          <button
                            onClick={() => {
                              const updated = integrationsList.map(t => {
                                if (t.id === item.id) {
                                  const nextStatus = t.status === 'connected' ? 'disconnected' : 'connected';
                                  return { ...t, status: nextStatus };
                                }
                                return t;
                              });
                              setIntegrationsList(updated);
                              if (isConnected) {
                                chimeEngine.playChime('select');
                                triggerToast(`تم قطع الاتصال ببوابة ${item.name} المؤقتة.`);
                              } else {
                                chimeEngine.playChime('success');
                                triggerToast(`تمت مزامنة البوابة السيادية مع ${item.name} بأمان! ✓`);
                              }
                            }}
                            className={`w-10 h-6.5 rounded-full p-1 transition-all duration-300 relative ${isConnected ? 'bg-gradient-to-r from-[#208084] to-emerald-500' : 'bg-slate-850 border border-white/10'} cursor-pointer`}
                          >
                            <span className={`block w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-all duration-300 ${isConnected ? '-translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed my-5 h-[34px] overflow-hidden">{item.desc}</p>

                        <div className="flex justify-between items-center border-t border-white/5 pt-3.5 mt-2 text-[10px] font-bold">
                          <span className="text-slate-500">الحالة التشغيلية:</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-450 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-slate-500'}`} />
                            <span className={isConnected ? 'text-emerald-400' : 'text-slate-500'}>{isConnected ? 'مُتصل ونشط سيادياً' : 'غير متصل حالياً'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SUB-VIEW 3: VIP INTERACTIVE CALENDAR PLATFORM */}
              {contactsSubTab === 'calendar' && (
                <div className="p-6 rounded-3xl bg-neutral-950/65 border border-white/[0.04] shadow-2xl">
                  <div className="flex justify-between items-center pb-4 mb-5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                      <span className="text-xs font-black text-amber-400 bg-amber-550/10 border border-amber-500/20 px-3 py-1.5 rounded-full">١٧ لقاءً سيادياً محتملاً هذا الشهر</span>
                    </div>
                    <span className="text-sm font-black text-white font-mono">مايو ٢٠٢٦ (MAY)</span>
                  </div>

                  {/* Calendar Widget Grid */}
                  <div className="grid grid-cols-7 gap-2.5 text-center mb-4 text-xs font-mono font-black text-slate-400 pb-2">
                    {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map((day) => <div key={day}>{day}</div>)}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {/* Render empty places or days */}
                    {Array.from({ length: 31 }).map((_, index) => {
                      const dayNumber = index + 1;
                      
                      // Highlight specific days
                      const isEventDay = dayNumber === 24 || dayNumber === 26 || dayNumber === 28;
                      const eventDetails = 
                        dayNumber === 24 ? { title: "مسبوكات الذهب الفاخرة", client: "الأمير فيصل بن المطيري" } :
                        dayNumber === 25 ? null :
                        dayNumber === 26 ? { title: "تثبيت خوادم الربط وبث NFC", client: "موقع الشكور ووزارة الاتصالات" } :
                        dayNumber === 28 ? { title: "إمبراطورية الكروت الذكية", client: "الجهة السيادية للتقنية المصرفية" } : null;

                      return (
                        <button
                          key={dayNumber}
                          onClick={() => {
                            chimeEngine.playChime('gold');
                            if (isEventDay && eventDetails) {
                              triggerToast(`📅 موعد سيادي: ${eventDetails.title} لصالح ${eventDetails.client}`);
                            } else {
                              triggerToast(`تم حجز اليوم ${dayNumber} للاستنفار وتلقي الإحالات العامة 📋`);
                            }
                          }}
                          className={`min-h-[64px] rounded-2xl p-2.5 flex flex-col justify-between items-end relative border transition-all duration-300 hover:scale-105 cursor-pointer ${
                            isEventDay 
                              ? 'bg-[#208084]/15 border-[#208084]/45 text-emerald-300 shadow-md shadow-[#208084]/5' 
                              : 'bg-black/30 border-white/[0.03] text-slate-500 hover:text-white hover:border-white/10'
                          }`}
                        >
                          <span className="text-xs font-mono font-bold">{dayNumber}</span>
                          
                          {isEventDay && eventDetails && (
                            <span className="w-2 h-2 rounded-full bg-emerald-450 animate-ping absolute top-2 left-2 shadow-[0_0_8px_#10b981]" title={eventDetails.title} />
                          )}

                          {isEventDay && eventDetails && (
                            <div className="text-[7.5px] text-[#208185] font-black truncate max-w-full text-right block line-clamp-1 w-full mt-1.5">{eventDetails.title}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* TAB 3: PROECTS DATABASE AND LEAGDER Contracts */}
          {activeTab === 'projects' && (
            <motion.div
              key="projects-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6 text-right"
            >
              {/* Premium Venture Hub Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a0c0d]/60 p-6 md:p-8 rounded-[30px] border border-white/[0.05] shadow-lg">
                <div>
                  <h3 className="text-xl font-black text-white">مستودع المشاريع والدفاتر المالية</h3>
                  <p className="text-xs text-slate-400 mt-1">إدارة شاملة للعقود السيادية، تدوين محاورة الأفكار، وتعقب المبيعات والعمليات المالية الذكية.</p>
                </div>

                <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="البحث في المستندات..."
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#208084]/60 text-right pr-9 w-full sm:w-60"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                  </div>
                  
                  <button
                    onClick={() => {
                      chimeEngine.playChime('select');
                      handleAddNewProject({
                        title: "بناء وتكامل الياقوت بنظام NFC الفريد",
                        client: "شركة التطوير الفندقية بالرياض",
                        budget: "٩٥,٠٠٠ ريال",
                        category: "الرقمية السيادية"
                      });
                      triggerToast("تم تسجيل مشروع ذهبي جديد لصالح شركة التطوير الفندقية! 👑");
                    }}
                    className="bg-gradient-to-r from-[#208084] to-[#145a5d] text-white text-xs font-black px-4.5 py-2.5 rounded-xl cursor-pointer hover:brightness-110 transition-all shadow-md shadow-[#208084]/15"
                  >
                    تسجيل عقد مشروع +
                  </button>
                </div>
              </div>

              {/* Sub-Tab Selector for Projects tab */}
              <div className="flex items-center gap-2 pb-1.5 border-b border-white/[0.05] overflow-x-auto scrollbar-none">
                {[
                  { id: 'contracts_ledger', label: 'عقود المشاريع والتنفيذ', icon: <Briefcase className="w-4 h-4" /> },
                  { id: 'analytics', label: 'الدفتر المالي والمؤشرات', icon: <TrendingUp className="w-4 h-4" /> },
                  { id: 'notes', label: 'الأفكار والمدونات الذكية', icon: <Bookmark className="w-4 h-4" /> }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setProjectsSubTab(sub.id as any);
                      chimeEngine.playChime('select');
                    }}
                    className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${projectsSubTab === sub.id ? 'bg-[#208084]/15 border border-[#208084]/35 text-[#208084] shadow-sm' : 'bg-black/25 border border-white/[0.03] text-slate-400 hover:text-white'}`}
                  >
                    {sub.icon}
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>

              {/* CONDITIONAL SUB-VIEW RE-RENDERING */}

              {/* SECTION A: CONTRACTS & LEADERBOARD SYSTEM */}
              {projectsSubTab === 'contracts_ledger' && (
                <>
                  <div className="flex justify-between items-center bg-black/10 py-2.5 px-3 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-slate-400">نمط عرض السجلات:</span>
                    
                    <div className="flex bg-black/45 p-1 rounded-xl border border-white/5">
                      {[
                        { id: 'card', icon: <Grid className="w-4 h-4" /> },
                        { id: 'list', icon: <List className="w-4 h-4" /> },
                        { id: 'kanban', icon: <Columns className="w-4 h-4" /> }
                      ].map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => { setViewMode(mode.id as any); chimeEngine.playChime('select'); }}
                          className={`p-2 rounded-lg cursor-pointer transition-colors ${viewMode === mode.id ? 'bg-[#208084] text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                          {mode.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* VIEW 1: GLASS CONTRACT CARDS */}
                  {viewMode === 'card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                      {filteredProjects.map((p) => (
                        <div
                          key={p.id}
                          className="p-5 rounded-3xl bg-black/40 border border-white/5 flex flex-col justify-between h-[190px] hover:border-[#208084]/45 transition-colors shadow-md relative overflow-hidden group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-white group-hover:text-[#208084] transition-colors">{p.title}</span>
                              <span className="text-[11px] text-slate-400 mt-1">{p.client}</span>
                            </div>
                            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/20 px-3 py-1 rounded-full">{p.status}</span>
                          </div>

                          <div className="flex flex-col gap-2 mt-4.5">
                            <div className="flex justify-between text-xs opacity-60">
                              <span>قوة إنجاز غايات العقد</span>
                              <span className="font-mono text-emerald-400">{p.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#208084] to-emerald-400" style={{ width: `${p.progress}%` }} />
                            </div>
                          </div>

                          <div className="flex justify-between items-center border-t border-white/5 pt-3.5 mt-3 text-xs">
                            <span className="text-slate-500">مجموع الموارد:</span>
                            <span className="font-bold text-white font-mono">{p.budget}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* VIEW 2: PREMIUM DIGITAL LISTS */}
                  {viewMode === 'list' && (
                    <div className="flex flex-col gap-3">
                      {filteredProjects.map((p) => (
                        <div
                          key={p.id}
                          className="p-4.5 rounded-[18px] bg-black/30 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-right hover:border-[#208084]/35 transition-all shadow-sm"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-100">{p.title}</span>
                            <span className="text-[10px] text-slate-500 mt-1">{p.client}</span>
                          </div>

                          <div className="flex items-center gap-8 justify-between sm:justify-end">
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="text-[10px] text-slate-400 font-mono">التقدم: {p.progress}%</span>
                              <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#208084] to-emerald-450" style={{ width: `${p.progress}%` }} />
                              </div>
                            </div>

                            <span className="text-xs font-bold text-emerald-450 font-mono shrink-0">{p.budget}</span>
                            <span className="text-[10px] tracking-wider text-slate-300 font-bold bg-white/5 px-2.5 py-1 rounded-lg shrink-0">{p.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* VIEW 3: DYNAMIC DRAGGABLE KANBAN */}
                  {viewMode === 'kanban' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-right">
                      {(['planning', 'active', 'review', 'completed'] as const).map((col) => {
                        const group = filteredProjects.filter(p => p.status === col);
                        return (
                          <div key={col} className="p-4 rounded-2xl bg-black/45 border border-white/[0.04] flex flex-col gap-3.5 min-h-[350px] shadow-lg">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                              <span className="text-xs font-black text-white uppercase">{col === 'planning' ? '📋 مقترحات ومشاريع' : col === 'active' ? '⚡ قيد الحسم' : col === 'review' ? '🔍 معايير التفويض' : '✓ تم إثباتها شرفياً'}</span>
                              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">{group.length}</span>
                            </div>

                            <div className="flex flex-col gap-2.5">
                              {group.map((p) => (
                                <div
                                  key={p.id}
                                  onClick={() => {
                                    const states: Array<'planning' | 'active' | 'review' | 'completed'> = ['planning', 'active', 'review', 'completed'];
                                    const nextIdx = (states.indexOf(p.status) + 1) % states.length;
                                    setProjects(prev => prev.map(item => item.id === p.id ? { ...item, status: states[nextIdx] } : item));
                                    chimeEngine.playChime('select');
                                    triggerToast(`تم نقل المشروع بنجاح إلى مرحلة: ${states[nextIdx]}`);
                                  }}
                                  className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.04] hover:border-[#208084]/45 transition-all text-right cursor-pointer group hover:bg-[#208084]/5"
                                >
                                  <span className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors leading-relaxed block">{p.title}</span>
                                  <span className="text-[10px] text-slate-550 truncate block mt-1.5">{p.client}</span>
                                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/5 text-[9.5px]">
                                    <span className="opacity-40 font-mono">طرح: {p.budget}</span>
                                    <span className="text-[#208084] font-black">إنجاز: {p.progress}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* SECTION B: ANALYTICS LEDGER & HISTORIC VALUE PORTAL */}
              {projectsSubTab === 'analytics' && (
                <div className="flex flex-col gap-6">
                  {/* Master Ledger Graph */}
                  <div className="p-6 rounded-[28px] bg-[#090b0c]/80 border border-white/[0.05] shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-2 py-0.5 rounded">V4 ACTIVE</span>
                        <span className="text-[11px] text-slate-500">مؤشر رصيد مبيعات الإحالات المتبادلة</span>
                      </div>
                      <span className="text-xs font-black text-white">تحليل النمو المالي السنوي</span>
                    </div>

                    <div className="h-[210px] w-full">
                      <SovereignAreaChart theme={theme} />
                    </div>
                  </div>

                  {/* Filter and Search for Ledger Transactions */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/25 p-5.5 rounded-2xl border border-white/5 mt-2">
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-black text-white">سجل المعاملات والعمليات الرقمية اللحظية</span>
                      <span className="text-[10px] text-slate-500 tracking-wide mt-0.5">مراجعة المبالغ وقنوات الدفع والتأكيد السيادي المتبادل.</span>
                    </div>

                    <div className="flex gap-2.5 w-full md:w-auto">
                      <div className="relative flex-1 md:flex-initial">
                        <input
                          type="text"
                          value={transactionSearch}
                          onChange={(e) => setTransactionSearch(e.target.value)}
                          placeholder="البحث برقم المعاملة أو الكيان..."
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#208084]/60 text-right pr-9 w-full sm:w-60"
                        />
                        <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                      </div>

                      <select
                        value={transactionsFilter}
                        onChange={(e) => {
                          setTransactionsFilter(e.target.value as any);
                          chimeEngine.playChime('select');
                        }}
                        className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer text-right min-w-[120px]"
                      >
                        <option value="all">كل الحالات 🌐</option>
                        <option value="completed">تم الحسم شرفياً ✓</option>
                        <option value="pending">معلق بالقيد ⚡</option>
                        <option value="active">قيد التنفيذ النشط 🔍</option>
                      </select>
                    </div>
                  </div>

                  {/* Render Table with extreme precision */}
                  <div className="rounded-2xl border border-white/[0.04] bg-neutral-950/45 overflow-hidden shadow-2xl">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5 text-slate-400">
                          <th className="py-3 px-5">رقم المعاملة</th>
                          <th className="py-3 px-5">صاحب العقد</th>
                          <th className="py-3 px-5">تاريخ العمل</th>
                          <th className="py-3 px-5">القيمة الإجمالية</th>
                          <th className="py-3 px-5">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.02]">
                        {transactionsList
                          .filter(t => {
                            const matchSearch = t.client.toLowerCase().includes(transactionSearch.toLowerCase()) || t.id.toLowerCase().includes(transactionSearch.toLowerCase());
                            const matchStatus = transactionsFilter === 'all' || t.status === transactionsFilter;
                            return matchSearch && matchStatus;
                          })
                          .map((t) => (
                            <tr
                              key={t.id}
                              onClick={() => {
                                // Cycle status dynamically for tactile feedback
                                const availableStatuses = ['completed', 'pending', 'active'];
                                const currentIdx = availableStatuses.indexOf(t.status);
                                const nextStatus = availableStatuses[(currentIdx + 1) % availableStatuses.length];
                                setTransactionsList(prev => prev.map(item => item.id === t.id ? { ...item, status: nextStatus } : item));
                                chimeEngine.playChime('select');
                                triggerToast(`تمت معايرة حالة العمل للأمر ${t.id} إلى: ${nextStatus === 'completed' ? 'مكتمل' : nextStatus === 'pending' ? 'مُعلّق' : 'نشط'}`);
                              }}
                              className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                            >
                              <td className="py-4 px-5 font-mono font-bold text-slate-400 group-hover:text-white">{t.id}</td>
                              <td className="py-4 px-5 text-white font-bold">{t.client}</td>
                              <td className="py-4 px-5 text-slate-500 font-mono">{t.date}</td>
                              <td className="py-4 px-5 font-bold text-emerald-450 font-mono">{t.amount}</td>
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-1.5 justify-start">
                                  <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'completed' ? 'bg-emerald-450 shadow-[0_0_8px_#10b981]' : t.status === 'active' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-slate-500'}`} />
                                  <span className={`text-[11px] ${t.status === 'completed' ? 'text-emerald-400' : t.status === 'active' ? 'text-amber-300' : 'text-slate-500'}`}>
                                    {t.status === 'completed' ? 'مكتمل' : t.status === 'active' ? 'جاري التنفيذ' : 'معلّق بالدفع'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SECTION C: IDEAS AND NOTES PLATFORM */}
              {projectsSubTab === 'notes' && (
                <div className="flex flex-col gap-6">
                  {/* Floating Action note prompt creator */}
                  <div className="p-5.5 rounded-2xl bg-black/35 border border-white/5 flex justify-between items-center text-right">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white">إضافة فكرة أو خاطرة سيادية مسجلة</span>
                      <span className="text-[10px] text-slate-500 mt-1">يمكنك تدوين الملاحظات الفورية لدعم اجتماعات ومشاريع النخبة.</span>
                    </div>

                    <button
                      onClick={() => {
                        chimeEngine.playChime('success');
                        const prompt = window.prompt("اكتب عنوان الملاحظة السيادية الجديدة:") || "";
                        if (prompt.trim()) {
                          const desc = window.prompt("اكتب نص أو محتوى الملاحظة بالتفصيل:") || "";
                          const tag = window.prompt("اكتب اسم التصنيف (مثال: Weekly, Personal, VIP):") || "General";
                          const addedNote = {
                            id: `note-${Date.now()}`,
                            title: prompt,
                            desc: desc || "مراجعة تفاصيل ودفاتر مبيعات النخبة وتدقيق آليات NFC الخاصة بالشكور.",
                            category: tag,
                            tagColor: 'bg-amber-500/15 text-amber-300 border-amber-500/10',
                            date: 'اليوم',
                            members: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80']
                          };
                          setNotesList(prev => [addedNote, ...prev]);
                          triggerToast("تم إضافة الملاحظة وحفظها إلى دفاتر النخبة بامتياز!");
                        }
                      }}
                      className="bg-[#208084] text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer"
                    >
                      إضافة تدوينة جديدة +
                    </button>
                  </div>

                  {/* Notes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-right">
                    {notesList.map((note) => (
                      <div
                        key={note.id}
                        className="p-6 rounded-[24px] bg-[#090b0c]/80 border border-white/[0.04] flex flex-col justify-between hover:border-[#208084]/45 transition-all duration-300 group shadow-md"
                      >
                        <div>
                          <div className="flex justify-between items-start pb-3 border-b border-white/5 mb-4">
                            <span className="text-[10.5px] text-slate-500 font-mono tracking-wide">{note.date}</span>
                            <span className={`text-[9.5px] font-black uppercase px-2.5 py-1 rounded bg-slate-800 border border-white/5 ${note.tagColor}`}>{note.category}</span>
                          </div>

                          <h4 className="text-sm font-black text-white group-hover:text-[#208084] transition-colors leading-relaxed">{note.title}</h4>
                          <p className="text-xs text-slate-450 leading-relaxed mt-2.5 line-clamp-3">{note.desc}</p>
                        </div>

                        {/* Note footers - listing members working on this idea */}
                        <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
                          <span className="text-[10px] text-slate-500">الفريق القائم على الفكرة:</span>
                          
                          <div className="flex items-center -space-x-1.5 overflow-hidden">
                            {note.members.map((m, idx) => (
                              <img
                                key={idx}
                                src={m}
                                className="w-6.5 h-6.5 rounded-full object-cover border border-neutral-900"
                                alt="Member"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* TAB 4: THE STUDIO COHESIVE INTERFACE */}
          {activeTab === 'studio' && (
            <motion.div
              key="studio-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <StudioLab
                drafts={drafts}
                onAddDraft={handleAddNewDraft}
                onDeleteDraft={handleDeleteDraft}
                onPublishDraft={handlePublishDraft}
                currentTheme={theme}
                triggerToast={triggerToast}
              />
            </motion.div>
          )}

          {/* TAB 5: REWARDS STORE EXCHANGE */}
          {activeTab === 'rewards' && (
            <motion.div
              key="rewards-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6 text-right"
            >
              <div className="bg-black/25 p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-black text-white">متجر الأصول الحصرية والجوائز السيادية</h3>
                  <p className="text-xs text-slate-400">صرف رصيد المكافآت الحالية واقتناء دروع النحاس والتفويضات الشرفية.</p>
                </div>

                <span className="text-sm font-black text-amber-400 bg-amber-500/15 border border-amber-500/25 px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0">
                  <Coins className="w-4 h-4" /> الرصيد: {userData.points.toLocaleString()} ن
                </span>
              </div>

              {/* Reward Grid list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewards.map((rew) => (
                  <div
                    key={rew.id}
                    className="p-5 rounded-2xl bg-black/35 border border-white/5 flex flex-col justify-between h-[230px] hover:border-[#208084]/30 transition-colors relative overflow-hidden group"
                  >
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-slate-400 font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full">{rew.category}</span>
                        <span className="text-[9px] text-[#208084] font-bold">مقتبَسة {rew.claimedTimes} مرات</span>
                      </div>
                      
                      <h4 className="text-xs font-black text-slate-100 group-hover:text-emerald-300 transition-colors mt-4 leading-relaxed">{rew.title}</h4>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">التكلفة الشرفية المقدرة:</span>
                        <span className="font-extrabold text-amber-400 font-mono">{rew.pointsCost.toLocaleString()} points</span>
                      </div>

                      <button
                        onClick={() => handleClaimReward(rew.id, rew.pointsCost, rew.title)}
                        className={`w-full text-xs font-black py-2.5 rounded-xl transition-all cursor-pointer ${userData.points >= rew.pointsCost ? 'bg-[#208084] text-white hover:bg-[#1b6b6e]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                      >
                        {userData.points >= rew.pointsCost ? 'اقتناء الأصل الآن 🪙' : 'نقاط رتبتك غير كافية'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* PORTRAIT CARD PERSONALIZER MODAL/DIALOG */}
      <AnimatePresence>
        {isCardEditorOpen && (
          <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCardEditorOpen(false)}
              className="absolute inset-0 bg-black/80"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg p-6 md:p-8 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl z-10 text-right flex flex-col gap-5 relative overflow-hidden"
              style={{ direction: 'rtl' }}
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <h3 className="text-md font-black text-white">تعديل ملف كرت النخبة السيادي 🖊️</h3>
                <button onClick={() => setIsCardEditorOpen(false)} className="p-1 hover:bg-white/5 rounded">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSaveCardDetails} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-300 font-bold">اسم معالي الريادي بالكامل</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#208084]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-300 font-bold">المنصب الاستراتيجي والوظيفة</label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#208084]"
                  />
                </div>

                <div className="flex flex-col gap-2 border border-white/5 bg-black/45 p-4 rounded-2xl text-right">
                  <span className="text-[11px] text-[#208084] font-black tracking-wide block mb-1">تحديث الصورة الشخصية وبث الهوية 📸</span>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Live Preview circle */}
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#208084]/50 shadow-lg shrink-0 bg-neutral-950 flex items-center justify-center">
                      {editedAvatar ? (
                        <img 
                          src={editedAvatar} 
                          className="w-full h-full object-cover" 
                          alt="مستعرض الصورة" 
                        />
                      ) : (
                        <span className="text-[9px] text-zinc-500 font-bold block text-center">بلا صورة</span>
                      )}
                    </div>

                    <div className="flex-1 w-full flex flex-col gap-2">
                      {/* Image uploader button */}
                      <label 
                        className="bg-gradient-to-r from-[#208084] to-[#125557] hover:brightness-110 text-white text-[11px] py-2.5 px-4 rounded-xl text-center cursor-pointer font-black transition-all shadow-md shadow-[#208084]/15 block w-full"
                        title="اختر ملف صورة من جهازك الشخصي"
                      >
                        <span>رفع صورة شخصية مباشرة 💻</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setEditedAvatar(reader.result);
                                  chimeEngine.playChime('success');
                                  triggerToast("تم تحميل ومعالجة صورتك الشخصية بنجاح 📸");
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {/* Text URL alternative field */}
                      <input
                        type="text"
                        placeholder="أو الصق رابط صورة سحابي مباشر هنا..."
                        value={editedAvatar}
                        onChange={(e) => setEditedAvatar(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white outline-none focus:border-[#208084] font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Preset VIP Templates Picker */}
                  <div className="mt-2.5 pt-2.5 border-t border-white/5">
                    <span className="text-[10px] text-slate-400 font-bold block mb-2">أو اختر من صور النخبة والرواد المعتمدة:</span>
                    <div className="flex gap-2.5 pb-1 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
                      {[
                        { name: "Executive Dark Suit", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" },
                        { name: "Sovereign Leader", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80" },
                        { name: "Global Diplomat", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80" },
                        { name: "Future Tech Innovator", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80" }
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setEditedAvatar(preset.url);
                            chimeEngine.playChime('select');
                          }}
                          className={`relative shrink-0 w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-300 ${editedAvatar === preset.url ? 'border-amber-400 scale-110 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/20' : 'border-white/10 hover:border-white/30'}`}
                          title={preset.name}
                        >
                          <img src={preset.url} className="w-full h-full object-cover" alt={preset.name} />
                          {editedAvatar === preset.url && (
                            <span className="absolute inset-0 bg-amber-500/10 flex items-center justify-center">
                              <Check className="w-4 h-4 text-amber-300 drop-shadow-md" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsCardEditorOpen(false)}
                    className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    تراجع
                  </button>
                  <button
                    type="submit"
                    className="bg-[#208084] hover:bg-[#1b6b6e] text-white px-5 py-2 rounded-xl text-xs font-black"
                  >
                    بث وتوثيق التفاصيل ✓
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING PERSISTENT BOT ORB (Apple Intelligence Style - Draggable) */}
      <motion.div 
        drag
        dragMomentum={false}
        dragElastic={0.1}
        className="fixed bottom-28 left-6 z-40 pointer-events-auto cursor-grab active:cursor-grabbing"
        title="اسحب الأيقونة الذكية أو اضغط لفتح سكرتير الشكور"
      >
        <button
          onClick={() => {
            setIsSecretaryOpen(true);
            chimeEngine.playChime('neon');
          }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#208084] via-emerald-600 to-[#125557] flex items-center justify-center text-white cursor-pointer relative shadow-[0_8px_32px_rgba(32,128,132,0.35)] hover:scale-110 active:scale-95 transition-all duration-300"
        >
          {/* Pulsing glow rings representing live AI processing */}
          <span className="absolute inset-0 rounded-full border border-emerald-400/50 animate-ping opacity-60" style={{ animationDuration: '3s' }} />
          <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#208084]/20 to-amber-500/10 blur-sm" />
          <span className="absolute inset-[2px] rounded-full bg-black/80 backdrop-blur-md" />
          <Bot className="w-6 h-6 relative z-10 text-emerald-300 drop-shadow-[0_2px_10px_rgba(52,211,153,0.65)] animate-bounce" style={{ animationDuration: '4s' }} />
          
          {/* Subtle drag handle hint dot indicators */}
          <span className="absolute bottom-1 flex justify-center gap-0.5 inset-x-0 z-20 opacity-30">
            <span className="w-0.5 h-0.5 rounded-full bg-white" />
            <span className="w-0.5 h-0.5 rounded-full bg-white" />
            <span className="w-0.5 h-0.5 rounded-full bg-white" />
          </span>
        </button>
      </motion.div>

      {/* DOCK BACK NAVIGATION FOOTER */}
      <footer className="fixed bottom-0 inset-x-0 bg-[#060809]/90 backdrop-blur-3xl border-t border-white/[0.06] py-3.5 z-45 shadow-[0_-15px_40px_rgba(0,0,0,0.92)]">
        <div className="max-w-xl mx-auto px-4 flex justify-between items-center relative gap-1">
          
          {[
            { id: 'home', label: 'الرئيسية', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
            { id: 'contacts', label: 'النخبة', icon: <Users className="w-[18px] h-[18px]" /> },
            { id: 'projects', label: 'المشاريع', icon: <Briefcase className="w-[18px] h-[18px]" /> },
            { id: 'ai_orb', label: 'الشكور الذكي', icon: <Bot className="w-5.5 h-5.5 text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-bounce" style={{ animationDuration: '4s' }} />, isSpecial: true },
            { id: 'studio', label: 'الاستوديو', icon: <Code className="w-[18px] h-[18px]" /> },
            { id: 'rewards', label: 'المكافآت', icon: <Award className="w-[18px] h-[18px]" /> }
          ].map((tab) => {
            if (tab.isSpecial) {
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setIsSecretaryOpen(true);
                    chimeEngine.playChime('neon');
                  }}
                  className="w-14 h-14 -mt-8 rounded-full bg-gradient-to-tr from-[#208084] via-emerald-600 to-[#0a3536] flex items-center justify-center text-white shadow-[0_0_30px_rgba(32,128,132,0.8)] border-3 border-neutral-950 hover:scale-115 active:scale-95 transition-all duration-300 cursor-pointer relative"
                  title="بوابة الذكاء الاصطناعي الشاملة"
                >
                  <span className="absolute inset-0 rounded-full border border-emerald-450/40 animate-ping opacity-45" style={{ animationDuration: '3s' }} />
                  <span className="absolute inset-[2.5px] rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-80" />
                  {tab.icon}
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  chimeEngine.playChime('select');
                }}
                className={`flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105 cursor-pointer outline-none relative py-1 md:py-1.5 px-3 rounded-2xl ${activeTab === tab.id ? 'text-[#208084] font-black' : 'text-slate-400 hover:text-white'}`}
              >
                {activeTab === tab.id && (
                  <motion.span 
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-[#208084]/10 rounded-xl -z-10 border border-[#208084]/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {tab.icon}
                <span className="text-[10px] md:text-[10.5px] tracking-wide mt-0.5">{tab.label}</span>
              </button>
            );
          })}

        </div>
      </footer>

      {/* AI INCORPORATED COMPONENT DRAWER */}
      <AiSecretary
        isOpen={isSecretaryOpen}
        onClose={() => setIsSecretaryOpen(false)}
        onAddDraft={handleAddNewDraft}
        onAddProject={handleAddNewProject}
        onAddReferral={handleAddNewReferral}
        triggerToast={triggerToast}
        userName={userData.name}
      />

    </div>
  );
}

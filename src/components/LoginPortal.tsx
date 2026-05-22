import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, QrCode, Smartphone, Database, Check, Award, ArrowRight } from 'lucide-react';
import { chimeEngine } from './TactileSound';

interface LoginPortalProps {
  currentTheme: 'luxury' | 'minimal' | 'chinese' | 'cosmos' | 'grok';
  onLoginSuccess: (profile: { name: string; title: string; avatar: string; email: string }) => void;
}

const PRESET_PORTRAITS = [
  {
    name: "م. عبد الرحمن الشكور",
    title: "الرئيس التنفيذي للابتكار الرقمي",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
    email: "abdulrahman@mshkur.com"
  },
  {
    name: "م. فهد بن ناصر",
    title: "مستشار حلول السيادة الرقمية",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
    email: "fahad.n@mshkur.com"
  },
  {
    name: "د. سارة الهاشمي",
    title: "شريكة إقليمية - تطوير الـ VIP",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
    email: "sara.h@mshkur.com"
  }
];

export const LoginPortal: React.FC<LoginPortalProps> = ({ currentTheme, onLoginSuccess }) => {
  const [phase, setPhase] = useState<'welcome' | 'identity_select' | 'compiling' | 'ready'>('welcome');
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customName, setCustomName] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  
  // Compiling process state
  const [compileStep, setCompileStep] = useState(0);
  const [compileProgress, setCompileProgress] = useState(0);

  const stepsText = [
    "جارٍ سحب صورتك ومعطيات الهوية الموثقة من Google...",
    "جارٍ تشفير وحياكة بطاقة كرت السيادة السحابي (NFC Active)...",
    "جارٍ توليد وتسميت شفرة الاستجابة السريعة (Sovereign QR)...",
    "تأمين خادم المزامنة التلقائية مع Google Drive & Sheets...",
    "اكتمال تشييد النظام وبدء التحميل النهائي لتبويب الشكور..."
  ];

  const currentPreset = PRESET_PORTRAITS[selectedPreset];

  useEffect(() => {
    if (phase !== 'compiling') return;

    let progressInterval = setInterval(() => {
      setCompileProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 60);

    let stepInterval = setInterval(() => {
      setCompileStep(prev => {
        if (prev >= stepsText.length - 1) {
          clearInterval(stepInterval);
          return stepsText.length - 1;
        }
        chimeEngine.playChime('select');
        return prev + 1;
      });
    }, 1200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [phase]);

  useEffect(() => {
    if (compileProgress === 100 && phase === 'compiling') {
      chimeEngine.playChime('success');
      setPhase('ready');
    }
  }, [compileProgress, phase]);

  const handleStartLogin = () => {
    chimeEngine.playChime('select');
    setPhase('identity_select');
  };

  const handleConfirmIdentity = () => {
    chimeEngine.playChime('gold');
    setPhase('compiling');
  };

  const handleLaunchApp = () => {
    onLoginSuccess({
      name: customName.trim() || currentPreset.name,
      title: customTitle.trim() || currentPreset.title,
      avatar: currentPreset.url,
      email: currentPreset.email
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative ambient spots suited for login portal */}
      <div className="absolute inset-0 z-0 bg-radial from-slate-950 via-neutral-950 to-black" />
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#208084] opacity-10 blur-[130px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500 opacity-5 blur-[120px]" />

      <AnimatePresence mode="wait">
        
        {/* PHASE 1: WELCOME / INTRO */}
        {phase === 'welcome' && (
          <motion.div
            key="welcome-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg p-8 md:p-10 rounded-3xl bg-neutral-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl z-10 text-center relative flex flex-col items-center gap-6"
          >
            {/* Crown launch icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#208084] to-amber-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-[#208084]/25">
              M
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                Mshkur Studio
                <span className="text-xs bg-[#208084]/20 text-[#208084] px-2 py-0.5 rounded-full border border-[#208084]/35 font-mono">OS V4</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                مرحباً بك في الاستوديو السيادي الكامل لـ Mshkur-OS. تجربة زجاجية مستقبلية 2026 لإدارة الكروت الرقمية، معاملات النخبة ومزامنة الإحالات والتقدم التفاعلي.
              </p>
            </div>

            {/* Glowing card graphic demo */}
            <div className="w-full p-6 rounded-2xl bg-black/45 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-2 left-3 text-[9px] font-mono opacity-20 tracking-widest uppercase">M-Os Encryption Active</div>
              <div className="flex items-center gap-3.5 text-right">
                <div className="w-11 h-11 rounded-full bg-slate-800 border border-white/15 animate-pulse" />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-3.5 bg-slate-800 rounded w-2/3 animate-pulse" />
                  <div className="h-2.5 bg-slate-800 rounded w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="mt-5 h-[1.5px] bg-gradient-to-r from-transparent via-[#208084] to-transparent" />
              <p className="text-[10px] text-slate-500 mt-2 font-mono">Automatic Google Account Integration & Premium Setup</p>
            </div>

            {/* Google Login Trigger */}
            <button
              onClick={handleStartLogin}
              className="w-full bg-gradient-to-r from-[#208084] to-emerald-500 text-white font-extrabold py-3.5 px-6 rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-[#208084]/25 transition-all text-sm flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.48 1 0 6.48 0 13s5.48 12 12.24 12c7.06 0 11.77-4.97 11.77-11.97 0-.81-.08-1.42-.19-1.745H12.24z"/>
              </svg>
              <span>تسجيل الدخول الآمن بحساب Google</span>
            </button>
          </motion.div>
        )}

        {/* PHASE 2: IDENTITY CHOOSE & PERSONALIZE */}
        {phase === 'identity_select' && (
          <motion.div
            key="config-card"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full max-w-xl p-8 rounded-3xl bg-neutral-900/70 backdrop-blur-2xl border border-white/10 shadow-2xl z-10 flex flex-col gap-6"
          >
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#208084] bg-[#208084]/15 px-2.5 py-1 rounded-full border border-[#208084]/20 w-max">Onboarding Step 1</span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-2">مزامنة حساب Google البصري</h2>
              <p className="text-xs text-slate-400 mt-1">سحبنا صورتك التلقائية. اختر هويتك المفضلة أو خصص الاسم والمنصب لكرتك الرقمي.</p>
            </div>

            {/* Presets selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 text-right">الحسابات والوجوه الملتقطة:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_PORTRAITS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(idx);
                      setCustomName(p.name);
                      setCustomTitle(p.title);
                      chimeEngine.playChime('select');
                    }}
                    className={`p-3 rounded-2xl text-right flex flex-col gap-2 border transition-all cursor-pointer bg-black/25 ${idx === selectedPreset ? 'border-[#208084] bg-[#208084]/5 shadow-md shadow-[#208084]/10' : 'border-white/5 hover:border-white/10 hover:bg-white/5'}`}
                  >
                    <img src={p.url} className="w-10 h-10 rounded-full object-cover border border-white/15" alt={p.name} />
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-white">{p.name}</span>
                      <span className="text-[9px] text-slate-500 mt-1 truncate">{p.email}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customizer forms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-slate-300 font-bold">الاسم المعروض بالكرت</label>
                <input
                  type="text"
                  value={customName || currentPreset.name}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="م. عبد الرحمن الشكور"
                  className="bg-black/45 border border-white/15 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#208084]/60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-slate-300 font-bold">المنصب / اللقب الرسمي</label>
                <input
                  type="text"
                  value={customTitle || currentPreset.title}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="الرئيس التنفيذي والشريك المؤسس"
                  className="bg-black/45 border border-white/15 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#208084]/60"
                />
              </div>
            </div>

            {/* Trigger Onboarding compile */}
            <button
              onClick={handleConfirmIdentity}
              className="w-full bg-[#208084] text-white font-extrabold py-3.5 rounded-2xl cursor-pointer hover:bg-[#1b6b6e] transition-all text-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>تأكيد الهوية وبدء تشييد كرت السيادة</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </motion.div>
        )}

        {/* PHASE 3: COMPILING SYSTEM ONBOARDING SEQUENCE */}
        {phase === 'compiling' && (
          <motion.div
            key="compiling-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg p-8 rounded-3xl bg-neutral-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl z-10 flex flex-col gap-6 text-center text-right"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <span className="absolute -inset-2 rounded-full border border-[#208084]/40 animate-ping opacity-35" />
                <div className="w-12 h-12 rounded-full border-4 border-[#208084]/30 border-t-[#208084] animate-spin flex items-center justify-center">
                  <Database className="w-5 h-5 text-[#208084]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">تجميع وتهيئة Mshkur-OS...</h3>
            </div>

            {/* Dynamic Step indicator */}
            <div className="bg-black/35 p-5 rounded-2xl border border-white/5 min-h-[100px] flex flex-col justify-center gap-2">
              <span className="text-xs font-bold text-[#208084] block">{stepsText[compileStep]}</span>
              
              <div className="flex justify-between text-[10px] opacity-50 mt-2 font-mono">
                <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> NFC BEACON</span>
                <span className="flex items-center gap-1"><QrCode className="w-3 h-3" /> QR INSTANTIATOR</span>
              </div>
            </div>

            {/* Percentage Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-50">مؤشرات التقدم والربط</span>
                <span className="font-bold text-[#208084] font-mono">{compileProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#208084] to-emerald-400" style={{ width: `${compileProgress}%` }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 4: SYSTEM CONFIGURED SUCCESSFULLY */}
        {phase === 'ready' && (
          <motion.div
            key="ready-card"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 rounded-3xl bg-neutral-900/90 backdrop-blur-2xl border-2 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] z-10 text-center flex flex-col items-center gap-6"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-500/10">
              ✓
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white">تم تفعيل الكرت السيادي بنجاح!</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed px-2">
                سحبنا صورتك التلقائية من Google، قمنا بإنتاج الـ QR المخصص، وكتبنا البصمة على شريحة NFC وتوجنا حسابك برتبة الياقوت الملكي مع نقاط ريادية baseline.
              </p>
            </div>

            {/* Compiled Card presentation snippet */}
            <div className="w-full p-4 rounded-xl bg-black/60 border border-white/10 text-right flex items-center gap-3">
              <img src={currentPreset.url} className="w-11 h-11 rounded-full object-cover border-2 border-[#208084]" alt="Avatar" />
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-xs font-bold text-white">{customName.trim() || currentPreset.name}</span>
                <span className="text-[10px] text-slate-400 truncate mt-1">{customTitle.trim() || currentPreset.title}</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20 font-bold shrink-0">
                الياقوت الملكي V4
              </span>
            </div>

            <button
              onClick={handleLaunchApp}
              className="w-full bg-gradient-to-r from-[#208084] to-emerald-500 text-white font-extrabold py-3.5 rounded-2xl cursor-pointer hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#208084]/20"
            >
              <span>الدخول إلى لوحة التحكم واستوديو الشكور</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

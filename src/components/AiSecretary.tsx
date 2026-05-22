import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, Mic, Camera, Paperclip, Sparkles, Check, Play, UserPlus, Clipboard, Heart } from 'lucide-react';
import { chimeEngine } from './TactileSound';

interface AiSecretaryProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDraft: (draft: { cardName: string; templateType: 'Corporate' | 'Futuristic' | 'Golden Minimalist' | 'Oriental Craft' | 'Neon Pulse'; accentColor: string }) => void;
  onAddProject: (proj: { title: string; client: string; budget: string; category: string }) => void;
  onAddReferral: (ref: { refereeName: string; serviceName: string; pointsReward: number }) => void;
  triggerToast: (msg: string) => void;
  userName: string;
}

export const AiSecretary: React.FC<AiSecretaryProps> = ({
  isOpen,
  onClose,
  onAddDraft,
  onAddProject,
  onAddReferral,
  triggerToast,
  userName
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string; attachment?: { name: string; type: string; url?: string }; action?: { label: string; type: 'draft' | 'project' | 'referral'; payload: any } }>>([
    {
      sender: 'ai',
      text: `أهلاً بك يا معالي ${userName}. أنا سكرتيرك الشخصي ومستشارك الذكي Mshkur AI. عُدت لك بأحدث توصيات مجايلة 2026. كيف أخدم استوديو الكروت السيادي الخاص بك اليوم؟`,
      time: "18:22"
    }
  ]);
  const [inputText, setInputText] = useState('');
  
  // Interactive tools states (simulated)
  const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 24, 8, 30, 16, 22, 10, 28, 14, 20]);
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string } | null>(null);

  // Audio wave interval simulation
  useEffect(() => {
    let waveInterval: any;
    if (micActive) {
      waveInterval = setInterval(() => {
        setWaveHeights(Array.from({ length: 12 }, () => Math.floor(Math.random() * 32) + 6));
      }, 100);
    }
    return () => clearInterval(waveInterval);
  }, [micActive]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() && !attachedFile) return;

    const timeString = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // 1. User Message
    const userMsg: typeof messages[0] = {
      sender: 'user',
      text: textToSend || `أرسلتُ ملفاً: ${attachedFile?.name}`,
      time: timeString
    };

    if (attachedFile) {
      userMsg.attachment = {
        name: attachedFile.name,
        type: attachedFile.type
      };
    }

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachedFile(null);
    chimeEngine.playChime('select');

    // 2. Synthesize smart AI response
    setTimeout(() => {
      const lowerText = textToSend.toLowerCase();
      let responseText = "";
      let responseAction: typeof messages[0]['action'] = undefined;

      if (lowerText.includes("كرت") || lowerText.includes("بطاقة") || lowerText.includes("تسجيل كرت")) {
        responseText = `لقد قمت بصياغة مسودة كرت فاخرة تحت مسمى "صقر الاستثمار الرقمي" بتأثيرات النيون المتوهج لون (#208084). هل تود إرسالها وحفظها في drafts الخاصة بالاستوديو الآن؟`;
        responseAction = {
          label: "مزامنة كارت صقر الاستثمار 🎨",
          type: 'draft',
          payload: {
            cardName: "صقر الاستثمار الرقمي 🦅",
            templateType: 'Neon Pulse',
            accentColor: '#208084'
          }
        };
      } else if (lowerText.includes("مشروع") || lowerText.includes("عقد") || lowerText.includes("ميثاق")) {
        responseText = `أدركت رغبتكم يا فندم. قمت بهيكلة ميثاق مشروع تعاقدي سيادي جديد للجهة "الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)" بقيمة 150,000 ريال تحت منصة الذكاء الصوتي. هل ترغب بإدراجه مباشرة في قائمة مشاريعك؟`;
        responseAction = {
          label: "إدراج وتفعيل مشروع سدايا 📁",
          type: 'project',
          payload: {
            title: "بوابة سدايا للربط الصوتي السيادي",
            client: "الهيئة السعودية للبيانات والذكاء الاستراتيجي",
            budget: "١٥٠,٠٠٠ ريال",
            category: "الذكاء السيادي"
          }
        };
      } else if (lowerText.includes("إحالة") || lowerText.includes("شخص") || lowerText.includes("تسجيل شريك")) {
        responseText = `تم رصد الرغبة. صممت إحالة ريادية عاجلة لصالح "الأميرة نورة بنت عبد العزيز" للاستشارات الاستراتيجية في الكروت المعدنية، بمكافأة 4,000 نقطة. اضغط لتغذية Ledger الاستوديو بالصفقة:`;
        responseAction = {
          label: "تأكيد إحالة الأميرة نورة 👑",
          type: 'referral',
          payload: {
            refereeName: "سمو الأميرة نورة بنت عبد العزيز",
            serviceName: "تصميم بطاقة دائرية معدنية NFC",
            pointsReward: 4000
          }
        };
      } else if (attachedFile) {
        responseText = `استلمت مرفقك الذكي: (${attachedFile.name}). قمت بفحصه واستخلاص لوح الألوان البصرية منه، وجدولت نسخة منه كمسودة كرت جديد "بيانات العميل المرفقة" داخل الاستوديو.`;
        responseAction = {
          label: "حفظ الكرت المستخلص في الاستوديو 📸",
          type: 'draft',
          payload: {
            cardName: "كرت مظهر العميل المرفق",
            templateType: 'Corporate',
            accentColor: '#c5a059'
          }
        };
      } else {
        responseText = `أهلاً بك يا معالي المستشار. خوارزميات الشكور الذكية تحلل سياقك الرقمي حالياً. هل ترغب في (١) تخليق كرت للـ VIP بضغطات ذكية، (٢) مراجعة إحالات صندوق الاستثمارات، أو (٣) تسجيل ميثاق تعاقدي بنظام API السحابة؟`;
      }

      const aiMsg: typeof messages[0] = {
        sender: 'ai',
        text: responseText,
        time: timeString,
        action: responseAction
      };

      setMessages(prev => [...prev, aiMsg]);
      chimeEngine.playChime('success');
    }, 1100);
  };

  const handleExecuteAction = (type: 'draft' | 'project' | 'referral', payload: any) => {
    chimeEngine.playChime('gold');
    
    if (type === 'draft') {
      onAddDraft(payload);
      triggerToast(`تمت حياكة وحفظ مسودة الكارت "${payload.cardName}" في الاستوديو بنجاح!`);
    } else if (type === 'project') {
      onAddProject(payload);
      triggerToast(`تم إظهار وتفعيل عقد المشروع "${payload.title}" فورياً!`);
    } else if (type === 'referral') {
      onAddReferral(payload);
      triggerToast(`تم إتمام إحالة "${payload.refereeName}" وكسب النقاط الشرفية!`);
    }

    // Filter out the action button after clicking
    setMessages(prev => prev.map(m => m.action && m.action.payload === payload ? { ...m, action: undefined } : m));
  };

  const handleSimulateVoiceInput = () => {
    if (micActive) {
      // End recording, send simulated speech
      setMicActive(false);
      handleSendMessage("تسجيل كرت ذهبي فخم لسمو الوزير");
    } else {
      setMicActive(true);
      chimeEngine.playChime('select');
      triggerToast("بدء الاستماع الصوتي... تحدث الآن مع سكرتير الشكور.");
    }
  };

  const handleSimulateCameraBusinessCard = () => {
    setCameraActive(true);
    chimeEngine.playChime('select');
    triggerToast("تفعيل الكاميرا الذكية... جارٍ التقاط بطاقة الأعمال بصرياً.");
    
    setTimeout(() => {
      setCameraActive(false);
      chimeEngine.playChime('success');
      handleSendMessage("تسجيل إحالة من بطاقة الأعمال الملتقطة");
    }, 2200);
  };

  const handleSimulateAttachment = () => {
    const mockFiles = [
      { name: "شعار_مجلس_الوزراء.png2026", type: "image/png" },
      { name: "بروتوكول_الربط_السيادي.pdf", type: "application/pdf" },
      { name: "صوت_التقديم.mp3", type: "audio/mp3" }
    ];
    const chosen = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setAttachedFile(chosen);
    chimeEngine.playChime('select');
    triggerToast(`تم إقران ملفك بنجاح: ${chosen.name}. اضغط ارسال للمزامنة.`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-auto flex items-end sm:items-center justify-center p-0 sm:p-4">
          
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Majestic Secretary Dialogue card */}
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="w-full max-w-2xl h-[550px] rounded-t-[32px] sm:rounded-[32px] p-6 bg-neutral-900/90 backdrop-blur-3xl border-2 border-[#208084]/20 shadow-[0_20px_50px_rgba(32,128,132,0.3)] flex flex-col justify-between z-10 relative overflow-hidden"
            style={{ direction: 'rtl' }}
          >
            
            {/* Top decorative glassmorphic control row */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#208084]/20 flex items-center justify-center border border-[#208084]/45 animate-pulse relative">
                  <span className="absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-black text-white flex items-center gap-1">
                    سكرتير الشكور الذكي (Mshkur AI)
                  </span>
                  <span className="text-[9.5px] text-[#208084] font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> متصل ومزامَن بالكامل مع المودل 2026
                  </span>
                </div>
              </div>

              {/* Action wave elements close details */}
              <div className="flex items-center gap-3.5">
                {micActive && (
                  <div className="flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 font-bold animate-pulse">مستمع صوياً...</span>
                    <div className="flex items-center gap-0.5">
                      {waveHeights.slice(0, 5).map((h, i) => (
                        <span key={i} className="w-0.5 bg-emerald-400 rounded-full" style={{ height: `${h / 2}px` }} />
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={onClose}
                  className="p-1 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> إغلاق
                </button>
              </div>
            </div>

            {/* Simulated Live Camera view overlay */}
            {cameraActive && (
              <div className="absolute inset-x-0 top-16 bottom-[80px] bg-black/95 z-20 flex flex-col items-center justify-center p-6 text-center gap-4">
                <div className="w-48 h-32 rounded-xl border-2 border-dashed border-[#208084] flex items-center justify-center relative animate-pulse">
                  <Camera className="w-12 h-12 text-[#208084]" />
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#208084]" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#208084]" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#208084]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#208084]" />
                </div>
                <h4 className="text-sm font-bold text-white text-right">جلاء المسح البصري للبطاقة...</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">التقاط مصفوفة النحاس واستخراج معلومات العقد آلياً لتنقية المدخلات.</p>
              </div>
            )}

            {/* Messages Chat Window */}
            <div className="flex-1 overflow-y-auto my-4 p-4 bg-black/45 rounded-2xl border border-white/5 flex flex-col gap-4 scroll-smooth">
              {messages.map((log, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[85%] ${log.sender === 'user' ? 'mr-auto items-start text-left' : 'ml-auto items-end text-right'}`}
                >
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${log.sender === 'user' ? 'bg-slate-800 text-white rounded-bl-none' : 'bg-[#208084]/20 text-emerald-100 rounded-br-none border border-[#208084]/30'}`}>
                    {log.text}

                    {/* Attachment preview if exists */}
                    {log.attachment && (
                      <div className="mt-3.5 p-2 bg-black/40 rounded-xl border border-white/5 flex items-center gap-2.5">
                        <Paperclip className="w-4 h-4 text-[#208084]" />
                        <span className="text-[10px] text-slate-300 font-bold font-mono">{log.attachment.name}</span>
                        <span className="text-[8px] bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded-full">{log.attachment.type}</span>
                      </div>
                    )}
                  </div>

                  {/* Immediate automatic creation trigger inside messenger */}
                  {log.action && (
                    <button
                      onClick={() => handleExecuteAction(log.action!.type, log.action!.payload)}
                      className="mt-2.5 w-full bg-[#208084] text-white font-black text-xs px-4 py-2.5 rounded-xl hover:bg-[#1b6b6e] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#208084]/15 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
                      <span>{log.action.label}</span>
                    </button>
                  )}

                  <span className="text-[8px] opacity-35 mt-1 font-mono">{log.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Suggestions panel */}
            <div className="flex gap-2 mb-3.5 overflow-x-auto pb-1.5 scroll-smooth pr-1">
              {[
                { label: "حياكة كرت الـ VIP 🎨", prompt: "تسجيل كرت ذهبي فخم لسمو الأمير" },
                { label: "هيكلة مشروع تعاقدي 📁", prompt: "تفعيل مشروع نظام API سدايا" },
                { label: "تسجيل إحالة سريعة 💼", prompt: "تسجيل إحالة لشريك من كبار الشخصيات" }
              ].map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug.prompt)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10.5px] font-bold text-slate-200 shrink-0 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#208084]" />
                  <span>{sug.label}</span>
                </button>
              ))}
            </div>

            {/* Equipment and Text Entry Control row */}
            <div className="flex gap-2 border-t border-white/10 pt-3.5">
              
              {/* Media equipment toggles (Camera, Mic, Attachment) */}
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={handleSimulateCameraBusinessCard}
                  className="p-3 rounded-xl bg-white/5 border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                  title="مسح وتصوير بطاقات نون بصرياً"
                >
                  <Camera className="w-4 h-4 text-[#208084]" />
                </button>
                
                <button
                  type="button"
                  onClick={handleSimulateAttachment}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${attachedFile ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/15 text-slate-300 hover:text-white hover:bg-white/10'}`}
                  title="إقران ملف سحابي"
                >
                  <Paperclip className="w-4 h-4 text-[#208084]" />
                </button>

                <button
                  type="button"
                  onClick={handleSimulateVoiceInput}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${micActive ? 'bg-red-500/20 border-red-500/45 text-red-400 animate-pulse' : 'bg-white/5 border-white/15 text-slate-300 hover:text-white hover:bg-white/10'}`}
                  title="ميكروفون الاستماع الصوتي السيادي"
                >
                  <Mic className="w-4 h-4 text-emerald-400" />
                </button>
              </div>

              {/* Text Form entry */}
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={attachedFile ? `مقرن بملف: ${attachedFile.name}... اضغط إرسال` : "وجه سطر الأوامر أو سؤالك لنظام الشكور..."}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none flex-1 focus:border-[#208084]/50"
                />
                <button
                  type="submit"
                  className="bg-[#208084] hover:bg-[#1b6b6e] px-5 rounded-xl flex items-center justify-center text-white text-xs font-black transition-all cursor-pointer shadow-lg shadow-[#208084]/20"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

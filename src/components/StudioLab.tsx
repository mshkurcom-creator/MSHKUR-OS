import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Mic, Paperclip, FileText, Plus, Check, Trash, Sparkles, AlertCircle, RefreshCw, Video } from 'lucide-react';
import { StudioDraft } from '../types';
import { chimeEngine } from './TactileSound';

interface StudioLabProps {
  drafts: StudioDraft[];
  onAddDraft: (draft: { cardName: string; templateType: 'Corporate' | 'Futuristic' | 'Golden Minimalist' | 'Oriental Craft' | 'Neon Pulse'; accentColor: string }) => void;
  onDeleteDraft: (id: string) => void;
  onPublishDraft: (id: string) => void;
  currentTheme: string;
  triggerToast: (msg: string) => void;
}

export const StudioLab: React.FC<StudioLabProps> = ({
  drafts,
  onAddDraft,
  onDeleteDraft,
  onPublishDraft,
  currentTheme,
  triggerToast
}) => {
  const [activeTool, setActiveTool] = useState<'none' | 'camera' | 'audio' | 'upload' | 'builder' | 'video'>('none');
  
  // Custom Card customizer form
  const [cardName, setCardName] = useState('شعار الذهب السيادي');
  const [cardStyle, setCardStyle] = useState<'Corporate' | 'Futuristic' | 'Golden Minimalist' | 'Oriental Craft' | 'Neon Pulse'>('Golden Minimalist');
  const [cardColor, setCardColor] = useState('#c5a059');

  // Simulated state for camera OCR snap
  const [scannerStep, setScannerStep] = useState<'snap' | 'processing' | 'ocr_success'>('snap');
  const [ocrResult, setOcrResult] = useState({ name: '', title: '', email: '' });

  // Simulated state for audio note note-taking
  const [recording, setRecording] = useState(false);
  const [audioTranscription, setAudioTranscription] = useState('');

  // Video recording simulation state
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [videoTimer, setVideoTimer] = useState(4);
  const [videoSuccess, setVideoSuccess] = useState(false);

  // Attachments drag-drop
  const [dragging, setDragging] = useState(false);

  const handleSimulateAttachmentLocal = () => {
    chimeEngine.playChime('success');
    onAddDraft({
      cardName: "مستند يدوي مرفق: شعار_الهوية_2026.png",
      templateType: 'Golden Minimalist',
      accentColor: '#208084'
    });
    triggerToast("تم استلام المستند يدوياً وحفظ التقارير.");
    setActiveTool('none');
  };

  const handleCreateCardBuilder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName.trim()) return;

    onAddDraft({
      cardName,
      templateType: cardStyle,
      accentColor: cardColor
    });
    
    chimeEngine.playChime('success');
    triggerToast(`تم ترسيخ الكرت الفاخر (${cardName}) في مسودات الاستوديو بنجاح!`);
    setActiveTool('none');
  };

  const startOcrScan = () => {
    setScannerStep('processing');
    chimeEngine.playChime('select');
    
    setTimeout(() => {
      setOcrResult({
        name: "سمو الشيخ تركي آل معمر",
        title: "رئيس الوفود التجارية والاستراتيجية",
        email: "turki.m@vip.gov.sa"
      });
      setScannerStep('ocr_success');
      chimeEngine.playChime('success');
      triggerToast("نجحت الخوارزمية في استخراج مصفوفة الاتصال!");
    }, 1500);
  };

  const handleApplyOcrAsCard = () => {
    onAddDraft({
      cardName: `كرت أعمال: الشيخ تركي آل معمر`,
      templateType: 'Corporate',
      accentColor: '#c5a059'
    });
    chimeEngine.playChime('gold');
    triggerToast("تم تجميع وتحويل معلومات البطاقة وبثها كمسودة كرت.");
    setActiveTool('none');
    setScannerStep('snap');
  };

  const startAudioRecording = () => {
    setRecording(true);
    chimeEngine.playChime('select');
    triggerToast("ميكروفون الاستوديو نشط... تحدث الآن لتلخيص العقد.");
    
    setTimeout(() => {
      setRecording(false);
      setAudioTranscription("ملخص صوتي: الاتفاق المتبادل مع وفد الاستثمارات لتقديم ٢,٠٠٠ لوحة NFC لربط الكروت السكنية.");
      chimeEngine.playChime('success');
    }, 3500);
  };

  const handleApplyVoiceNote = () => {
    onAddDraft({
      cardName: "مذكرة تفويض: وفد الاستشارات 🗣️",
      templateType: 'Futuristic',
      accentColor: '#208084'
    });
    chimeEngine.playChime('gold');
    setActiveTool('none');
    setAudioTranscription('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    chimeEngine.playChime('success');
    onAddDraft({
      cardName: "مستند سحابي مرفق: العقد_الفاخر.pdf",
      templateType: 'Golden Minimalist',
      accentColor: '#208084'
    });
    triggerToast("تم استلام المستند وحفظه تلقائياً في Drafts السحابية.");
    setActiveTool('none');
  };

  return (
    <div className="flex flex-col gap-6 text-right">
      
      {/* STUDIO EQUIPMENT TILES (📸 🎤 📎 ✍️ 🎥) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { id: 'camera', label: '📸 كاميرا الاستوديو', desc: 'مسح البطاقات وتقنية التعرف البصري OCR', icon: <Camera className="w-6 h-6 text-[#208084] group-hover:scale-110 transition-transform" />, color: 'shadow-[0_0_15px_rgba(32,128,132,0.15)] hover:border-[#208084]/45' },
          { id: 'audio', label: '🎤 تلخيص صوتي', desc: 'استماع للتعليمات وتوليد مسودة كارت بالذكاء', icon: <Mic className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />, color: 'shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:border-amber-500/40' },
          { id: 'upload', label: '📎 إرفاق ملفات', desc: 'تحميل الشعارات والمستندات السحابية', icon: <Paperclip className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" />, color: 'shadow-[0_0_15px_rgba(56,189,248,0.1)] hover:border-sky-500/40' },
          { id: 'builder', label: '✍️ منشئ الكروت', desc: 'صياغة يدوية دقيقة للمصفوفة والعلامات', icon: <FileText className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />, color: 'shadow-[0_0_15px_rgba(52,211,153,0.1)] hover:border-emerald-500/40' },
          { id: 'video', label: '🎥 تصوير فيديو', desc: 'عرض تقديمي مصور للهوية بوهج ليزري', icon: <Video className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />, color: 'shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-red-500/40' }
        ].map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(activeTool === tool.id ? 'none' : (tool.id as any));
              chimeEngine.playChime('select');
            }}
            className={`p-5 rounded-2xl border text-right transition-all duration-300 cursor-pointer flex flex-col justify-between h-[135px] overflow-hidden relative group bg-gradient-to-b from-neutral-900/60 to-black/75 backdrop-blur-md ${tool.color} ${activeTool === tool.id ? 'border-[#208084] bg-[#208084]/10 ring-1 ring-[#208084]/30' : 'border-white/5 hover:border-white/20'}`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between w-full">
              <div className={`p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all ${activeTool === tool.id ? 'bg-[#208084]/20 border-[#208084]/40' : ''}`}>
                {tool.icon}
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${activeTool === tool.id ? 'bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20' : 'bg-slate-700'}`} />
            </div>

            {/* Bottom details */}
            <div className="flex flex-col gap-1 mt-3">
              <span className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors leading-tight">{tool.label}</span>
              <span className="text-[10px] text-slate-400 leading-normal line-clamp-1">{tool.desc}</span>
            </div>
            
            {/* Subtle glow effect inside the card */}
            <span className="absolute bottom-[-15%] right-[-10%] w-20 h-20 bg-[#208084]/5 rounded-full blur-xl group-hover:bg-[#208084]/15 transition-all" />
          </button>
        ))}
      </div>

      {/* DYNAMIC EQUIPMENT LABS DRAWER */}
      <AnimatePresence mode="wait">
        {activeTool !== 'none' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-5 rounded-2xl bg-black/35 backdrop-blur-xl border border-white/10 overflow-hidden relative"
          >
            {/* Camera Business card scanner */}
            {activeTool === 'camera' && (
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-[180px] h-[120px] rounded-xl border-2 border-[#208084]/50 border-dashed flex flex-col items-center justify-center p-4 bg-slate-900/50 relative overflow-hidden shrink-0">
                  <Camera className="w-8 h-8 text-[#208084] animate-pulse" />
                  <span className="text-[9px] opacity-40 mt-1.5 leading-none">محيط المسح الباطني</span>
                  {scannerStep === 'processing' && (
                    <div className="absolute inset-0 bg-black/85 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-t-[#208084] rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-right flex flex-col justify-center">
                  {scannerStep === 'snap' && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-bold text-white">الكاميرا البصرية بالاستوديو</h4>
                      <p className="text-xs text-slate-400">التقط صورة لكرت أعمالك الفعلي، لتقوم التقاطة الذكاء بقراءة التفاصيل ومطابقتها وحفظها كمسودة فورية.</p>
                      <button
                        onClick={startOcrScan}
                        className="bg-[#208084] text-white px-4 py-2 rounded-xl text-xs font-bold w-max mt-2 cursor-pointer"
                      >
                        قراءة ومسح البطاقة بالذكاء 📸
                      </button>
                    </div>
                  )}

                  {scannerStep === 'processing' && (
                    <span className="text-xs text-slate-400 animate-pulse">الخوارزمية الآن تحلل النحاس الصقيل وتستخلص مصفوفة كبار الشخصيات...</span>
                  )}

                  {scannerStep === 'ocr_success' && (
                    <div className="flex flex-col gap-2.5">
                      <h4 className="text-sm font-bold text-emerald-400">تم فك تشفير البطاقة بنجاح!</h4>
                      <div className="bg-black/45 p-3 rounded-xl border border-white/5 font-mono text-xs flex flex-col gap-1.5 text-slate-300">
                        <span>👤 الاسم: {ocrResult.name}</span>
                        <span>💼 المنصب: {ocrResult.title}</span>
                        <span>✉️ البريد: {ocrResult.email}</span>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={handleApplyOcrAsCard}
                          className="bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          تحويل وتجميع كمسودة كارت في الاستوديو 🎨
                        </button>
                        <button
                          onClick={() => setScannerStep('snap')}
                          className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-xl text-xs"
                        >
                          إعادة
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Audio note taking module */}
            {activeTool === 'audio' && (
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <button
                  type="button"
                  onClick={startAudioRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-4 cursor-pointer transition-all ${recording ? 'bg-red-500/10 border-red-500 blink-pulse' : 'bg-amber-500 text-black border-amber-600'}`}
                >
                  <Mic className="w-6 h-6" />
                </button>

                <div className="flex-1 text-right">
                  {!audioTranscription && !recording && (
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-sm font-bold text-white">الاستماع العاصف وإبرام العقود بالصوت</h4>
                      <p className="text-xs text-slate-400">اضغط الزر وسجل ملخص اتفاقك لتتم حياكة مسودة الكارت والعقد بالاستوديو تلقائياً وبنسخ شرفي.</p>
                    </div>
                  )}

                  {recording && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-slate-100 font-bold animate-pulse">استماع نشط لمطالبك... تحدث الآن</span>
                      <div className="flex gap-0.5 items-end h-8">
                        {Array.from({ length: 15 }).map((_, idx) => (
                          <span key={idx} className="w-1 bg-red-400 rounded-full animate-pulse" style={{ height: `${Math.random() * 26 + 4}px` }} />
                        ))}
                      </div>
                    </div>
                  )}

                  {audioTranscription && (
                    <div className="flex flex-col gap-2.5">
                      <h4 className="text-xs text-amber-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> تفريغ الذكاء الاصطناعي للملف:
                      </h4>
                      <p className="text-xs text-slate-300 italic bg-black/45 p-3 rounded-xl leading-relaxed">"{audioTranscription}"</p>
                      
                      <button
                        onClick={handleApplyVoiceNote}
                        className="bg-amber-500 text-black px-4 py-2 rounded-xl text-xs font-bold w-max cursor-pointer"
                      >
                        مزامنة المسودة الصياغية بالاستوديو 📁
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upload drag drop panel */}
            {activeTool === 'upload' && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropFile}
                onClick={handleSimulateAttachmentLocal}
                className={`w-full border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${dragging ? 'bg-[#208084]/10 border-[#208084]' : 'bg-black/10 border-white/10 hover:border-white/20'}`}
              >
                <Paperclip className="w-10 h-10 text-[#208084]/80 animate-bounce" />
                <h4 className="text-sm font-bold text-white">اسحب وألقِ مستندات العقد أو الشعارات هنا</h4>
                <p className="text-xs text-slate-500">ادفع الملفات اللوجستية (PDF, PNG, JPEG) أو اضغط هنا لمحاكاة الرفع المباشر.</p>
              </div>
            )}

            {/* Live Video recording module */}
            {activeTool === 'video' && (
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-[180px] h-[120px] rounded-xl border border-red-500/30 flex flex-col items-center justify-center bg-black/90 relative overflow-hidden shrink-0">
                  {recordingVideo ? (
                    <>
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10 bg-black/80 px-1.5 py-0.5 rounded-md border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        <span className="text-[9px] font-mono text-white">REC {videoTimer}s</span>
                      </div>
                      <Video className="w-8 h-8 text-red-500 animate-pulse" />
                      <span className="text-[8px] text-zinc-400 mt-2 z-10">بث حي ليزري</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-8 h-8 text-zinc-500" />
                      <span className="text-[8px] text-zinc-500 mt-1.5 leading-none">عدسة الكاميرا جاهزة</span>
                    </>
                  )}
                  {videoSuccess && (
                    <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20">
                      <Check className="w-6 h-6 text-emerald-400 animate-bounce" />
                      <span className="text-[9px] text-emerald-300 font-bold mt-1">اكتمل المونتاج</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-right">
                  {!recordingVideo && !videoSuccess && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-black text-white">التصوير التقديمي للهوية الشخصية 🎥</h4>
                      <p className="text-xs text-slate-400">سجل فيديو بروتوكول مدته 4 ثوانٍ لتقديمه للشركاء وعرض الألياف النحاسية المذهبة بالليزر.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setRecordingVideo(true);
                          setVideoTimer(4);
                          setVideoSuccess(false);
                          chimeEngine.playChime('select');
                          triggerToast("بدء تسجيل الفيديو التقديمي السيادي...");
                          
                          const interval = setInterval(() => {
                            setVideoTimer((prev) => {
                              if (prev <= 1) {
                                clearInterval(interval);
                                setRecordingVideo(false);
                                setVideoSuccess(true);
                                chimeEngine.playChime('gold');
                                onAddDraft({
                                  cardName: "بروتوكول تقديمي مصور: الهوية الشخصية 🎥",
                                  templateType: 'Futuristic',
                                  accentColor: '#ef4444'
                                });
                                triggerToast("تم ترميز وحفظ فيديو الهوية السيادية في المسودات!");
                                return 0;
                              }
                              return prev - 1;
                            });
                          }, 1000);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold w-max mt-1.5 flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-500/10"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>بدء بث وتصوير الفيديو</span>
                      </button>
                    </div>
                  )}

                  {recordingVideo && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-red-400 font-black animate-pulse flex items-center gap-1.5 justify-end">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> جارٍ التصوير الترويجي بدقة Ultra-HD...
                      </span>
                      <p className="text-xs text-slate-400 leading-normal">تحدث أو اعرض بطاقتك الدائرية الفاخرة أمام العدسة لبث ومزامنة الهياكل اللامعة.</p>
                    </div>
                  )}

                  {videoSuccess && (
                    <div className="flex flex-col gap-2">
                       <h4 className="text-sm font-bold text-emerald-400">تم دمج وترقية فيديو العرض!</h4>
                      <p className="text-xs text-slate-300">تمت معالجة الإطارات، دمج ليزر الوهج الأخضر بحياكة ذكية وحفظ الفيديو في مسودات الاستوديو (Drafts).</p>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoSuccess(false);
                        }}
                        className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-3.5 py-1.5 rounded-xl text-xs font-bold w-max"
                      >
                        إعادة تصوير جديد 🎥
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Custom card builder forms */}
            {activeTool === 'builder' && (
              <form onSubmit={handleCreateCardBuilder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4 text-right">
                  <div>
                    <h4 className="text-sm font-black text-white">صياغة هويتة بصمات الكارت اللحظي</h4>
                    <p className="text-[11px] opacity-60">تعديل التخطيط الهيكلي والخصائص السحابية بنقرات قليلة.</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-slate-300">اسم الكرت المقترح</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-300">التخطيط المفترض</label>
                      <select
                        value={cardStyle}
                        onChange={(e: any) => setCardStyle(e.target.value)}
                        className="bg-black/45 border border-white/10 text-white rounded-xl px-3 py-2 text-xs outline-none"
                      >
                        <option value="Corporate">الريادي الفخم</option>
                        <option value="Futuristic">تخطيط المجرة والمستقبل</option>
                        <option value="Golden Minimalist">الحد الأدنى اللامع</option>
                        <option value="Oriental Craft">التطريز المشرقي التراثي</option>
                        <option value="Neon Pulse">نبض النيون المتوهج</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-300">انتقاء الوهج بالكرت</label>
                      <div className="flex gap-1.5 mt-1 items-center justify-center">
                        {['#c5a059', '#208084', '#e63946', '#38bdf8', '#10b981'].map((co) => (
                          <button
                            key={co}
                            type="button"
                            onClick={() => setCardColor(co)}
                            className="w-5.5 h-5.5 rounded-full border border-white/10 transition-transform hover:scale-110 cursor-pointer"
                            style={{ backgroundColor: co, boxShadow: cardColor === co ? `0 0 8px ${co}` : 'none' }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#208084] text-white font-black py-2.5 rounded-xl text-xs hover:bg-[#1b6b6e] mt-1.5"
                  >
                    مزامنة وحفظ المسودة بالاستوديو +
                  </button>
                </div>

                {/* Direct Visual mock of laser layout card */}
                <div className="flex flex-col items-center justify-center p-4 bg-black/45 rounded-xl border border-white/5 relative overflow-hidden">
                  <div className="w-full h-32 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden text-right shadow-xl"
                       style={{
                         background: 'rgba(15,15,15,0.95)',
                         border: `1.5px solid ${cardColor}`,
                         boxShadow: `0 8px 24px 0 ${cardColor}25`
                       }}>
                    <div className="flex justify-between items-start">
                      <div className="w-5.5 h-5.5 rounded bg-white/5 flex items-center justify-center text-[9px] text-white">M</div>
                      <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest">{cardStyle} Active</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white truncate leading-none">{cardName}</span>
                      <span className="text-[9px] opacity-65 truncate mt-1">السيادي م. عبد الرحمن الشكور</span>
                    </div>
                  </div>
                  <span className="text-[9px] opacity-40 mt-2 font-mono">Laser Laser Copper Customizer Preview</span>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DRAFTS LEDGER LIST */}
      <div className="p-5 rounded-2xl bg-black/35 backdrop-blur-xl border border-white/5 flex flex-col gap-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <span className="text-sm font-black text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> أرشيف المسودات وعناصر الاستوديو (Studio Drafts)
          </span>
          <span className="text-[10px] font-mono opacity-55 bg-[#208084]/10 text-[#208084] px-2.5 py-0.5 rounded-full border border-[#208084]/25">
            {drafts.length} عناصر مسودة
          </span>
        </div>

        {drafts.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 opacity-40 text-slate-400" />
            <span>لا يوجد مسودات متاحة في أرشيف الاستوديو حالياً. قم بإنتاجها من الاختصارات أعلاه أو مع سكرتيرك.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="p-4 rounded-xl bg-black/20 hover:bg-black/30 border border-white/5 transition-all flex flex-col justify-between h-[120px] relative overflow-hidden group hover:border-[#208084]/30"
              >
                <div className="flex flex-col items-start gap-1 justify-between w-full">
                  <span
                    className="w-1.5 h-10 rounded-full absolute left-0 top-3.5"
                    style={{ backgroundColor: draft.accentColor }}
                  />
                  <div className="flex flex-col text-right pr-1.5">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors leading-relaxed truncate max-w-[150px]">{draft.cardName}</span>
                    <span className="text-[9.5px] opacity-50 mt-1 max-w-[140px] truncate">{draft.templateType} Layout</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onPublishDraft(draft.id)}
                      className={`text-[9px] font-bold px-2 py-1 rounded-lg outline-none ${draft.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700/40 text-slate-400 hover:text-white'}`}
                    >
                      {draft.status === 'Published' ? 'تم الإشهار' : 'إشهار'}
                    </button>
                    
                    <button
                      onClick={() => onDeleteDraft(draft.id)}
                      className="p-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      title="حذف المسودة"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <span className="text-[9px] font-mono opacity-30 mt-1">تعديل: {draft.lastModified}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

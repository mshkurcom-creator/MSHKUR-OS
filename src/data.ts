/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, ReferralRecord, ProjectRecord, StudioDraft, RewardItem } from './types';

export const INITIAL_USER: UserProfile = {
  name: "الريادي م. عبد الرحمن الشكور",
  title: "الرئيس التنفيذي والشريك المؤسس لـ Mshkur-OS",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
  rankName: "الياقوت الملكي",
  rankTier: "ruby",
  points: 14250,
  qrValue: "https://mshkur.com/os/card/abdulrahman-ce",
  nfcActive: true
};

export const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: "ref-1",
    refereeName: "سمو الأمير فيصل بن المطيري",
    serviceName: "رخصة ربط API الكروت السيادية",
    pointsReward: 1500,
    date: "2026-05-20",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop"
  },
  {
    id: "ref-2",
    refereeName: "الدكتورة سارة الهاشمي",
    serviceName: "تصميم بطاقة النخبة المضيئة NFC",
    pointsReward: 3000,
    date: "2026-05-18",
    status: "completed",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop"
  },
  {
    id: "ref-3",
    refereeName: "المهندس رامي عبد الله العتيبي",
    serviceName: "الخادم السحابي السيادي للنظام",
    pointsReward: 1200,
    date: "2026-05-22",
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128&auto=format&fit=crop"
  },
  {
    id: "ref-4",
    refereeName: "الأستاذة عهد أحمد القحطاني",
    serviceName: "بروتوكول البصمة الرقمية الفاخرة",
    pointsReward: 800,
    date: "2026-05-15",
    status: "rejected",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128&auto=format&fit=crop"
  }
];

export const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: "proj-1",
    title: "بوابة الربط السيادي لـ Mshkur-OS",
    client: "الجهة السيادية للتقنية المصرفية",
    progress: 78,
    budget: "١٢٠,٠٠٠ ريال",
    category: "نظم السيادة الرقمية",
    status: "active",
    tags: ["VIP-Integration", "Secured API"]
  },
  {
    id: "proj-2",
    title: "شاشات التحكم التفاعلي لمصانع M-Card",
    client: "الشركة الفاخرة لصناعة المعادن الفخمة",
    progress: 94,
    budget: "٤٥,٠٠٠ ريال",
    category: "تصاميم مادية",
    status: "review",
    tags: ["Custom Hardware", "NFC Laser"]
  },
  {
    id: "proj-3",
    title: "مساعد الذكاء الاصطناعي الصوتي MshkurAI",
    client: "مشاريع التطوير السريّة لشركة الشكور Core",
    progress: 35,
    budget: "٨٥,٠٠٠ ريال",
    category: "الذكاء السيادي",
    status: "active",
    tags: ["Gemini-3.5", "Voice Synth"]
  },
  {
    id: "proj-4",
    title: "تطوير الدروع التذكارية لـ VIP Club",
    client: "نادي الياقوت والزمرد الفخم",
    progress: 100,
    budget: "٢٠٠,٠٠٠ ريال",
    category: "جوائز حصرية",
    status: "completed",
    tags: ["Pure Gold 24k", "RTL NFC"]
  }
];

export const INITIAL_DRAFTS: StudioDraft[] = [
  {
    id: "draft-1",
    cardName: "بطاقة الياقوت الرقمية للنخبة",
    templateType: "Golden Minimalist",
    accentColor: "#c5a059",
    status: "Published",
    lastModified: "2026-05-21"
  },
  {
    id: "draft-2",
    cardName: "كرت العضوية الشرقية للتراث الثقافي",
    templateType: "Oriental Craft",
    accentColor: "#9e2a2b",
    status: "Draft",
    lastModified: "2026-05-19"
  },
  {
    id: "draft-3",
    cardName: "درع المظهر الرقمي المتوهج نيون",
    templateType: "Neon Pulse",
    accentColor: "#208084",
    status: "Draft",
    lastModified: "2026-05-22"
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: "rew-1",
    title: "بطاقة معدنية مطعمة بذهب عيار ٢٤ مخصصة ومحفورة بالليزر",
    pointsCost: 10000,
    category: "الأصول الفاخرة",
    claimedTimes: 2,
    icon: "Award"
  },
  {
    id: "rew-2",
    title: "جلسة تخطيط استراتيجي لتطوير محفظة الإحالات مع فريق القادة",
    pointsCost: 5000,
    category: "الاستشارات الفاخرة",
    claimedTimes: 1,
    icon: "Cpu"
  },
  {
    id: "rew-3",
    title: "دومين سياسي دائم mcard.me/yourname مجاناً مدى الحياة",
    pointsCost: 8000,
    category: "الويب السيادي",
    claimedTimes: 4,
    icon: "Globe"
  }
];

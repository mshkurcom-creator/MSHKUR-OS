/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeType = 'luxury' | 'minimal' | 'chinese' | 'cosmos' | 'grok';

export type ViewMode = 'card' | 'list' | 'kanban';

export interface UserProfile {
  name: string;
  title: string;
  avatar: string;
  rankName: string;
  rankTier: 'bronze' | 'silver' | 'gold' | 'ruby' | 'emperor';
  points: number;
  qrValue: string;
  nfcActive: boolean;
}

export interface ReferralRecord {
  id: string;
  refereeName: string;
  serviceName: string;
  pointsReward: number;
  date: string;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  avatar?: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  client: string;
  progress: number; // 0 to 100
  budget: string;
  category: string;
  status: 'planning' | 'active' | 'review' | 'completed';
  tags: string[];
}

export interface StudioDraft {
  id: string;
  cardName: string;
  templateType: 'Corporate' | 'Futuristic' | 'Golden Minimalist' | 'Oriental Craft' | 'Neon Pulse';
  accentColor: string;
  status: 'Draft' | 'Published';
  lastModified: string;
}

export interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  category: string;
  claimedTimes: number;
  icon: string;
}

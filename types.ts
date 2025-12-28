export interface UserProfile {
  name: string;
  northStar: string;
  lifeBackground?: string;
  persona: 'nurturer' | 'stoic' | 'dreamer' | 'sage' | 'inquirer' | 'individualist' | 'alchemist' | 'minimalist' | 'empathetic' | 'poetic'; // Keeping old ones for compatibility
  initialGreeting?: string;
  archivistName?: string;
  aura?: 'stone' | 'midnight' | 'rose' | 'forest';
  resonanceFilter?: 'pattern-matching' | 'silver-linings' | 'critical-growth' | 'validation';
}

export interface CapsuleEntry {
  id: string;
  timestamp: number;
  transcript: string;
  summary: string;
  mood: string;
  tags: string[];
  response: string;
  imageUrl?: string;
  userImageUrl?: string;
  imagePrompt?: string;
  isBotResponse?: boolean; // New: to distinguish chat bubbles
  type?: 'voice' | 'text';
}

export interface CapsuleAnalysis {
  mood: string;
  summary: string;
  tags: string[];
  transcript: string;
  response: string;
  imagePrompt: string;
}

export interface WeeklyLetter {
  id: string;
  timestamp: number;
  weekLabel: string;
  content: string;
  themes: string[];
}
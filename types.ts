export interface UserProfile {
  name: string;
  northStar: string;
  persona: 'empathetic' | 'stoic' | 'poetic';
  initialGreeting: string;
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
  imagePrompt?: string;
  isBotResponse?: boolean; // New: to distinguish chat bubbles
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
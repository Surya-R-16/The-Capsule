
import React, { useState, useEffect, useCallback } from 'react';
import { CapsuleEntry, WeeklyLetter, UserProfile } from './types';
import ArchiveTimeline from './components/ArchiveTimeline';
import ArchiveSearch from './components/ArchiveSearch';
import ProfileSettings from './components/ProfileSettings';
import ChatInterface from './components/ChatInterface';
import InsightsDashboard from '@/components/InsightsDashboard';
import { analyzeVoiceNote, generateWeeklyLetter, generateSoulCard } from './services/geminiService';

const App: React.FC = () => {
  const [entries, setEntries] = useState<CapsuleEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<CapsuleEntry[] | null>(null);
  const [weeklyLetters, setWeeklyLetters] = useState<WeeklyLetter[]>([]);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('capsule_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.archivistName) parsed.archivistName = 'The Archivist';
        if (!parsed.aura) parsed.aura = 'stone';
        const validPersonas = ['nurturer', 'stoic', 'dreamer', 'sage', 'inquirer', 'individualist', 'alchemist', 'minimalist'];
        if (!validPersonas.includes(parsed.persona)) parsed.persona = 'nurturer';
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved profile', e);
        // Fallthrough to default
      }
    }
    return {
      name: 'Seeker',
      archivistName: 'The Archivist',
      northStar: 'Capturing the small beauties of everyday life.',
      lifeBackground: 'I am a seeker navigating the complexity of modern life.',
      persona: 'nurturer',
      resonanceFilter: 'validation',
      aura: 'stone'
    };
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'archive' | 'insights' | 'profile'>('chat');

  useEffect(() => {
    document.body.className = `aura-${profile.aura}`;
  }, [profile.aura]);

  useEffect(() => {
    const savedEntries = localStorage.getItem('capsule_entries');
    if (savedEntries) try { setEntries(JSON.parse(savedEntries)); } catch (e) { }
    const savedLetters = localStorage.getItem('capsule_letters');
    if (savedLetters) try { setWeeklyLetters(JSON.parse(savedLetters)); } catch (e) { }
  }, []);

  useEffect(() => { localStorage.setItem('capsule_entries', JSON.stringify(entries)); }, [entries]);
  useEffect(() => { localStorage.setItem('capsule_letters', JSON.stringify(weeklyLetters)); }, [weeklyLetters]);
  useEffect(() => { localStorage.setItem('capsule_profile', JSON.stringify(profile)); }, [profile]);

  const handleRecordingComplete = useCallback(async (blob: Blob, base64: string, imageBase64?: string) => {
    setIsProcessing(true);
    try {
      const analysis = await analyzeVoiceNote(base64, blob.type, profile, imageBase64);
      const soulCardUrl = await generateSoulCard(analysis.imagePrompt);

      const newEntry: CapsuleEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        ...analysis,
        imageUrl: soulCardUrl,
        userImageUrl: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : undefined,
        type: 'voice'
      };
      setEntries(prev => [newEntry, ...prev]);
    } catch (err) {
      alert("The archive encountered an error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [profile]);

  const handleTextEntryComplete = useCallback((entry: CapsuleEntry) => {
    setEntries(prev => [entry, ...prev]);
  }, []);

  // When changing tabs, clear any active filters
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setFilteredEntries(null);
  };

  return (
    <div className={`min-h-screen pb-32 pt-8 max-w-4xl mx-auto px-4 sm:px-6 transition-colors duration-1000 overflow-x-hidden`}>
      <header className="mb-10 flex flex-col items-center text-center relative px-2">
        <button
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
          className={`absolute top-0 right-0 p-3 rounded-full transition-all ${isPrivacyMode ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-800'}`}
          title="Toggle Privacy Shield"
        >
          <i className={`fas ${isPrivacyMode ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
        <div className={`w-14 h-14 aura-bg-accent rounded-2xl flex items-center justify-center mb-4 shadow-lg rotate-3 hover:rotate-0 transition-all cursor-pointer`}>
          <i className="fas fa-leaf text-white text-2xl"></i>
        </div>
        <h1 className="serif text-3xl sm:text-5xl font-bold aura-text-accent tracking-tight mb-2 leading-tight">Hello, {profile.name}</h1>
        <p className="text-stone-500 font-medium tracking-wide italic max-w-[280px] sm:max-w-sm opacity-70 text-sm">"{profile.northStar}"</p>
      </header>

      <main className="pb-10">
        {activeTab === 'chat' && <ChatInterface entries={entries} profile={profile} onRecordingComplete={handleRecordingComplete} onTextEntryComplete={handleTextEntryComplete} isProcessing={isProcessing} isPrivacyMode={isPrivacyMode} />}

        {activeTab === 'archive' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ArchiveSearch
              entries={entries}
              profile={profile}
              onFilterChange={(filtered) => setFilteredEntries(filtered)}
            />
            <ArchiveTimeline
              entries={filteredEntries !== null ? filteredEntries : entries}
            />
          </div>
        )}

        {activeTab === 'insights' && <InsightsDashboard entries={entries} letters={weeklyLetters} profile={profile} />}
        {activeTab === 'profile' && <ProfileSettings profile={profile} onChange={setProfile} />}
      </main>

      {/* FIXED BOTTOM NAVIGATION FOR MOBILE THUMBS */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-stone-900 shadow-[0_15px_30px_rgba(0,0,0,0.3)] p-1.5 rounded-3xl z-[100] border border-white/10 backdrop-blur-xl flex justify-between items-center px-2">
        <button
          onClick={() => handleTabChange('chat')}
          className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300 ${activeTab === 'chat' ? 'bg-white text-stone-900 scale-105 shadow-md' : 'text-stone-400 hover:text-stone-200'}`}
        >
          <i className="fas fa-comment-dots text-lg"></i>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Chat</span>
        </button>
        <button
          onClick={() => handleTabChange('archive')}
          className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300 ${activeTab === 'archive' ? 'bg-white text-stone-900 scale-105 shadow-md' : 'text-stone-400 hover:text-stone-200'}`}
        >
          <i className="fas fa-book-open text-lg"></i>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Logs</span>
        </button>
        <button
          onClick={() => handleTabChange('insights')}
          className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300 ${activeTab === 'insights' ? 'bg-white text-stone-900 scale-105 shadow-md' : 'text-stone-400 hover:text-stone-200'}`}
        >
          <i className="fas fa-wave-square text-lg"></i>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Vibe</span>
        </button>
        <button
          onClick={() => handleTabChange('profile')}
          className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300 ${activeTab === 'profile' ? 'bg-white text-stone-900 scale-105 shadow-md' : 'text-stone-400 hover:text-stone-200'}`}
        >
          <i className="fas fa-user-circle text-lg"></i>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Self</span>
        </button>
      </nav>
    </div>
  );
};

export default App;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CapsuleEntry, WeeklyLetter, UserProfile } from './types';
import ArchiveTimeline from './components/ArchiveTimeline';
import ArchiveSearch from './components/ArchiveSearch';
import WeeklyLetterView from './components/WeeklyLetterView';
import ProfileSettings from './components/ProfileSettings';
import ChatInterface from './components/ChatInterface';
import { analyzeVoiceNote, generateWeeklyLetter, generateSoulCard } from './services/geminiService';

const App: React.FC = () => {
  const [entries, setEntries] = useState<CapsuleEntry[]>([]);
  const [weeklyLetters, setWeeklyLetters] = useState<WeeklyLetter[]>([]);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('capsule_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration for existing users
      if (!parsed.initialGreeting) {
        parsed.initialGreeting = `Hello ${parsed.name}. Record a thought of at least 10 seconds. I'll listen, transcribe, and find the meaning within.`;
      }
      return parsed;
    }
    return {
      name: 'Seeker',
      northStar: 'Capturing the small beauties of everyday life.',
      persona: 'empathetic',
      initialGreeting: 'Hello. I am your Capsule Archivist. Record a thought of at least 10 seconds, and I will find the threads of meaning within your story.'
    };
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingRecap, setIsGeneratingRecap] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'archive' | 'insights' | 'profile'>('chat');

  useEffect(() => {
    const savedEntries = localStorage.getItem('capsule_entries');
    if (savedEntries) try { setEntries(JSON.parse(savedEntries)); } catch (e) { }
    const savedLetters = localStorage.getItem('capsule_letters');
    if (savedLetters) try { setWeeklyLetters(JSON.parse(savedLetters)); } catch (e) { }
  }, []);

  useEffect(() => {
    localStorage.setItem('capsule_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('capsule_letters', JSON.stringify(weeklyLetters));
  }, [weeklyLetters]);

  useEffect(() => {
    localStorage.setItem('capsule_profile', JSON.stringify(profile));
  }, [profile]);

  const checkAndGenerateWeeklyRecap = useCallback(async () => {
    if (entries.length < 3) return;
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const lastSunday = new Date(now);
    lastSunday.setDate(now.getDate() - day);
    lastSunday.setHours(20, 0, 0, 0);
    if (day === 0 && hour < 20) lastSunday.setDate(lastSunday.getDate() - 7);

    const lastSundayTimestamp = lastSunday.getTime();
    const hasRecapForPeriod = weeklyLetters.some(l => l.timestamp > lastSundayTimestamp);

    if (!hasRecapForPeriod && (now.getTime() > lastSundayTimestamp)) {
      setIsGeneratingRecap(true);
      try {
        const MS_PER_WEEK = 604800000;
        const sevenDaysAgo = lastSundayTimestamp - MS_PER_WEEK;
        const recentEntries = entries.filter(e => e.timestamp > sevenDaysAgo && e.timestamp <= lastSundayTimestamp);

        if (recentEntries.length >= 2) {
          const weekLabel = `Week of ${new Date(sevenDaysAgo).toLocaleDateString()} – ${new Date(lastSundayTimestamp).toLocaleDateString()}`;
          const newLetter = await generateWeeklyLetter(recentEntries, weekLabel, profile);
          setWeeklyLetters(prev => [newLetter, ...prev]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsGeneratingRecap(false);
      }
    }
  }, [entries, weeklyLetters, profile]);

  useEffect(() => {
    checkAndGenerateWeeklyRecap();
  }, [entries.length, checkAndGenerateWeeklyRecap]);

  const handleRecordingComplete = useCallback(async (blob: Blob, base64: string) => {
    setIsProcessing(true);
    try {
      const analysis = await analyzeVoiceNote(base64, blob.type, profile);
      // const imageUrl = await generateSoulCard(analysis.imagePrompt); // Paused for now

      const newEntry: CapsuleEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        ...analysis,
        imageUrl: undefined
      };

      setEntries(prev => [newEntry, ...prev]);
    } catch (err) {
      console.error(err);
      alert("The archive encountered an error. Please try speaking again.");
    } finally {
      setIsProcessing(false);
    }
  }, [profile]);

  const stats = useMemo(() => {
    const moods = entries.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const sorted = Object.entries(moods).sort((a, b) => (b[1] as number) - (a[1] as number));
    return {
      total: entries.length,
      sortedMoods: sorted as [string, number][],
      primaryMood: sorted.length > 0 ? sorted[0][0] : 'Peaceful'
    };
  }, [entries]);

  const handleDeleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  return (
    <div className="min-h-screen pb-20 max-w-4xl mx-auto px-4 sm:px-6 bg-paper font-sans text-stone-800">
      <header className="py-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-stone-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl rotate-3 hover:rotate-0 transition-all cursor-pointer ring-1 ring-stone-900/5">
          <i className="fas fa-leaf text-paper text-2xl"></i>
        </div>
        <h1 className="font-serif text-5xl font-medium text-stone-900 tracking-tight mb-3">Hello, {profile.name}</h1>
        <p className="text-stone-500 font-medium tracking-wide italic max-w-sm">"{profile.northStar}"</p>
      </header>

      {/* Navigation */}
      <nav className="flex justify-center gap-1 mb-12 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl self-center max-w-fit mx-auto sticky top-4 z-50 shadow-sm ring-1 ring-stone-900/5">
        <button onClick={() => setActiveTab('chat')} className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-stone-800 text-paper shadow-md' : 'text-stone-400 hover:text-stone-600 hover:bg-white/50'}`}>
          <i className="fas fa-comments mr-2"></i> Chat
        </button>
        <button onClick={() => setActiveTab('archive')} className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'archive' ? 'bg-stone-800 text-paper shadow-md' : 'text-stone-400 hover:text-stone-600 hover:bg-white/50'}`}>
          <i className="fas fa-history mr-2"></i> Archive
        </button>
        <button onClick={() => setActiveTab('insights')} className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'insights' ? 'bg-stone-800 text-paper shadow-md' : 'text-stone-400 hover:text-stone-600 hover:bg-white/50'}`}>
          <i className="fas fa-chart-line mr-2"></i> Insights
        </button>
        <button onClick={() => setActiveTab('profile')} className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-stone-800 text-paper shadow-md' : 'text-stone-400 hover:text-stone-600 hover:bg-white/50'}`}>
          <i className="fas fa-user mr-2"></i> Profile
        </button>
      </nav>

      <main className="animate-in fade-in duration-700">
        {activeTab === 'chat' && (
          <ChatInterface
            entries={entries}
            profile={profile}
            onRecordingComplete={handleRecordingComplete}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === 'archive' && (
          <div>
            <ArchiveSearch entries={entries} profile={profile} />
            <ArchiveTimeline entries={entries} onDelete={handleDeleteEntry} />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-12">
            {weeklyLetters.map(letter => <WeeklyLetterView key={letter.id} letter={letter} />)}
            {entries.length > 0 && (
              <div className="p-10 bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <h3 className="serif text-3xl mb-6 font-medium tracking-wide">Patterns of {profile.name}</h3>
                <p className="text-stone-300 leading-loose italic text-xl font-light">
                  "You've recorded {entries.length} moments of your journey. Your {stats.primaryMood.toLowerCase()} reflections suggest you're staying true to your focus on {stats.primaryMood.toLowerCase()}."
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <ProfileSettings
            profile={profile}
            entries={entries}
            weeklyLetters={weeklyLetters}
            onChange={setProfile}
          />
        )}
      </main>

      <footer className="mt-24 pt-12 border-t border-stone-100 text-center text-stone-400 text-[10px] uppercase tracking-widest font-bold">
        <p>The Capsule &bull;</p>
      </footer>
    </div>
  );
};

export default App;
import React from 'react';
import { UserProfile, CapsuleEntry, WeeklyLetter } from '../types';

interface ProfileSettingsProps {
  profile: UserProfile;
  entries: CapsuleEntry[];
  weeklyLetters: WeeklyLetter[];
  onChange: (profile: UserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, entries, weeklyLetters, onChange }) => {
  const handleExport = () => {
    const archive = {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      profile,
      entries,
      weeklyLetters
    };

    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-capsule-archive-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-xl mx-auto glass-morphism p-8 rounded-3xl border border-stone-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center text-white">
          <i className="fas fa-user-gear"></i>
        </div>
        <div>
          <h2 className="serif text-2xl font-bold text-stone-800">Your Identity</h2>
          <p className="text-stone-500 text-xs">Tell The Capsule who you are today.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Nickname</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ ...profile, name: e.target.value })}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all shadow-sm"
            placeholder="What should I call you?"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Bot Initial Greeting</label>
          <textarea
            value={profile.initialGreeting}
            onChange={(e) => onChange({ ...profile, initialGreeting: e.target.value })}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all h-24 resize-none shadow-sm"
            placeholder="Customize the first message you see in chat..."
          />
          <p className="text-[10px] text-stone-400 mt-2 italic">This is the first message the Archivist sends in the Chat tab.</p>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Current North Star (Focus)</label>
          <textarea
            value={profile.northStar}
            onChange={(e) => onChange({ ...profile, northStar: e.target.value })}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all h-28 resize-none shadow-sm"
            placeholder="e.g., Learning to be more present with my family."
          />
          <p className="text-[10px] text-stone-400 mt-2 italic">I will use this to find deeper meaning in your memories.</p>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Archivist Persona</label>
          <div className="grid grid-cols-3 gap-2">
            {(['empathetic', 'stoic', 'poetic'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onChange({ ...profile, persona: p })}
                className={`py-3 px-2 rounded-xl text-[10px] font-bold uppercase tracking-tighter transition-all border ${profile.persona === p
                    ? 'bg-stone-800 text-white border-stone-800 shadow-md'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-stone-100">
          <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Data Management</label>
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3 px-4 rounded-xl transition-all border border-stone-200"
          >
            <i className="fas fa-download"></i>
            Export Archive (JSON)
          </button>
          <p className="text-[10px] text-stone-400 mt-2 italic text-center">Save a backup of your entries and letters.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
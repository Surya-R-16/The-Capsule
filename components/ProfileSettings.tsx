
import React from 'react';
import { UserProfile } from '../types';

interface ProfileSettingsProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onChange, onExport, onImport }) => {
  const archetypes = [
    { id: 'nurturer', name: 'The Nurturer', icon: 'fa-heart', desc: 'Warm, empathetic, and nurturing.' },
    { id: 'stoic', name: 'The Anchor', icon: 'fa-anchor', desc: 'Resilient, grounded, and objective.' },
    { id: 'dreamer', name: 'The Dreamer', icon: 'fa-cloud-moon', desc: 'Lyrical, poetic, and imaginative.' },
    { id: 'sage', name: 'The Sage', icon: 'fa-scroll', desc: 'Wise, timeless, and global observer.' },
    { id: 'inquirer', name: 'The Inquirer', icon: 'fa-question', desc: 'Curious, piercing, and Socratic.' },
    { id: 'individualist', name: 'The Individual', icon: 'fa-compass', desc: 'Authentic, bold, and existential.' },
    { id: 'alchemist', name: 'The Alchemist', icon: 'fa-flask', desc: 'Transmuting struggle into wisdom.' },
    { id: 'minimalist', name: 'The Minimalist', icon: 'fa-minus', desc: 'Finding the singular truth in noise.' }
  ] as const;

  const auraConfigs = [
    { id: 'stone', name: 'Tidal', color: 'bg-sky-500', desc: 'Sophisticated & Clear' },
    { id: 'midnight', name: 'Onyx', color: 'bg-stone-900', desc: 'Deep & Enigmatic' },
    { id: 'rose', name: 'Bloom', color: 'bg-rose-400', desc: 'Warm & Compassionate' },
    { id: 'forest', name: 'Grove', color: 'bg-emerald-500', desc: 'Vibrant & Grounded' }
  ] as const;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 pb-32 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* SECTION: THE SEEKER */}
      <div className="glass-morphism p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-stone-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
            <i className="fas fa-fingerprint"></i>
          </div>
          <div>
            <h2 className="serif text-xl font-bold text-stone-800">The Seeker</h2>
            <p className="text-stone-500 text-[10px] uppercase tracking-widest font-bold">Your Human Identity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2 ml-1">Nickname</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onChange({ ...profile, name: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-3.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all shadow-sm"
                placeholder="How shall I address you?"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2 ml-1">Current North Star</label>
              <input
                type="text"
                value={profile.northStar}
                onChange={(e) => onChange({ ...profile, northStar: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-3.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all shadow-sm"
                placeholder="Your primary focus..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2 ml-1">Life Background (Context)</label>
            <textarea
              value={profile.lifeBackground}
              onChange={(e) => onChange({ ...profile, lifeBackground: e.target.value })}
              className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-3.5 text-sm text-stone-900 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all shadow-sm leading-relaxed"
              placeholder="Tell me about your role, your city, your struggles, and your joys..."
            />
          </div>
        </div>
      </div>

      {/* SECTION: THE ARCHIVIST */}
      <div className="glass-morphism p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center text-white">
            <i className="fas fa-sparkles"></i>
          </div>
          <div>
            <h2 className="serif text-xl font-bold text-stone-800">The Archivist</h2>
            <p className="text-stone-500 text-[10px] uppercase tracking-widest font-bold">Your Philosophical Mirror</p>
          </div>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2 ml-1">Archivist's Name</label>
              <input
                type="text"
                value={profile.archivistName}
                onChange={(e) => onChange({ ...profile, archivistName: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-3.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all shadow-sm"
                placeholder="Name your silent partner..."
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2 ml-1">System Aura</label>
              <div className="flex gap-4 h-[50px] items-center">
                {auraConfigs.map((aura) => (
                  <button
                    key={aura.id}
                    onClick={() => onChange({ ...profile, aura: aura.id })}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${aura.color
                      } ${profile.aura === aura.id ? 'ring-2 ring-offset-2 ring-stone-400 scale-110' : 'opacity-40 hover:opacity-100'}`}
                    title={`${aura.name}: ${aura.desc}`}
                  >
                    {profile.aura === aura.id && <i className="fas fa-check text-white text-[10px]"></i>}
                  </button>
                ))}
              </div>
              <p className="text-[8px] text-stone-400 uppercase tracking-widest mt-2 font-bold italic">
                {auraConfigs.find(a => a.id === profile.aura)?.name} Aura Active
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4 ml-1">Philosophical Archetype</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {archetypes.map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => onChange({ ...profile, persona: arch.id })}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left ${profile.persona === arch.id
                    ? 'bg-stone-800 border-stone-800 text-white shadow-lg scale-[1.02]'
                    : 'bg-white border-stone-100 text-stone-600 hover:border-stone-300'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${profile.persona === arch.id ? 'bg-white/10' : 'bg-stone-50 text-stone-400'}`}>
                    <i className={`fas ${arch.icon} text-sm`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider mb-1">{arch.name}</h4>
                    <p className={`text-[10px] leading-relaxed ${profile.persona === arch.id ? 'text-stone-300' : 'text-stone-400'}`}>{arch.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4 ml-1">Resonance Preference</label>
            <div className="grid grid-cols-2 gap-2">
              {(['pattern-matching', 'silver-linings', 'critical-growth', 'validation'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => onChange({ ...profile, resonanceFilter: filter })}
                  className={`py-4 px-1 rounded-xl text-[9px] font-bold uppercase tracking-tight transition-all border ${profile.resonanceFilter === filter
                    ? 'bg-stone-800 text-white border-stone-800 shadow-md'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                    }`}
                >
                  {filter.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>


      {/* SECTION: DATA MANAGEMENT */}
      <div className="glass-morphism p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
            <i className="fas fa-database"></i>
          </div>
          <div>
            <h2 className="serif text-xl font-bold text-stone-800">The Vault</h2>
            <p className="text-stone-500 text-[10px] uppercase tracking-widest font-bold">Backup & Restore</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <h4 className="font-bold text-sm text-stone-800 mb-2">Backup Archive</h4>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">Save a copy of your journal, letters, and settings to this device.</p>
            <button
              onClick={onExport}
              className="w-full py-3 bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-900 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <i className="fas fa-download"></i> Download
            </button>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <h4 className="font-bold text-sm text-stone-800 mb-2">Restore Archive</h4>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">Restore your data from a backup file. Existing data will be merged.</p>
            <label className="w-full py-3 bg-white border border-stone-200 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              <i className="fas fa-upload"></i> Restore
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onImport(e.target.files[0]);
                    // Reset value so same file can be selected again if needed
                    e.target.value = '';
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

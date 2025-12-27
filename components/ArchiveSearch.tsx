
import React, { useState } from 'react';
import { askTheArchive } from '../services/geminiService';
import { CapsuleEntry, UserProfile } from '../types';

interface ArchiveSearchProps {
  entries: CapsuleEntry[];
  // Added profile prop to fix the argument mismatch error
  profile: UserProfile;
}

const ArchiveSearch: React.FC<ArchiveSearchProps> = ({ entries, profile }) => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || entries.length === 0) return;

    setIsLoading(true);
    setAnswer(null);

    const historyText = entries
      .map(e => `[${new Date(e.timestamp).toLocaleDateString()}] ${e.transcript}`)
      .join('\n\n');

    // Added profile as the third argument to askTheArchive
    const result = await askTheArchive(query, historyText, profile);
    setAnswer(result);
    setIsLoading(false);
  };

  return (
    <div className="w-full glass-morphism p-6 rounded-3xl border border-stone-200 shadow-sm mb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
          <i className="fas fa-wand-magic-sparkles"></i>
        </div>
        <div>
          <h3 className="font-semibold text-stone-800">Memory Search</h3>
          <p className="text-xs text-stone-500">Ask me anything about your past entries</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., When was the last time I felt really happy?"
          className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-stone-800 text-white px-6 py-3 rounded-xl hover:bg-stone-900 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed transition-all font-semibold"
        >
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Ask'}
        </button>
      </form>

      {answer && (
        <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-3">
            <div className="mt-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center shrink-0">
              <i className="fas fa-leaf text-[10px] text-white"></i>
            </div>
            <p className="text-emerald-900 text-sm leading-relaxed serif italic">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveSearch;

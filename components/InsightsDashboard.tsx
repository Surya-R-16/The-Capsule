import React, { useMemo } from 'react';
import { CapsuleEntry, WeeklyLetter, UserProfile } from '../types';
import WeeklyLetterView from './WeeklyLetterView';
import MoodTrendChart from './MoodTrendChart';

interface InsightsDashboardProps {
    entries: CapsuleEntry[];
    letters: WeeklyLetter[];
    profile: UserProfile;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ entries, letters, profile }) => {
    const stats = useMemo(() => {
        const moods = entries.reduce((acc, curr) => {
            const category = curr.moodCategory || 'Unknown'; // Or use helper if available, but simple check fits standard new data
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const sorted = Object.entries(moods).sort((a, b) => (b[1] as number) - (a[1] as number));
        // Fallback for primary mood text (use most frequent category or actual mood if no category)
        const primaryCategory = sorted.length > 0 ? sorted[0][0] : 'Peaceful';

        return {
            total: entries.length,
            sortedMoods: sorted as [string, number][],
            primaryMood: primaryCategory
        };
    }, [entries]);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Mood Trend Chart */}
            <MoodTrendChart entries={entries} />

            {letters.map(letter => <WeeklyLetterView key={letter.id} letter={letter} />)}

            {entries.length > 0 && (
                <div className="p-8 sm:p-10 bg-gradient-to-br from-stone-900 to-stone-800 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group mx-2 sm:mx-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <h3 className="serif text-2xl sm:text-3xl mb-6 font-medium tracking-wide">Patterns of {profile.name}</h3>
                    <p className="text-stone-300 leading-loose italic text-lg sm:text-xl font-light">
                        "You've recorded {entries.length} moments of your journey. Your tendency towards <span className="text-white font-normal">{stats.primaryMood}</span> suggests you're staying true to your focus."
                    </p>
                </div>
            )}

            {entries.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <i className="fas fa-chart-pie text-4xl mb-4 text-stone-300"></i>
                    <p className="text-stone-400 text-sm">Insights will appear here as your archive grows.</p>
                </div>
            )}
        </div>
    );
};

export default InsightsDashboard;

import React, { useMemo } from 'react';
import { CapsuleEntry } from '../types';

interface MoodTrendChartProps {
    entries: CapsuleEntry[];
}

// Mood color mapping - The Capsule Palette
const moodColors: Record<string, string> = {
    'Radiance': '#fbbf24',      // Amber-400 (Joy, Confidence)
    'Serenity': '#2dd4bf',      // Teal-400 (Peace, Calm)
    'Wonder': '#e879f9',        // Fuchsia-400 (Awe, Curiosity)
    'Introspection': '#818cf8', // Indigo-400 (Focus, Neutral)
    'Nostalgia': '#d6d3d1',     // Stone-300 (Bittersweet, Old memories) -> actually Warm Sepia/Bronze might be better #a8a29e? Let's go with a warm grey
    'Melancholy': '#6366f1',    // Indigo-500 (Sadness)
    'Storm': '#f87171',         // Red-400 (Anger, Anxiety)
    'Unknown': '#57534e'        // Stone-600
};

// Legacy fallback map
const legacyMoodMap: Record<string, string> = {
    'Joyful': 'Radiance', 'Happy': 'Radiance', 'Excited': 'Radiance', 'Confident': 'Radiance',
    'Calm': 'Serenity', 'Peaceful': 'Serenity', 'Relaxed': 'Serenity',
    'Reflective': 'Introspection', 'Neutral': 'Introspection', 'Focus': 'Introspection',
    'Sad': 'Melancholy', 'Melancholic': 'Melancholy', 'Lonely': 'Melancholy',
    'Anxious': 'Storm', 'Stressed': 'Storm', 'Angry': 'Storm',
    'Grateful': 'Wonder', 'Inspired': 'Wonder', 'Hopeful': 'Wonder'
};

const getCategory = (entry: CapsuleEntry): string => {
    if (entry.moodCategory && moodColors[entry.moodCategory]) return entry.moodCategory;
    // Attempt legacy mapping
    const mapped = legacyMoodMap[entry.mood] || legacyMoodMap[Object.keys(legacyMoodMap).find(k => entry.mood.includes(k)) || ''] || 'Unknown';
    return mapped;
};

const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ entries }) => {
    const chartData = useMemo(() => {
        if (entries.length === 0) return [];

        // Get last 14 days
        const days: { date: string; label: string; moods: { category: string, mood: string }[] }[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 13; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const label = date.toLocaleDateString(undefined, { weekday: 'short' }).charAt(0);
            days.push({ date: dateStr, label, moods: [] });
        }

        // Populate moods
        entries.forEach(entry => {
            const dateStr = new Date(entry.timestamp).toISOString().split('T')[0];
            const day = days.find(d => d.date === dateStr);
            if (day) {
                day.moods.push({
                    category: getCategory(entry),
                    mood: entry.mood
                });
            }
        });

        return days;
    }, [entries]);

    if (entries.length === 0) return null;

    const maxMoods = Math.max(...chartData.map(d => d.moods.length), 1);
    const barMaxHeight = 80;

    return (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chart-bar text-white text-xs"></i>
                </div>
                <div>
                    <h3 className="font-bold text-stone-800 text-sm">Mood Landscape</h3>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Last 14 Days</p>
                </div>
            </div>

            {/* Chart */}
            <div className="flex items-end justify-between gap-1 h-24">
                {chartData.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        {/* Bar */}
                        <div
                            className="w-full rounded-t-sm transition-all duration-300 relative group"
                            style={{
                                height: day.moods.length > 0 ? `${(day.moods.length / maxMoods) * barMaxHeight}px` : '4px',
                                backgroundColor: day.moods.length > 0
                                    ? (moodColors[day.moods[day.moods.length - 1].category] || '#57534e')
                                    : '#292524', // stone-800 for empty
                                minHeight: '4px'
                            }}
                        >
                            {/* Tooltip */}
                            {day.moods.length > 0 && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-stone-800 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {day.moods.map(m => m.mood).join(', ')}
                                </div>
                            )}
                        </div>
                        {/* Day label */}
                        <span className="text-[8px] text-stone-400 font-bold">{day.label}</span>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {Object.entries(moodColors).slice(0, 6).map(([mood, color]) => (
                    <div key={mood} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                        <span className="text-[8px] text-stone-400">{mood}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoodTrendChart;

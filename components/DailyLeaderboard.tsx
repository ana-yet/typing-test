import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface DailyResult {
    date: string;
    wpm: number;
    accuracy: number;
    time: number;
}

const DailyLeaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<DailyResult[]>([]);

    useEffect(() => {
        const results: DailyResult[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('daily_challenge_')) {
                const date = key.replace('daily_challenge_', '');
                try {
                    const data = JSON.parse(localStorage.getItem(key) || '{}');
                    if (data.wpm) {
                        results.push({ date, ...data });
                    }
                } catch (e) {
                    console.error('Failed to parse daily result', e);
                }
            }
        }
        
        // Sort by WPM descending
        results.sort((a, b) => b.wpm - a.wpm);
        setLeaderboard(results);
    }, []);

    if (leaderboard.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--bg-tertiary)] mb-8 shadow-lg animate-fade-in">
            <div className="flex items-center gap-3 mb-6 text-[var(--accent-primary)]">
                <Trophy size={24} />
                <h2 className="text-xl font-bold">Your Daily Challenge Leaderboard</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                            <th className="py-3 px-4 font-semibold">Rank</th>
                            <th className="py-3 px-4 font-semibold">Date</th>
                            <th className="py-3 px-4 font-semibold">WPM</th>
                            <th className="py-3 px-4 font-semibold">Accuracy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((result, index) => (
                            <tr 
                                key={result.date} 
                                className={`border-b border-[var(--bg-tertiary)] last:border-0 hover:bg-[var(--bg-tertiary)] transition-colors ${index === 0 ? 'bg-[var(--bg-tertiary)] bg-opacity-50' : ''}`}
                            >
                                <td className="py-3 px-4">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </td>
                                <td className="py-3 px-4 font-medium">{result.date}</td>
                                <td className="py-3 px-4 font-bold text-[var(--accent-primary)]">{result.wpm}</td>
                                <td className="py-3 px-4">{result.accuracy.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DailyLeaderboard;

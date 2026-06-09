import React from 'react';
import { useHistoryStore } from '../store/useHistoryStore';
import { Trophy, Star, Medal, Lock } from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
    const { xp, level, achievements } = useHistoryStore();

    // calculate xp to next level
    // level: Math.floor(Math.sqrt(xp / 100)) + 1
    // xp needed for next level = ((level) * (level)) * 100
    const nextLevelXP = (level * level) * 100;
    const currentLevelBaseXP = ((level - 1) * (level - 1)) * 100;
    const progressXP = xp - currentLevelBaseXP;
    const requiredXP = nextLevelXP - currentLevelBaseXP;
    const progressPercent = Math.min(100, Math.max(0, (progressXP / requiredXP) * 100));

    return (
        <div className="max-w-5xl mx-auto w-full px-4 animate-fade-in space-y-8">
            <h1 className="text-3xl font-bold text-[var(--accent-primary)] tracking-tight">Profile & Achievements</h1>

            <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                
                <div className="w-32 h-32 rounded-full border-4 border-[var(--bg-tertiary)] bg-[var(--bg-primary)] flex items-center justify-center flex-shrink-0 shadow-inner relative z-10">
                    <span className="text-5xl">👤</span>
                </div>
                
                <div className="flex-1 text-center md:text-left relative z-10 w-full">
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Typist Level {level}</h2>
                        <div className="bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <Star size={12} fill="currentColor" /> {xp} Total XP
                        </div>
                    </div>
                    
                    <p className="text-[var(--text-secondary)] mb-4">
                        Earn XP by completing typing tests, achieving high accuracy, and reaching new speed milestones.
                    </p>

                    <div className="bg-[var(--bg-primary)] h-4 rounded-full overflow-hidden border border-[var(--bg-tertiary)]">
                        <div 
                            className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="absolute top-0 bottom-0 left-0 right-0 bg-white/20" />
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        <span>Level {level}</span>
                        <span>{progressXP} / {requiredXP} XP</span>
                        <span>Level {level + 1}</span>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Medal className="text-[var(--accent-primary)]" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Achievements</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {achievements.map((ach) => (
                        <div 
                            key={ach.id} 
                            className={`p-5 rounded-xl border transition-all ${
                                ach.unlockedAt 
                                    ? 'bg-[var(--bg-secondary)] border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)] shadow-sm' 
                                    : 'bg-[var(--bg-primary)] border-[var(--bg-tertiary)] opacity-60 grayscale'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-4xl">{ach.icon}</span>
                                {!ach.unlockedAt && <Lock size={16} className="text-[var(--text-muted)]" />}
                            </div>
                            <h3 className={`font-bold mb-1 ${ach.unlockedAt ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                {ach.name}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)] leading-snug mb-3">
                                {ach.description}
                            </p>
                            {ach.unlockedAt && (
                                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                                    Unlocked {format(ach.unlockedAt, 'MMM d, yyyy')}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

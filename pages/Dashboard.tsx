import React, { useState, useMemo } from 'react';
import { useHistoryStore } from '../src/store/useHistoryStore';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, ScatterChart, Scatter, Cell, Legend 
} from 'recharts';
import { 
    Target, Zap, Clock, Activity, Flame, Award, AlertCircle, 
    Sparkles, BarChart2, ShieldAlert, ArrowRight, Clipboard, Check, Key, TrendingUp, Compass, Swords, Monitor
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const COMMON_WORDS = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

const leftHandKeys = new Set('qwertasefgzxcvb'.split(''));
const rightHandKeys = new Set('yuiophjklnm'.split(''));
const topRowKeys = new Set('qwertyuiop'.split(''));
const homeRowKeys = new Set('asdfghjkl'.split(''));
const bottomRowKeys = new Set('zxcvbnm'.split(''));
const vowels = new Set('aeiou'.split(''));

export default function Dashboard() {
    const { tests, mistakeHeatmap, totalPracticeTime, totalWordsTyped, currentStreak, longestStreak } = useHistoryStore();
    const [timeframe, setTimeframe] = useState<'10' | '30' | 'all'>('all');
    const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'advanced' | 'planner'>('overview');
    const [copied, setCopied] = useState(false);
    const [customPracticeText, setCustomPracticeText] = useState<string>('');

    // Filter tests by selected timeframe
    const filteredTests = useMemo(() => {
        let sorted = [...tests].sort((a, b) => b.date - a.date); // newest first
        if (timeframe === '10') sorted = sorted.slice(0, 10);
        else if (timeframe === '30') sorted = sorted.slice(0, 30);
        return sorted.reverse(); // old to new for trends
    }, [tests, timeframe]);

    // Calculate core stats
    const stats = useMemo(() => {
        if (filteredTests.length === 0) {
            return {
                averageWpm: 0,
                averageAccuracy: 0,
                maxWpm: 0,
                maxAccuracy: 0,
                totalPracticeTime: 0,
                consistency: 100
            };
        }

        const wpms = filteredTests.map(t => t.wpm);
        const accs = filteredTests.map(t => t.accuracy);
        
        const averageWpm = Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length);
        const averageAccuracy = Math.round(accs.reduce((a, b) => a + b, 0) / accs.length);
        const maxWpm = Math.max(...wpms);
        const maxAccuracy = Math.max(...accs);

        // Standard Deviation & Coefficient of Variation for Consistency
        let consistency = 100;
        if (wpms.length > 1) {
            const mean = averageWpm;
            if (mean > 0) {
                const variance = wpms.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / wpms.length;
                const stdDev = Math.sqrt(variance);
                const cv = stdDev / mean;
                consistency = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
            }
        }

        return {
            averageWpm,
            averageAccuracy,
            maxWpm,
            maxAccuracy,
            totalPracticeTime: filteredTests.reduce((acc, t) => acc + t.duration, 0),
            consistency
        };
    }, [filteredTests]);

    // Trend Chart Data
    const chartData = useMemo(() => {
        return filteredTests.map((test, index) => ({
            index: index + 1,
            wpm: test.wpm,
            rawWpm: test.rawWpm || test.wpm,
            accuracy: test.accuracy,
            date: format(test.date, 'MMM d')
        }));
    }, [filteredTests]);

    // Mistake Profile (Row, Hand, Key Types)
    const mistakeProfile = useMemo(() => {
        let leftHandErrors = 0;
        let rightHandErrors = 0;
        let topRowErrors = 0;
        let homeRowErrors = 0;
        let bottomRowErrors = 0;
        let vowelErrors = 0;
        let consonantErrors = 0;
        let spaceErrors = 0;
        let totalErrors = 0;

        Object.entries(mistakeHeatmap).forEach(([char, count]) => {
            const charLower = char.toLowerCase();
            totalErrors += count;

            if (charLower === ' ' || charLower === 'space') {
                spaceErrors += count;
            } else {
                if (leftHandKeys.has(charLower)) leftHandErrors += count;
                if (rightHandKeys.has(charLower)) rightHandErrors += count;
                if (topRowKeys.has(charLower)) topRowErrors += count;
                if (homeRowKeys.has(charLower)) homeRowErrors += count;
                if (bottomRowKeys.has(charLower)) bottomRowErrors += count;
                
                if (/[a-z]/.test(charLower)) {
                    if (vowels.has(charLower)) {
                        vowelErrors += count;
                    } else {
                        consonantErrors += count;
                    }
                }
            }
        });

        return {
            leftHandErrors,
            rightHandErrors,
            topRowErrors,
            homeRowErrors,
            bottomRowErrors,
            vowelErrors,
            consonantErrors,
            spaceErrors,
            totalErrors
        };
    }, [mistakeHeatmap]);

    // Key Speed Buckets Distribution
    const wpmDistribution = useMemo(() => {
        const buckets = {
            'Slow (<40)': 0,
            'Normal (40-60)': 0,
            'Fast (60-80)': 0,
            'Very Fast (80-100)': 0,
            'Elite (100+)': 0
        };

        filteredTests.forEach(t => {
            if (t.wpm < 40) buckets['Slow (<40)']++;
            else if (t.wpm < 60) buckets['Normal (40-60)']++;
            else if (t.wpm < 80) buckets['Fast (60-80)']++;
            else if (t.wpm < 100) buckets['Very Fast (80-100)']++;
            else buckets['Elite (100+)']++;
        });

        return Object.entries(buckets).map(([bucket, count]) => ({
            range: bucket,
            count
        }));
    }, [filteredTests]);

    // Top mistyped keys chart data
    const topKeysData = useMemo(() => {
        return Object.entries(mistakeHeatmap)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .slice(0, 8)
            .map(([char, count]) => ({
                char: char === ' ' ? 'Space' : char,
                count
            }));
    }, [mistakeHeatmap]);

    // Correlation (WPM vs Accuracy) scatter data
    const scatterData = useMemo(() => {
        return filteredTests.map(t => ({
            wpm: t.wpm,
            accuracy: t.accuracy,
            date: format(t.date, 'MMM d')
        }));
    }, [filteredTests]);

    // Performance Mode comparison
    const modeStats = useMemo(() => {
        const modesMap: Record<string, { wpmSum: number; accSum: number; count: number }> = {};
        
        tests.forEach(t => {
            const mode = t.mode || 'normal';
            if (!modesMap[mode]) {
                modesMap[mode] = { wpmSum: 0, accSum: 0, count: 0 };
            }
            modesMap[mode].wpmSum += t.wpm;
            modesMap[mode].accSum += t.accuracy;
            modesMap[mode].count++;
        });

        return Object.entries(modesMap).map(([mode, data]) => ({
            mode: mode.charAt(0).toUpperCase() + mode.slice(1),
            avgWpm: Math.round(data.wpmSum / data.count),
            avgAcc: Math.round(data.accSum / data.count),
            count: data.count
        }));
    }, [tests]);

    // Language stats comparison
    const languageStats = useMemo(() => {
        const langMap: Record<string, { wpmSum: number; accSum: number; count: number }> = {
            english: { wpmSum: 0, accSum: 0, count: 0 },
            bengali: { wpmSum: 0, accSum: 0, count: 0 }
        };

        tests.forEach(t => {
            const lang = t.language || 'english';
            if (langMap[lang]) {
                langMap[lang].wpmSum += t.wpm;
                langMap[lang].accSum += t.accuracy;
                langMap[lang].count++;
            }
        });

        return langMap;
    }, [tests]);

    // Generate personalized practice plan text
    const handleGeneratePractice = () => {
        const sortedKeys = Object.entries(mistakeHeatmap)
            .sort((a, b) => b[1] - a[1])
            .map(([char]) => char.toLowerCase())
            .filter(char => char.trim().length > 0 && /[a-zA-Z]/.test(char));

        if (sortedKeys.length === 0) {
            const defaultText = "the quick brown fox jumps over the lazy dog";
            setCustomPracticeText(defaultText);
            return;
        }

        const weakKeys = sortedKeys.slice(0, 3);
        const matchingWords = COMMON_WORDS.filter(word => 
            weakKeys.some(key => word.includes(key))
        );

        let practiceWords = [...matchingWords];
        if (practiceWords.length < 15) {
            practiceWords = [...practiceWords, ...COMMON_WORDS].slice(0, 20);
        }
        
        practiceWords = practiceWords.sort(() => Math.random() - 0.5);
        const resultText = practiceWords.slice(0, 15).join(' ');
        setCustomPracticeText(resultText);
    };

    const handleCopy = () => {
        if (!customPracticeText) return;
        navigator.clipboard.writeText(customPracticeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Calculate typing skill rating
    const typingRating = useMemo(() => {
        const avgWpm = stats.averageWpm;
        if (tests.length === 0) return { title: 'Trainee', color: 'text-gray-400', desc: 'Complete tests to receive your tier rating.' };
        if (avgWpm < 30) return { title: 'Novice Typist', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5', desc: 'Focus on accuracy and correct posture.' };
        if (avgWpm < 50) return { title: 'Intermediate Typist', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Great foundation. Work on keeping home row keys steady.' };
        if (avgWpm < 70) return { title: 'Fluent Typist', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', desc: 'Your speed is above average! Start utilizing advanced words.' };
        if (avgWpm < 90) return { title: 'Advanced Typist', color: 'text-pink-400 border-pink-500/20 bg-pink-500/5', desc: 'Professional level speed. Aim for 98%+ precision.' };
        if (avgWpm < 110) return { title: 'Typing Master', color: 'text-purple-400 border-purple-500/20 bg-purple-500/5', desc: 'Incredible speed. You are among the top tier typists!' };
        return { title: 'Typing Deity', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.15)]', desc: 'Absolute perfection. Legend of keyboard speed.' };
    }, [stats.averageWpm, tests]);

    // Handle Empty State
    if (tests.length === 0) {
        return (
            <div className="max-w-4xl mx-auto w-full px-4 py-12 text-center space-y-6">
                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-full w-20 h-20 flex items-center justify-center mx-auto text-[var(--accent-primary)] shadow-sm">
                    <BarChart2 size={40} />
                </div>
                <h1 className="text-3xl font-black text-[var(--accent-primary)] tracking-tight">Advanced Analytics Dashboard</h1>
                <p className="text-[var(--text-secondary)] text-lg max-w-lg mx-auto">
                    Complete your first test in the Arena to start tracking speed metrics, anatomical keyboard analysis, consistency ratings, and personalized drill builders!
                </p>
                <div>
                    <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold rounded-xl hover:opacity-90 transition-opacity">
                        <span>Enter Arena</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto w-full px-4 animate-fade-in space-y-6">
            {/* Header section with timeframe selectors */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--bg-tertiary)] pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[var(--accent-primary)] tracking-tight">Performance Analytics</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Deep-dive keyboard diagnostics, error anatomy, and custom metrics.</p>
                </div>
                
                <div className="flex items-center gap-1 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-1 rounded-xl">
                    <button 
                        onClick={() => setTimeframe('10')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === '10' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        Last 10 Tests
                    </button>
                    <button 
                        onClick={() => setTimeframe('30')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === '30' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        Last 30 Tests
                    </button>
                    <button 
                        onClick={() => setTimeframe('all')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'all' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        All History
                    </button>
                </div>
            </div>

            {/* Custom Tab Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all shrink-0 ${activeTab === 'overview' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] border-transparent' : 'bg-[var(--bg-secondary)] border-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                    <TrendingUp size={16} />
                    <span>Overview & Trends</span>
                </button>
                <button 
                    onClick={() => setActiveTab('keys')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all shrink-0 ${activeTab === 'keys' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] border-transparent' : 'bg-[var(--bg-secondary)] border-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                    <Key size={16} />
                    <span>Anatomy of Mistakes</span>
                </button>
                <button 
                    onClick={() => setActiveTab('advanced')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all shrink-0 ${activeTab === 'advanced' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] border-transparent' : 'bg-[var(--bg-secondary)] border-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                    <Compass size={16} />
                    <span>Speed vs Precision</span>
                </button>
                <button 
                    onClick={() => setActiveTab('planner')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all shrink-0 ${activeTab === 'planner' ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] border-transparent' : 'bg-[var(--bg-secondary)] border-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                    <Sparkles size={16} />
                    <span>Insights & Practice Plan</span>
                </button>
            </div>

            {/* Content Tabs */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Top Core Metrics Dashboard Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <StatCard icon={<Activity />} label="Analyzed Tests" value={filteredTests.length} />
                        <StatCard icon={<Zap />} label="Avg Net WPM" value={stats.averageWpm} />
                        <StatCard icon={<Award />} label="Max WPM" value={stats.maxWpm} />
                        <StatCard icon={<Target />} label="Avg Accuracy" value={`${stats.averageAccuracy}%`} />
                        <StatCard icon={<Clock />} label="Practice (min)" value={Math.round(stats.totalPracticeTime / 60)} />
                        <StatCard 
                            icon={<TrendingUp className="text-[var(--text-correct)]" />} 
                            label="Consistency" 
                            value={`${stats.consistency}%`} 
                            tooltip="Reflects the variance in speed across tests. High consistency means a very stable flow speed."
                        />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* WPM & Accuracy Trend Chart */}
                        <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                                <h2 className="text-lg font-bold text-[var(--text-primary)]">Velocity & Precision Curve</h2>
                                <span className="text-xs text-[var(--text-secondary)] font-mono">Double Y-axis correlation analysis</span>
                            </div>
                            <div className="h-80">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary-hover)" vertical={false} />
                                            <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis yAxisId="left" stroke="var(--accent-primary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis yAxisId="right" orientation="right" stroke="var(--text-correct)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} domain={[80, 100]} axisLine={false} tickLine={false} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary-hover)', color: 'var(--text-primary)', borderRadius: '0.75rem', fontSize: '13px' }}
                                            />
                                            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                            <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="var(--accent-primary)" strokeWidth={3} dot={{ strokeWidth: 1 }} name="Net WPM" activeDot={{ r: 6 }} />
                                            <Line yAxisId="left" type="monotone" dataKey="rawWpm" stroke="var(--text-secondary)" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Raw WPM" />
                                            <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="var(--text-correct)" strokeWidth={3} dot={{ strokeWidth: 1 }} name="Accuracy %" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">Loading performance curve...</div>
                                )}
                            </div>
                        </div>

                        {/* Speed Distribution Chart */}
                        <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm">
                            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">WPM Speed Spread</h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={wpmDistribution} margin={{ top: 10, right: 10, bottom: 20, left: -25 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary-hover)" vertical={false} />
                                        <XAxis dataKey="range" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} angle={-15} textAnchor="end" height={45} axisLine={false} tickLine={false} />
                                        <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary-hover)', color: 'var(--text-primary)', borderRadius: '0.75rem', fontSize: '13px' }}
                                        />
                                        <Bar dataKey="count" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} name="Tests Count">
                                            {wpmDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} opacity={0.75 + (index / wpmDistribution.length) * 0.25} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Streak & Consistency Quick Card */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-[var(--text-secondary)]">Regularity Streak</span>
                                <Flame size={20} className="text-orange-500 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="text-4xl font-extrabold text-[var(--text-primary)]">{currentStreak} <span className="text-lg font-medium text-[var(--text-secondary)]">Days Current</span></div>
                                <div className="text-sm text-[var(--text-secondary)]">Longest consecutive streak is {longestStreak} days. Keep practicing daily!</div>
                            </div>
                        </div>

                        <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-[var(--text-secondary)]">Typing Consistency Index</span>
                                <TrendingUp size={20} className="text-[var(--text-correct)]" />
                            </div>
                            <div className="space-y-2">
                                <div className="text-4xl font-extrabold text-[var(--text-primary)]">{stats.consistency}%</div>
                                <div className="text-sm text-[var(--text-secondary)]">
                                    {stats.consistency >= 90 ? 'Your typing pace is extremely stable.' : stats.consistency >= 75 ? 'Moderate pace control. Maintain steady transitions.' : 'Highly variable typing speed. Work on standard rhythm.'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-[var(--text-secondary)]">Cumulative Volume</span>
                                <Activity size={20} className="text-[var(--accent-primary)]" />
                            </div>
                            <div className="space-y-2">
                                <div className="text-4xl font-extrabold text-[var(--text-primary)]">{(totalWordsTyped || 0).toLocaleString()} <span className="text-lg font-medium text-[var(--text-secondary)]">Words</span></div>
                                <div className="text-sm text-[var(--text-secondary)]">You typed a massive amount of keystrokes to refine your kinetic typing patterns!</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'keys' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Key Miss Heatmap Bar Chart */}
                        <div className="lg:col-span-1 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm flex flex-col">
                            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Top Mistyped Characters</h2>
                            <p className="text-xs text-[var(--text-secondary)] mb-6">Historical list of top characters registered as mistakes.</p>
                            <div className="flex-1 min-h-[300px]">
                                {topKeysData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={320}>
                                        <BarChart data={topKeysData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary-hover)" horizontal={true} vertical={false} />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="char" type="category" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-primary)', fontWeight: 'bold' }} axisLine={false} tickLine={false} width={45} />
                                            <Tooltip 
                                                cursor={{ fill: 'var(--bg-tertiary)' }}
                                                contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary-hover)', color: 'var(--text-primary)', borderRadius: '0.75rem', fontSize: '13px' }}
                                            />
                                            <Bar dataKey="count" fill="var(--bg-incorrect, #ef5350)" radius={[0, 4, 4, 0]} barSize={18} name="Mistakes">
                                                {topKeysData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} opacity={1 - (index / topKeysData.length) * 0.5} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-[var(--text-secondary)] text-sm">Perfect precision! No errors recorded.</div>
                                )}
                            </div>
                        </div>

                        {/* Hand Balance & Row Anatomy */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Left vs Right Hand Balance */}
                            <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm">
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Lateral Hand Error Balance</h2>
                                <div className="space-y-6">
                                    <div className="flex justify-between text-xs font-mono text-[var(--text-secondary)]">
                                        <span>Left Hand Zone (Q-G, Z-B)</span>
                                        <span>Right Hand Zone (Y-P, H-M)</span>
                                    </div>
                                    <div className="h-6 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden flex">
                                        {mistakeProfile.totalErrors > 0 ? (
                                            <>
                                                <div 
                                                    style={{ width: `${(mistakeProfile.leftHandErrors / (mistakeProfile.leftHandErrors + mistakeProfile.rightHandErrors || 1)) * 100}%` }}
                                                    className="bg-[var(--accent-primary)] h-full transition-all duration-500 relative flex items-center justify-center text-[10px] font-extrabold text-[var(--bg-primary)]"
                                                >
                                                    {Math.round((mistakeProfile.leftHandErrors / (mistakeProfile.leftHandErrors + mistakeProfile.rightHandErrors || 1)) * 100)}%
                                                </div>
                                                <div 
                                                    style={{ width: `${(mistakeProfile.rightHandErrors / (mistakeProfile.leftHandErrors + mistakeProfile.rightHandErrors || 1)) * 100}%` }}
                                                    className="bg-[var(--text-correct)] h-full transition-all duration-500 relative flex items-center justify-center text-[10px] font-extrabold text-[var(--bg-primary)]"
                                                >
                                                    {Math.round((mistakeProfile.rightHandErrors / (mistakeProfile.leftHandErrors + mistakeProfile.rightHandErrors || 1)) * 100)}%
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full text-center text-xs text-[var(--text-secondary)] leading-6">Balanced typing profiles.</div>
                                        )}
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--bg-tertiary)]">
                                            <div className="text-xs text-[var(--text-secondary)] font-medium">Left Hand Errors</div>
                                            <div className="text-2xl font-black text-[var(--accent-primary)]">{mistakeProfile.leftHandErrors} <span className="text-xs font-normal text-[var(--text-secondary)]">registered</span></div>
                                        </div>
                                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--bg-tertiary)]">
                                            <div className="text-xs text-[var(--text-secondary)] font-medium">Right Hand Errors</div>
                                            <div className="text-2xl font-black text-[var(--text-correct)]">{mistakeProfile.rightHandErrors} <span className="text-xs font-normal text-[var(--text-secondary)]">registered</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Row Analysis */}
                            <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm">
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">Keyboard Rows Miss Distribution</h2>
                                <div className="space-y-4">
                                    <RowProgress 
                                        label="Top Row (Q-P)" 
                                        count={mistakeProfile.topRowErrors} 
                                        percent={mistakeProfile.totalErrors ? Math.round((mistakeProfile.topRowErrors / mistakeProfile.totalErrors) * 100) : 0} 
                                        color="bg-sky-500"
                                    />
                                    <RowProgress 
                                        label="Home Row (A-L)" 
                                        count={mistakeProfile.homeRowErrors} 
                                        percent={mistakeProfile.totalErrors ? Math.round((mistakeProfile.homeRowErrors / mistakeProfile.totalErrors) * 100) : 0} 
                                        color="bg-emerald-500"
                                    />
                                    <RowProgress 
                                        label="Bottom Row (Z-M)" 
                                        count={mistakeProfile.bottomRowErrors} 
                                        percent={mistakeProfile.totalErrors ? Math.round((mistakeProfile.bottomRowErrors / mistakeProfile.totalErrors) * 100) : 0} 
                                        color="bg-purple-500"
                                    />
                                    <RowProgress 
                                        label="Space Bar & Punctuations" 
                                        count={mistakeProfile.spaceErrors} 
                                        percent={mistakeProfile.totalErrors ? Math.round((mistakeProfile.spaceErrors / mistakeProfile.totalErrors) * 100) : 0} 
                                        color="bg-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'advanced' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Speed vs Accuracy Correlation Scatter Plot */}
                        <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-[var(--text-primary)]">Correlation: Speed vs. Precision</h2>
                                <p className="text-xs text-[var(--text-secondary)]">Identifies your optimal velocity threshold where accuracy starts to degrade.</p>
                            </div>
                            <div className="h-80">
                                {scatterData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -25 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary-hover)" />
                                            <XAxis type="number" dataKey="wpm" name="Speed" unit=" WPM" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                                            <YAxis type="number" dataKey="accuracy" name="Accuracy" unit="%" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[70, 100]} />
                                            <Tooltip 
                                                cursor={{ strokeDasharray: '3 3' }}
                                                contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary-hover)', color: 'var(--text-primary)', borderRadius: '0.75rem', fontSize: '13px' }}
                                            />
                                            <Scatter name="Tests" data={scatterData} fill="var(--accent-primary)">
                                                {scatterData.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={entry.accuracy >= 95 ? 'var(--text-correct)' : 'var(--bg-incorrect, #ef5350)'} 
                                                        r={6}
                                                    />
                                                ))}
                                            </Scatter>
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">Not enough scatter coordinate markers...</div>
                                )}
                            </div>
                            <div className="flex items-center gap-6 mt-2 text-xs font-medium justify-center text-[var(--text-secondary)]">
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[var(--text-correct, #4caf50)]" /> High Quality (≥95%)</div>
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[var(--bg-incorrect, #ef5350)]" /> Velocity Fatigue (&lt;95%)</div>
                            </div>
                        </div>

                        {/* Language Diagnostics Side-By-Side Comparison */}
                        <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-sans">Language Performance Profile</h2>
                                <p className="text-xs text-[var(--text-secondary)] mb-6">English QWERTY vs Bengali (Avro/Keyboard layout) metrics comparison.</p>
                                
                                <div className="space-y-6">
                                    {/* English stats */}
                                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--bg-tertiary-hover)]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">English</span>
                                            <span className="text-xs font-mono text-[var(--text-secondary)]">{languageStats.english.count} tests</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-center mt-3">
                                            <div>
                                                <div className="text-[10px] uppercase text-[var(--text-secondary)]">Avg speed</div>
                                                <div className="text-xl font-bold text-[var(--text-primary)]">
                                                    {languageStats.english.count > 0 ? Math.round(languageStats.english.wpmSum / languageStats.english.count) : '-'} <span className="text-xs font-normal">WPM</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase text-[var(--text-secondary)]">Avg precision</div>
                                                <div className="text-xl font-bold text-[var(--text-primary)]">
                                                    {languageStats.english.count > 0 ? Math.round(languageStats.english.accSum / languageStats.english.count) : '-'}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bengali stats */}
                                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--bg-tertiary-hover)]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-correct)]">Bengali</span>
                                            <span className="text-xs font-mono text-[var(--text-secondary)]">{languageStats.bengali.count} tests</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-center mt-3">
                                            <div>
                                                <div className="text-[10px] uppercase text-[var(--text-secondary)]">Avg speed</div>
                                                <div className="text-xl font-bold text-[var(--text-primary)]">
                                                    {languageStats.bengali.count > 0 ? Math.round(languageStats.bengali.wpmSum / languageStats.bengali.count) : '-'} <span className="text-xs font-normal">WPM</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase text-[var(--text-secondary)]">Avg precision</div>
                                                <div className="text-xl font-bold text-[var(--text-primary)]">
                                                    {languageStats.bengali.count > 0 ? Math.round(languageStats.bengali.accSum / languageStats.bengali.count) : '-'}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[11px] text-[var(--text-secondary)] italic mt-4 text-center">
                                Tip: Alternating language modes balances split-brain layout indexing and muscle memory.
                            </p>
                        </div>
                    </div>

                    {/* Mode Breakdown comparison Table */}
                    <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Mode Productivity Analysis</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--bg-tertiary)] text-[var(--text-secondary)] font-medium">
                                        <th className="py-3 px-4">Test Mode Type</th>
                                        <th className="py-3 px-4">Completed Cycles</th>
                                        <th className="py-3 px-4">Average WPM</th>
                                        <th className="py-3 px-4">Average Precision</th>
                                        <th className="py-3 px-4">Efficiency Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modeStats.map((row, idx) => (
                                        <tr key={idx} className="border-b border-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary-hover)] transition-colors">
                                            <td className="py-3 px-4 font-bold text-[var(--text-primary)]">{row.mode}</td>
                                            <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">{row.count} test(s)</td>
                                            <td className="py-3 px-4 font-mono text-[var(--accent-primary)] font-bold">{row.avgWpm} WPM</td>
                                            <td className="py-3 px-4 font-mono text-[var(--text-correct)]">{row.avgAcc}%</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-md ${row.avgWpm >= 80 ? 'bg-purple-500/10 text-purple-400' : row.avgWpm >= 50 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                    {row.avgWpm >= 80 ? 'High Throughput' : row.avgWpm >= 50 ? 'Steady Pacing' : 'Training Focus'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'planner' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Rating Banner */}
                    <div className={`p-6 rounded-xl border flex flex-col md:flex-row items-center gap-6 justify-between transition-all ${typingRating.color}`}>
                        <div className="space-y-1 text-center md:text-left">
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Current Tier Standing</span>
                            <h2 className="text-3xl font-black">{typingRating.title}</h2>
                            <p className="text-sm max-w-xl opacity-90">{typingRating.desc}</p>
                        </div>
                        <div className="px-6 py-3 bg-[var(--bg-primary)] rounded-xl border border-current font-extrabold text-lg min-w-[120px] text-center shadow-inner">
                            {stats.averageWpm} <span className="text-xs font-bold opacity-60">WPM</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Algorithmic Diagnostic Insights */}
                        <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm space-y-4">
                            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <AlertCircle className="text-[var(--accent-primary)]" size={20} />
                                <span>Diagnostics & Insights</span>
                            </h2>

                            <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                                <InsightRow 
                                    condition={mistakeProfile.leftHandErrors > mistakeProfile.rightHandErrors * 1.2}
                                    title="Left Hand Kinetic Inefficiency"
                                    description="Your left-hand keyboard zone represents more than 55% of total errors. Dedicate practice to words featuring left-side letter transitions (A, S, T, E)."
                                />

                                <InsightRow 
                                    condition={mistakeProfile.rightHandErrors > mistakeProfile.leftHandErrors * 1.2}
                                    title="Right Hand Coordination Lag"
                                    description="Your right hand is triggering disproportionate typing faults. Slow down slightly to stabilize pinky and ring finger hits on keys like O, P, L, and M."
                                />

                                <InsightRow 
                                    condition={stats.averageAccuracy < 92}
                                    title="Velocity-Accuracy Mismatch"
                                    description="Your average precision falls below the 92% benchmark. Practice in 'Sudden Death' or strict pacing mode to align visual parsing speed with typing muscle memory."
                                />

                                <InsightRow 
                                    condition={mistakeProfile.topRowErrors > Math.max(mistakeProfile.homeRowErrors, mistakeProfile.bottomRowErrors)}
                                    title="Row Transit Instability: Top Row"
                                    description="You suffer from 'overshoot fatigue' when moving fingers from the home row to the top row. Ensure hands are properly anchored and relaxed to stabilize vertical transit."
                                />

                                <InsightRow 
                                    condition={mistakeProfile.bottomRowErrors > Math.max(mistakeProfile.homeRowErrors, mistakeProfile.topRowErrors)}
                                    title="Row Transit Instability: Bottom Row"
                                    description="Mistakes are heavily biased towards the bottom row (Z, X, C, V). Work on curling fingers comfortably during downward strokes instead of shifting whole hands."
                                />

                                <InsightRow 
                                    condition={stats.consistency >= 90 && tests.length > 5}
                                    title="Pristine Metronome Rhythm"
                                    description="Superb consistency rating! You maintain an incredibly steady speed stream. This cadence reduces wrist fatigue and establishes great typing endurance."
                                />

                                <InsightRow 
                                    condition={tests.length > 0}
                                    title="Muscle Memory Consolidation"
                                    description="Your typing metrics indicate your finger placement is stabilizing. Daily practice sessions of even 3-5 minutes help solidify these neural connections."
                                />
                            </div>
                        </div>

                        {/* Interactive custom practice text generator */}
                        <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2 mb-2">
                                    <Sparkles className="text-[var(--accent-primary)]" size={20} />
                                    <span>Personalized Practice Plan</span>
                                </h2>
                                <p className="text-xs text-[var(--text-secondary)] mb-6">
                                    Calculates your weakest keystrokes and generates custom-constructed words with those target letter distributions for real-time corrective training.
                                </p>

                                {customPracticeText ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--bg-tertiary-hover)] relative">
                                            <p className="text-base font-mono leading-relaxed text-[var(--text-primary)] break-words pr-8 select-all">
                                                {customPracticeText}
                                            </p>
                                            <button 
                                                onClick={handleCopy}
                                                className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
                                                title="Copy customized lesson text"
                                            >
                                                {copied ? <Check className="text-[var(--text-correct)]" size={18} /> : <Clipboard size={18} />}
                                            </button>
                                        </div>
                                        
                                        {copied && (
                                            <div className="text-xs text-[var(--text-correct)] font-bold animate-pulse flex items-center gap-1">
                                                <Check size={14} />
                                                <span>Custom practice text copied! Go to Arena &gt; Custom to paste and train.</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleGeneratePractice}
                                                className="flex-1 py-2 text-xs font-bold border border-[var(--bg-tertiary)] rounded-xl hover:bg-[var(--bg-tertiary-hover)] text-[var(--text-primary)] transition-colors"
                                            >
                                                Regenerate Variations
                                            </button>
                                            <Link 
                                                to="/" 
                                                className="flex-[1.5] py-2 text-xs font-bold bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-xl text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                                            >
                                                <span>Launch in Arena</span>
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 space-y-4 border border-dashed border-[var(--bg-tertiary)] rounded-xl bg-[var(--bg-tertiary)]/10">
                                        <p className="text-sm text-[var(--text-secondary)]">No custom plan loaded. Ready to compile dynamic text targeting your mistyped keys!</p>
                                        <button 
                                            onClick={handleGeneratePractice}
                                            className="px-5 py-2.5 bg-[var(--accent-primary)] text-[var(--bg-primary)] text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
                                        >
                                            Construct My Typing Plan
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-[var(--bg-tertiary)] pt-4 mt-6">
                                <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider mb-2">Practice Methodology</h3>
                                <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc list-inside">
                                    <li>Keep wrists neutral, do not rest them heavily on desk surfaces.</li>
                                    <li>Focus entirely on accuracy rather than rushing for higher WPM.</li>
                                    <li>Practice for 10-15 minutes daily instead of 2 hours once a week.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, unit, tooltip }: { icon: React.ReactNode, label: string, value: string | number, unit?: string, tooltip?: string }) {
    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-4 rounded-xl flex flex-col gap-1.5 relative group shadow-sm hover:border-[var(--bg-tertiary-hover)] transition-all">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-semibold">
                {icon}
                <span>{label}</span>
            </div>
            <div className="text-3xl font-black text-[var(--accent-primary)] tracking-tight">
                {value} {unit && <span className="text-sm font-medium text-[var(--text-secondary)]">{unit}</span>}
            </div>
            {tooltip && (
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[var(--bg-tertiary)] border border-[var(--bg-tertiary-hover)] text-[var(--text-primary)] text-[10px] p-2 rounded-lg max-w-[200px] shadow-md z-10 font-sans leading-normal">
                    {tooltip}
                </div>
            )}
        </div>
    );
}

function RowProgress({ label, count, percent, color }: { label: string; count: number; percent: number; color: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
                <span className="text-[var(--text-primary)]">{label}</span>
                <span className="text-[var(--text-secondary)]">{count} misses <span className="font-mono text-xs">({percent}%)</span></span>
            </div>
            <div className="h-2 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div 
                    style={{ width: `${percent}%` }}
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                />
            </div>
        </div>
    );
}

function InsightRow({ condition, title, description }: { condition: boolean; title: string; description: string }) {
    if (!condition) return null;
    return (
        <div className="p-3 bg-[var(--bg-tertiary)] border-l-4 border-[var(--accent-primary)] rounded-r-xl space-y-1">
            <h4 className="text-xs font-bold text-[var(--text-primary)]">{title}</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
        </div>
    );
}

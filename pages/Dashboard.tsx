import React, { useMemo } from 'react';
import { useHistoryStore } from '../store/useHistoryStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Target, Zap, Clock, Activity, Flame } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
    const { tests, mistakeHeatmap, totalPracticeTime, totalWordsTyped, currentStreak, longestStreak } = useHistoryStore();

    const chartData = useMemo(() => {
        return [...tests].reverse().map((test, index) => ({
            index: index + 1,
            wpm: test.wpm,
            accuracy: test.accuracy,
            date: format(test.date, 'MMM d')
        }));
    }, [tests]);

    const heatmapData = useMemo(() => {
        return Object.entries(mistakeHeatmap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([char, count]) => ({
                char: char === ' ' ? 'Space' : char,
                count
            }));
    }, [mistakeHeatmap]);

    const averageWpm = tests.length ? Math.round(tests.reduce((acc, t) => acc + t.wpm, 0) / tests.length) : 0;
    const averageAccuracy = tests.length ? (tests.reduce((acc, t) => acc + t.accuracy, 0) / tests.length).toFixed(1) : 0;

    return (
        <div className="max-w-7xl mx-auto w-full px-4 animate-fade-in space-y-8">
            <h1 className="text-3xl font-bold text-[var(--accent-primary)] tracking-tight">Analytics Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard icon={<Activity />} label="Total Tests" value={tests.length} />
                <StatCard icon={<Zap />} label="Avg WPM" value={averageWpm} />
                <StatCard icon={<Target />} label="Avg Acc." value={`${averageAccuracy}%`} />
                <StatCard icon={<Clock />} label="Time (min)" value={Math.round(totalPracticeTime / 60)} />
                <StatCard icon={<Flame className="text-orange-500" />} label="Streak" value={currentStreak} unit="Days" />
                <StatCard icon={<Flame className="text-gray-500" />} label="Best Streak" value={longestStreak} unit="Days" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">Performance Trend</h2>
                    <div className="h-80">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary-hover)" vertical={false} />
                                    <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left" stroke="var(--accent-primary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" stroke="var(--text-correct)" tick={{ fill: 'var(--text-secondary)' }} domain={['auto', 100]} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary-hover)', color: 'var(--text-primary)', borderRadius: '0.5rem' }}
                                    />
                                    <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="var(--accent-primary)" strokeWidth={3} dot={false} name="WPM" />
                                    <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="var(--text-correct)" strokeWidth={3} dot={false} name="Accuracy %" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">Not enough data to display chart.</div>
                        )}
                    </div>
                </div>

                <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm flex flex-col">
                    <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">Top Mistyped Keys</h2>
                    <div className="flex-1 min-h-[300px]">
                        {heatmapData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={heatmapData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary-hover)" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="char" type="category" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-primary)', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: 'var(--bg-tertiary)' }}
                                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary-hover)', color: 'var(--text-primary)', borderRadius: '0.5rem' }}
                                    />
                                    <Bar dataKey="count" fill="var(--bg-incorrect)" radius={[0, 4, 4, 0]} barSize={20} name="Misses" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">No mistakes recorded yet! Great job.</div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Typing Consistency Summary</h2>
                <p className="text-[var(--text-secondary)]">
                    You have typed a total of <strong className="text-[var(--text-primary)]">{totalWordsTyped.toLocaleString()}</strong> words across <strong className="text-[var(--text-primary)]">{tests.length}</strong> tests. 
                    {tests.length > 10 && averageWpm > 0 && ` Your average speed is stabilizing around ${averageWpm} WPM.`}
                </p>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string | number, unit?: string }) {
    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-4 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium">
                {icon}
                <span>{label}</span>
            </div>
            <div className="text-3xl font-black text-[var(--accent-primary)]">
                {value} {unit && <span className="text-base font-medium text-[var(--text-secondary)]">{unit}</span>}
            </div>
        </div>
    );
}

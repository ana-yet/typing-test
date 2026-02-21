
export enum TypePhase {
    Idle = 'idle',
    Typing = 'typing',
    Finished = 'finished',
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Language = 'english' | 'bengali';
export type TestMode = 'passages' | 'custom' | 'timed' | 'sudden-death';

export interface WpmDataPoint {
    time: number;
    wpm: number;
    accuracy: number;
}

export interface TestResults {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    errors: number;
    time: number;
    wordCount: number;
    history: WpmDataPoint[];
    missedChars: Record<string, number>;
    slowestWords: { word: string; time: number }[];
}

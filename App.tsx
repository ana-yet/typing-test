
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateTypingText } from './services/geminiService';
import { translate as translateToAvro } from './services/avroLayout';
import StatsCard from './components/StatsCard';
import Spinner from './components/Spinner';
import AvroKeyboard from './components/AvroKeyboard';
import { TypePhase } from './types';

const themes = {
  dark: {
    '--bg-primary': '#0f172a', // slate-900
    '--bg-secondary': '#1e293b', // slate-800
    '--bg-tertiary': '#334155', // slate-700
    '--bg-tertiary-hover': '#475569', // slate-600
    '--text-primary': '#f1f5f9', // slate-100
    '--text-primary-inverted': '#ffffff',
    '--text-secondary': '#94a3b8', // slate-400
    '--text-muted': '#64748b', // slate-500
    '--accent-primary': '#38bdf8', // sky-400
    '--accent-secondary': '#0ea5e9', // sky-600
    '--accent-secondary-hover': '#38bdf8', // sky-400
    '--text-correct': '#4ade80', // green-400
    '--bg-incorrect': '#ef4444', // red-500
    '--text-incorrect': '#ffffff',
    '--border-key': '#0f172a', // slate-900
    '--accent-primary-faded': '#7dd3fc', // sky-300
    '--cursor-color': '#38bdf8', // sky-400
  },
  light: {
    '--bg-primary': '#f1f5f9', // slate-100
    '--bg-secondary': '#ffffff', // white
    '--bg-tertiary': '#e2e8f0', // slate-200
    '--bg-tertiary-hover': '#cbd5e1', // slate-300
    '--text-primary': '#0f172a', // slate-900
    '--text-primary-inverted': '#ffffff',
    '--text-secondary': '#475569', // slate-600
    '--text-muted': '#94a3b8', // slate-400
    '--accent-primary': '#0ea5e9', // sky-600
    '--accent-secondary': '#0284c7', // sky-700
    '--accent-secondary-hover': '#0369a1', // sky-800
    '--text-correct': '#16a34a', // green-600
    '--bg-incorrect': '#fecaca', // red-200
    '--text-incorrect': '#b91c1c', // red-800
    '--border-key': '#f1f5f9', // slate-100
    '--accent-primary-faded': '#38bdf8', // sky-400
    '--cursor-color': '#0ea5e9', // sky-600
  },
  matrix: {
    '--bg-primary': '#000000', // black
    '--bg-secondary': '#0D0208', // very dark
    '--bg-tertiary': '#003B00', // dark green
    '--bg-tertiary-hover': '#005a00',
    '--text-primary': '#00FF00', // green
    '--text-primary-inverted': '#000000',
    '--text-secondary': '#00b300', // lighter green
    '--text-muted': '#008000', // medium green
    '--accent-primary': '#39FF14', // neon green
    '--accent-secondary': '#00FF00', // green
    '--accent-secondary-hover': '#39FF14', // neon green
    '--text-correct': '#39FF14', // neon green
    '--bg-incorrect': '#FF0000', // red
    '--text-incorrect': '#000000',
    '--border-key': '#000000', // black
    '--accent-primary-faded': '#00FF00', // green
    '--cursor-color': '#39FF14', // neon green
  },
};

const App: React.FC = () => {
    const [phase, setPhase] = useState<TypePhase>(TypePhase.Idle);
    const [textToType, setTextToType] = useState<string>('');
    const [userInput, setUserInput] = useState<string>(''); // This will hold the Bengali text
    const [rawInput, setRawInput] = useState<string>(''); // This will hold the raw English input
    const [loading, setLoading] = useState<boolean>(true);
    
    const [language, setLanguage] = useState('english');
    const [difficulty, setDifficulty] = useState('medium');
    const [mode, setMode] = useState<'standard' | 'endurance' | 'accuracy'>('standard');
    const [duration, setDuration] = useState<number>(60);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [activeKey, setActiveKey] = useState<string>('');
    const [showAvroChart, setShowAvroChart] = useState<boolean>(false);
    const [theme, setTheme] = useState<string>('dark');
    const [errorIndex, setErrorIndex] = useState<number | null>(null);

    const startTime = useRef<number | null>(null);
    const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [wpm, setWpm] = useState<number>(0);
    const [accuracy, setAccuracy] = useState<number>(100);
    const [errors, setErrors] = useState<number>(0);
    const [wordCount, setWordCount] = useState<number>(0);

    // State for personal best scores
    const [bestWpm, setBestWpm] = useState<number>(0);
    const [bestAccuracy, setBestAccuracy] = useState<number>(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const keypressSound = useRef<HTMLAudioElement | null>(null);
    const errorSound = useRef<HTMLAudioElement | null>(null);
    const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    useEffect(() => {
        keypressSound.current = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
        errorSound.current = new Audio("data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQYYAAAAAP//AAAA//8A//8A/v/9AP7//QD+/wEA/v8A/v/9AP8A");
    }, []);

    // Load saved settings from localStorage on initial render
    useEffect(() => {
        const storedBestWpm = localStorage.getItem('bestWpm');
        const storedBestAccuracy = localStorage.getItem('bestAccuracy');
        const storedTheme = localStorage.getItem('typingTheme');

        if (storedBestWpm) {
            setBestWpm(parseInt(storedBestWpm, 10) || 0);
        }
        if (storedBestAccuracy) {
            setBestAccuracy(parseFloat(storedBestAccuracy) || 0);
        }
        if (storedTheme && themes[storedTheme]) {
            setTheme(storedTheme);
        }
    }, []);

    // Apply theme changes
    useEffect(() => {
        const currentTheme = themes[theme];
        const root = document.documentElement;
        Object.keys(currentTheme).forEach(key => {
            root.style.setProperty(key, currentTheme[key]);
        });
        localStorage.setItem('typingTheme', theme);
    }, [theme]);
    
    useEffect(() => {
        const handleWindowKeyDown = (e: KeyboardEvent) => setActiveKey(e.key);
        const handleWindowKeyUp = () => setActiveKey('');
        window.addEventListener('keydown', handleWindowKeyDown);
        window.addEventListener('keyup', handleWindowKeyUp);
        return () => {
            window.removeEventListener('keydown', handleWindowKeyDown);
            window.removeEventListener('keyup', handleWindowKeyUp);
        };
    }, []);

    const resetState = useCallback(() => {
        setPhase(TypePhase.Idle);
        setUserInput('');
        setRawInput('');
        setElapsedTime(0);
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        setWordCount(0);
        startTime.current = null;
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }
    }, []);

    const fetchText = useCallback(() => {
        setLoading(true);
        resetState();
        try {
            const newText = generateTypingText(language, difficulty, mode);
            setTextToType(newText);
        } catch (error) {
            console.error("Failed to generate text:", error);
            setTextToType("The quick brown fox jumps over the lazy dog. Please try refreshing the page.");
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [language, difficulty, mode, resetState]);

    useEffect(() => {
        fetchText();
    }, [fetchText]);

    const handleRestart = () => {
        fetchText();
    };
    
    const finishTest = useCallback(() => {
        if (phase !== TypePhase.Typing) return;
    
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }
    
        setPhase(TypePhase.Finished);
    
        if (startTime.current) {
            const finalTime = mode === 'endurance' 
                ? (Date.now() - startTime.current) / 1000
                : Math.min((Date.now() - startTime.current) / 1000, duration);
            setElapsedTime(finalTime);
        }
    }, [phase, duration, mode]);

    const playSound = () => {
        if (soundEnabled && keypressSound.current) {
            keypressSound.current.currentTime = 0;
            keypressSound.current.play().catch(e => console.error("Error playing sound:", e));
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key.length === 1 || e.key === 'Backspace') {
            playSound();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (phase === TypePhase.Finished) return;

        if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
        }

        const playErrorFeedback = (index: number) => {
            if (soundEnabled && errorSound.current) {
                errorSound.current.currentTime = 0;
                errorSound.current.play().catch(err => console.error("Error playing sound:", err));
            }
            setErrorIndex(index);
            errorTimeoutRef.current = setTimeout(() => setErrorIndex(null), 300);
        };
        
        if (mode === 'accuracy') {
            const prospectiveText = language === 'bengali' ? translateToAvro(value) : value;
            if (!textToType.startsWith(prospectiveText)) {
                playErrorFeedback(prospectiveText.length - 1);
                return;
            }
        }

        if (phase === TypePhase.Idle && value.length > 0) {
            setPhase(TypePhase.Typing);
            startTime.current = Date.now();
            timerInterval.current = setInterval(() => {
                if(startTime.current) {
                    const currentElapsedTime = (Date.now() - startTime.current) / 1000;
                    if (mode !== 'endurance' && currentElapsedTime >= duration) {
                        finishTest();
                    } else {
                       setElapsedTime(currentElapsedTime);
                    }
                }
            }, 500);
        }
        
        // Check for new errors on character addition
        if (value.length > rawInput.length) {
            const currentText = language === 'bengali' ? translateToAvro(value) : value;
            const lastTypedCharIndex = currentText.length - 1;
            
            if (lastTypedCharIndex < textToType.length && currentText[lastTypedCharIndex] !== textToType[lastTypedCharIndex]) {
                playErrorFeedback(lastTypedCharIndex);
            } else {
                setErrorIndex(null);
            }
        } else {
            // Character deleted
            setErrorIndex(null);
        }
        
        setRawInput(value);
    };

    useEffect(() => {
        if (phase !== TypePhase.Typing) return;

        let currentText = rawInput;
        if (language === 'bengali') {
            const translated = translateToAvro(rawInput);
            setUserInput(translated);
            currentText = translated;
        } else {
            setUserInput(rawInput);
        }

        if (currentText.length >= textToType.length) {
            finishTest();
        }
    }, [rawInput, language, textToType.length, phase, finishTest]);

    useEffect(() => {
        if (phase === TypePhase.Typing || phase === TypePhase.Finished) {
            const typedChars = userInput.length;
            let currentErrors = 0;
            
            for (let i = 0; i < typedChars; i++) {
                if (userInput[i] !== textToType[i]) {
                    currentErrors++;
                }
            }
            setErrors(currentErrors);

            const correctChars = typedChars - currentErrors;
            const currentAccuracy = typedChars > 0 ? (correctChars / typedChars) * 100 : 100;
            setAccuracy(currentAccuracy);
            
            const words = userInput.trim() === '' ? [] : userInput.trim().split(/\s+/);
            setWordCount(words.length);

            const effectiveTime = phase === TypePhase.Finished ? Math.max(elapsedTime, 1) : elapsedTime;
            if (effectiveTime > 0) {
                const wordsTyped = correctChars / 5;
                const minutes = effectiveTime / 60;
                const currentWpm = Math.round(wordsTyped / minutes);
                setWpm(currentWpm);
            }
        }
    }, [userInput, elapsedTime, textToType, phase]);
    
    useEffect(() => {
        if (phase === TypePhase.Finished) {
            if (wpm > bestWpm) {
                setBestWpm(wpm);
                localStorage.setItem('bestWpm', wpm.toString());
            }
            if (accuracy > bestAccuracy) {
                setBestAccuracy(accuracy);
                localStorage.setItem('bestAccuracy', accuracy.toString());
            }
        }
    }, [phase, wpm, accuracy, bestWpm, bestAccuracy]);

    const focusInput = () => {
      inputRef.current?.focus();
    }
    
    let timeValue: string | number = 0;
    let timeUnit: string | undefined = 's';

    if (mode === 'endurance') {
        switch (phase) {
            case TypePhase.Idle:
                timeValue = '∞';
                timeUnit = undefined;
                break;
            case TypePhase.Typing:
                timeValue = Math.floor(elapsedTime);
                break;
            case TypePhase.Finished:
                timeValue = elapsedTime.toFixed(0);
                break;
        }
    } else { // Standard or Accuracy
        switch (phase) {
            case TypePhase.Idle:
                timeValue = duration;
                break;
            case TypePhase.Typing:
                timeValue = Math.max(0, duration - Math.floor(elapsedTime));
                break;
            case TypePhase.Finished:
                timeValue = elapsedTime.toFixed(0);
                break;
        }
    }


    const OptionButton: React.FC<{ value: string; state: string; onClick: (value: string) => void; children: React.ReactNode; disabled?: boolean; }> = 
        ({ value, state, onClick, children, disabled }) => (
        <button 
            onClick={() => onClick(value)}
            className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${state === value ? 'bg-[var(--accent-secondary)] text-[var(--text-primary-inverted)]' : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary-hover)]'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
        >
            {children}
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-mono transition-colors duration-300">
            <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-[var(--accent-primary)] mb-4 text-center">Typing Speed Test</h1>
                <p className="text-[var(--text-secondary)] mb-6 text-center">Type the text below as fast and accurately as you can.</p>

                <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 mb-8">
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--text-secondary)]">Language:</span>
                        <div className="flex gap-2 rounded-lg p-1 bg-[var(--bg-secondary)]">
                            <OptionButton value="english" state={language} onClick={setLanguage} disabled={phase === TypePhase.Typing}>English</OptionButton>
                            <OptionButton value="bengali" state={language} onClick={setLanguage} disabled={phase === TypePhase.Typing}>Bengali</OptionButton>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="text-[var(--text-secondary)]">Difficulty:</span>
                        <div className="flex gap-2 rounded-lg p-1 bg-[var(--bg-secondary)]">
                           <OptionButton value="easy" state={difficulty} onClick={setDifficulty} disabled={phase === TypePhase.Typing}>Easy</OptionButton>
                           <OptionButton value="medium" state={difficulty} onClick={setDifficulty} disabled={phase === TypePhase.Typing}>Medium</OptionButton>
                           <OptionButton value="hard" state={difficulty} onClick={setDifficulty} disabled={phase === TypePhase.Typing}>Hard</OptionButton>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--text-secondary)]">Mode:</span>
                        <div className="flex gap-2 rounded-lg p-1 bg-[var(--bg-secondary)]">
                            <OptionButton value="standard" state={mode} onClick={setMode} disabled={phase === TypePhase.Typing}>Standard</OptionButton>
                            <OptionButton value="endurance" state={mode} onClick={setMode} disabled={phase === TypePhase.Typing}>Endurance</OptionButton>
                            <OptionButton value="accuracy" state={mode} onClick={setMode} disabled={phase === TypePhase.Typing}>Accuracy</OptionButton>
                        </div>
                    </div>
                    {mode !== 'endurance' && (
                        <div className="flex items-center gap-2">
                            <span className="text-[var(--text-secondary)]">Duration (s):</span>
                            <input
                                type="number"
                                value={duration}
                                min="10"
                                step="10"
                                onChange={(e) => {
                                    if (phase === TypePhase.Typing) return;
                                    const newDuration = parseInt(e.target.value, 10);
                                    if (!isNaN(newDuration) && newDuration > 0) {
                                        setDuration(newDuration);
                                        resetState();
                                    }
                                }}
                                className="w-24 bg-[var(--bg-secondary)] rounded-lg p-2 text-center text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={phase === TypePhase.Typing}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-8">
                    <StatsCard label="WPM" value={wpm} />
                    <StatsCard label="Accuracy" value={accuracy.toFixed(0)} unit="%" />
                    <StatsCard label="Time" value={timeValue} unit={timeUnit} />
                    <StatsCard label="Errors" value={errors} />
                    <StatsCard label="Word Count" value={wordCount} />
                    <StatsCard label="Best WPM" value={bestWpm} />
                    <StatsCard label="Best Accuracy" value={bestAccuracy.toFixed(0)} unit="%" />
                </div>
                
                 <div className="flex items-center gap-2 mb-8">
                    <span className="text-[var(--text-secondary)]">Theme:</span>
                    <div className="flex gap-3 rounded-lg p-1 bg-[var(--bg-secondary)]">
                        {Object.entries(themes).map(([themeKey, themeColors]) => (
                            <button
                                key={themeKey}
                                title={themeKey}
                                aria-label={`Select ${themeKey} theme`}
                                onClick={() => setTheme(themeKey)}
                                className={`w-8 h-6 rounded flex overflow-hidden border-2 transition-all ${
                                    theme === themeKey ? 'border-[var(--accent-primary)] scale-110' : 'border-transparent hover:border-[var(--text-muted)]'
                                }`}
                                disabled={phase === TypePhase.Typing}
                            >
                                <div style={{ backgroundColor: themeColors['--bg-primary'] }} className="w-1/2 h-full"></div>
                                <div style={{ backgroundColor: themeColors['--accent-primary'] }} className="w-1/2 h-full"></div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full bg-[var(--bg-secondary)] p-6 rounded-lg shadow-lg relative" onClick={focusInput}>
                    {loading ? (
                        <div className="h-48 flex items-center justify-center">
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <p className={`text-xl sm:text-2xl leading-relaxed tracking-wider text-[var(--text-secondary)] select-none break-words ${language === 'bengali' ? 'font-serif' : ''}`}>
                                {textToType.split('').map((char, index) => {
                                    let charClassName;
                                    const isCursor = index === userInput.length && phase !== TypePhase.Finished;

                                    if (index < userInput.length) {
                                        charClassName = char === userInput[index] 
                                            ? 'text-[var(--text-correct)]' 
                                            : 'bg-[var(--bg-incorrect)] text-[var(--text-incorrect)] rounded-sm';
                                    } else {
                                        charClassName = 'text-[var(--text-muted)]';
                                    }

                                    if (index === errorIndex) {
                                        charClassName = 'bg-[var(--bg-incorrect)] text-[var(--text-incorrect)] rounded-sm error-flash';
                                    }
                                    
                                    const cursorClassName = isCursor ? (char === ' ' ? 'cursor-blink-space' : 'cursor-blink') : '';

                                    return (
                                        <span key={index} className={`${charClassName} ${cursorClassName}`}>
                                            {char === ' ' ? '\u00A0' : char}
                                        </span>
                                    );
                                })}
                            </p>
                            <input
                                ref={inputRef}
                                type="text"
                                value={rawInput}
                                onKeyDown={handleInputKeyDown}
                                onChange={handleInput}
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-text"
                                disabled={phase === TypePhase.Finished || loading}
                                autoFocus
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                            />
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4 mt-8">
                    <button 
                        onClick={handleRestart} 
                        className="px-6 py-3 bg-[var(--accent-secondary)] text-[var(--text-primary-inverted)] font-bold rounded-lg hover:bg-[var(--accent-secondary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
                    >
                        {phase === TypePhase.Finished ? 'New Test' : 'Restart'}
                    </button>
                    {language === 'bengali' && (
                         <button 
                            onClick={() => setShowAvroChart(!showAvroChart)}
                            aria-label="Show Avro Chart"
                            className="p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary-hover)] transition-colors text-[var(--text-primary)]"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        </button>
                    )}
                    <button 
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
                        className="p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary-hover)] transition-colors text-[var(--text-primary)]"
                    >
                        {soundEnabled ? (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 15.858a5 5 0 010-7.072m2.829 9.9a9 9 0 010-12.728M12 6v12" /></svg>
                        ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15.586a5 5 0 010-7.072m9.9 7.072a5 5 0 000-7.072m-4.243 4.242L12 12m0 0l-1.414-1.414m1.414 1.414L13.414 12m-1.414 0l-1.414 1.414m1.414-1.414L13.414 13.414M12 6v12" /></svg>
                        )}
                    </button>
                </div>
                
                {language === 'bengali' && showAvroChart && (
                    <AvroKeyboard 
                        activeKey={activeKey} 
                        onClose={() => setShowAvroChart(false)}
                    />
                )}

            </main>
        </div>
    );
};

export default App;
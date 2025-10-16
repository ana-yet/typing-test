import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateTypingText } from './services/geminiService';
import { translate as translateToAvro } from './services/avroLayout';
import StatsCard from './components/StatsCard';
import Spinner from './components/Spinner';
import AvroKeyboard from './components/AvroKeyboard';
import { TypePhase } from './types';

const App: React.FC = () => {
    const [phase, setPhase] = useState<TypePhase>(TypePhase.Idle);
    const [textToType, setTextToType] = useState<string>('');
    const [userInput, setUserInput] = useState<string>(''); // This will hold the Bengali text
    const [rawInput, setRawInput] = useState<string>(''); // This will hold the raw English input
    const [loading, setLoading] = useState<boolean>(true);
    
    const [language, setLanguage] = useState('english');
    const [difficulty, setDifficulty] = useState('medium');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [activeKey, setActiveKey] = useState<string>('');
    const [showAvroChart, setShowAvroChart] = useState<boolean>(false);

    const startTime = useRef<number | null>(null);
    const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [wpm, setWpm] = useState<number>(0);
    const [accuracy, setAccuracy] = useState<number>(100);
    const [errors, setErrors] = useState<number>(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const keypressSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        keypressSound.current = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
    }, []);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => setActiveKey(e.key);
        const handleKeyUp = () => setActiveKey('');
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const fetchText = useCallback(async () => {
        setLoading(true);
        resetState();
        try {
            const newText = await generateTypingText(language, difficulty);
            setTextToType(newText);
        } catch (error) {
            console.error("Failed to fetch text:", error);
            setTextToType("The quick brown fox jumps over the lazy dog. Please try refreshing the page.");
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    }, [language, difficulty]);

    useEffect(() => {
        fetchText();
    }, [fetchText]);

    const resetState = () => {
        setPhase(TypePhase.Idle);
        setUserInput('');
        setRawInput('');
        setElapsedTime(0);
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        startTime.current = null;
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }
    };

    const handleRestart = () => {
        fetchText();
    };

    const playSound = () => {
        if (soundEnabled && keypressSound.current) {
            keypressSound.current.currentTime = 0;
            keypressSound.current.play().catch(e => console.error("Error playing sound:", e));
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (phase === TypePhase.Finished) return;
        
        playSound();

        if (phase === TypePhase.Idle && value.length > 0) {
            setPhase(TypePhase.Typing);
            startTime.current = Date.now();
            timerInterval.current = setInterval(() => {
                const now = Date.now();
                if(startTime.current) {
                    setElapsedTime((now - startTime.current) / 1000);
                }
            }, 1000);
        }
        
        setRawInput(value);
    };

    useEffect(() => {
        if (language === 'bengali') {
            const translated = translateToAvro(rawInput);
            setUserInput(translated);
            if (translated.length >= textToType.length && phase === TypePhase.Typing) {
                 setPhase(TypePhase.Finished);
                 if (timerInterval.current) {
                     clearInterval(timerInterval.current);
                 }
            }
        } else {
            setUserInput(rawInput);
            if (rawInput.length >= textToType.length && phase === TypePhase.Typing) {
                 setPhase(TypePhase.Finished);
                 if (timerInterval.current) {
                     clearInterval(timerInterval.current);
                 }
            }
        }
    }, [rawInput, language, textToType.length, phase]);

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

            if (elapsedTime > 0) {
                const wordsTyped = correctChars / 5; // Standard is 5 chars per word
                const minutes = elapsedTime / 60;
                const currentWpm = Math.round(wordsTyped / minutes);
                setWpm(currentWpm);
            }
        }
    }, [userInput, elapsedTime, textToType, phase]);
    
    const focusInput = () => {
      inputRef.current?.focus();
    }

    const OptionButton: React.FC<{ value: string; state: string; onClick: (value: string) => void; children: React.ReactNode }> = 
        ({ value, state, onClick, children }) => (
        <button 
            onClick={() => onClick(value)}
            className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${state === value ? 'bg-sky-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-mono">
            <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 mb-4 text-center">Typing Speed Test</h1>
                <p className="text-slate-400 mb-6 text-center">Type the text below as fast and accurately as you can.</p>

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-8">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400">Language:</span>
                        <div className="flex gap-2 rounded-lg p-1 bg-slate-800">
                            <OptionButton value="english" state={language} onClick={setLanguage}>English</OptionButton>
                            <OptionButton value="bengali" state={language} onClick={setLanguage}>Bengali</OptionButton>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="text-slate-400">Difficulty:</span>
                        <div className="flex gap-2 rounded-lg p-1 bg-slate-800">
                           <OptionButton value="easy" state={difficulty} onClick={setDifficulty}>Easy</OptionButton>
                           <OptionButton value="medium" state={difficulty} onClick={setDifficulty}>Medium</OptionButton>
                           <OptionButton value="hard" state={difficulty} onClick={setDifficulty}>Hard</OptionButton>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mb-8">
                    <StatsCard label="WPM" value={wpm} />
                    <StatsCard label="Accuracy" value={accuracy.toFixed(0)} unit="%" />
                    <StatsCard label="Errors" value={errors} />
                    <StatsCard label="Time" value={elapsedTime.toFixed(0)} unit="s" />
                </div>

                <div className="w-full bg-slate-800 p-6 rounded-lg shadow-lg relative" onClick={focusInput}>
                    {loading ? (
                        <div className="h-48 flex items-center justify-center">
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <p className={`text-xl sm:text-2xl leading-relaxed tracking-wider text-slate-400 select-none break-words ${language === 'bengali' ? 'font-serif' : ''}`}>
                                {textToType.split('').map((char, index) => {
                                    let charClassName;
                                    const isCursor = index === userInput.length && phase !== TypePhase.Finished;

                                    if (index < userInput.length) {
                                        charClassName = char === userInput[index] ? 'text-green-400' : 'text-red-400 bg-red-900/50 rounded-sm';
                                    } else {
                                        charClassName = 'text-slate-500';
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
                        className="px-6 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        {phase === TypePhase.Finished ? 'Try Again' : 'Restart'}
                    </button>
                    {language === 'bengali' && (
                         <button 
                            onClick={() => setShowAvroChart(!showAvroChart)}
                            aria-label="Show Avro Chart"
                            className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-white"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        </button>
                    )}
                    <button 
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
                        className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-white"
                    >
                        {soundEnabled ? (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 15.858a5 5 0 010-7.072m2.829 9.9a9 9 0 010-12.728M12 6v12" /></svg>
                        ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15.586a5 5 0 010-7.072m9.9 7.072a5 5 0 000-7.072m-4.243 4.242L12 12m0 0l-1.414-1.414m1.414 1.414L13.414 12m-1.414 0l-1.414 1.414m1.414-1.414L13.414 13.414M12 6v12" /></svg>
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
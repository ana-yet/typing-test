import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Users, Copy, Check } from 'lucide-react';

interface MultiplayerPanelProps {
    roomId: string;
    setRoomId: (id: string) => void;
    progress: number;
    wpm: number;
    playerName: string;
}

interface Player {
    id: string;
    progress: number;
    wpm: number;
    username: string;
}

const MultiplayerPanel: React.FC<MultiplayerPanelProps> = ({ roomId, setRoomId, progress, wpm, playerName }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [inputRoomId, setInputRoomId] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Connect to the backend server
        const newSocket = io(window.location.origin);
        setSocket(newSocket);

        newSocket.on('room-update', (roomData: { players: Player[] }) => {
            setPlayers(roomData.players);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket && roomId) {
            socket.emit('join-room', { roomId, username: playerName });
        }
    }, [socket, roomId, playerName]);

    useEffect(() => {
        if (socket && roomId) {
            socket.emit('update-progress', { roomId, progress, wpm });
        }
    }, [progress, wpm, socket, roomId]);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputRoomId.trim()) {
            setRoomId(inputRoomId.trim());
        }
    };

    const handleCreate = () => {
        const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomId(newRoomId);
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!roomId) {
        return (
            <div className="w-full max-w-2xl mx-auto bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--bg-tertiary)] mb-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6 text-[var(--accent-primary)]">
                    <Users size={24} />
                    <h2 className="text-xl font-bold">Multiplayer Race</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={handleCreate}
                        className="flex-1 py-3 bg-[var(--accent-secondary)] text-[var(--text-primary-inverted)] rounded-lg font-bold hover:bg-[var(--accent-secondary-hover)] transition-colors"
                    >
                        Create Private Room
                    </button>
                    <div className="flex-1 flex items-center gap-2">
                        <span className="text-[var(--text-secondary)]">or</span>
                        <form onSubmit={handleJoin} className="flex-1 flex gap-2">
                            <input 
                                type="text" 
                                value={inputRoomId}
                                onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                                placeholder="Enter Room Code"
                                className="flex-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-4 py-2 rounded-lg border border-[var(--bg-tertiary-hover)] focus:outline-none focus:border-[var(--accent-primary)] uppercase"
                                maxLength={6}
                            />
                            <button 
                                type="submit"
                                disabled={!inputRoomId.trim()}
                                className="px-4 py-2 bg-[var(--bg-tertiary-hover)] text-[var(--text-primary)] rounded-lg font-bold hover:bg-[var(--accent-primary)] hover:text-[var(--text-primary-inverted)] transition-colors disabled:opacity-50"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--bg-tertiary)] mb-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3 text-[var(--accent-primary)]">
                    <Users size={24} />
                    <h2 className="text-xl font-bold">Race in Progress</h2>
                </div>
                <div className="flex items-center gap-3 bg-[var(--bg-tertiary)] px-4 py-2 rounded-lg">
                    <span className="text-sm text-[var(--text-secondary)]">Room Code:</span>
                    <span className="font-mono font-bold text-[var(--text-primary)] tracking-widest">{roomId}</span>
                    <button 
                        onClick={copyRoomId}
                        className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors ml-2"
                        title="Copy Room Code"
                    >
                        {copied ? <Check size={18} className="text-[var(--text-correct)]" /> : <Copy size={18} />}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {players.map((player) => (
                    <div key={player.id} className="relative">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-bold text-[var(--text-primary)]">{player.username} {player.id === socket?.id ? '(You)' : ''}</span>
                            <span className="text-[var(--text-secondary)]">{player.wpm} WPM</span>
                        </div>
                        <div className="h-3 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-300 ease-out ${player.id === socket?.id ? 'bg-[var(--accent-primary)]' : 'bg-[var(--text-secondary)]'}`}
                                style={{ width: `${Math.max(0, Math.min(100, player.progress))}%` }}
                            />
                        </div>
                    </div>
                ))}
                {players.length === 1 && (
                    <div className="text-center text-[var(--text-secondary)] text-sm mt-4 italic">
                        Waiting for other players to join...
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiplayerPanel;
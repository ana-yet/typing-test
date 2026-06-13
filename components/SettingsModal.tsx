import React from 'react';
import { X } from 'lucide-react';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { CursorStyle, SoundPack } from '../types';

const themes = {
  dark: { '--bg-primary': '#0f172a', '--accent-primary': '#38bdf8' },
  light: { '--bg-primary': '#f8fafc', '--accent-primary': '#0284c7' },
  monokai: { '--bg-primary': '#272822', '--accent-primary': '#a6e22e' },
  dracula: { '--bg-primary': '#282a36', '--accent-primary': '#ff79c6' },
  nord: { '--bg-primary': '#2e3440', '--accent-primary': '#88c0d0' },
};

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const { theme, setTheme, cursorStyle, setCursorStyle, soundPack, setSoundPack, soundEnabled, setSoundEnabled, zenMode, setZenMode } = useSettingsStore();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 rounded-xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Theme</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(themes).map(([themeKey, themeColors]) => (
                <button
                  key={themeKey}
                  onClick={() => setTheme(themeKey)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 border-2 transition-all ${
                    theme === themeKey ? 'border-[var(--accent-primary)] bg-[var(--bg-tertiary)]' : 'border-transparent bg-[var(--bg-primary)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeColors['--accent-primary'] }}></div>
                  <span className="capitalize text-sm font-medium">{themeKey}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Cursor Style</h3>
            <div className="flex flex-wrap gap-2">
               {(['line', 'block', 'underline'] as CursorStyle[]).map((style) => (
                  <button
                      key={style}
                      onClick={() => setCursorStyle(style)}
                      className={`px-4 py-2 text-sm rounded-md transition-colors capitalize ${
                          cursorStyle === style ? 'bg-[var(--accent-primary)] text-[var(--text-primary-inverted)]' : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary-hover)]'
                      }`}
                  >
                      {style}
                  </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Typing Sound</h3>
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={soundEnabled} 
                  onChange={(e) => setSoundEnabled(e.target.checked)} 
                  className="w-4 h-4 rounded text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] border-[var(--bg-tertiary)] bg-[var(--bg-primary)]"
                />
                <span className="text-sm font-medium">Enable Sounds</span>
              </label>
            </div>
            {soundEnabled && (
              <div className="flex flex-wrap gap-2">
                {(['web-audio', 'mechanical', 'typewriter', 'soft'] as SoundPack[]).map((pack) => (
                    <button
                        key={pack}
                        onClick={() => setSoundPack(pack)}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                            soundPack === pack ? 'bg-[var(--accent-primary)] text-[var(--text-primary-inverted)]' : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary-hover)] text-[var(--text-secondary)]'
                        }`}
                    >
                        {pack.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Zen Mode</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={zenMode} 
                onChange={(e) => setZenMode(e.target.checked)} 
                className="w-4 h-4 rounded text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] border-[var(--bg-tertiary)] bg-[var(--bg-primary)]"
              />
              <span className="text-sm font-medium text-[var(--text-secondary)]">Hide UI elements while typing</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

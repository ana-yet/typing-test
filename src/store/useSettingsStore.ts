import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CursorStyle, SoundPack, Language } from '../types';

interface SettingsState {
  theme: string;
  cursorStyle: CursorStyle;
  soundPack: SoundPack;
  soundEnabled: boolean;
  language: Language;
  zenMode: boolean;
  setTheme: (theme: string) => void;
  setCursorStyle: (style: CursorStyle) => void;
  setSoundPack: (pack: SoundPack) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setLanguage: (lang: Language) => void;
  setZenMode: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      cursorStyle: 'line',
      soundPack: 'web-audio',
      soundEnabled: false,
      language: 'english',
      zenMode: false,
      setTheme: (theme) => set({ theme }),
      setCursorStyle: (cursorStyle) => set({ cursorStyle }),
      setSoundPack: (soundPack) => set({ soundPack }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setLanguage: (language) => set({ language }),
      setZenMode: (zenMode) => set({ zenMode }),
    }),
    {
      name: 'typemaster-settings',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Mood = 'imperial' | 'dusk' | 'midnight' | 'forest' | 'ocean' | 'crimson';

export interface MoodDef {
  id:     Mood;
  label:  string;
  emoji:  string;
  deep:   string;
  mid:    string;
  card:   string;
  border: string;
  accent: string;
  gold:   string;
}

export const MOODS: MoodDef[] = [
  { id: 'imperial', label: 'Imperial', emoji: '👑',
    deep: '#0D0118', mid: '#12022A', card: '#1E0A4A',
    border: '#4B1E91', accent: '#4B1E91', gold: '#C9A84C' },
  { id: 'dusk',     label: 'Dusk',     emoji: '🌆',
    deep: '#1E1E2E', mid: '#2A2A40', card: '#363658',
    border: '#7C6AE0', accent: '#7C6AE0', gold: '#F0C060' },
  { id: 'midnight', label: 'Midnight', emoji: '🌙',
    deep: '#050A0F', mid: '#0A1628', card: '#0F2040',
    border: '#1D4ED8', accent: '#1D4ED8', gold: '#38BDF8' },
  { id: 'forest',   label: 'Forest',   emoji: '🌿',
    deep: '#051A0F', mid: '#0A2818', card: '#0F3A20',
    border: '#16A34A', accent: '#16A34A', gold: '#FBBF24' },
  { id: 'ocean',    label: 'Ocean',    emoji: '🌊',
    deep: '#010D18', mid: '#021A2E', card: '#063050',
    border: '#0891B2', accent: '#0891B2', gold: '#22D3EE' },
  { id: 'crimson',  label: 'Crimson',  emoji: '🔴',
    deep: '#0F0505', mid: '#1E0808', card: '#2D0F0F',
    border: '#991B1B', accent: '#DC2626', gold: '#F59E0B' },
];

function applyMoodVars(mood: Mood) {
  const m = MOODS.find((x) => x.id === mood) ?? MOODS[0];
  const root = document.documentElement;
  root.setAttribute('data-mood', mood);
  root.style.setProperty('--bg-deep',  m.deep);
  root.style.setProperty('--bg-mid',   m.mid);
  root.style.setProperty('--bg-card',  m.card);
  root.style.setProperty('--bd',       m.border);
  root.style.setProperty('--ac',       m.accent);
  root.style.setProperty('--gd',       m.gold);
}

interface ThemeStore {
  mood: Mood;
  setMood: (mood: Mood) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mood: 'imperial',
      setMood: (mood) => {
        applyMoodVars(mood);
        set({ mood });
      },
    }),
    { name: 'theme-store' }
  )
);

export function bootTheme() {
  try {
    const raw  = localStorage.getItem('theme-store');
    const mood = raw ? (JSON.parse(raw)?.state?.mood as Mood) : 'imperial';
    applyMoodVars(mood ?? 'imperial');
  } catch {
    applyMoodVars('imperial');
  }
}

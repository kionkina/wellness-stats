export const MOOD_OPTIONS = [
  { label: 'Awful', score: -2, emoji: '😞' },
  { label: 'Bad', score: -1, emoji: '😕' },
  { label: 'Okay', score: 0, emoji: '😐' },
  { label: 'Good', score: 1, emoji: '🙂' },
  { label: 'Great', score: 2, emoji: '😄' },
] as const;

export const ENERGY_OPTIONS = [
  { label: 'Exhausted', score: -2, emoji: '🪫' },
  { label: 'Low', score: -1, emoji: '😴' },
  { label: 'Moderate', score: 0, emoji: '⚡' },
  { label: 'High', score: 1, emoji: '🔋' },
  { label: 'Energized', score: 2, emoji: '⚡✨' },
] as const;
export const APPETITE_LABELS = ['', 'None', 'Low', 'Normal', 'High', 'Ravenous'] as const;
export const FLOW_LABELS = ['', 'Light', 'Medium', 'Heavy'] as const;
export const BLOATING_LABELS = ['', 'Mild', 'Moderate', 'Severe'] as const;

export const MOOD_TAGS = [
  'happy', 'calm', 'grateful', 'excited', 'content', 'hopeful',
  'anxious', 'stressed', 'sad', 'irritable', 'lonely', 'overwhelmed',
  'bored', 'tired', 'motivated', 'confident', 'frustrated', 'numb',
] as const;

export const MOOD_TAG_COLORS: Record<string, string> = {
  happy: '#FFD93D',
  calm: '#86efac',
  grateful: '#fbbf24',
  excited: '#FFB347',
  content: '#4ade80',
  hopeful: '#a5b4fc',
  anxious: '#C9B1FF',
  stressed: '#f87171',
  sad: '#6C9BCF',
  irritable: '#FF6B6B',
  lonely: '#94a3b8',
  overwhelmed: '#e879f9',
  bored: '#d1d5db',
  tired: '#a1a1aa',
  motivated: '#34d399',
  confident: '#fbbf24',
  frustrated: '#fb923c',
  numb: '#9ca3af',
};

export const EXERCISE_TYPES = [
  'Walking', 'Running', 'Cycling', 'Swimming', 'Yoga',
  'Weights', 'HIIT', 'Pilates', 'Dance', 'Sports', 'Other',
] as const;

export const PAIN_AREAS = [
  'Head', 'Throat', 'Chest', 'Stomach', 'Back',
  'Joints', 'Muscles', 'Cramps', 'Other',
] as const;

export const TRACKABLE_FEATURES = [
  { key: 'appetite', label: 'Appetite', description: 'Track daily appetite level' },
  { key: 'bloating', label: 'Bloating', description: 'Track bloating and severity' },
  { key: 'exercise', label: 'Exercise', description: 'Track workouts and duration' },
  { key: 'period', label: 'Period & cycle', description: 'Track period, flow, and cycle predictions' },
  { key: 'sick', label: 'Sick / pain', description: 'Track illness and pain areas' },
  { key: 'notable_events', label: 'Notable events', description: 'Log notable daily events' },
] as const;

export const ALL_FEATURE_KEYS = TRACKABLE_FEATURES.map((f) => f.key);

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/checkin', label: 'Check-in', icon: 'PenSquare' },
  { href: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
] as const;

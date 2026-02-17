export const FEELINGS_WHEEL = {
  happy: {
    playful: ['aroused', 'cheeky'],
    content: ['free', 'joyful'],
    interested: ['curious', 'inquisitive'],
    proud: ['successful', 'confident'],
    accepted: ['respected', 'valued'],
    powerful: ['courageous', 'creative'],
    peaceful: ['loving', 'thankful'],
    trusting: ['sensitive', 'intimate'],
    optimistic: ['hopeful', 'inspired'],
  },
  sad: {
    lonely: ['isolated', 'abandoned'],
    vulnerable: ['victimized', 'fragile'],
    despair: ['grief', 'powerless'],
    guilty: ['ashamed', 'remorseful'],
    depressed: ['inferior', 'empty'],
    hurt: ['disappointed', 'embarrassed'],
  },
  disgusted: {
    disapproving: ['judgmental', 'embarrassed'],
    disappointed: ['appalled', 'revolted'],
    awful: ['nauseated', 'detestable'],
    repelled: ['horrified', 'hesitant'],
  },
  angry: {
    'let down': ['betrayed', 'resentful'],
    humiliated: ['disrespected', 'ridiculed'],
    bitter: ['indignant', 'violated'],
    mad: ['furious', 'jealous'],
    aggressive: ['provoked', 'hostile'],
    frustrated: ['infuriated', 'annoyed'],
    distant: ['withdrawn', 'numb'],
    critical: ['skeptical', 'dismissive'],
  },
  fearful: {
    scared: ['helpless', 'frightened'],
    anxious: ['overwhelmed', 'worried'],
    insecure: ['inadequate', 'inferior'],
    weak: ['worthless', 'insignificant'],
    rejected: ['excluded', 'persecuted'],
    threatened: ['nervous', 'exposed'],
  },
  surprised: {
    startled: ['shocked', 'dismayed'],
    confused: ['disillusioned', 'perplexed'],
    amazed: ['astonished', 'awestruck'],
    excited: ['eager', 'energetic'],
  },
} as const;

export type PrimaryFeeling = keyof typeof FEELINGS_WHEEL;

export const PRIMARY_FEELINGS = Object.keys(FEELINGS_WHEEL) as PrimaryFeeling[];

export const FEELING_COLORS: Record<PrimaryFeeling, string> = {
  happy: '#FFD93D',
  sad: '#6C9BCF',
  disgusted: '#A8E6CF',
  angry: '#FF6B6B',
  fearful: '#C9B1FF',
  surprised: '#FFB347',
};

export const MOOD_LABELS = ['', 'Awful', 'Bad', 'Okay', 'Good', 'Great'] as const;
export const ENERGY_LABELS = ['', 'Exhausted', 'Low', 'Moderate', 'High', 'Energized'] as const;
export const APPETITE_LABELS = ['', 'None', 'Low', 'Normal', 'High', 'Ravenous'] as const;
export const FLOW_LABELS = ['', 'Light', 'Medium', 'Heavy'] as const;
export const BLOATING_LABELS = ['', 'Mild', 'Moderate', 'Severe'] as const;

export const EXERCISE_TYPES = [
  'Walking', 'Running', 'Cycling', 'Swimming', 'Yoga',
  'Weights', 'HIIT', 'Pilates', 'Dance', 'Sports', 'Other',
] as const;

export const PAIN_AREAS = [
  'Head', 'Throat', 'Chest', 'Stomach', 'Back',
  'Joints', 'Muscles', 'Cramps', 'Other',
] as const;

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/checkin', label: 'Check-in', icon: 'PenSquare' },
  { href: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
] as const;

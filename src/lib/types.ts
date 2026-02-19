export interface CheckIn {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  mood_label: string | null;
  mood_score: number | null; // -2 to 2
  energy_label: string | null;
  energy_score: number | null; // -2 to 2
  appetite: number | null; // 1-5
  sleep_hours: number | null;
  note: string | null;
  mood_tags: string[] | null;
  bloating: boolean;
  bloating_severity: number | null; // 1-3
  exercised: boolean;
  exercise_type: string | null;
  exercise_minutes: number | null;
  period: boolean;
  period_start: boolean;
  flow_level: number | null; // 1-3
  sick: boolean;
  pain_areas: string[] | null;
  sick_notes: string | null;
  notable_events: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  reminder_time: string | null; // HH:MM
  timezone: string | null;
  tracked_features: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  created_at: string;
}

export type CheckInFormData = Omit<CheckIn, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export type MetricKey = 'mood_score' | 'energy_score' | 'appetite' | 'bloating' | 'exercised' | 'period' | 'sick';

export interface CorrelationResult {
  metric1: string;
  metric2: string;
  correlation: number;
  sampleSize: number;
  insight: string;
}

export interface CyclePrediction {
  averageCycleLength: number;
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  confidence: 'low' | 'medium' | 'high';
  cyclesUsed: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastCheckinDate: string | null;
}

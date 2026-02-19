'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import type { CheckIn } from '@/lib/types';

const today = () => format(new Date(), 'yyyy-MM-dd');

export interface CheckInState {
  mood_label: string | null;
  mood_score: number | null;
  energy_label: string | null;
  energy_score: number | null;
  appetite: number | null;
  sleep_hours: number | null;
  note: string | null;
  mood_tags: string[];
  bloating: boolean;
  bloating_severity: number | null;
  exercised: boolean;
  exercise_type: string | null;
  exercise_minutes: number | null;
  period: boolean;
  period_start: boolean;
  flow_level: number | null;
  sick: boolean;
  pain_areas: string[];
  sick_notes: string | null;
  notable_events: string | null;
}

const defaultState: CheckInState = {
  mood_label: null,
  mood_score: null,
  energy_label: null,
  energy_score: null,
  appetite: null,
  sleep_hours: null,
  note: null,
  mood_tags: [],
  bloating: false,
  bloating_severity: null,
  exercised: false,
  exercise_type: null,
  exercise_minutes: null,
  period: false,
  period_start: false,
  flow_level: null,
  sick: false,
  pain_areas: [],
  sick_notes: null,
  notable_events: null,
};

export function useCheckin(date?: string) {
  const [state, setState] = useState<CheckInState>(defaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);
  const supabase = createClient();
  const checkinDate = date || today();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', checkinDate)
        .single();

      if (data) {
        setExistingId(data.id);
        setState({
          mood_label: data.mood_label,
          mood_score: data.mood_score,
          energy_label: data.energy_label,
          energy_score: data.energy_score,
          appetite: data.appetite,
          sleep_hours: data.sleep_hours,
          note: data.note,
          mood_tags: data.mood_tags || [],
          bloating: data.bloating || false,
          bloating_severity: data.bloating_severity,
          exercised: data.exercised || false,
          exercise_type: data.exercise_type,
          exercise_minutes: data.exercise_minutes,
          period: data.period || false,
          period_start: data.period_start || false,
          flow_level: data.flow_level,
          sick: data.sick || false,
          pain_areas: data.pain_areas || [],
          sick_notes: data.sick_notes,
          notable_events: data.notable_events,
        });
      } else {
        setState(defaultState);
        setExistingId(null);
      }
      setLoading(false);
    }

    load();
  }, [checkinDate, supabase]);

  const update = useCallback(<K extends keyof CheckInState>(key: K, value: CheckInState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return false; }

    const record = {
      user_id: user.id,
      date: checkinDate,
      mood_label: state.mood_label,
      mood_score: state.mood_score,
      energy_label: state.energy_label,
      energy_score: state.energy_score,
      appetite: state.appetite,
      sleep_hours: state.sleep_hours,
      note: state.note || null,
      mood_tags: state.mood_tags.length > 0 ? state.mood_tags : null,
      bloating: state.bloating,
      bloating_severity: state.bloating ? state.bloating_severity : null,
      exercised: state.exercised,
      exercise_type: state.exercised ? state.exercise_type : null,
      exercise_minutes: state.exercised ? state.exercise_minutes : null,
      period: state.period,
      period_start: state.period ? state.period_start : false,
      flow_level: state.period ? state.flow_level : null,
      sick: state.sick,
      pain_areas: state.sick ? state.pain_areas : null,
      sick_notes: state.sick ? state.sick_notes : null,
      notable_events: state.notable_events || null,
    };

    let error;
    if (existingId) {
      ({ error } = await supabase
        .from('checkins')
        .update(record)
        .eq('id', existingId));
    } else {
      const result = await supabase
        .from('checkins')
        .upsert(record, { onConflict: 'user_id,date' })
        .select()
        .single();
      error = result.error;
      if (result.data) setExistingId(result.data.id);
    }

    setSaving(false);
    return !error;
  }, [state, existingId, checkinDate, supabase]);

  return { state, update, save, loading, saving, isEdit: !!existingId };
}

export function useRecentCheckins(limit = 7) {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(limit);

      setCheckins((data as CheckIn[]) || []);
      setLoading(false);
    }

    load();
  }, [limit, supabase]);

  return { checkins, loading };
}

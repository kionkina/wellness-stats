'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ALL_FEATURE_KEYS } from '@/lib/constants';
import type { Profile } from '@/lib/types';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data as Profile);
      setLoading(false);
    }

    load();
  }, [supabase]);

  const tracked = useMemo(() => {
    const features = profile?.tracked_features ?? ALL_FEATURE_KEYS;
    return new Set(features);
  }, [profile?.tracked_features]);

  return { profile, loading, tracked };
}

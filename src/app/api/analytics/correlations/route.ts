import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { computeCorrelations } from '@/lib/analytics';
import type { CheckIn } from '@/lib/types';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const correlations = computeCorrelations((data as CheckIn[]) || []);
  return NextResponse.json(correlations);
}

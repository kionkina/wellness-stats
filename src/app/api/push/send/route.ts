import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function initVapid() {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  initVapid();
  const supabaseAdmin = getSupabaseAdmin();

  const { data: subscriptions } = await supabaseAdmin
    .from('push_subscriptions')
    .select('*, profiles!inner(reminder_time, timezone)')
    .not('profiles.reminder_time', 'is', null);

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const now = new Date();
  let sent = 0;

  for (const sub of subscriptions) {
    try {
      const userTz = sub.profiles?.timezone || 'UTC';
      const userTime = new Intl.DateTimeFormat('en-US', {
        timeZone: userTz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);

      if (userTime === sub.profiles?.reminder_time) {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          JSON.stringify({
            title: 'Wellness Stats',
            body: "Time for your daily check-in! How are you feeling today?",
          })
        );
        sent++;
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'statusCode' in err && (err as { statusCode: number }).statusCode === 410) {
        await supabaseAdmin
          .from('push_subscriptions')
          .delete()
          .eq('id', sub.id);
      }
    }
  }

  return NextResponse.json({ sent });
}

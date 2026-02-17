// Supabase Edge Function - called by cron every 15 minutes
// Sends push notifications to users whose reminder_time matches current time

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_EMAIL = Deno.env.get('VAPID_EMAIL')!;

serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const now = new Date();

    // Get all users with reminder_time set and push subscriptions
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, reminder_time, timezone')
      .not('reminder_time', 'is', null);

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let sent = 0;

    for (const profile of profiles) {
      // Check if current time matches user's reminder time
      const userTime = new Intl.DateTimeFormat('en-US', {
        timeZone: profile.timezone || 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);

      if (userTime !== profile.reminder_time) continue;

      // Check if user already checked in today
      const userToday = new Intl.DateTimeFormat('en-CA', {
        timeZone: profile.timezone || 'UTC',
      }).format(now);

      const { data: existing } = await supabase
        .from('checkins')
        .select('id')
        .eq('user_id', profile.id)
        .eq('date', userToday)
        .single();

      if (existing) continue; // Already checked in

      // Get push subscriptions
      const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', profile.id);

      if (!subs || subs.length === 0) continue;

      for (const sub of subs) {
        try {
          // Use the Push API endpoint instead of web-push library
          // (web-push is a Node.js library, not available in Deno)
          const response = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-push`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              },
              body: JSON.stringify({
                subscription: {
                  endpoint: sub.endpoint,
                  keys: sub.keys,
                },
                payload: {
                  title: 'Wellness Stats',
                  body: "Time for your daily check-in! How are you feeling today?",
                },
              }),
            }
          );

          if (response.ok) sent++;
        } catch (err) {
          console.error('Push send error:', err);
        }
      }
    }

    return new Response(JSON.stringify({ sent }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

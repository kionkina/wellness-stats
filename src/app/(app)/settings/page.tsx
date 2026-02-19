'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { TRACKABLE_FEATURES, ALL_FEATURE_KEYS } from '@/lib/constants';

const TIMEZONES = Intl.supportedValuesOf('timeZone');

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { permission, subscribe, unsubscribe, isSupported, subscription } = useNotifications();
  const { toast } = useToast();
  const supabase = createClient();

  const [reminderTime, setReminderTime] = useState('20:00');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [trackedFeatures, setTrackedFeatures] = useState<string[]>(ALL_FEATURE_KEYS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        if (data.reminder_time) setReminderTime(data.reminder_time);
        if (data.timezone) setTimezone(data.timezone);
        if (data.tracked_features) setTrackedFeatures(data.tracked_features);
      }
      setLoading(false);
    }

    loadProfile();
  }, [user, supabase]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        reminder_time: reminderTime,
        timezone,
        tracked_features: trackedFeatures,
      })
      .eq('id', user.id);

    setSaving(false);
    toast({
      title: error ? 'Error' : 'Settings saved',
      description: error ? error.message : 'Your preferences have been updated.',
      variant: error ? 'destructive' : 'default',
    });
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const ok = await subscribe();
      if (!ok) {
        toast({
          title: 'Notification permission denied',
          description: 'Please enable notifications in your browser settings.',
          variant: 'destructive',
        });
      }
    } else {
      await unsubscribe();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Settings</h2>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tracked Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Choose which optional sections appear in your daily check-in.
            Mood, energy, sleep, and notes are always shown.
          </p>
          {TRACKABLE_FEATURES.map((feature) => (
            <div key={feature.key} className="flex items-center justify-between">
              <div>
                <Label htmlFor={`feature-${feature.key}`}>{feature.label}</Label>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
              <Switch
                id={`feature-${feature.key}`}
                checked={trackedFeatures.includes(feature.key)}
                onCheckedChange={(checked) => {
                  setTrackedFeatures((prev) =>
                    checked
                      ? [...prev, feature.key]
                      : prev.filter((k) => k !== feature.key)
                  );
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Reminders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSupported && (
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Push notifications</Label>
              <Switch
                id="notifications"
                checked={permission === 'granted' && !!subscription}
                onCheckedChange={handleNotificationToggle}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reminder-time">Reminder time</Label>
            <Input
              id="reminder-time"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

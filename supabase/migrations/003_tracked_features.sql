-- Add tracked_features preference to profiles
ALTER TABLE profiles
  ADD COLUMN tracked_features text[] DEFAULT '{appetite,bloating,exercise,period,sick,notable_events}';

-- Add period_start flag to checkins
ALTER TABLE checkins
  ADD COLUMN period_start boolean DEFAULT false;

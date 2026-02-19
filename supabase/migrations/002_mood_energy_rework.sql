-- Rework mood/energy from 1-5 numeric to labeled scales with -2 to +2 scores
-- Rename day_description to note

-- Drop old columns
ALTER TABLE checkins DROP COLUMN IF EXISTS mood;
ALTER TABLE checkins DROP COLUMN IF EXISTS energy;

-- Add new labeled mood/energy columns
ALTER TABLE checkins ADD COLUMN mood_label text;
ALTER TABLE checkins ADD COLUMN mood_score smallint CHECK (mood_score BETWEEN -2 AND 2);
ALTER TABLE checkins ADD COLUMN energy_label text;
ALTER TABLE checkins ADD COLUMN energy_score smallint CHECK (energy_score BETWEEN -2 AND 2);

-- Rename day_description to note
ALTER TABLE checkins RENAME COLUMN day_description TO note;

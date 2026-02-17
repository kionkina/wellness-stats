'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEELINGS_WHEEL, FEELING_COLORS, type PrimaryFeeling } from '@/lib/constants';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FeelingsWheelProps {
  value: string[][];
  onChange: (feelings: string[][]) => void;
}

type Level = 'primary' | 'secondary' | 'tertiary';

export function FeelingsWheel({ value, onChange }: FeelingsWheelProps) {
  const [level, setLevel] = useState<Level>('primary');
  const [selectedPrimary, setSelectedPrimary] = useState<PrimaryFeeling | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(null);

  const handlePrimaryClick = useCallback((feeling: PrimaryFeeling) => {
    setSelectedPrimary(feeling);
    setLevel('secondary');
  }, []);

  const handleSecondaryClick = useCallback((feeling: string) => {
    setSelectedSecondary(feeling);
    setLevel('tertiary');
  }, []);

  const handleTertiaryClick = useCallback(
    (feeling: string) => {
      if (!selectedPrimary || !selectedSecondary) return;
      const path = [selectedPrimary, selectedSecondary, feeling];
      const alreadyExists = value.some(
        (v) => v[0] === path[0] && v[1] === path[1] && v[2] === path[2]
      );
      if (!alreadyExists) {
        onChange([...value, path]);
      }
      setLevel('primary');
      setSelectedPrimary(null);
      setSelectedSecondary(null);
    },
    [selectedPrimary, selectedSecondary, value, onChange]
  );

  const handleRemove = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const handleBack = useCallback(() => {
    if (level === 'tertiary') {
      setLevel('secondary');
      setSelectedSecondary(null);
    } else if (level === 'secondary') {
      setLevel('primary');
      setSelectedPrimary(null);
    }
  }, [level]);

  const primaryFeelings = Object.keys(FEELINGS_WHEEL) as PrimaryFeeling[];

  const secondaryFeelings = selectedPrimary
    ? Object.keys(FEELINGS_WHEEL[selectedPrimary])
    : [];

  const tertiaryFeelings =
    selectedPrimary && selectedSecondary
      ? (FEELINGS_WHEEL[selectedPrimary] as Record<string, readonly string[]>)[selectedSecondary] || []
      : [];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">How are you feeling?</label>

      {/* Selected feelings */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((path, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="gap-1 pr-1"
              style={{
                backgroundColor: `${FEELING_COLORS[path[0] as PrimaryFeeling]}30`,
                borderColor: FEELING_COLORS[path[0] as PrimaryFeeling],
              }}
            >
              {path.join(' → ')}
              <button
                onClick={() => handleRemove(i)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
                aria-label={`Remove ${path.join(' ')}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Wheel navigation */}
      <div className="rounded-lg border p-4">
        {level !== 'primary' && (
          <button
            onClick={handleBack}
            className="mb-2 text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={level + selectedPrimary + selectedSecondary}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-3 gap-2"
          >
            {level === 'primary' &&
              primaryFeelings.map((feeling) => (
                <Button
                  key={feeling}
                  variant="outline"
                  className="h-auto py-3 capitalize"
                  style={{
                    borderColor: FEELING_COLORS[feeling],
                    backgroundColor: `${FEELING_COLORS[feeling]}15`,
                  }}
                  onClick={() => handlePrimaryClick(feeling)}
                >
                  {feeling}
                </Button>
              ))}

            {level === 'secondary' &&
              secondaryFeelings.map((feeling) => (
                <Button
                  key={feeling}
                  variant="outline"
                  className="h-auto py-3 capitalize"
                  style={{
                    borderColor: FEELING_COLORS[selectedPrimary!],
                    backgroundColor: `${FEELING_COLORS[selectedPrimary!]}20`,
                  }}
                  onClick={() => handleSecondaryClick(feeling)}
                >
                  {feeling}
                </Button>
              ))}

            {level === 'tertiary' &&
              (tertiaryFeelings as readonly string[]).map((feeling) => (
                <Button
                  key={feeling}
                  variant="outline"
                  className="h-auto py-3 capitalize"
                  style={{
                    borderColor: FEELING_COLORS[selectedPrimary!],
                    backgroundColor: `${FEELING_COLORS[selectedPrimary!]}30`,
                  }}
                  onClick={() => handleTertiaryClick(feeling)}
                >
                  {feeling}
                </Button>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

import { simulateQuantum, type StudentProfile, type PredictionResult } from './quantumEngine';

export interface WhatIfResult {
  original: PredictionResult;
  optimized: StudentProfile;
  optimizedResult: PredictionResult;
  changes: { field: keyof StudentProfile; from: number; to: number; label: string }[];
  probabilityGain: number;
}

const FIELD_LABELS: Record<keyof StudentProfile, string> = {
  studytime: 'Weekly Study Time',
  failures: 'Past Class Failures',
  absences: 'School Absences',
  freetime: 'Free Time',
  health: 'Health Status',
};

const FIELD_RANGES: Record<keyof StudentProfile, { min: number; max: number; step: number; direction: 'up' | 'down' }> = {
  studytime: { min: 1, max: 4, step: 1, direction: 'up' },
  failures:  { min: 0, max: 3, step: 1, direction: 'down' },
  absences:  { min: 0, max: 50, step: 5, direction: 'down' },
  freetime:  { min: 1, max: 5, step: 1, direction: 'up' },
  health:    { min: 1, max: 5, step: 1, direction: 'up' },
};

/** Greedy optimizer: finds the minimum-change student profile that flips prediction to PASS */
export function findWhatIfOptimization(profile: StudentProfile): WhatIfResult | null {
  const original = simulateQuantum(profile);

  // Already passing — nothing to do
  if (original.prediction === 'PASS') return null;

  let best = { ...profile };
  let bestProb = original.probability;
  const changes: WhatIfResult['changes'] = [];

  // Priority order: failures (most impactful), absences, studytime, health, freetime
  const priority: (keyof StudentProfile)[] = ['failures', 'absences', 'studytime', 'health', 'freetime'];

  for (const field of priority) {
    const range = FIELD_RANGES[field];
    const current = best[field];
    let improved = current;

    if (range.direction === 'down') {
      // Reduce to minimum
      improved = range.min;
    } else {
      // Increase to maximum
      improved = range.max;
    }

    if (improved === current) continue;

    const candidate = { ...best, [field]: improved };
    const candidateResult = simulateQuantum(candidate);

    if (candidateResult.probability > bestProb) {
      changes.push({
        field,
        from: current,
        to: improved,
        label: FIELD_LABELS[field],
      });
      best = candidate;
      bestProb = candidateResult.probability;

      if (candidateResult.prediction === 'PASS') break;
    }
  }

  // If still failing, apply all changes
  if (simulateQuantum(best).prediction === 'FAIL') {
    for (const field of priority) {
      const range = FIELD_RANGES[field];
      const current = best[field];
      const improved = range.direction === 'down' ? range.min : range.max;
      if (improved !== current) {
        if (!changes.find(c => c.field === field)) {
          changes.push({ field, from: current, to: improved, label: FIELD_LABELS[field] });
        }
        best = { ...best, [field]: improved };
      }
    }
  }

  const optimizedResult = simulateQuantum(best);
  return {
    original,
    optimized: best,
    optimizedResult,
    changes,
    probabilityGain: optimizedResult.probability - original.probability,
  };
}

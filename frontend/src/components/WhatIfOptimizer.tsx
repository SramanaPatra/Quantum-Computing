import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import type { WhatIfResult } from '../whatIfEngine';

interface WhatIfOptimizerProps {
  result: WhatIfResult | null;
  onApply: (profile: import('../quantumEngine').StudentProfile) => void;
}

const FIELD_ICONS: Record<string, string> = {
  studytime: '📚',
  failures: '❌',
  absences: '🏫',
  freetime: '⏰',
  health: '💪',
};

export function WhatIfOptimizer({ result, onApply }: WhatIfOptimizerProps) {
  if (!result) return null;

  const gain = Math.round(result.probabilityGain * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="glass rounded-xl border border-violet-500/25 p-5 mt-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-violet-400" />
            <span className="text-sm font-bold font-mono text-violet-400 uppercase tracking-widest">
              What-If Optimizer
            </span>
          </div>
          <div className="text-xs font-mono text-emerald-400 glass px-2 py-1 rounded border border-emerald-500/30">
            +{gain}% probability gain
          </div>
        </div>

        {/* Changes list */}
        <div className="space-y-2 mb-4">
          {result.changes.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono">No single changes found. Profile may need holistic improvement.</p>
          ) : (
            result.changes.map((c, i) => (
              <motion.div
                key={c.field}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 glass rounded-lg px-3 py-2 border border-slate-700/50"
              >
                <span className="text-base">{FIELD_ICONS[c.field]}</span>
                <div className="flex-1">
                  <span className="text-xs text-slate-400 font-mono">{c.label}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-sm">
                  <span className="text-rose-400 font-bold">{c.from}</span>
                  <ArrowRight size={12} className="text-slate-500" />
                  <span className="text-emerald-400 font-bold">{c.to}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Result preview */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            Optimised outcome:{' '}
            <span className={result.optimizedResult.prediction === 'PASS' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {result.optimizedResult.prediction}
            </span>
            {' '}({Math.round(result.optimizedResult.probability * 100)}%)
          </div>
          {result.changes.length > 0 && (
            <button
              onClick={() => onApply(result.optimized)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold
                bg-emerald-500/15 border border-emerald-500/35 text-emerald-400
                hover:bg-emerald-500/25 hover:border-emerald-400 transition-all"
            >
              <CheckCircle2 size={12} />
              Apply Changes
            </button>
          )}
        </div>

        {result.optimizedResult.prediction === 'PASS' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 flex items-center gap-2 text-xs text-emerald-400 font-mono"
          >
            <Zap size={12} />
            Flipping to PASS requires {result.changes.length} change{result.changes.length !== 1 ? 's' : ''}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

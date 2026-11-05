import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Star, AlertTriangle, User } from 'lucide-react';
import type { StudentProfile } from '../quantumEngine';

interface ControlPanelProps {
  profile: StudentProfile;
  onChange: (p: StudentProfile) => void;
  onSimulate: () => void;
  isRunning: boolean;
}

const PRESETS = {
  star:    { studytime: 4, failures: 0, absences: 1,  freetime: 3, health: 5 },
  atrisk:  { studytime: 1, failures: 3, absences: 28, freetime: 5, health: 2 },
  average: { studytime: 2, failures: 1, absences: 8,  freetime: 3, health: 3 },
};

type SliderDef = {
  key: keyof StudentProfile;
  label: string;
  min: number; max: number;
  unit?: string;
  ticks: string[];
  warnIf?: (v: number) => boolean;
  presets?: { label: string; value: number }[];
};

const SLIDERS: SliderDef[] = [
  {
    key: 'studytime', label: 'Weekly Study Time', min: 1, max: 4,
    ticks: ['<2h', '2–5h', '5–10h', '>10h'],
    warnIf: v => v < 2,
  },
  {
    key: 'failures', label: 'Past Class Failures', min: 0, max: 3,
    ticks: ['None', '1', '2', '3+'],
    warnIf: v => v > 1,
  },
  {
    key: 'absences', label: 'School Absences', min: 0, max: 50, unit: 'days',
    ticks: ['0', '17', '33', '50'],
    warnIf: v => v > 10,
    presets: [{ label: 'Low', value: 2 }, { label: 'Avg', value: 8 }, { label: 'Chronic', value: 25 }],
  },
  {
    key: 'freetime', label: 'Free Time After School', min: 1, max: 5,
    ticks: ['Very Low', 'Low', 'Mid', 'High', 'Very High'],
  },
  {
    key: 'health', label: 'Health Status', min: 1, max: 5,
    ticks: ['Poor', 'Bad', 'OK', 'Good', 'Excel.'],
    warnIf: v => v < 2,
  },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({ profile, onChange, onSimulate, isRunning }) => {
  const [ripple, setRipple] = useState(false);

  const set = (key: keyof StudentProfile, v: number) => onChange({ ...profile, [key]: v });

  const handleSimulate = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 800);
    onSimulate();
  };

  return (
    <div className="glass rounded-xl p-5 border border-cyan-500/20 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Student Profile</span>
        {/* Preset buttons */}
        <div className="flex gap-2">
          <PresetBtn icon={<Star size={10} />} label="Star" color="cyan"
            onClick={() => onChange(PRESETS.star)} />
          <PresetBtn icon={<AlertTriangle size={10} />} label="At-Risk" color="rose"
            onClick={() => onChange(PRESETS.atrisk)} />
          <PresetBtn icon={<User size={10} />} label="Average" color="slate"
            onClick={() => onChange(PRESETS.average)} />
        </div>
      </div>

      {/* Sliders */}
      {SLIDERS.map(s => {
        const val = profile[s.key];
        const warn = s.warnIf?.(val) ?? false;
        const pct  = ((val - s.min) / (s.max - s.min)) * 100;
        return (
          <div key={s.key} className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400 font-mono">{s.label}</label>
              <motion.span
                key={val}
                initial={{ scale: 1.3, color: warn ? '#F43F5E' : '#00F5FF' }}
                animate={{ scale: 1,   color: warn ? '#F43F5E' : '#00F5FF' }}
                className="text-sm font-bold font-mono"
              >
                {val}{s.unit ? ` ${s.unit}` : ''}
              </motion.span>
            </div>
            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1 rounded-full"
                style={{ width: `${pct}%`, background: warn ? '#F43F5E' : '#00F5FF', opacity: 0.5 }} />
              <input
                type="range" min={s.min} max={s.max} value={val}
                className={`w-full relative z-10 ${warn ? 'danger' : ''}`}
                style={{ background: `linear-gradient(to right, ${warn ? '#F43F5E' : '#00F5FF'}44 0%, ${warn ? '#F43F5E' : '#00F5FF'}44 ${pct}%, #1e2d5a ${pct}%, #1e2d5a 100%)` }}
                onChange={e => set(s.key, Number(e.target.value))}
              />
            </div>
            {/* Tick labels */}
            <div className="flex justify-between text-slate-600 text-xs font-mono px-0.5">
              {s.ticks.map(t => <span key={t}>{t}</span>)}
            </div>
            {/* Quick presets for absences */}
            {s.presets && (
              <div className="flex gap-2 mt-1">
                {s.presets.map(p => (
                  <button key={p.label} onClick={() => set(s.key, p.value)}
                    className="text-xs px-2 py-0.5 rounded border border-slate-700 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-400 font-mono transition-all">
                    {p.label} ({p.value})
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Simulate button */}
      <div className="relative mt-2">
        <AnimatePresence>
          {ripple && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-cyan-400 ripple"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>
        <button
          onClick={handleSimulate}
          disabled={isRunning}
          className="w-full py-3 rounded-xl font-bold text-sm font-mono tracking-widest uppercase transition-all
            bg-gradient-to-r from-cyan-500/20 to-violet-500/20
            border border-cyan-500/40 hover:border-cyan-400
            text-cyan-300 hover:text-white
            hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                <Zap size={16} />
              </motion.div>
              Measuring…
            </>
          ) : (
            <><Zap size={16} /> Simulate Quantum Measurement</>
          )}
        </button>
      </div>
    </div>
  );
};

const PresetBtn: React.FC<{ icon: React.ReactNode; label: string; color: string; onClick: () => void }> = ({ icon, label, color, onClick }) => {
  const c = color === 'cyan' ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/40'
          : color === 'rose' ? 'border-rose-500/30 text-rose-400 hover:bg-rose-950/40'
          : 'border-slate-700 text-slate-400 hover:bg-slate-800';
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded border font-mono transition-all ${c}`}>
      {icon} {label}
    </button>
  );
};


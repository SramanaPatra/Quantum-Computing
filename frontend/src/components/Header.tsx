import { motion } from 'framer-motion';
import { Atom, GitBranch, Zap, Cpu, Server, AlertCircle } from 'lucide-react';

interface HeaderProps {
  backendMode: 'mock' | 'real';
  backendOnline: boolean;
  onToggleBackend: () => void;
  onOpenExplainer: () => void;
}

export const Header = ({ backendMode, backendOnline, onToggleBackend, onOpenExplainer }: HeaderProps) => (
  <header className="relative z-10 glass border-b border-cyan-500/15 px-6 py-3">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="text-cyan-400"
        >
          <Atom size={30} strokeWidth={1.4} />
        </motion.div>
        <div>
          <div className="font-orbitron font-bold text-lg text-cyan-400 text-glow-cyan tracking-widest">
            QuLearn <span className="text-slate-600">//</span> QML Academic Predictor
          </div>
          <div className="text-xs text-slate-500 font-share-mono">v2.0.0 · Qiskit Aer Edition</div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-share-mono">
        <StatusBadge color="emerald" pulse>Qiskit Aer ACTIVE v2.5</StatusBadge>
        <StatusBadge color="cyan" icon={<Cpu size={10} />}>5-Qubit ZZFeatureMap</StatusBadge>
        <StatusBadge color="violet" icon={<Zap size={10} />}>QSVC Kernel</StatusBadge>

        {/* Backend toggle */}
        <button
          onClick={onToggleBackend}
          className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-all
            ${backendMode === 'real'
              ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
              : 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20'
            }`}
        >
          {backendMode === 'real'
            ? <><Server size={10} />{backendOnline ? '⚛ Real QML' : '⚠ Offline'}</>
            : <><Cpu size={10} />Mock Mode</>
          }
        </button>

        {backendMode === 'real' && !backendOnline && (
          <span className="flex items-center gap-1 text-yellow-400 text-xs font-share-mono">
            <AlertCircle size={10} /> Start FastAPI first
          </span>
        )}

        <a href="https://github.com/SramanaPatra/Quantum-Computing" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 rounded glass border border-slate-700 hover:border-cyan-500/40
            text-slate-400 hover:text-cyan-400 transition-all">
          <GitBranch size={12} /> GitHub
        </a>

        <button onClick={onOpenExplainer}
          className="px-2 py-1 rounded glass border border-violet-500/25 text-violet-400
            hover:border-violet-400/50 transition-all text-xs">
          How It Works?
        </button>
      </div>
    </div>
  </header>
);

const StatusBadge = ({
  color, pulse, icon, children
}: { color: 'emerald'|'cyan'|'violet'; pulse?: boolean; icon?: React.ReactNode; children: React.ReactNode }) => {
  const cm = {
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/25',
    cyan:    'text-cyan-400 border-cyan-500/30 bg-cyan-950/25',
    violet:  'text-violet-400 border-violet-500/30 bg-violet-950/25',
  };
  const dm = { emerald: 'bg-emerald-400', cyan: 'bg-cyan-400', violet: 'bg-violet-400' };
  return (
    <span className={`flex items-center gap-1 px-2 py-1 rounded border ${cm[color]}`}>
      {pulse ? (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dm[color]} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dm[color]}`} />
        </span>
      ) : icon}
      {children}
    </span>
  );
};

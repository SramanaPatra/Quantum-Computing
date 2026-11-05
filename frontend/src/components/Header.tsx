import { Atom, GitBranch, Zap, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => (
  <header className="relative z-10 glass border-b border-cyan-500/20 px-6 py-3">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="text-cyan-400"
        >
          <Atom size={30} strokeWidth={1.5} />
        </motion.div>
        <div>
          <div className="font-mono font-bold text-lg text-cyan-400 text-glow-cyan tracking-widest">
            QuLearn <span className="text-slate-500">//</span> QML Academic Predictor
          </div>
          <div className="text-xs text-slate-500 font-mono">v1.0.0 · Qiskit Aer Edition</div>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <StatusBadge color="emerald" pulse>
          Qiskit Aer ACTIVE v2.5
        </StatusBadge>
        <StatusBadge color="cyan" icon={<Cpu size={10} />}>
          5-Qubit ZZFeatureMap
        </StatusBadge>
        <StatusBadge color="violet" icon={<Zap size={10} />}>
          QSVC Kernel
        </StatusBadge>
        <a
          href="https://github.com/SramanaPatra/Quantum-Computing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 rounded glass border border-slate-700 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 transition-all"
        >
          <GitBranch size={12} /> GitHub
        </a>
      </div>
    </div>
  </header>
);

const StatusBadge: React.FC<{
  color: 'emerald' | 'cyan' | 'violet';
  pulse?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ color, pulse, icon, children }) => {
  const colorMap = {
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
    cyan:    'text-cyan-400 border-cyan-500/30 bg-cyan-950/30',
    violet:  'text-violet-400 border-violet-500/30 bg-violet-950/30',
  };
  const dotMap = {
    emerald: 'bg-emerald-400',
    cyan:    'bg-cyan-400',
    violet:  'bg-violet-400',
  };
  return (
    <span className={`flex items-center gap-1 px-2 py-1 rounded border ${colorMap[color]}`}>
      {pulse ? (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotMap[color]} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotMap[color]}`} />
        </span>
      ) : icon}
      {children}
    </span>
  );
};


import { motion } from 'framer-motion';
import { Cpu, Network, Layers, BarChart2 } from 'lucide-react';

const stats = [
  { icon: <Cpu size={22} />, label: 'Qubits Allocated', value: '5 Qubits', sub: 'Linear Entanglement', color: 'cyan' },
  { icon: <Network size={22} />, label: 'Quantum Feature Map', value: 'ZZFeatureMap', sub: 'Reps = 2, Depth = 4', color: 'violet' },
  { icon: <Layers size={22} />, label: 'Quantum Kernel', value: 'FidelityKernel', sub: 'Qiskit-ML v0.9.1', color: 'cyan' },
  { icon: <BarChart2 size={22} />, label: 'Classical Baseline', value: '68.3%', sub: 'Random Forest (Accuracy)', color: 'violet' },
];
const colorMap = {
  cyan:   { border: 'border-cyan-500/25',   icon: 'text-cyan-400',   glow: 'shadow-cyan-950/40',  val: 'text-cyan-300' },
  violet: { border: 'border-violet-500/25', icon: 'text-violet-400', glow: 'shadow-violet-950/40', val: 'text-violet-300' },
};

export const HeroSection = () => (
  <section className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-8">
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
      className="text-center mb-10">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-orbitron font-bold mb-4 leading-tight">
        <span className="text-cyan-400 text-glow-cyan">Predicting Academic Outcomes</span>
        <br />
        <span className="text-slate-200">on Quantum Feature Spaces</span>
      </h1>
      <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base font-dm">
        Encoding student socio-academic attributes into a{' '}
        <span className="text-cyan-400 font-semibold">5-qubit Hilbert space</span> via{' '}
        <span className="text-violet-400 font-semibold">Fidelity Quantum Kernels</span> &amp; ZZFeatureMap
      </p>
    </motion.div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const c = colorMap[s.color as 'cyan' | 'violet'];
        return (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.5 }}
            className={`glass glass-hover rounded-xl p-4 shadow-xl ${c.glow} ${c.border} border`}>
            <div className={`mb-2 ${c.icon}`}>{s.icon}</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-share-mono mb-1">{s.label}</div>
            <div className={`text-lg font-bold ${c.val} font-orbitron`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5 font-dm">{s.sub}</div>
          </motion.div>
        );
      })}
    </div>
  </section>
);

import { motion } from 'framer-motion';

const models = [
  { name: 'Classical SVM', sub: 'RBF Kernel', acc: 64.5, color: '#6366f1', note: 'Classical kernel machine on 4-PC features' },
  { name: 'Random Forest', sub: '100 Estimators', acc: 68.3, color: '#f59e0b', note: 'Ensemble baseline — highest classical accuracy' },
  { name: 'Quantum QSVC', sub: '5-Qubit ZZFeatureMap', acc: 61.2, color: '#00F5FF', note: 'Fidelity kernel — NISQ simulation on Qiskit Aer' },
];

export const BenchmarkSection: React.FC = () => (
  <section className="relative z-10 max-w-7xl mx-auto px-6 py-10">
    <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-6 flex items-center gap-3">
      <span className="flex-1 h-px bg-slate-800" />
      Classical vs. Quantum Benchmark
      <span className="flex-1 h-px bg-slate-800" />
    </div>

    <div className="grid sm:grid-cols-3 gap-4 mb-6">
      {models.map((m, i) => (
        <motion.div
          key={m.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12 }}
          className="glass glass-hover rounded-xl p-5 border border-slate-700/50"
        >
          <div className="text-sm font-bold font-mono mb-0.5" style={{ color: m.color }}>{m.name}</div>
          <div className="text-xs text-slate-500 mb-3">{m.sub}</div>
          {/* Bar */}
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${m.acc}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.12 + 0.3 }}
              className="h-full rounded-full"
              style={{ background: m.color, boxShadow: `0 0 10px ${m.color}66` }}
            />
          </div>
          <div className="text-2xl font-bold font-mono" style={{ color: m.color }}>{m.acc}%</div>
          <div className="text-xs text-slate-500 mt-1">{m.note}</div>
        </motion.div>
      ))}
    </div>

    {/* Quantum advantage explanation */}
    <div className="glass rounded-xl p-5 border border-violet-500/15">
      <div className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-3">Quantum Advantage Tradeoff</div>
      <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
        <div>
          <span className="text-cyan-400 font-mono">▸ High-Dimensional Mapping:</span> The ZZFeatureMap embeds 5 classical features into a 2⁵ = 32-dimensional Hilbert space. In theory, this exponential blowup in state space enables finer class boundaries impossible classically.
        </div>
        <div>
          <span className="text-rose-400 font-mono">▸ NISQ Constraints:</span> On today's noisy simulators, decoherence and shot noise limit practical advantage. The 61.2% accuracy reflects this — but as hardware scales, quantum kernels are expected to outperform classical SVMs on complex high-dimensional problems.
        </div>
      </div>
    </div>
  </section>
);


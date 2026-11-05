import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

interface ExplainerModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    num: '01',
    title: 'Classical Normalisation',
    math: 'x̃ = 2·(x − xₘᵢₙ)/(xₘₐₓ − xₘᵢₙ) − 1  →  x̃ ∈ [−1, 1]',
    desc: 'Each student feature is scaled to [−1, 1] via MinMaxScaler so it can be encoded as a qubit rotation angle.',
  },
  {
    num: '02',
    title: 'Quantum State Encoding',
    math: 'UΦ(x)|0⟩⊗⁵  =  Rz(2x̃₀)H ⊗ ... ⊗ Rz(2x̃₄)H|00000⟩',
    desc: 'The ZZFeatureMap applies Hadamard gates (superposition) followed by parameterised Rz rotations. CNOT-based ZZ interactions entangle adjacent qubits, encoding feature correlations.',
  },
  {
    num: '03',
    title: 'Fidelity Kernel Computation',
    math: 'K(x, x′) = |⟨Φ(x)|Φ(x′)⟩|²',
    desc: 'The kernel value is the squared overlap (fidelity) between two quantum states. This forms an N×N kernel matrix used to find optimal support vectors.',
  },
  {
    num: '04',
    title: 'Support Vector Optimisation',
    math: 'max Σᵢαᵢ − ½ ΣᵢΣⱼαᵢαⱼyᵢyⱼK(xᵢ,xⱼ)',
    desc: 'Classical SVM dual optimisation runs over the quantum kernel matrix using COBYLA. The resulting hyperplane in quantum feature space separates PASS from FAIL students.',
  },
];

export const ExplainerModal: React.FC<ExplainerModalProps> = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          onClick={onClose}
        />
        {/* Panel */}
        <motion.div
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed right-0 top-0 h-full w-full max-w-lg glass border-l border-cyan-500/20 z-50 overflow-y-auto p-7"
        >
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-lg font-bold font-mono text-cyan-400 text-glow-cyan">How QML Works Here</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* Connector */}
                {i < steps.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 to-transparent" />
                )}
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full border border-cyan-500/40 bg-cyan-950/40
                    flex items-center justify-center font-mono text-xs text-cyan-400 font-bold">
                    {s.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-sm font-semibold text-slate-200 mb-1">
                      <ChevronRight size={14} className="text-cyan-400" />
                      {s.title}
                    </div>
                    <div className="font-mono text-xs text-violet-300 bg-violet-950/30 border border-violet-500/20 rounded px-3 py-2 mb-2 leading-relaxed whitespace-pre-wrap">
                      {s.math}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);


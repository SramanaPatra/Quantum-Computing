import { motion } from 'framer-motion';

interface QuantumCircuitProps {
  theta: number[];
  isRunning: boolean;
}

const QUBIT_LABELS = ['q₀ Study', 'q₁ Failures', 'q₂ Absences', 'q₃ FreeTime', 'q₄ Health'];
const QUBIT_COLORS = ['#00F5FF', '#BD00FF', '#00F5FF', '#BD00FF', '#10B981'];
const H = 54;    // vertical spacing per qubit
const PAD = 40;  // left padding for labels
const W = 520;   // total SVG width
const TOTAL_H = H * 5 + 20;

export const QuantumCircuit: React.FC<QuantumCircuitProps> = ({ theta, isRunning }) => {
  const wireY = (q: number) => 20 + q * H;

  return (
    <div className="glass rounded-xl p-4 border border-cyan-500/20 overflow-x-auto">
      <div className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-3">
        Live Circuit — ZZFeatureMap + Rz(θ)
      </div>
      <svg viewBox={`0 0 ${W} ${TOTAL_H}`} width="100%" style={{ minWidth: 320 }}>
        {/* Grid background */}
        {[...Array(6)].map((_, i) => (
          <line key={i} x1={PAD + 60 + i * 80} y1={0} x2={PAD + 60 + i * 80} y2={TOTAL_H}
            stroke="#1e2d5a" strokeWidth="1" strokeDasharray="2 4" />
        ))}

        {QUBIT_LABELS.map((label, q) => {
          const y = wireY(q);
          const col = QUBIT_COLORS[q];
          const th = theta[q] ?? 0;
          const hue = isRunning ? col : col + '99';

          return (
            <g key={q}>
              {/* Qubit label */}
              <text x={PAD - 4} y={y + 4} textAnchor="end" fill={col} fontSize="11" fontFamily="JetBrains Mono, monospace">
                {'|' + label.split(' ')[0] + '\u27E9'}
              </text>
              <text x={PAD - 4} y={y + 15} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono, monospace">
                {label.split(' ').slice(1).join(' ')}
              </text>

              {/* Wire */}
              <line x1={PAD} x2={W - 20} y1={y} y2={y}
                stroke={isRunning ? col + '55' : '#1e2d5a'}
                strokeWidth={isRunning ? 1.5 : 1}
                className={isRunning ? 'circuit-wire-active' : 'circuit-wire'}
                strokeDasharray="6 3"
              />

              {/* H gate */}
              <HGate x={PAD + 10} y={y} color={hue} />

              {/* Rz gate */}
              <RzGate x={PAD + 110} y={y} theta={th} color={hue} />

              {/* Second Rz after entanglement */}
              <RzGate x={PAD + 300} y={y} theta={th * 1.2} color={hue} />

              {/* Measurement */}
              <MeasureGate x={W - 48} y={y} color={col} />
            </g>
          );
        })}

        {/* ZZ Entanglement arcs (between adjacent qubits) */}
        {[0, 1, 2, 3].map(q => {
          const y1 = wireY(q);
          const y2 = wireY(q + 1);
          const x  = PAD + 200;
          const col = isRunning ? '#BD00FF' : '#BD00FF55';
          return (
            <g key={`ent-${q}`}>
              <line x1={x} y1={y1} x2={x} y2={y2} stroke={col} strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx={x} cy={y1} r="4" fill={col} />
              <circle cx={x} cy={y2} r="4" fill={col} />
              <text x={x + 6} y={(y1 + y2) / 2 + 4} fill={col} fontSize="9" fontFamily="monospace">ZZ</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ---- Gate components ---- */

const HGate: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g>
    <rect x={x - 12} y={y - 12} width={24} height={24} rx={4}
      fill="#0B112C" stroke={color} strokeWidth="1.5" />
    <text x={x} y={y + 5} textAnchor="middle" fill={color} fontSize="12" fontWeight="bold" fontFamily="monospace">H</text>
  </g>
);

const RzGate: React.FC<{ x: number; y: number; theta: number; color: string }> = ({ x, y, theta, color }) => (
  <g>
    <rect x={x - 20} y={y - 14} width={40} height={28} rx={4}
      fill="#0B112C" stroke={color} strokeWidth="1.5" />
    <text x={x} y={y - 2} textAnchor="middle" fill={color} fontSize="9" fontFamily="monospace">Rz</text>
    <motion.text
      key={theta.toFixed(2)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      x={x} y={y + 9} textAnchor="middle" fill={color} fontSize="8" fontFamily="monospace"
    >
      {theta.toFixed(2)}
    </motion.text>
  </g>
);

const MeasureGate: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g>
    <rect x={x - 16} y={y - 14} width={32} height={28} rx={4}
      fill="#0B112C" stroke={color} strokeWidth="1.5" />
    <path d={`M${x - 8} ${y + 4} Q${x} ${y - 8} ${x + 8} ${y + 4}`} stroke={color} strokeWidth="1.5" fill="none" />
    <line x1={x} y1={y + 4} x2={x + 6} y2={y - 4} stroke={color} strokeWidth="1.5" />
  </g>
);


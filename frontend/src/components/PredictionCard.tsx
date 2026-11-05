import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, Copy, Check } from 'lucide-react';
import type { PredictionResult } from '../quantumEngine';

interface PredictionCardProps {
  result: PredictionResult | null;
  isRunning: boolean;
}

export const PredictionCard = ({ result, isRunning }: PredictionCardProps) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated gauge
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2 + 10;
    const r = Math.min(W, H) / 2 - 12;

    let progress = 0;
    const target = result.probability;
    const passColor = '#10B981';
    const failColor = '#F43F5E';
    const col = result.prediction === 'PASS' ? passColor : failColor;

    const animate = () => {
      progress = Math.min(progress + 0.02, target);
      ctx.clearRect(0, 0, W, H);

      // Track
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
      ctx.strokeStyle = '#1e2d5a';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Fill
      const angle = Math.PI * 0.75 + progress * Math.PI * 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI * 0.75, angle);
      ctx.strokeStyle = col;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.shadowColor = col;
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Text
      ctx.fillStyle = col;
      ctx.font = 'bold 22px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(progress * 100)}%`, cx, cy + 6);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(result.prediction === 'PASS' ? 'Pass Prob.' : 'Risk Factor', cx, cy + 22);

      if (progress < target) requestAnimationFrame(animate);
    };
    animate();
  }, [result]);

  const copyResult = () => {
    if (!result) return;
    const text = `QML Prediction: ${result.prediction} (${Math.round(result.probability * 100)}%)\nFidelity: ${(result.fidelity * 100).toFixed(1)}%`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="glass rounded-xl p-5 border border-cyan-500/20 h-full flex flex-col gap-5">

      {/* Gauge + badge */}
      <div className="flex items-center gap-6">
        <canvas ref={canvasRef} width={130} height={130} className={result ? '' : 'opacity-20'} />

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="font-mono text-cyan-400 text-sm animate-pulse">
                Measuring quantum state…
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                {result.prediction === 'PASS' ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-glow-emerald">
                    <CheckCircle2 size={28} />
                    <span className="font-bold text-2xl font-mono">PASS</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-400 text-glow-rose">
                    <XCircle size={28} />
                    <span className="font-bold text-2xl font-mono">FAIL</span>
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-1 font-mono">
                  Fidelity: {(result.fidelity * 100).toFixed(1)}%
                </div>
                <button
                  onClick={copyResult}
                  className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy result'}
                </button>
              </motion.div>
            ) : (
              <motion.div key="idle" className="text-slate-600 text-sm font-mono">
                Run a simulation to see results
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dirac notation */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-slate-900/80 border border-slate-700 p-3"
        >
          <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-2">Quantum State</div>
          <div className="font-mono text-sm text-cyan-300">
            |ψ⟩ = {result.alpha.toFixed(3)}|00000⟩ + {result.beta.toFixed(3)}|11111⟩
          </div>
          <div className="font-mono text-xs text-slate-500 mt-1">
            |α|² = {(result.alpha ** 2).toFixed(3)} &nbsp;|β|² = {(result.beta ** 2).toFixed(3)}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-mono mb-2">
            <Lightbulb size={12} className="text-yellow-400" /> AI Recommendations
          </div>
          <ul className="space-y-2">
            {result.recommendations.map((r, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2">
                <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, Copy, Check, FlipHorizontal2 } from 'lucide-react';
import type { PredictionResult } from '../quantumEngine';

interface PredictionCardProps {
  result: PredictionResult | null;
  isRunning: boolean;
  predictionFlash: boolean;
}

/* ── Typewriter hook ── */
function useTypewriter(text: string, speed = 60) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return { displayed, done };
}

export const PredictionCard = ({
  result, isRunning, predictionFlash
}: PredictionCardProps) => {
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const predText = result ? result.prediction : '';
  const { displayed, done } = useTypewriter(predText, 80);

  /* ── Gauge animation ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2 + 10;
    const r = Math.min(W, H) / 2 - 12;
    let progress = 0;
    const target = result.probability;
    const col = result.prediction === 'PASS' ? '#10B981' : '#F43F5E';
    const raf = { id: 0 };
    const draw = () => {
      progress = Math.min(progress + 0.018, target);
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
      ctx.strokeStyle = '#1e2d5a'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 0.75 + progress * Math.PI * 1.5);
      ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.lineCap = 'round';
      ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = col; ctx.font = 'bold 20px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(progress * 100)}%`, cx, cy + 6);
      ctx.fillStyle = '#64748b'; ctx.font = '10px "DM Sans", sans-serif';
      ctx.fillText(result.prediction === 'PASS' ? 'Pass Prob.' : 'Risk Factor', cx, cy + 22);
      if (progress < target) raf.id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf.id);
  }, [result]);

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `QML Prediction: ${result.prediction} (${Math.round(result.probability * 100)}%)\nFidelity: ${(result.fidelity * 100).toFixed(1)}%`
    ).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const passColor = 'text-emerald-400 text-glow-emerald';
  const failColor = 'text-rose-400 text-glow-rose';

  return (
    <div className="glass rounded-xl border border-cyan-500/20 h-full flex flex-col gap-4 p-5 relative overflow-hidden">
      {/* Quantum collapse flash overlay */}
      <AnimatePresence>
        {predictionFlash && (
          <motion.div
            className="absolute inset-0 bg-cyan-400 pointer-events-none z-20 collapse-flash rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Gauge + badge */}
      <div className="flex items-center gap-5">
        <canvas ref={canvasRef} width={130} height={130}
          className={`shrink-0 transition-opacity duration-500 ${result ? 'opacity-100' : 'opacity-20'}`} />
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="font-share-mono text-cyan-400 text-sm animate-pulse">
                Collapsing quantum state…
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className={`flex items-center gap-2 ${result.prediction === 'PASS' ? passColor : failColor}`}>
                  {result.prediction === 'PASS'
                    ? <CheckCircle2 size={26} />
                    : <XCircle size={26} />}
                  <span className="font-orbitron font-bold text-2xl pred-pulse" style={{ color: result.prediction === 'PASS' ? '#10B981' : '#F43F5E' }}>
                    {displayed}
                    {!done && <span className="typewriter-cursor" style={{ background: result.prediction === 'PASS' ? '#10B981' : '#F43F5E' }} />}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-share-mono">
                  Probability: {Math.round(result.probability * 100)}% &nbsp;|&nbsp;
                  Fidelity: {(result.fidelity * 100).toFixed(1)}%
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={copyResult}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors font-share-mono">
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={() => setFlipped(f => !f)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-400 transition-colors font-share-mono">
                    <FlipHorizontal2 size={12} /> Flip Card
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="idle" className="text-slate-600 text-sm font-share-mono">
                Awaiting quantum measurement…
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Flipping card — front: Dirac | back: Recs */}
      {result && (
        <div className="perspective flex-1">
          <div className={`card-flip w-full h-full ${flipped ? 'flipped' : ''}`} style={{ position: 'relative', minHeight: 120 }}>
            {/* Front */}
            <div className="card-face absolute inset-0 rounded-lg bg-slate-900/80 border border-slate-700 p-3">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-share-mono mb-2">Quantum State</div>
              <div className="font-share-mono text-sm text-cyan-300 mb-1">
                |ψ⟩ = {result.alpha.toFixed(3)}|00000⟩ + {result.beta.toFixed(3)}|11111⟩
              </div>
              <div className="font-share-mono text-xs text-slate-500">
                |α|² = {(result.alpha ** 2).toFixed(3)} &nbsp;|β|² = {(result.beta ** 2).toFixed(3)}
              </div>
              <div className="mt-2 text-xs text-slate-600 italic">Flip card to see recommendations ↗</div>
            </div>
            {/* Back */}
            <div className="card-back absolute inset-0 rounded-lg bg-violet-950/40 border border-violet-500/20 p-3 overflow-auto">
              <div className="flex items-center gap-1.5 text-xs text-violet-400 uppercase tracking-widest font-share-mono mb-2">
                <Lightbulb size={12} className="text-yellow-400" /> AI Recommendations
              </div>
              <ul className="space-y-1.5">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-slate-300 flex gap-2 font-dm">
                    <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

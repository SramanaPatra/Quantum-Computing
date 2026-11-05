import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

import { ParticleBackground } from './components/ParticleBackground';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ControlPanel } from './components/ControlPanel';
import { QuantumCircuit } from './components/QuantumCircuit';
import { PredictionCard } from './components/PredictionCard';
import { BenchmarkSection } from './components/BenchmarkSection';
import { ExplainerModal } from './components/ExplainerModal';

import { simulateQuantum, type StudentProfile, type PredictionResult } from './quantumEngine';

const DEFAULT_PROFILE: StudentProfile = {
  studytime: 2,
  failures: 0,
  absences: 4,
  freetime: 3,
  health: 3,
};

function App() {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [result, setResult]   = useState<PredictionResult | null>(null);
  const [running, setRunning] = useState(false);
  const [explainer, setExplainer] = useState(false);

  // Live theta update (circuit reacts to sliders in real time)
  const liveResult = simulateQuantum(profile);

  const handleSimulate = () => {
    setRunning(true);
    setResult(null);
    // 600ms mock quantum shot delay
    setTimeout(() => {
      setResult(simulateQuantum(profile));
      setRunning(false);
    }, 650);
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #050814 0%, #0B112C 50%, #050814 100%)' }}>
      {/* Atmospheric */}
      <ParticleBackground />
      <div className="scan-line" />

      {/* Radial glow spots */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(189,0,255,0.04) 0%, transparent 70%)' }} />

      {/* Header */}
      <Header />

      {/* Hero */}
      <HeroSection />

      {/* Prediction Studio */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-10">
        <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-slate-800" />
          Interactive Quantum Prediction Studio
          <span className="flex-1 h-px bg-slate-800" />
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Left: Control */}
          <ControlPanel
            profile={profile}
            onChange={setProfile}
            onSimulate={handleSimulate}
            isRunning={running}
          />

          {/* Right: Circuit + Output */}
          <div className="flex flex-col gap-4">
            <QuantumCircuit theta={liveResult.theta} isRunning={running} />
            <PredictionCard result={result} isRunning={running} />
          </div>
        </div>
      </section>

      {/* Benchmark */}
      <BenchmarkSection />

      {/* Footer / Explainer trigger */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 pb-10 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setExplainer(true)}
          className="flex items-center gap-2 px-5 py-2.5 glass border border-violet-500/25 rounded-full
            text-violet-400 text-sm font-mono hover:border-violet-400/50 hover:shadow-[0_0_20px_rgba(189,0,255,0.15)]
            transition-all"
        >
          <HelpCircle size={16} />
          How Does Quantum ML Work Here?
        </motion.button>
      </footer>

      {/* Explainer drawer */}
      <ExplainerModal open={explainer} onClose={() => setExplainer(false)} />
    </div>
  );
}

export default App;


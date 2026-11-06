import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

import { ParticleBackground } from './components/ParticleBackground';
import { NebulaBackground }   from './components/NebulaBackground';
import { Header }             from './components/Header';
import { HeroSection }        from './components/HeroSection';
import { ControlPanel }       from './components/ControlPanel';
import { QuantumCircuit }     from './components/QuantumCircuit';
import { PredictionCard }     from './components/PredictionCard';
import { BlochSphere }        from './components/BlochSphere';
import { WhatIfOptimizer }    from './components/WhatIfOptimizer';
import { BatchPrediction }    from './components/BatchPrediction';
import { BenchmarkSection }   from './components/BenchmarkSection';
import { ExplainerModal }     from './components/ExplainerModal';

import { simulateQuantum, type StudentProfile, type PredictionResult } from './quantumEngine';
import { findWhatIfOptimization, type WhatIfResult } from './whatIfEngine';
import { predict, checkBackendHealth }                 from './apiClient';

type Tab = 'studio' | 'batch' | 'benchmark';

const DEFAULT_PROFILE: StudentProfile = {
  studytime: 2, failures: 0, absences: 4, freetime: 3, health: 3,
};

function App() {
  const [profile,       setProfile]       = useState<StudentProfile>(DEFAULT_PROFILE);
  const [result,        setResult]        = useState<PredictionResult | null>(null);
  const [whatIf,        setWhatIf]        = useState<WhatIfResult | null>(null);
  const [running,       setRunning]       = useState(false);
  const [flash,         setFlash]         = useState(false);
  const [explainer,     setExplainer]     = useState(false);
  const [tab,           setTab]           = useState<Tab>('studio');
  const [backendMode,   setBackendMode]   = useState<'mock' | 'real'>('mock');
  const [backendOnline, setBackendOnline] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  /* Live circuit angles always reflect sliders */
  const liveTheta = simulateQuantum(profile).theta;

  /* Health-check backend every 5s when in real mode */
  useEffect(() => {
    if (backendMode !== 'real') return;
    const check = async () => setBackendOnline(await checkBackendHealth());
    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, [backendMode]);

  const handleSimulate = useCallback(async () => {
    setRunning(true);
    setResult(null);
    setWhatIf(null);
    setFlash(true);
    setTimeout(() => setFlash(false), 500);

    try {
      const r = await predict(profile, backendMode === 'real' && backendOnline);
      setResult(r);
      if (r.prediction === 'FAIL') {
        setWhatIf(findWhatIfOptimization(profile));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  }, [profile, backendMode, backendOnline]);

  const applyOptimized = (p: StudentProfile) => {
    setProfile(p);
    setResult(null);
    setWhatIf(null);
  };

  /* PDF export */
  const exportPDF = async () => {
    if (!result || !reportRef.current) return;
    const { default: html2canvas } = await import('html2canvas');
    const { jsPDF } = await import('jspdf');
    const canvas = await html2canvas(reportRef.current, { backgroundColor: '#050814', scale: 2 });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height / canvas.width) * w;
    pdf.addImage(img, 'PNG', 0, 0, w, h);
    pdf.save('QuLearn_Report.pdf');
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'studio',    label: '⚛ Quantum Studio'     },
    { key: 'batch',     label: '📋 Batch Prediction'   },
    { key: 'benchmark', label: '📊 Benchmark'           },
  ];

  return (
    <div className="min-h-screen relative"
      style={{ background: 'linear-gradient(135deg, #050814 0%, #0B112C 50%, #050814 100%)' }}>

      {/* Atmospheric layers */}
      <NebulaBackground />
      <ParticleBackground />
      <div className="scan-line" />

      {/* Header */}
      <Header
        backendMode={backendMode}
        backendOnline={backendOnline}
        onToggleBackend={() => setBackendMode(m => m === 'mock' ? 'real' : 'mock')}
        onOpenExplainer={() => setExplainer(true)}
      />

      {/* Hero */}
      <HeroSection />

      {/* Tab Nav */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-6">
        <div className="flex gap-2 glass rounded-xl p-1 border border-cyan-500/15 w-fit">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-xs font-share-mono transition-all
                ${tab === t.key
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {tab === 'studio' && (
          <motion.section key="studio"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="relative z-10 max-w-7xl mx-auto px-6 pb-10"
          >
            {/* Export button */}
            {result && (
              <div className="flex justify-end mb-3">
                <button onClick={exportPDF}
                  className="flex items-center gap-2 px-4 py-2 glass rounded-lg border border-violet-500/30
                    text-violet-400 text-xs font-share-mono hover:border-violet-400/60 transition-all">
                  <Download size={12} /> Export PDF Report
                </button>
              </div>
            )}

            {/* Studio grid */}
            <div ref={reportRef} className="grid lg:grid-cols-2 gap-5">
              {/* Left col */}
              <div className="flex flex-col gap-4">
                <ControlPanel
                  profile={profile}
                  onChange={setProfile}
                  onSimulate={handleSimulate}
                  isRunning={running}
                />
                {/* What-If Optimizer (shown after FAIL) */}
                {whatIf && (
                  <WhatIfOptimizer result={whatIf} onApply={applyOptimized} />
                )}
              </div>

              {/* Right col */}
              <div className="flex flex-col gap-4">
                <QuantumCircuit theta={liveTheta} isRunning={running} />

                {/* Bloch sphere (shows after prediction) */}
                {result && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <BlochSphere
                      alpha={result.alpha}
                      beta={result.beta}
                      prediction={result.prediction}
                    />
                  </motion.div>
                )}

                <PredictionCard
                  result={result}
                  isRunning={running}
                  predictionFlash={flash}
                />
              </div>
            </div>
          </motion.section>
        )}

        {tab === 'batch' && (
          <motion.section key="batch"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="relative z-10 max-w-4xl mx-auto px-6 pb-10"
          >
            <BatchPrediction />
          </motion.section>
        )}

        {tab === 'benchmark' && (
          <motion.section key="benchmark"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <BenchmarkSection />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Explainer drawer */}
      <ExplainerModal open={explainer} onClose={() => setExplainer(false)} />
    </div>
  );
}

export default App;

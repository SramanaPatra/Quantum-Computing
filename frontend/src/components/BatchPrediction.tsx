import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { simulateQuantum, type StudentProfile } from '../quantumEngine';

interface BatchRow extends StudentProfile {
  id: number;
  prediction?: 'PASS' | 'FAIL';
  probability?: number;
}

export function BatchPrediction() {
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError('');
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed: BatchRow[] = result.data.map((row, i) => ({
          id: i + 1,
          studytime: Math.min(4, Math.max(1, Number(row.studytime) || 2)),
          failures:  Math.min(3, Math.max(0, Number(row.failures)  || 0)),
          absences:  Math.min(50, Math.max(0, Number(row.absences) || 0)),
          freetime:  Math.min(5, Math.max(1, Number(row.freetime)  || 3)),
          health:    Math.min(5, Math.max(1, Number(row.health)    || 3)),
        }));
        if (parsed.length === 0) { setError('No valid rows found in CSV.'); return; }
        setRows(parsed.map(r => ({ ...r, prediction: undefined })));
      },
      error: () => setError('Failed to parse CSV. Check the format.'),
    });
  };

  const runBatch = async () => {
    setProcessing(true);
    const processed: BatchRow[] = [];
    for (const row of rows) {
      await new Promise(r => setTimeout(r, 40)); // small delay for UX
      const result = simulateQuantum(row);
      processed.push({ ...row, prediction: result.prediction, probability: result.probability });
    }
    setRows(processed);
    setProcessing(false);
  };

  const downloadCSV = () => {
    const header = 'id,studytime,failures,absences,freetime,health,prediction,probability\n';
    const body = rows.map(r =>
      `${r.id},${r.studytime},${r.failures},${r.absences},${r.freetime},${r.health},${r.prediction ?? ''},${r.probability !== undefined ? (r.probability * 100).toFixed(1) + '%' : ''}`
    ).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'qml_predictions.csv'; a.click();
  };

  const passCount = rows.filter(r => r.prediction === 'PASS').length;
  const failCount = rows.filter(r => r.prediction === 'FAIL').length;

  return (
    <div className="glass rounded-xl border border-cyan-500/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={16} className="text-cyan-400" />
        <span className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-widest">Batch CSV Prediction</span>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className="border-2 border-dashed border-cyan-500/25 hover:border-cyan-400/50 rounded-xl p-6
          cursor-pointer text-center transition-all group mb-4"
      >
        <Upload size={24} className="mx-auto text-cyan-500/50 group-hover:text-cyan-400 mb-2 transition-colors" />
        <p className="text-xs text-slate-500 font-mono">Drop CSV or click to upload</p>
        <p className="text-xs text-slate-600 font-mono mt-1">Columns: studytime, failures, absences, freetime, health</p>
        <input ref={fileRef} type="file" accept=".csv" className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
      </div>

      {/* Template download */}
      <button
        onClick={() => {
          const csv = 'studytime,failures,absences,freetime,health\n2,0,4,3,4\n1,3,25,5,2\n4,0,1,2,5\n';
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'student_template.csv'; a.click();
        }}
        className="text-xs text-slate-500 hover:text-cyan-400 font-mono underline underline-offset-2 transition-colors mb-4 block"
      >
        Download sample template CSV
      </button>

      {error && <p className="text-xs text-rose-400 font-mono mb-3">{error}</p>}

      {/* Table preview */}
      {rows.length > 0 && (
        <>
          <div className="text-xs text-slate-500 font-mono mb-2">{rows.length} student profiles loaded</div>
          <div className="overflow-auto max-h-56 rounded-lg border border-slate-700/50 mb-4">
            <table className="w-full text-xs font-mono">
              <thead className="sticky top-0 bg-slate-900">
                <tr>
                  {['#', 'Study', 'Fail', 'Absent', 'Free', 'Health', 'Result', 'Prob'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-slate-500 uppercase tracking-wider border-b border-slate-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="px-3 py-1.5 text-slate-500">{r.id}</td>
                    <td className="px-3 py-1.5 text-cyan-300">{r.studytime}</td>
                    <td className="px-3 py-1.5 text-rose-300">{r.failures}</td>
                    <td className="px-3 py-1.5 text-slate-300">{r.absences}</td>
                    <td className="px-3 py-1.5 text-slate-300">{r.freetime}</td>
                    <td className="px-3 py-1.5 text-emerald-300">{r.health}</td>
                    <td className="px-3 py-1.5">
                      {r.prediction ? (
                        r.prediction === 'PASS'
                          ? <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={10} />PASS</span>
                          : <span className="flex items-center gap-1 text-rose-400"><XCircle size={10} />FAIL</span>
                      ) : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-3 py-1.5 text-slate-400">
                      {r.probability !== undefined ? `${(r.probability * 100).toFixed(0)}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary + actions */}
          <AnimatePresence>
            {failCount + passCount > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-3 mb-3 text-xs font-mono">
                <span className="text-emerald-400">✓ {passCount} PASS</span>
                <span className="text-rose-400">✗ {failCount} FAIL</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2">
            <button onClick={runBatch} disabled={processing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold
                bg-cyan-500/15 border border-cyan-500/35 text-cyan-400
                hover:bg-cyan-500/25 hover:border-cyan-400 transition-all disabled:opacity-50">
              {processing ? <Loader2 size={12} className="animate-spin" /> : <Loader2 size={12} />}
              {processing ? 'Simulating…' : 'Run Batch Predict'}
            </button>
            {rows.some(r => r.prediction) && (
              <button onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold
                  bg-violet-500/15 border border-violet-500/35 text-violet-400
                  hover:bg-violet-500/25 transition-all">
                <Download size={12} /> Download Results
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

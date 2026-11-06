// FastAPI backend connector — switches between mock and real Qiskit QSVC
import { simulateQuantum, type StudentProfile, type PredictionResult } from './quantumEngine';

const API_BASE = 'http://localhost:8000';

export async function predictWithBackend(profile: StudentProfile): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!response.ok) throw new Error(`Backend error: ${response.statusText}`);
  const data = await response.json();
  return data as PredictionResult;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function predict(
  profile: StudentProfile,
  useRealBackend: boolean
): Promise<PredictionResult> {
  if (useRealBackend) {
    return await predictWithBackend(profile);
  }
  // Simulate mock delay
  await new Promise(r => setTimeout(r, 650));
  return simulateQuantum(profile);
}

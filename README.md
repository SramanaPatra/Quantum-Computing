# Quantum Machine Learning Student Predictor ⚛️🎓

An end-to-end Quantum Machine Learning (QML) project predicting student academic outcomes using a **Quantum Support Vector Classifier (QSVC)** powered by **Qiskit** and a futuristic **React/TypeScript UI**.

---

## 🌟 Key Features
- **Quantum Feature Encoding**: 5 student socio-academic attributes mapped to 5 qubits via `ZZFeatureMap` (2 repetitions, linear entanglement).
- **Fidelity Quantum Kernel**: High-dimensional Hilbert space separation using `FidelityQuantumKernel`.
- **Classical Benchmarks**: Direct comparison against Classical SVM (RBF Kernel) and Random Forest Classifier.
- **Dual Interfaces**:
  - **React + Tailwind Frontend**: Cyberpunk glassmorphism design with real-time 5-qubit circuit visualization, interactive parameter sliders, dynamic Dirac state notation, and probability gauge.
  - **Streamlit App**: Lightweight Python web app for quick local testing.

---

## 📁 Project Structure

```text
Quantum-Computing/
├── data/                      # Dataset files (UCI Student Performance)
├── data_prep.py               # Data acquisition, cleaning & PCA reduction
├── classical_baseline.py      # SVM & Random Forest benchmarks
├── quantum_model.py           # QSVC implementation using Qiskit
├── app.py                     # Streamlit web interface
├── requirements.txt           # Python dependencies
└── frontend/                  # React + TypeScript + Tailwind Cyberpunk UI
    ├── src/
    │   ├── components/        # Circuit, ControlPanel, Benchmark, Explainer
    │   ├── quantumEngine.ts   # Deterministic quantum simulation engine
    │   └── App.tsx            # Main application layout
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Getting Started

### 1. Python Environment & Quantum Models

```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate   # On Windows
# source venv/bin/activate # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run preprocessing & model benchmarks
python data_prep.py
python classical_baseline.py
python quantum_model.py

# Launch Streamlit app
streamlit run app.py
```

### 2. Modern React Cyberpunk UI

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

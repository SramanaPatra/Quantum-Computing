# Quantum Machine Learning Student Predictor

This project uses a Quantum Support Vector Classifier (QSVC) via Qiskit to predict student academic performance (Pass/Fail) based on a subset of the UCI Student Performance dataset.

## Features
* **Classical Baseline Models:** Support Vector Machine and Random Forest benchmarks.
* **Quantum Classifier (QSVC):** A 5-qubit quantum classifier using a `ZZFeatureMap` and `FidelityQuantumKernel` to classify student records.
* **Interactive Web App:** A Streamlit application that allows real-time adjustments of student parameters and instantly runs the quantum circuit simulation to predict outcomes.

## Getting Started

1. **Clone the repository**
2. **Set up a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the Web Interface:**
   ```bash
   streamlit run app.py
   ```

## Project Structure
* `data_prep.py`: Downloads and preprocesses the UCI dataset.
* `classical_baseline.py`: Trains classical SVM and Random Forest models.
* `quantum_model.py`: Trains the QSVC model.
* `app.py`: The Streamlit web interface.
* `data/`: Directory containing the raw and processed dataset.

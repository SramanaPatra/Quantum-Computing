import numpy as np
import time
from qiskit.circuit.library import ZZFeatureMap
from qiskit_machine_learning.algorithms import QSVC
from qiskit_machine_learning.kernels import FidelityQuantumKernel
from sklearn.metrics import accuracy_score, classification_report

# Load data
X_train = np.load("data/X_train.npy")
X_test = np.load("data/X_test.npy")
y_train = np.load("data/y_train.npy")
y_test = np.load("data/y_test.npy")

num_features = X_train.shape[1]
print(f"Training Quantum Support Vector Classifier (QSVC) on {num_features} qubits...")

# 1. Define the Feature Map
# ZZFeatureMap is a standard feature map for quantum machine learning
feature_map = ZZFeatureMap(feature_dimension=num_features, reps=2, entanglement='linear')

# 2. Define the Quantum Kernel
# We use the fidelity quantum kernel to compute the similarity matrix between points
qkernel = FidelityQuantumKernel(feature_map=feature_map)

# 3. Initialize the QSVC
qsvc = QSVC(quantum_kernel=qkernel)

# 4. Train the Model
print("Training started. This might take a few minutes depending on dataset size...")
start_time = time.time()
qsvc.fit(X_train, y_train)
end_time = time.time()
print(f"Training completed in {end_time - start_time:.2f} seconds.\n")

# 5. Evaluate the Model
print("Evaluating QSVC on test set...")
y_pred = qsvc.predict(X_test)
print("--- QSVC Performance ---")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred))

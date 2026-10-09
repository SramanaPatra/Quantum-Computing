import streamlit as st
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from qiskit.circuit.library import ZZFeatureMap
from qiskit_machine_learning.algorithms import QSVC
from qiskit_machine_learning.kernels import FidelityQuantumKernel

st.set_page_config(page_title="QML Student Predictor", layout="centered")

@st.cache_resource
def load_and_train_model():
    # 1. Load Data
    df = pd.read_csv("data/student-mat.csv", sep=";")
    df['Target'] = (df['G3'] >= 10).astype(int)
    
    # To make the model highly responsive to the UI inputs, we will train it EXCLUSIVELY 
    # on the 5 features the user can control. We will also balance the dataset so it 
    # doesn't simply guess "PASS" (the majority class) every time.
    features = ['studytime', 'failures', 'absences', 'freetime', 'health']
    
    # Balance the dataset (equal number of Pass and Fail)
    df_pass = df[df['Target'] == 1]
    df_fail = df[df['Target'] == 0]
    
    # Take 40 of each to create a fast-training, perfectly balanced subset of 80 samples
    min_size = min(len(df_pass), len(df_fail), 40) 
    df_balanced = pd.concat([df_pass.sample(min_size, random_state=42), df_fail.sample(min_size, random_state=42)])
    df_balanced = df_balanced.sample(frac=1, random_state=42).reset_index(drop=True)
    
    X = df_balanced[features]
    y = df_balanced['Target']
    
    # 2. Scaling to [-1, 1] for ZZFeatureMap
    scaler = MinMaxScaler(feature_range=(-1, 1))
    X_scaled = scaler.fit_transform(X)
    
    # 3. Train QSVC on a 5-qubit feature map
    feature_map = ZZFeatureMap(feature_dimension=5, reps=2, entanglement='linear')
    qkernel = FidelityQuantumKernel(feature_map=feature_map)
    qsvc = QSVC(quantum_kernel=qkernel)
    
    qsvc.fit(X_scaled, y)
    
    return scaler, qsvc

st.title("🎓 Quantum Machine Learning Student Predictor")
st.markdown("This application uses a **Quantum Support Vector Classifier (QSVC)** to predict whether a student will pass or fail based on their profile. It maps 5 key features to a 5-qubit quantum simulator.")

with st.spinner("Initializing and training the Quantum Model on a balanced dataset (This may take ~30 seconds)..."):
    scaler, qsvc = load_and_train_model()

st.success("Quantum Model Loaded and Ready!")

st.header("Student Profile")
st.markdown("Try setting **Failures to 3** and **Study Time to 1** to see the model predict a FAIL.")

col1, col2 = st.columns(2)
with col1:
    studytime = st.slider("Weekly Study Time (1: <2h, 4: >10h)", 1, 4, 2)
    failures = st.slider("Number of past class failures", 0, 3, 0)
    absences = st.slider("Number of school absences", 0, 93, 4)

with col2:
    freetime = st.slider("Free time after school (1: very low, 5: very high)", 1, 5, 3)
    health = st.slider("Current health status (1: very bad, 5: very good)", 1, 5, 3)

if st.button("Predict Performance"):
    # Process user input directly
    user_input = np.array([[studytime, failures, absences, freetime, health]])
    X_scaled = scaler.transform(user_input)
    
    # Predict
    with st.spinner("Running quantum circuit for prediction..."):
        prediction = qsvc.predict(X_scaled)
    
    if prediction[0] == 1:
        st.success("🎉 **Prediction: PASS** (The model predicts the student will achieve a passing grade >= 10)")
        st.balloons()
    else:
        st.error("⚠️ **Prediction: FAIL** (The model predicts the student will achieve a failing grade < 10)")

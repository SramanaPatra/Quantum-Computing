import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, MinMaxScaler
from sklearn.compose import ColumnTransformer
from sklearn.decomposition import PCA
import urllib.request
import zipfile
import os

# 1. Download Data
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00320/student.zip"
zip_path = "student.zip"

print("Downloading dataset...")
urllib.request.urlretrieve(url, zip_path)

print("Extracting dataset...")
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall("data")

# Read the math student dataset (uses semicolons as separators)
df = pd.read_csv("data/student-mat.csv", sep=";")
print(f"Original dataset shape: {df.shape}")

# 2. Target Definition
# 'G3' is the final grade (0-20). We'll convert it to a binary Pass/Fail classification
# for the quantum classifier. Pass >= 10, Fail < 10.
df['Target'] = (df['G3'] >= 10).astype(int)

# Drop the original grade columns to prevent data leakage
X = df.drop(columns=['G1', 'G2', 'G3', 'Target'])
y = df['Target']

# 3. Encoding and Scaling
categorical_cols = X.select_dtypes(include=['object']).columns
numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns

# One-hot encode categorical features and standardize numerical features
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_cols),
        ('cat', OneHotEncoder(drop='first', sparse_output=False), categorical_cols)
    ])

X_preprocessed = preprocessor.fit_transform(X)
print(f"Shape after encoding: {X_preprocessed.shape}")

# 4. Dimensionality Reduction (PCA)
# We reduce to 4 dimensions to map to 4 qubits for our small quantum classifier.
num_qubits = 4
pca = PCA(n_components=num_qubits)
X_pca = pca.fit_transform(X_preprocessed)

# 5. MinMax Scaling for Quantum Feature Map
# Scale between -1 and 1 as is common for quantum feature maps (like ZZFeatureMap)
scaler = MinMaxScaler(feature_range=(-1, 1))
X_scaled = scaler.fit_transform(X_pca)

# 6. Data Splitting
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

print(f"Final Data shape after PCA (mapping to {num_qubits} qubits): {X_scaled.shape}")
print(f"Train samples: {X_train.shape[0]}, Test samples: {X_test.shape[0]}")

# Save the preprocessed data arrays for the next phase
np.save("data/X_train.npy", X_train)
np.save("data/X_test.npy", X_test)
np.save("data/y_train.npy", y_train)
np.save("data/y_test.npy", y_test)
print("Preprocessed data saved successfully in 'data/' directory.")

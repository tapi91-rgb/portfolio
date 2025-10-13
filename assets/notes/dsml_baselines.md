# DS/ML Baselines

A practical approach for IoT/SDN, text, and vision domains using simple, strong baselines first.

## IoT/SDN (Tabular ML)
- Clean CSVs and train/val/test splits
- Start with Logistic Regression, RandomForest, XGBoost
- Evaluate with accuracy, F1, ROC-AUC, confusion matrix

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000))
])
pipe.fit(X_train, y_train)
```

## Text (NLP)
- TF‑IDF + Linear SVM (or Logistic Regression)
- Simple tokenization and lowercase
- Evaluate macro/micro F1; confusion matrix

## Vision (UAV/traffic)
- Small YOLO variants on small datasets
- Train for few epochs; report precision/recall, mAP
- Keep configs and scripts minimal

## Reproducibility
- Pin versions and record seeds
- Include small demo scripts
- README with quick start + results table
# CS Round Winner Predictor API

Backend FastAPI para la predicción de ganadores de ronda en Counter-Strike.

## Instalación

1. Instalar dependencias:
```bash
pip install -r requirements.txt
```

2. Ejecutar el servidor:
```bash
cd backend
python main.py
```

El servidor estará disponible en `http://localhost:8000`

## Endpoints

- `GET /` - Información básica de la API
- `GET /health` - Estado de salud del servidor
- `POST /predict` - Realizar predicción
- `GET /model-info` - Información del modelo

## Uso

Para usar tu modelo entrenado:

1. Entrena tu modelo con tu código original
2. Guarda el modelo y las columnas:
```python
import joblib
joblib.dump(model, "backend/model.joblib")
joblib.dump(X.columns.tolist(), "backend/feature_columns.joblib")
```

3. Reinicia el servidor

El API detectará automáticamente tu modelo guardado.
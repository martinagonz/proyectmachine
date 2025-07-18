"""
FastAPI backend para predicción de ganador de ronda en Counter-Strike
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
from typing import Dict
import warnings


warnings.filterwarnings('ignore')


app = FastAPI(title="CS Round Winner Predictor", version="1.0.0")


# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Modelo global
model = None
feature_columns = None


class PredictionRequest(BaseModel):
    round_kills: float
    time_alive: float
    lethal_grenades: float
    non_lethal_grenades: float
    travelled_distance: float
    survived: int  # 0 o 1
    team: str  # "CT" o "T"
    map_name: str
    abnormal_match: int  # 0 o 1


class PredictionResponse(BaseModel):
    prediction: int
    probability: float
    team_win_probability: Dict[str, float]
    feature_importance: Dict[str, float]


def preprocess_input(request: PredictionRequest) -> pd.DataFrame:
    """Procesa la entrada y crea las características necesarias"""
    data = {
        'RoundKills': request.round_kills,
        'TimeAlive': request.time_alive,
        'RLethalGrenadesThrown': request.lethal_grenades,
        'RNonLethalGrenadesThrown': request.non_lethal_grenades,
        'TravelledDistance': request.travelled_distance,
        'Survived': request.survived,
        'AbnormalMatch': request.abnormal_match,
        'Team_T': 1 if request.team == 'T' else 0,
        'Map_de_dust2': 1 if request.map_name == 'de_dust2' else 0,
        'Map_de_mirage': 1 if request.map_name == 'de_mirage' else 0,
        'Map_de_inferno': 1 if request.map_name == 'de_inferno' else 0,
        'Map_de_cache': 1 if request.map_name == 'de_cache' else 0,
    }


    df = pd.DataFrame([data])


    # Crear variables derivadas
    df['KillEfficiency'] = df['RoundKills'] / (df['TimeAlive'] + 1e-5)
    df['GrenadesThrown'] = df['RLethalGrenadesThrown'] + df['RNonLethalGrenadesThrown']
    df['AggressionIndex'] = (df['GrenadesThrown'] + df['TravelledDistance']) / (df['TimeAlive'] + 1e-5)


    # Asegurar que tiene todas las columnas necesarias
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0


    return df[feature_columns]


@app.on_event("startup")
async def load_model():
    """Carga el modelo entrenado y sus columnas al iniciar la aplicación"""
    global model, feature_columns


    try:
        if os.path.exists("random_forest_model.joblib") and os.path.exists("feature_columns.joblib"):
            model = joblib.load("random_forest_model.joblib")
            feature_columns = joblib.load("feature_columns.joblib")
        else:
            raise FileNotFoundError("Faltan archivos del modelo")
    except Exception as e:
        raise RuntimeError(f"No se pudo cargar el modelo: {str(e)}")


@app.get("/")
async def root():
    return {"message": "CS Round Winner Predictor API", "status": "active"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}


@app.post("/predict", response_model=PredictionResponse)
async def predict_round_winner(request: PredictionRequest):
    """Predice el ganador de la ronda basado en las características del juego"""
    try:
        if model is None:
            raise HTTPException(status_code=500, detail="Modelo no cargado")


        # Procesar entrada
        X = preprocess_input(request)


        # Hacer predicción
        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0]


        # Obtener importancia de características
        feature_importance = dict(zip(feature_columns, model.feature_importances_))
        top_features = dict(sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:5])


        return PredictionResponse(
            prediction=int(prediction),
            probability=float(probabilities[1] if prediction == 1 else probabilities[0]),
            team_win_probability={
                "team_0": float(probabilities[0]),
                "team_1": float(probabilities[1])
            },
            feature_importance=top_features
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al predecir: {str(e)}")


@app.get("/model-info")
async def get_model_info():
    """Devuelve información del modelo cargado"""
    if model is None:
        raise HTTPException(status_code=500, detail="Modelo no cargado")


    return {
        "model_type": "RandomForestClassifier",
        "n_features": len(feature_columns),
        "feature_names": feature_columns
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
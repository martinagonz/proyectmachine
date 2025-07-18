from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CS Headshot Predictor", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de datos de entrada
class PlayerStats(BaseModel):
    match_kills: int = Field(..., ge=0, le=100, description="Total kills in the match")
    round_kills: int = Field(..., ge=0, le=100, description="Kills in current round")
    round_assists: int = Field(..., ge=0, le=100, description="Assists in current round")
    round_flank_kills: int = Field(..., ge=0, le=100, description="Flank kills in current round")
    round_starting_equipment_value: int = Field(..., ge=0, le=16000, description="Equipment value at round start")
    primary_assault_rifle: int = Field(..., ge=0, le=1, description="Has assault rifle (0 or 1)")
    primary_sniper_rifle: int = Field(..., ge=0, le=1, description="Has sniper rifle (0 or 1)")

# Modelo de respuesta
class PredictionResponse(BaseModel):
    predicted_headshots: float
    confidence_score: float
    player_stats: PlayerStats
    model_info: dict

# Cargar modelo real
try:
    model = joblib.load("random_forest_model.joblib")
    logger.info("Modelo real cargado exitosamente desde random_forest_model.joblib")
except Exception as e:
    logger.error(f"Error cargando modelo: {e}")
    model = None

@app.get("/")
async def root():
    return {"message": "CS Headshot Predictor API", "status": "active"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "version": "1.0.0"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_headshots(stats: PlayerStats):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Preparar datos para predicción
        features = np.array([[
            stats.match_kills,
            stats.round_kills,
            stats.round_assists,
            stats.round_flank_kills,
            stats.round_starting_equipment_value,
            stats.primary_assault_rifle,
            stats.primary_sniper_rifle
        ]])

        # Hacer predicción
        prediction = model.predict(features)[0]

        # Estimar confianza usando una constante (puedes mejorarla si quieres con varianza de árboles)
        confidence = 0.85  # Valor fijo como placeholder

        # Asegurar que la predicción esté en un rango realista
        prediction = max(0, min(5, prediction))

        return PredictionResponse(
            predicted_headshots=round(prediction, 2),
            confidence_score=round(confidence, 2),
            player_stats=stats,
            model_info={
                "model_type": "Random Forest Regressor",
                "features_used": 7,
                "prediction_range": "0-5 headshots",
                "accuracy_note": "Modelo real entrenado y cargado desde archivo .joblib"
            }
        )

    except Exception as e:
        logger.error(f"Error en predicción: {e}")
        raise HTTPException(status_code=500, detail="Error processing prediction")

@app.get("/model-info")
async def get_model_info():
    return {
        "model_type": "Random Forest Regressor",
        "features": [
            "Match Kills",
            "Round Kills", 
            "Round Assists",
            "Round Flank Kills",
            "Round Starting Equipment Value",
            "Primary Assault Rifle",
            "Primary Sniper Rifle"
        ],
        "target": "Round Headshots",
        "description": "Predicts the number of headshots a player will achieve in a CS round",
        "input_ranges": {
            "match_kills": "0-100",
            "round_kills": "0-5",
            "round_assists": "0-5", 
            "round_flank_kills": "0-5",
            "round_starting_equipment_value": "0-16000",
            "primary_assault_rifle": "0 or 1",
            "primary_sniper_rifle": "0 or 1"
        }
    }

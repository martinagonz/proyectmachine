import React from 'react';
import { Trophy, XCircle } from 'lucide-react';
import { PredictionResponse } from '../types/prediction';

interface PredictionResultProps {
  prediction: PredictionResponse;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction }) => {
  // Si prediction.player_won es 1 -> ganó, si es 0 -> perdió
  const playerResult = prediction.prediction === 1 ? '¡El jugador ganó!' : 'El jugador perdió';
  const confidence = Math.round(prediction.probability * 100);

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-400';
    if (conf >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBgColor = (conf: number) => {
    if (conf >= 80) return 'from-green-500/20 to-green-600/20 border-green-500/30';
    if (conf >= 60) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    return 'from-red-500/20 to-red-600/20 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Main Prediction */}
      <div className={`bg-gradient-to-r ${getConfidenceBgColor(confidence)} backdrop-blur-sm rounded-2xl border p-8 text-center`}>
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-white/10 rounded-full">
            {prediction.prediction === 1 ? (
              <Trophy className="h-12 w-12 text-yellow-400" />
            ) : (
              <XCircle className="h-12 w-12 text-red-400" />
            )}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Resultado del Jugador</h3>
        <p className="text-4xl font-bold text-white mb-2">{playerResult}</p>
        
      </div>
    </div>
  );
};

export default PredictionResult;

import React, { useState, useRef } from 'react';
import { Target, Zap, TrendingUp, Shield, Crosshair, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

interface PlayerStats {
  match_kills: number;
  round_kills: number;
  round_assists: number;
  round_flank_kills: number;
  round_starting_equipment_value: number;
  primary_assault_rifle: number;
  primary_sniper_rifle: number;
}

interface PredictionResult {
  predicted_headshots: number;
  confidence_score: number;
  player_stats: PlayerStats;
  model_info: {
    model_type: string;
    features_used: number;
    prediction_range: string;
    accuracy_note: string;
  };
}

interface PredictionHistory {
  id: number;
  stats: PlayerStats;
  prediction: number;
  confidence: number;
  timestamp: Date;
}

function App() {
  const [stats, setStats] = useState<PlayerStats>({
    match_kills: 15,
    round_kills: 2,
    round_assists: 1,
    round_flank_kills: 0,
    round_starting_equipment_value: 4500,
    primary_assault_rifle: 1,
    primary_sniper_rifle: 0,
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: keyof PlayerStats, value: string) => {
    const numValue = parseInt(value) || 0;
    setStats(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats),
      });

      if (!response.ok) {
        throw new Error('Error en la predicción');
      }

      const result: PredictionResult = await response.json();
      setPrediction(result);
      
      // Agregar al historial
      const newEntry: PredictionHistory = {
        id: Date.now(),
        stats: { ...stats },
        prediction: result.predicted_headshots,
        confidence: result.confidence_score,
        timestamp: new Date()
      };
      
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Mantener últimas 10

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (err) {
      setError('Error al conectar con el servidor. Asegúrate de que el backend esté ejecutándose.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Alta';
    if (confidence >= 0.6) return 'Media';
    return 'Baja';
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">CS Headshot Predictor</h1>
              <p className="text-blue-200">Predicción de headshots por ronda usando Random Forest</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Backend Status Warning */}
      

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Estadísticas del Jugador</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Kills en la Partida
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stats.match_kills}
                    onChange={(e) => handleInputChange('match_kills', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Kills en la Ronda
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={stats.round_kills}
                    onChange={(e) => handleInputChange('round_kills', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Asistencias en la Ronda
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={stats.round_assists}
                    onChange={(e) => handleInputChange('round_assists', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Kills de Flanco
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={stats.round_flank_kills}
                    onChange={(e) => handleInputChange('round_flank_kills', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Valor del Equipamiento
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="16000"
                    step="100"
                    value={stats.round_starting_equipment_value}
                    onChange={(e) => handleInputChange('round_starting_equipment_value', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formatCurrency(stats.round_starting_equipment_value)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Armas Primarias
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={stats.primary_assault_rifle === 1}
                        onChange={(e) => handleInputChange('primary_assault_rifle', e.target.checked ? '1' : '0')}
                        className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-300">Rifle de Asalto</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={stats.primary_sniper_rifle === 1}
                        onChange={(e) => handleInputChange('primary_sniper_rifle', e.target.checked ? '1' : '0')}
                        className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-300">Rifle de Francotirador</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePredict}
                disabled={isLoading}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analizando...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    <span>Predecir Headshots</span>
                  </>
                )}
              </button>
            </div>

            {/* History Toggle */}
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <TrendingUp className="h-5 w-5" />
                <span>{showHistory ? 'Ocultar' : 'Mostrar'} Historial ({history.length})</span>
              </button>
            )}
          </div>

          {/* Results and History */}
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Prediction Results */}
            {prediction && (
              <div ref={resultsRef} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <Crosshair className="h-6 w-6 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">Resultado de la Predicción</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center space-x-3">
                      <Target className="h-8 w-8 text-green-400" />
                      <div>
                        <p className="text-sm text-green-200">Headshots Predichos</p>
                        <p className="text-2xl font-bold text-green-300">
                          {prediction.predicted_headshots}
                        </p>
                      </div>
                    </div>
                  </div>

                
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Información del Modelo</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Tipo:</span>
                      <span className="text-white ml-2">{prediction.model_info.model_type}</span>
                    </div>
                 
                  
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            {showHistory && history.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Historial de Predicciones</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((entry) => (
                    <div key={entry.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-green-300 font-semibold">
                            {entry.prediction} headshots
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <span>Kills: {entry.stats.round_kills}</span>
                        
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
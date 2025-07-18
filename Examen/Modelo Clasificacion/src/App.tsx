import React, { useState } from 'react';
import { Target, Zap, Award, TrendingUp, Users, Map } from 'lucide-react';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import ModelInfo from './components/ModelInfo';
import { PredictionRequest, PredictionResponse } from './types/prediction';

function App() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (data: PredictionRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error al hacer la predicción');
      }
      
      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">CS Round Predictor</h1>
                <p className="text-orange-200">Predicción de ganador de ronda con IA</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-orange-200">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Random Forest</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Counter-Strike</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Form */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="h-6 w-6 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">Datos de la Ronda</h2>
              </div>
              <PredictionForm onPredict={handlePredict} loading={loading} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-7 space-y-6">
          

            {/* Prediction Result */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}
            
            {prediction && <PredictionResult prediction={prediction} />}
            
            {!prediction && !error && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
                <Target className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Listo para Predecir</h3>
                <p className="text-gray-300">
                  Completa el formulario con los datos de la ronda para obtener una predicción del ganador.
                </p>
              </div>
            )}

            {/* Model Info */}
            <ModelInfo />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-orange-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-orange-200">
            <p>© 2025 CS Round Predictor. Powered by Random Forest & FastAPI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
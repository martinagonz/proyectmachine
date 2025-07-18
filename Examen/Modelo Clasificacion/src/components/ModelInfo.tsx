import React, { useState, useEffect } from 'react';
import { Brain, Database, Settings, Activity } from 'lucide-react';

interface ModelInfo {
  model_type: string;
  n_estimators: number;
  n_features: number;
  feature_names: string[];
}

const ModelInfo: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const response = await fetch('http://localhost:8000/model-info');
        if (response.ok) {
          const info = await response.json();
          setModelInfo(info);
        }
      } catch (error) {
        console.error('Error fetching model info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModelInfo();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gray-600 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!modelInfo) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="h-6 w-6 text-green-400" />
        <h3 className="text-xl font-semibold text-white">Información del Modelo</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Type */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="h-5 w-5 text-blue-400" />
            <h4 className="font-semibold text-white">Tipo de Modelo</h4>
          </div>
          <p className="text-gray-300">{modelInfo.model_type}</p>
        </div>

        {/* Estimators */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <h4 className="font-semibold text-white">Estimadores</h4>
          </div>
          <p className="text-gray-300">{modelInfo.n_estimators} árboles</p>
        </div>

        {/* Features Count */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Database className="h-5 w-5 text-yellow-400" />
            <h4 className="font-semibold text-white">Características</h4>
          </div>
          <p className="text-gray-300">{modelInfo.n_features} variables</p>
        </div>

        {/* Performance */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Brain className="h-5 w-5 text-green-400" />
            <h4 className="font-semibold text-white">Estado</h4>
          </div>
          <p className="text-green-300">✓ Modelo cargado</p>
        </div>
      </div>

      {/* Feature List */}
      <div className="mt-6">
        <h4 className="font-semibold text-white mb-3">Variables del Modelo:</h4>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {modelInfo.feature_names.map((feature, index) => (
            <div key={index} className="bg-white/5 rounded px-3 py-2">
              <span className="text-sm text-gray-300 capitalize">
                {feature.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;
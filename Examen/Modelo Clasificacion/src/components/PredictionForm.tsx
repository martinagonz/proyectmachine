import React, { useState } from 'react';
import { Play, Users, Clock, Bomb, MapPin } from 'lucide-react';
import { PredictionRequest } from '../types/prediction';


interface PredictionFormProps {
  onPredict: (data: PredictionRequest) => void;
  loading: boolean;
}


const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict, loading }) => {
  const [formData, setFormData] = useState<PredictionRequest>({
    round_kills: 0,
    time_alive: 100,
    lethal_grenades: 0,
    non_lethal_grenades: 0,
    travelled_distance: 1000,
    survived: 1,
    team: 'CT',
    map_name: 'de_dust2',
    abnormal_match: 0,
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };


  const handleInputChange = (field: keyof PredictionRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Team Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          <Users className="inline h-4 w-4 mr-2" />
          Equipo
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleInputChange('team', 'CT')}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
              formData.team === 'CT'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white/5 text-gray-300 border-gray-600 hover:bg-white/10'
            }`}
          >
            Counter-Terrorists
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('team', 'T')}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
              formData.team === 'T'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white/5 text-gray-300 border-gray-600 hover:bg-white/10'
            }`}
          >
            Terrorists
          </button>
        </div>
      </div>


      {/* Map Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          <MapPin className="inline h-4 w-4 mr-2" />
          Mapa
        </label>
        <select
          value={formData.map_name}
          onChange={(e) => handleInputChange('map_name', e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="de_dust2">Dust 2</option>
          <option value="de_mirage">Mirage</option>
          <option value="de_inferno">Inferno</option>
          <option value="de_cache">Cache</option>
        </select>
      </div>


      {/* Combat Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white flex items-center">
          <Bomb className="h-5 w-5 mr-2 text-orange-400" />
          Estadísticas de Combate
        </h3>
       
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Kills en la Ronda
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.round_kills}
              onChange={(e) => handleInputChange('round_kills', Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Tiempo Vivo (seg)
            </label>
            <input
              type="number"
              min="0"
              max="2400"
              value={formData.time_alive}
              onChange={(e) => handleInputChange('time_alive', Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>


        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Granadas Letales
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.lethal_grenades}
              onChange={(e) => handleInputChange('lethal_grenades', Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Granadas No Letales
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.non_lethal_grenades}
              onChange={(e) => handleInputChange('non_lethal_grenades', Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Distancia Recorrida (unidades)
          </label>
          <input
            type="number"
            min="0"
            max="5000"
            value={formData.travelled_distance}
            onChange={(e) => handleInputChange('travelled_distance', Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>


      {/* Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-400" />
          Estado del Jugador
        </h3>
       
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.survived === 1}
              onChange={(e) => handleInputChange('survived', e.target.checked ? 1 : 0)}
              className="mr-2 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 rounded"
            />
            <span className="text-gray-200">Sobrevivió la ronda</span>
          </label>
        </div>


        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.abnormal_match === 1}
              onChange={(e) => handleInputChange('abnormal_match', e.target.checked ? 1 : 0)}
              className="mr-2 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 rounded"
            />
            <span className="text-gray-200">Partida anormal</span>
          </label>
        </div>
      </div>


      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Prediciendo...</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            <span>Predecir Ganador</span>
          </>
        )}
      </button>
    </form>
  );
};


export default PredictionForm;

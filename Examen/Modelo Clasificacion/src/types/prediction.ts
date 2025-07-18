export interface PredictionRequest {
  round_kills: number;
  time_alive: number;
  lethal_grenades: number;
  non_lethal_grenades: number;
  travelled_distance: number;
  survived: number;
  team: string;
  map_name: string;
  abnormal_match: number;
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  team_win_probability: {
    team_0: number;
    team_1: number;
  };
  feature_importance: {
    [key: string]: number;
  };
}
# CS Headshot Predictor

Una aplicación web moderna que utiliza un modelo Random Forest para predecir el número de headshots que un jugador realizará por ronda en Counter-Strike.

## 🎯 Características

- **Predicción en tiempo real**: Utiliza Random Forest Regressor para predicciones precisas
- **Interfaz moderna**: Diseño gaming con animaciones y efectos visuales
- **API robusta**: Backend con FastAPI para serving del modelo ML
- **Historial de predicciones**: Mantiene un registro de las últimas 10 predicciones
- **Validación de datos**: Controles de entrada con rangos realistas
- **Responsive design**: Funciona en desktop, tablet y móvil

## 🚀 Tecnologías

### Frontend
- React 18 con TypeScript
- Tailwind CSS para estilos
- Lucide React para iconos
- Vite como bundler

### Backend
- FastAPI para la API REST
- Scikit-learn para el modelo ML
- Pydantic para validación de datos
- Uvicorn como servidor ASGI

## 📋 Características del Modelo

El modelo Random Forest utiliza las siguientes características para predecir headshots:

- **Match Kills**: Total de kills en la partida (0-100)
- **Round Kills**: Kills en la ronda actual (0-5) 
- **Round Assists**: Asistencias en la ronda (0-5)
- **Round Flank Kills**: Kills de flanco en la ronda (0-5)
- **Round Starting Equipment Value**: Valor del equipamiento ($0-$16,000)
- **Primary Assault Rifle**: Si tiene rifle de asalto (0/1)
- **Primary Sniper Rifle**: Si tiene rifle de francotirador (0/1)

## 🛠️ Instalación y Uso

### Requisitos Previos
- Node.js 18+ 
- Python 3.8+
- npm o yarn

### Configuración del Frontend

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Configuración del Backend

```bash
# Ir al directorio backend
cd backend

# Instalar dependencias Python
pip install -r requirements.txt

# Iniciar servidor FastAPI
python start.py
```

### Ejecutar Aplicación Completa

```bash
# Instalar concurrently si no está instalado
npm install concurrently

# Iniciar frontend y backend simultáneamente
npm run start-full
```

## 🔧 Estructura del Proyecto

```
/
├── src/                    # Frontend React
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos base
├── backend/               # Backend FastAPI
│   ├── main.py           # API principal
│   ├── start.py          # Script de inicio
│   └── requirements.txt  # Dependencias Python
├── public/               # Archivos estáticos
└── package.json         # Configuración Node.js
```

## 🎮 Uso de la Aplicación

1. **Ingresar Estadísticas**: Completa el formulario con las estadísticas del jugador
2. **Obtener Predicción**: Haz clic en "Predecir Headshots" para obtener el resultado
3. **Analizar Resultado**: Revisa la predicción y el nivel de confianza
4. **Ver Historial**: Consulta las predicciones anteriores en el historial

## 📊 Interpretación de Resultados

- **Predicción**: Número estimado de headshots (0-5 por ronda)
- **Confianza**: Porcentaje de confianza del modelo (basado en varianza)
  - 🟢 Alta (80%+): Predicción muy confiable
  - 🟡 Media (60-79%): Predicción moderadamente confiable  
  - 🔴 Baja (<60%): Predicción con mayor incertidumbre

## 🔮 Personalización del Modelo

Para usar tu modelo real entrenado:

1. Exporta tu modelo Random Forest usando `joblib`:
```python
import joblib
joblib.dump(best_rf, 'headshot_model.pkl')
```

2. Reemplaza el modelo mock en `backend/main.py`:
```python
# Cargar modelo real
model = joblib.load('headshot_model.pkl')
```

3. Ajusta las métricas de evaluación según tu modelo

## 📈 Mejoras Futuras

- Integración con bases de datos para persistencia
- Análisis de rendimiento histórico del jugador
- Comparación con otros jugadores
- Exportación de reportes
- Integración con APIs de Steam/CS

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para detalles.
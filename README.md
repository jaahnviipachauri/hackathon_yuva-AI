# 🌡️ Urban Heat Island Detector - Advanced Edition

An AI-powered comprehensive web application that analyzes urban heat island effects in Indian cities with advanced visualizations, satellite imagery, and detailed climate adaptation recommendations.

## 🚀 Enhanced Features

### **Core Analysis**
- **Real-time Weather Analysis**: Fetches current temperature, humidity, and weather conditions
- **Air Quality Monitoring**: Displays AQI with health interpretations
- **AI-Powered UHI Prediction**: Advanced machine learning to assess Urban Heat Island risk levels
- **Historical Temperature Trends**: 5-year temperature analysis with interactive charts
- **Risk Scoring**: Comprehensive 0-100 risk score calculation

### **Advanced Visualizations**
- **Interactive Google Maps**: Heat zone visualization with satellite imagery
- **Temperature Charts**: Historical trends with Recharts integration
- **Satellite Imagery**: Thermal views, heat maps, and before/after comparisons
- **Heat Zone Analysis**: Detailed zone-by-zone temperature analysis
- **Real-time Notifications**: Toast notifications for user feedback

### **Comprehensive Data**
- **City Demographics**: Population, area, and density information
- **Heat Zone Mapping**: 5+ heat zones with intensity analysis
- **Satellite Data**: Thermal imagery and heat distribution maps
- **Historical Analysis**: Multi-year temperature trend analysis
- **Adaptation Planning**: Budget estimates, timelines, and detailed measures

### **Enhanced UI/UX**
- **Tabbed Interface**: Overview, Maps, Charts, Satellite, and Heat Zones
- **Responsive Design**: Works perfectly on all device sizes
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Color-coded Results**: Visual indicators for all metrics
- **Modern Icons**: Lucide React icons throughout the interface

## 🏗️ Architecture

### Backend (Flask API)
- **Framework**: Flask with CORS support
- **Weather Data**: OpenWeatherMap API integration with fallback to mock data
- **AI Model**: Advanced rule-based UHI risk prediction algorithm
- **Features**: City validation, historical data generation, satellite imagery URLs, heat zone analysis
- **New Endpoints**: Historical data, satellite imagery, heat zones, enhanced analysis

### Frontend (React)
- **Framework**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS with custom gradients and animations
- **HTTP Client**: Axios for API communication with error handling
- **Maps**: Google Maps integration with heat layer visualization
- **Charts**: Recharts for interactive temperature trend visualization
- **Notifications**: React Hot Toast for user feedback
- **Icons**: Lucide React for modern iconography
- **Features**: Tabbed interface, real-time search, comprehensive data display

## 📁 Project Structure

```
hackathon/
├── backend/
│   ├── app.py              # Enhanced Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── Procfile           # Deployment configuration
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── GoogleMap.js        # Google Maps integration
│   │   │   ├── TemperatureChart.js # Historical temperature charts
│   │   │   ├── SatelliteImagery.js # Satellite imagery viewer
│   │   │   └── HeatZoneAnalysis.js # Heat zone analysis
│   │   ├── App.js          # Enhanced main React component
│   │   ├── App.css         # Custom styles
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Tailwind CSS
│   ├── package.json        # Enhanced Node.js dependencies
│   ├── tailwind.config.js  # Tailwind configuration
│   └── postcss.config.js   # PostCSS configuration
├── run_backend.sh         # Backend startup script
├── run_frontend.sh        # Frontend startup script
└── README.md              # Comprehensive documentation
```

## 🛠️ Setup Instructions

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up OpenWeatherMap API** (optional):
   - Get API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Replace `your_openweather_api_key_here` in `app.py` with your actual API key
   - If not configured, the app will use mock data

5. **Run the server**:
   ```bash
   python app.py
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```
   App will run on `http://localhost:3000`

## 🌐 API Endpoints

### `POST /api/uhi-analysis`
Analyzes a city for Urban Heat Island effects.

**Request Body**:
```json
{
  "city": "Delhi"
}
```

**Response**:
```json
{
  "city": "Delhi",
  "temperature": 36,
  "humidity": 65,
  "aqi": 189,
  "aqi_interpretation": "Unhealthy",
  "weather_description": "clear sky",
  "wind_speed": 3.2,
  "uhi_level": "High",
  "recommended_trees": 15000,
  "measures": [
    "Plant 12,000-20,000 trees in urban areas",
    "Implement reflective roofing materials",
    "Create rooftop gardens on commercial buildings"
  ],
  "timestamp": "2024-01-15T10:30:00"
}
```

### `GET /api/cities`
Returns list of supported Indian cities.

### `GET /health`
Health check endpoint.

## 🎯 Supported Cities

The application supports major Indian cities including:
- Delhi, Mumbai, Bangalore, Chennai, Kolkata
- Hyderabad, Pune, Ahmedabad, Jaipur, Surat
- And 25+ other major Indian cities

## 🤖 AI Model Details

The UHI risk prediction uses a rule-based algorithm that considers:

- **Temperature**: Higher temperatures increase UHI risk
- **Air Quality Index**: Higher pollution levels correlate with UHI effects
- **Humidity**: Low humidity in hot conditions amplifies heat effects
- **City-specific factors**: Known high-UHI cities get additional risk weighting

**Risk Levels**:
- **Low**: Minimal UHI effects, basic maintenance recommended
- **Medium**: Moderate risk, strategic interventions needed
- **High**: Significant UHI effects, comprehensive adaptation required

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Create `Procfile` in backend directory:
   ```
   web: gunicorn app:app
   ```
2. Deploy to Render or Heroku
3. Set environment variables for production

### Frontend Deployment (Vercel/Netlify)
1. Build the React app:
   ```bash
   npm run build
   ```
2. Deploy to Vercel or Netlify
3. Set environment variable `REACT_APP_API_URL` to your backend URL

## 🔧 Environment Variables

### Backend
- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (optional)

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000)

## 📊 Demo Flow

1. **User Input**: Enter a city name (e.g., "Delhi")
2. **Data Fetching**: Backend fetches weather data and generates AQI
3. **AI Analysis**: Algorithm predicts UHI risk level
4. **Recommendations**: System suggests specific adaptation measures
5. **Results Display**: Frontend shows comprehensive analysis with actionable insights

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Color-coded Results**: Visual indicators for temperature, AQI, and risk levels
- **Interactive Elements**: Smooth animations and hover effects
- **Accessibility**: Proper contrast ratios and semantic HTML

## 🔮 Future Enhancements

- Real-time satellite data integration
- Historical trend analysis
- Interactive maps with heat zones
- Community reporting features
- Advanced ML models with more data sources

## 📝 License

This project is built for hackathon purposes and educational use.

## 🤝 Contributing

This is a hackathon project. Feel free to fork and enhance for your own use!

---

**Built with ❤️ for sustainable urban development in India**

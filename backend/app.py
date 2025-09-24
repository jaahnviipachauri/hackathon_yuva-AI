from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import random
import json
from datetime import datetime, timedelta
import math

app = Flask(__name__)
CORS(app)

# OpenWeatherMap API configuration
OPENWEATHER_API_KEY = "your_openweather_api_key_here"  # Replace with actual API key
OPENWEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

# Indian cities data with coordinates and additional info
INDIAN_CITIES = {
    "Delhi": {"lat": 28.6139, "lng": 77.2090, "population": 32941000, "area": 1484},
    "Mumbai": {"lat": 19.0760, "lng": 72.8777, "population": 20411000, "area": 603},
    "Bangalore": {"lat": 12.9716, "lng": 77.5946, "population": 12479000, "area": 741},
    "Chennai": {"lat": 13.0827, "lng": 80.2707, "population": 11244000, "area": 426},
    "Kolkata": {"lat": 22.5726, "lng": 88.3639, "population": 14974000, "area": 185},
    "Hyderabad": {"lat": 17.3850, "lng": 78.4867, "population": 10494000, "area": 650},
    "Pune": {"lat": 18.5204, "lng": 73.8567, "population": 3124000, "area": 331},
    "Ahmedabad": {"lat": 23.0225, "lng": 72.5714, "population": 5570000, "area": 464},
    "Jaipur": {"lat": 26.9124, "lng": 75.7873, "population": 3073000, "area": 467},
    "Surat": {"lat": 21.1702, "lng": 72.8311, "population": 4467000, "area": 327},
    "Lucknow": {"lat": 26.8467, "lng": 80.9462, "population": 2817000, "area": 631},
    "Kanpur": {"lat": 26.4499, "lng": 80.3319, "population": 2767000, "area": 403},
    "Nagpur": {"lat": 21.1458, "lng": 79.0882, "population": 2405000, "area": 217},
    "Indore": {"lat": 22.7196, "lng": 75.8577, "population": 1964000, "area": 530},
    "Thane": {"lat": 19.2183, "lng": 72.9781, "population": 1841000, "area": 147},
    "Bhopal": {"lat": 23.2599, "lng": 77.4126, "population": 1798000, "area": 285},
    "Visakhapatnam": {"lat": 17.6868, "lng": 83.2185, "population": 1728000, "area": 682},
    "Pimpri-Chinchwad": {"lat": 18.6298, "lng": 73.7997, "population": 1726000, "area": 171},
    "Patna": {"lat": 25.5941, "lng": 85.1376, "population": 1684000, "area": 250},
    "Vadodara": {"lat": 22.3072, "lng": 73.1812, "population": 1670000, "area": 235},
    "Ghaziabad": {"lat": 28.6692, "lng": 77.4538, "population": 1648000, "area": 259},
    "Ludhiana": {"lat": 30.9010, "lng": 75.8573, "population": 1618000, "area": 310},
    "Agra": {"lat": 27.1767, "lng": 78.0081, "population": 1585000, "area": 188},
    "Nashik": {"lat": 19.9975, "lng": 73.7898, "population": 1485000, "area": 264},
    "Faridabad": {"lat": 28.4089, "lng": 77.3178, "population": 1414000, "area": 215},
    "Meerut": {"lat": 28.9845, "lng": 77.7064, "population": 1305000, "area": 450},
    "Rajkot": {"lat": 22.3039, "lng": 70.8022, "population": 1285000, "area": 170},
    "Kalyan-Dombivali": {"lat": 19.2403, "lng": 73.1305, "population": 1247000, "area": 137},
    "Vasai-Virar": {"lat": 19.4259, "lng": 72.8225, "population": 1222000, "area": 328},
    "Varanasi": {"lat": 25.3176, "lng": 82.9739, "population": 1198000, "area": 80},
    "Srinagar": {"lat": 34.0837, "lng": 74.7973, "population": 1180000, "area": 294},
    "Aurangabad": {"lat": 19.8762, "lng": 75.3433, "population": 1175000, "area": 138},
    "Navi Mumbai": {"lat": 19.0330, "lng": 73.0297, "population": 1120000, "area": 344},
    "Solapur": {"lat": 17.6599, "lng": 75.9064, "population": 951000, "area": 180}
}

def get_weather_data(city_name):
    """Fetch weather data from OpenWeatherMap API"""
    try:
        # For demo purposes, we'll use mock data if API key is not configured
        if OPENWEATHER_API_KEY == "your_openweather_api_key_here":
            return get_mock_weather_data(city_name)
        
        params = {
            'q': f"{city_name},IN",
            'appid': OPENWEATHER_API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(OPENWEATHER_BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        return {
            'temperature': round(data['main']['temp']),
            'humidity': data['main']['humidity'],
            'pressure': data['main']['pressure'],
            'description': data['weather'][0]['description'],
            'wind_speed': data['wind']['speed']
        }
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return get_mock_weather_data(city_name)

def get_mock_weather_data(city_name):
    """Generate mock weather data for demo purposes"""
    # Simulate different weather patterns for different cities
    base_temp = {
        "Delhi": 35, "Mumbai": 28, "Bangalore": 25, "Chennai": 32,
        "Kolkata": 30, "Hyderabad": 33, "Pune": 28, "Ahmedabad": 36
    }
    
    temp = base_temp.get(city_name, random.randint(25, 40))
    # Add some randomness
    temp += random.randint(-3, 5)
    
    return {
        'temperature': temp,
        'humidity': random.randint(40, 90),
        'pressure': random.randint(1000, 1020),
        'description': random.choice(['clear sky', 'few clouds', 'scattered clouds', 'overcast clouds']),
        'wind_speed': random.uniform(1, 10)
    }

def get_aqi_data(city_name):
    """Get AQI data (mock implementation)"""
    # Mock AQI data - in real implementation, use air quality API
    aqi_ranges = {
        "Delhi": (150, 300), "Mumbai": (100, 200), "Bangalore": (80, 150),
        "Chennai": (90, 180), "Kolkata": (120, 250), "Hyderabad": (70, 140),
        "Pune": (60, 120), "Ahmedabad": (100, 200)
    }
    
    min_aqi, max_aqi = aqi_ranges.get(city_name, (50, 150))
    aqi = random.randint(min_aqi, max_aqi)
    
    return aqi

def predict_uhi_risk(temperature, aqi, humidity, city_name):
    """AI/ML model to predict Urban Heat Island risk"""
    
    # Simple rule-based model for UHI prediction
    risk_score = 0
    
    # Temperature factor (higher temp = higher risk)
    if temperature >= 35:
        risk_score += 40
    elif temperature >= 30:
        risk_score += 25
    elif temperature >= 25:
        risk_score += 15
    
    # AQI factor (higher pollution = higher risk)
    if aqi >= 200:
        risk_score += 30
    elif aqi >= 150:
        risk_score += 20
    elif aqi >= 100:
        risk_score += 10
    
    # Humidity factor (lower humidity in hot conditions = higher risk)
    if temperature >= 30 and humidity < 50:
        risk_score += 15
    
    # City-specific factors (known high UHI cities)
    high_uhi_cities = ["Delhi", "Mumbai", "Chennai", "Kolkata", "Ahmedabad"]
    if city_name in high_uhi_cities:
        risk_score += 20
    
    # Determine risk level
    if risk_score >= 70:
        return "High"
    elif risk_score >= 40:
        return "Medium"
    else:
        return "Low"

def get_aqi_interpretation(aqi):
    """Get AQI interpretation"""
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Moderate"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups"
    elif aqi <= 200:
        return "Unhealthy"
    elif aqi <= 300:
        return "Very Unhealthy"
    else:
        return "Hazardous"

def get_historical_temperature_data(city_name, years=5):
    """Generate historical temperature data for the past years"""
    current_year = datetime.now().year
    historical_data = []
    
    # Base temperature for the city
    base_temp = {
        "Delhi": 25, "Mumbai": 27, "Bangalore": 23, "Chennai": 28,
        "Kolkata": 26, "Hyderabad": 26, "Pune": 25, "Ahmedabad": 27
    }
    
    base = base_temp.get(city_name, 25)
    
    for year in range(current_year - years, current_year):
        # Generate monthly data with seasonal variations
        monthly_data = []
        for month in range(1, 13):
            # Seasonal temperature variation
            if month in [12, 1, 2]:  # Winter
                temp = base - 5 + random.uniform(-3, 3)
            elif month in [3, 4, 5]:  # Spring
                temp = base + random.uniform(-2, 5)
            elif month in [6, 7, 8, 9]:  # Summer/Monsoon
                temp = base + 8 + random.uniform(-2, 4)
            else:  # Autumn
                temp = base + 2 + random.uniform(-2, 3)
            
            monthly_data.append({
                "month": month,
                "temperature": round(temp, 1),
                "year": year
            })
        
        historical_data.append({
            "year": year,
            "average_temp": round(sum([m["temperature"] for m in monthly_data]) / 12, 1),
            "max_temp": round(max([m["temperature"] for m in monthly_data]), 1),
            "min_temp": round(min([m["temperature"] for m in monthly_data]), 1),
            "monthly_data": monthly_data
        })
    
    return historical_data

def get_satellite_imagery_data(city_name):
    """Generate comprehensive satellite imagery and analysis data"""
    city_coords = INDIAN_CITIES.get(city_name, {"lat": 28.6139, "lng": 77.2090})
    lat, lng = city_coords["lat"], city_coords["lng"]
    
    # Google Maps API Key (in production, this should be in environment variables)
    api_key = "AIzaSyCkar4NK44FlSvsmheiEGXzQYoPx98bm54"
    
    # Generate multiple satellite imagery scenarios
    satellite_data = {
        "base_satellite": {
            "url": f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom=12&size=800x600&maptype=satellite&key={api_key}",
            "description": "High-resolution satellite imagery",
            "zoom_level": 12,
            "resolution": "800x600"
        },
        "thermal_overlay": {
            "url": f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom=12&size=800x600&maptype=hybrid&key={api_key}",
            "description": "Satellite imagery with thermal overlay",
            "zoom_level": 12,
            "resolution": "800x600"
        },
        "street_view": {
            "url": f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom=12&size=800x600&maptype=roadmap&key={api_key}",
            "description": "Street map for reference",
            "zoom_level": 12,
            "resolution": "800x600"
        },
        "detailed_view": {
            "url": f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom=14&size=1200x800&maptype=satellite&key={api_key}",
            "description": "Detailed satellite view for analysis",
            "zoom_level": 14,
            "resolution": "1200x800"
        },
        "heat_analysis": {
            "thermal_zones": generate_thermal_zones(lat, lng),
            "temperature_gradient": generate_temperature_gradient(lat, lng),
            "land_use_analysis": generate_land_use_analysis(city_name, lat, lng),
            "green_space_mapping": generate_green_space_mapping(lat, lng)
        },
        "time_series": {
            "morning": f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom=12&size=600x400&maptype=satellite&key={api_key}",
            "afternoon": f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom=12&size=600x400&maptype=satellite&key={api_key}",
            "evening": f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom=12&size=600x400&maptype=satellite&key={api_key}"
        }
    }
    
    return satellite_data

def generate_thermal_zones(lat, lng):
    """Generate thermal zone analysis for satellite imagery"""
    import random
    import math
    
    thermal_zones = []
    zone_count = 25
    
    for i in range(zone_count):
        # Create zones in a grid pattern around the city center
        angle = (2 * math.pi * i) / zone_count
        distance = random.uniform(0.01, 0.05)
        
        zone_lat = lat + distance * math.cos(angle)
        zone_lng = lng + distance * math.sin(angle)
        
        # Generate realistic thermal data
        intensity = random.uniform(0.2, 1.0)
        temperature = 25 + intensity * 15  # Base temp 25°C + intensity * 15
        
        # Determine zone type based on intensity
        if intensity > 0.8:
            zone_type = "Critical Heat Zone"
            color = "#FF0000"
            priority = "HIGH"
        elif intensity > 0.6:
            zone_type = "High Heat Zone"
            color = "#FF4500"
            priority = "MEDIUM"
        elif intensity > 0.4:
            zone_type = "Moderate Heat Zone"
            color = "#FFA500"
            priority = "LOW"
        else:
            zone_type = "Cool Zone"
            color = "#00FF00"
            priority = "MINIMAL"
        
        thermal_zones.append({
            "lat": round(zone_lat, 6),
            "lng": round(zone_lng, 6),
            "intensity": round(intensity, 2),
            "temperature": round(temperature, 1),
            "zone_type": zone_type,
            "color": color,
            "priority": priority,
            "area_km2": round(random.uniform(0.5, 5.0), 2),
            "population_affected": random.randint(1000, 50000)
        })
    
    return thermal_zones

def generate_temperature_gradient(lat, lng):
    """Generate temperature gradient data for visualization"""
    import random
    import math
    
    gradient_data = []
    grid_size = 10
    
    for i in range(grid_size):
        for j in range(grid_size):
            # Create a grid of temperature points
            offset_lat = lat + (i - grid_size/2) * 0.005
            offset_lng = lng + (j - grid_size/2) * 0.005
            
            # Calculate distance from center
            distance = math.sqrt((i - grid_size/2)**2 + (j - grid_size/2)**2)
            
            # Temperature decreases with distance from center (urban heat island effect)
            base_temp = 35 - distance * 1.5 + random.uniform(-2, 2)
            temperature = max(20, min(45, base_temp))  # Clamp between 20-45°C
            
            gradient_data.append({
                "lat": round(offset_lat, 6),
                "lng": round(offset_lng, 6),
                "temperature": round(temperature, 1),
                "intensity": round((temperature - 20) / 25, 2)  # Normalize to 0-1
            })
    
    return gradient_data

def generate_land_use_analysis(city_name, lat, lng):
    """Generate land use analysis for the city"""
    import random
    
    # Define land use types with their heat characteristics
    land_use_types = {
        "Residential": {"heat_factor": 0.7, "green_coverage": 0.3, "density": "high"},
        "Commercial": {"heat_factor": 0.9, "green_coverage": 0.1, "density": "very_high"},
        "Industrial": {"heat_factor": 0.95, "green_coverage": 0.05, "density": "medium"},
        "Green Space": {"heat_factor": 0.3, "green_coverage": 0.9, "density": "low"},
        "Water Body": {"heat_factor": 0.4, "green_coverage": 0.0, "density": "none"},
        "Transport": {"heat_factor": 0.85, "green_coverage": 0.1, "density": "high"},
        "Mixed Use": {"heat_factor": 0.8, "green_coverage": 0.2, "density": "high"}
    }
    
    land_use_data = []
    zone_count = 20
    
    for i in range(zone_count):
        land_type = random.choice(list(land_use_types.keys()))
        characteristics = land_use_types[land_type]
        
        # Generate random coordinates around city center
        angle = random.uniform(0, 2 * 3.14159)
        distance = random.uniform(0.005, 0.03)
        
        zone_lat = lat + distance * math.cos(angle)
        zone_lng = lng + distance * math.sin(angle)
        
        land_use_data.append({
            "lat": round(zone_lat, 6),
            "lng": round(zone_lng, 6),
            "land_type": land_type,
            "heat_factor": characteristics["heat_factor"],
            "green_coverage": characteristics["green_coverage"],
            "density": characteristics["density"],
            "area_km2": round(random.uniform(1.0, 10.0), 2),
            "estimated_population": random.randint(5000, 100000) if characteristics["density"] != "none" else 0
        })
    
    return land_use_data

def generate_green_space_mapping(lat, lng):
    """Generate green space mapping for environmental analysis"""
    import random
    import math
    
    green_spaces = []
    space_count = 15
    
    for i in range(space_count):
        # Generate green space locations
        angle = random.uniform(0, 2 * 3.14159)
        distance = random.uniform(0.01, 0.04)
        
        space_lat = lat + distance * math.cos(angle)
        space_lng = lng + distance * math.sin(angle)
        
        # Determine green space type
        space_types = ["Urban Park", "Botanical Garden", "Forest", "Waterfront", "Green Corridor", "Community Garden"]
        space_type = random.choice(space_types)
        
        # Calculate cooling effect
        cooling_effect = random.uniform(0.3, 0.8)
        temperature_reduction = cooling_effect * 5  # Up to 5°C reduction
        
        green_spaces.append({
            "lat": round(space_lat, 6),
            "lng": round(space_lng, 6),
            "space_type": space_type,
            "area_km2": round(random.uniform(0.1, 5.0), 2),
            "cooling_effect": round(cooling_effect, 2),
            "temperature_reduction": round(temperature_reduction, 1),
            "tree_count": random.randint(100, 5000),
            "biodiversity_index": random.uniform(0.3, 0.9),
            "accessibility": random.choice(["High", "Medium", "Low"])
        })
    
    return green_spaces

def get_enhanced_adaptation_recommendations(uhi_level, temperature, aqi, city_name, city_data):
    """Generate comprehensive climate adaptation recommendations"""
    recommendations = []
    tree_count = 0
    budget_estimate = 0
    timeline = ""
    
    population = city_data.get("population", 1000000)
    area = city_data.get("area", 100)
    
    if uhi_level == "High":
        tree_count = random.randint(15000, 25000)
        budget_estimate = random.randint(500, 1500)  # Crores
        timeline = "2-3 years"
        recommendations = [
            "🌳 CRITICAL: Plant 15,000-25,000 native trees (Neem, Peepal, Banyan) in high-heat zones",
            "🏢 URGENT: Implement cool/reflective roofing on 70% of buildings to reduce surface temperature by 5-8°C",
            "🌿 IMMEDIATE: Create 50+ rooftop gardens on commercial buildings with drought-resistant plants",
            "💧 HIGH IMPACT: Develop 20+ urban water bodies and misting systems in public spaces",
            "🌱 PRIORITY: Install 100+ green walls and vertical gardens on building facades",
            "🛣️ ESSENTIAL: Implement cool pavement technologies on major roads (reduces heat by 3-5°C)",
            "🏛️ VITAL: Establish 25+ urban heat monitoring stations with real-time alerts",
            "🌡️ CRITICAL: Implement comprehensive heat action plans for vulnerable populations",
            "🚗 STRATEGIC: Promote electric vehicle infrastructure to reduce heat emissions",
            "🏘️ URGENT: Create 10+ green corridors connecting parks and water bodies",
            "🏥 PROTECTIVE: Establish cooling centers in hospitals and schools",
            "🌿 RESTORATIVE: Implement urban forest restoration in degraded areas"
        ]
    elif uhi_level == "Medium":
        tree_count = random.randint(10000, 18000)
        budget_estimate = random.randint(300, 800)
        timeline = "1-2 years"
        recommendations = [
            "🌳 IMPORTANT: Plant 10,000-18,000 trees strategically in residential and commercial areas",
            "🏢 RECOMMENDED: Adopt cool roof technologies on 50% of buildings (reduces indoor temperature by 3-4°C)",
            "🌿 BENEFICIAL: Increase green cover in residential areas by 30% with native plants",
            "🚶 ESSENTIAL: Create 30+ shaded pedestrian walkways with tree canopies",
            "🌱 STRATEGIC: Implement comprehensive urban forestry programs",
            "💧 IMPACTFUL: Add water features and fountains in 15+ public spaces",
            "🌡️ MONITORING: Install temperature monitoring systems in 20+ locations",
            "🏘️ COMMUNITY: Develop 5+ community cooling centers for heat emergencies",
            "🚌 SUSTAINABLE: Improve public transport with electric/green buses",
            "🌿 NEIGHBORHOOD: Create 25+ neighborhood green spaces and pocket parks",
            "🏢 EFFICIENT: Promote energy-efficient building retrofits",
            "🌡️ PREPAREDNESS: Develop heat wave early warning systems"
        ]
    else:
        tree_count = random.randint(5000, 12000)
        budget_estimate = random.randint(100, 400)
        timeline = "6 months - 1 year"
        recommendations = [
            "🌳 MAINTENANCE: Plant 5,000-12,000 trees to maintain and enhance existing green cover",
            "🌿 PRESERVATION: Maintain and protect existing green infrastructure and urban forests",
            "🌡️ MONITORING: Monitor temperature trends regularly with 10+ weather stations",
            "🏘️ PLANNING: Plan for future urban development with climate-resilient design",
            "🌱 STANDARDS: Implement green building standards for all new constructions",
            "💧 CONSERVATION: Maintain and restore water bodies and decorative fountains",
            "🚶 MOBILITY: Create 20+ walking and cycling paths with tree cover",
            "🌿 COMMUNITY: Establish 15+ community gardens and urban farming initiatives",
            "🏢 EFFICIENCY: Promote energy-efficient buildings and retrofits",
            "🌡️ PREPAREDNESS: Develop comprehensive early warning systems for heat waves",
            "🌿 BIODIVERSITY: Enhance urban biodiversity with native plant species",
            "🏘️ RESILIENCE: Build climate-resilient infrastructure for future challenges"
        ]
    
    return recommendations, tree_count, budget_estimate, timeline

def get_heat_zone_analysis(city_name, city_data):
    """Analyze heat zones within the city with real locations and landmarks"""
    lat = city_data["lat"]
    lng = city_data["lng"]
    
    # Real city locations and landmarks database
    city_locations = {
        "Delhi": [
            {"name": "Connaught Place", "lat": 28.6315, "lng": 77.2167, "type": "Commercial", "intensity_base": 0.9},
            {"name": "India Gate", "lat": 28.6129, "lng": 77.2295, "type": "Monument", "intensity_base": 0.7},
            {"name": "Chandni Chowk", "lat": 28.6517, "lng": 77.2313, "type": "Market", "intensity_base": 0.95},
            {"name": "Karol Bagh", "lat": 28.6517, "lng": 77.1894, "type": "Commercial", "intensity_base": 0.8},
            {"name": "Lajpat Nagar", "lat": 28.5677, "lng": 77.2434, "type": "Residential", "intensity_base": 0.6},
            {"name": "Rajiv Chowk", "lat": 28.6315, "lng": 77.2167, "type": "Transport Hub", "intensity_base": 0.85},
            {"name": "Nehru Place", "lat": 28.5479, "lng": 77.2533, "type": "IT Hub", "intensity_base": 0.8},
            {"name": "Dilli Haat", "lat": 28.5712, "lng": 77.2328, "type": "Cultural", "intensity_base": 0.5},
            {"name": "Lotus Temple", "lat": 28.5535, "lng": 77.2588, "type": "Religious", "intensity_base": 0.4},
            {"name": "Red Fort", "lat": 28.6562, "lng": 77.2410, "type": "Monument", "intensity_base": 0.7},
            {"name": "Jama Masjid", "lat": 28.6508, "lng": 77.2338, "type": "Religious", "intensity_base": 0.6},
            {"name": "CP Metro Station", "lat": 28.6315, "lng": 77.2167, "type": "Transport Hub", "intensity_base": 0.9}
        ],
        "Mumbai": [
            {"name": "Marine Drive", "lat": 18.9433, "lng": 72.8262, "type": "Waterfront", "intensity_base": 0.6},
            {"name": "Gateway of India", "lat": 18.9219, "lng": 72.8331, "type": "Monument", "intensity_base": 0.7},
            {"name": "Juhu Beach", "lat": 19.1064, "lng": 72.8262, "type": "Recreation", "intensity_base": 0.5},
            {"name": "Bandra Kurla Complex", "lat": 19.0596, "lng": 72.8687, "type": "Business District", "intensity_base": 0.9},
            {"name": "Andheri Station", "lat": 19.1136, "lng": 72.8467, "type": "Transport Hub", "intensity_base": 0.85},
            {"name": "Dadar Market", "lat": 19.0176, "lng": 72.8562, "type": "Market", "intensity_base": 0.8},
            {"name": "Powai Lake", "lat": 19.1197, "lng": 72.9064, "type": "Green Space", "intensity_base": 0.3},
            {"name": "Haji Ali Dargah", "lat": 18.9829, "lng": 72.8092, "type": "Religious", "intensity_base": 0.6},
            {"name": "Worli Sea Face", "lat": 19.0176, "lng": 72.8235, "type": "Residential", "intensity_base": 0.7},
            {"name": "CST Station", "lat": 18.9398, "lng": 72.8355, "type": "Transport Hub", "intensity_base": 0.9},
            {"name": "Phoenix Mills", "lat": 19.0176, "lng": 72.8562, "type": "Commercial", "intensity_base": 0.8},
            {"name": "Sanjay Gandhi National Park", "lat": 19.2144, "lng": 72.9153, "type": "Green Space", "intensity_base": 0.2}
        ],
        "Bangalore": [
            {"name": "MG Road", "lat": 12.9716, "lng": 77.5946, "type": "Commercial", "intensity_base": 0.8},
            {"name": "Cubbon Park", "lat": 12.9716, "lng": 77.5946, "type": "Green Space", "intensity_base": 0.3},
            {"name": "Electronic City", "lat": 12.8456, "lng": 77.6603, "type": "IT Hub", "intensity_base": 0.7},
            {"name": "Whitefield", "lat": 12.9698, "lng": 77.7500, "type": "IT Hub", "intensity_base": 0.8},
            {"name": "Koramangala", "lat": 12.9279, "lng": 77.6271, "type": "Residential", "intensity_base": 0.6},
            {"name": "Indiranagar", "lat": 12.9716, "lng": 77.6406, "type": "Residential", "intensity_base": 0.6},
            {"name": "Bangalore Palace", "lat": 12.9977, "lng": 77.5928, "type": "Monument", "intensity_base": 0.5},
            {"name": "Lalbagh Botanical Garden", "lat": 12.9507, "lng": 77.5848, "type": "Green Space", "intensity_base": 0.2},
            {"name": "Kempegowda Bus Station", "lat": 12.9771, "lng": 77.5683, "type": "Transport Hub", "intensity_base": 0.9},
            {"name": "UB City", "lat": 12.9716, "lng": 77.5946, "type": "Commercial", "intensity_base": 0.8},
            {"name": "Vidhana Soudha", "lat": 12.9716, "lng": 77.5946, "type": "Government", "intensity_base": 0.6},
            {"name": "Bannerghatta National Park", "lat": 12.8003, "lng": 77.5777, "type": "Green Space", "intensity_base": 0.2}
        ],
        "Chennai": [
            {"name": "Marina Beach", "lat": 13.0399, "lng": 80.2830, "type": "Waterfront", "intensity_base": 0.6},
            {"name": "T. Nagar", "lat": 13.0399, "lng": 80.2330, "type": "Commercial", "intensity_base": 0.8},
            {"name": "Anna Nagar", "lat": 13.0878, "lng": 80.2200, "type": "Residential", "intensity_base": 0.6},
            {"name": "Phoenix MarketCity", "lat": 13.0399, "lng": 80.2330, "type": "Commercial", "intensity_base": 0.7},
            {"name": "Chennai Central", "lat": 13.0827, "lng": 80.2707, "type": "Transport Hub", "intensity_base": 0.9},
            {"name": "Kapaleeshwarar Temple", "lat": 13.0399, "lng": 80.2330, "type": "Religious", "intensity_base": 0.5},
            {"name": "Guindy National Park", "lat": 13.0075, "lng": 80.2206, "type": "Green Space", "intensity_base": 0.3},
            {"name": "OMR IT Corridor", "lat": 12.9000, "lng": 80.2330, "type": "IT Hub", "intensity_base": 0.8},
            {"name": "Egmore Station", "lat": 13.0827, "lng": 80.2607, "type": "Transport Hub", "intensity_base": 0.8},
            {"name": "Fort St. George", "lat": 13.0827, "lng": 80.2907, "type": "Monument", "intensity_base": 0.6},
            {"name": "Besant Nagar", "lat": 13.0075, "lng": 80.2606, "type": "Residential", "intensity_base": 0.5},
            {"name": "Velachery", "lat": 12.9820, "lng": 80.2200, "type": "Residential", "intensity_base": 0.6}
        ]
    }
    
    # Get city-specific locations or use default landmarks
    locations = city_locations.get(city_name, [
        {"name": f"{city_name} City Center", "lat": lat, "lng": lng, "type": "Urban Core", "intensity_base": 0.8},
        {"name": f"{city_name} Railway Station", "lat": lat + 0.005, "lng": lng + 0.005, "type": "Transport Hub", "intensity_base": 0.9},
        {"name": f"{city_name} Market", "lat": lat - 0.003, "lng": lng + 0.008, "type": "Commercial", "intensity_base": 0.7},
        {"name": f"{city_name} Park", "lat": lat + 0.008, "lng": lng - 0.005, "type": "Green Space", "intensity_base": 0.3},
        {"name": f"{city_name} Industrial Area", "lat": lat - 0.01, "lng": lng - 0.01, "type": "Industrial", "intensity_base": 0.9}
    ])
    
    heat_zones = []
    
    # Create heat zones for each real location
    for location in locations:
        # Add some variation to the base intensity
        intensity_variation = random.uniform(-0.15, 0.15)
        intensity = max(0.1, min(1.0, location["intensity_base"] + intensity_variation))
        
        # Calculate temperature based on intensity
        base_temp = 25
        if location["type"] == "Green Space":
            base_temp = 20  # Cooler for green spaces
        elif location["type"] == "Industrial":
            base_temp = 30  # Hotter for industrial areas
        elif location["type"] == "Transport Hub":
            base_temp = 28  # Hotter for transport hubs
        
        temperature = round(base_temp + intensity * 10, 1)
        
        heat_zones.append({
            "lat": location["lat"],
            "lng": location["lng"],
            "intensity": round(intensity, 2),
            "temperature": temperature,
            "zone_type": location["type"],
            "location_name": location["name"],
            "cluster_id": 0  # All real locations in main cluster
        })
    
    # Add some additional random zones around the city for coverage
    additional_zones = 8
    for i in range(additional_zones):
        angle = random.uniform(0, 2 * 3.14159)
        distance = random.uniform(0.01, 0.05)
        
        zone_lat = lat + distance * math.cos(angle)
        zone_lng = lng + distance * math.sin(angle)
        
        zone_types = ["Residential", "Commercial", "Mixed Use"]
        intensity = random.uniform(0.3, 0.8)
        temperature = round(25 + intensity * 12, 1)
        
        heat_zones.append({
            "lat": round(zone_lat, 6),
            "lng": round(zone_lng, 6),
            "intensity": round(intensity, 2),
            "temperature": temperature,
            "zone_type": random.choice(zone_types),
            "location_name": f"{city_name} Area {i+1}",
            "cluster_id": 1  # Additional zones cluster
        })
    
    # Sort by intensity for better visualization
    heat_zones.sort(key=lambda x: x["intensity"], reverse=True)
    
    return heat_zones

def calculate_uhi_risk_score(temperature, aqi, humidity, city_name):
    """Calculate UHI risk score (0-100)"""
    risk_score = 0
    
    # Temperature factor (0-40 points)
    if temperature >= 35:
        risk_score += 40
    elif temperature >= 30:
        risk_score += 25
    elif temperature >= 25:
        risk_score += 15
    
    # AQI factor (0-30 points)
    if aqi >= 200:
        risk_score += 30
    elif aqi >= 150:
        risk_score += 20
    elif aqi >= 100:
        risk_score += 10
    
    # Humidity factor (0-15 points)
    if temperature >= 30 and humidity < 50:
        risk_score += 15
    
    # City-specific factor (0-15 points)
    high_uhi_cities = ["Delhi", "Mumbai", "Chennai", "Kolkata", "Ahmedabad"]
    if city_name in high_uhi_cities:
        risk_score += 15
    
    return min(risk_score, 100)

def calculate_co2_emissions(city_name, city_data, temperature, aqi, uhi_level):
    """Calculate CO2 emissions and related metrics for the city"""
    population = city_data.get("population", 1000000)
    area = city_data.get("area", 100)
    
    # Base CO2 emissions per capita (tons per year)
    # Indian cities average around 1.5-3 tons per capita
    base_emissions_per_capita = random.uniform(1.8, 2.8)
    
    # Adjust based on city characteristics
    if city_name in ["Delhi", "Mumbai", "Bangalore", "Chennai"]:
        # Major metros have higher emissions
        base_emissions_per_capita *= random.uniform(1.2, 1.5)
    elif city_name in ["Pune", "Hyderabad", "Kolkata"]:
        # Tier-1 cities
        base_emissions_per_capita *= random.uniform(1.1, 1.3)
    else:
        # Smaller cities
        base_emissions_per_capita *= random.uniform(0.8, 1.1)
    
    # Temperature impact on emissions (hotter = more AC usage)
    temp_factor = 1 + (temperature - 25) * 0.02  # 2% increase per degree above 25°C
    
    # UHI level impact
    uhi_factors = {"Low": 1.0, "Medium": 1.15, "High": 1.35}
    uhi_factor = uhi_factors.get(uhi_level, 1.0)
    
    # AQI impact (higher pollution = more energy consumption)
    aqi_factor = 1 + (aqi - 50) * 0.001  # 0.1% increase per AQI point above 50
    
    # Calculate total annual CO2 emissions
    total_annual_co2 = population * base_emissions_per_capita * temp_factor * uhi_factor * aqi_factor
    
    # Calculate emissions per square km
    co2_per_sqkm = total_annual_co2 / area
    
    # Calculate potential reduction from adaptation measures
    reduction_potential = {
        "tree_planting": total_annual_co2 * 0.12,  # 12% reduction from trees
        "green_roofs": total_annual_co2 * 0.08,    # 8% reduction from green roofs
        "cool_pavements": total_annual_co2 * 0.05, # 5% reduction from cool pavements
        "renewable_energy": total_annual_co2 * 0.15, # 15% reduction from renewables
        "public_transport": total_annual_co2 * 0.10  # 10% reduction from better transport
    }
    
    total_reduction_potential = sum(reduction_potential.values())
    
    # Calculate carbon footprint per person
    carbon_footprint_per_person = total_annual_co2 / population
    
    # Historical trend (mock data for last 5 years)
    historical_emissions = []
    for year in range(5):
        year_emissions = total_annual_co2 * (0.95 + year * 0.03)  # 3% increase per year
        historical_emissions.append({
            "year": 2020 + year,
            "total_co2": round(year_emissions, 2),
            "per_capita": round(year_emissions / population, 2),
            "per_sqkm": round(year_emissions / area, 2),
            "growth_rate": round(3.0 + random.uniform(-0.5, 0.5), 1)  # 3% ± 0.5% growth
        })
    
    return {
        "total_annual_co2": round(total_annual_co2, 2),
        "co2_per_capita": round(total_annual_co2 / population, 2),
        "co2_per_sqkm": round(co2_per_sqkm, 2),
        "carbon_footprint_per_person": round(carbon_footprint_per_person, 2),
        "reduction_potential": {
            "total_potential": round(total_reduction_potential, 2),
            "percentage_reduction": round((total_reduction_potential / total_annual_co2) * 100, 1),
            "by_measure": {k: round(v, 2) for k, v in reduction_potential.items()}
        },
        "historical_trend": historical_emissions,
        "emission_factors": {
            "temperature_impact": round(temp_factor, 3),
            "uhi_impact": round(uhi_factor, 3),
            "aqi_impact": round(aqi_factor, 3)
        },
        "insights": {
            "annual_growth_rate": round(3.0 + random.uniform(-0.5, 0.5), 1),
            "projected_2030": round(total_annual_co2 * 1.2, 2),  # 20% increase by 2030
            "carbon_budget_remaining": round(total_annual_co2 * 0.3, 2),  # 30% of current emissions
            "net_zero_target": 2050,
            "critical_threshold": round(total_annual_co2 * 1.5, 2)  # 50% above current
        }
    }

def get_adaptation_recommendations(uhi_level, temperature, aqi, city_name):
    """Generate climate adaptation recommendations (legacy function for compatibility)"""
    city_data = INDIAN_CITIES.get(city_name, {"lat": 28.6139, "lng": 77.2090, "population": 1000000, "area": 100})
    recommendations, tree_count, budget, timeline = get_enhanced_adaptation_recommendations(
        uhi_level, temperature, aqi, city_name, city_data
    )
    return recommendations, tree_count

@app.route('/api/uhi-analysis', methods=['POST'])
def analyze_uhi():
    """Main API endpoint for UHI analysis"""
    try:
        data = request.get_json()
        city_name = data.get('city', '').strip()
        
        if not city_name:
            return jsonify({'error': 'City name is required'}), 400
        
        # Validate if city is in India
        if city_name not in INDIAN_CITIES:
            return jsonify({'error': f'City "{city_name}" not found in our database. Please try a major Indian city.'}), 400
        
        # Get city data
        city_data = INDIAN_CITIES[city_name]
        
        # Fetch weather data
        weather_data = get_weather_data(city_name)
        
        # Get AQI data
        aqi = get_aqi_data(city_name)
        
        # Predict UHI risk
        uhi_level = predict_uhi_risk(
            weather_data['temperature'], 
            aqi, 
            weather_data['humidity'], 
            city_name
        )
        
        # Get enhanced recommendations
        recommendations, tree_count, budget_estimate, timeline = get_enhanced_adaptation_recommendations(
            uhi_level, 
            weather_data['temperature'], 
            aqi, 
            city_name,
            city_data
        )
        
        # Get additional data
        historical_data = get_historical_temperature_data(city_name)
        satellite_data = get_satellite_imagery_data(city_name)
        heat_zones = get_heat_zone_analysis(city_name, city_data)
        
        # Calculate CO2 emissions
        co2_data = calculate_co2_emissions(city_name, city_data, weather_data['temperature'], aqi, uhi_level)
        
        # Calculate temperature trend
        if len(historical_data) >= 2:
            recent_avg = historical_data[-1]['average_temp']
            older_avg = historical_data[-2]['average_temp']
            temp_trend = round(recent_avg - older_avg, 1)
        else:
            temp_trend = 0
        
        # Prepare comprehensive response
        response = {
            'city': city_name,
            'coordinates': {
                'lat': city_data['lat'],
                'lng': city_data['lng']
            },
            'city_info': {
                'population': city_data['population'],
                'area': city_data['area'],
                'population_density': round(city_data['population'] / city_data['area'], 0)
            },
            'current_weather': {
                'temperature': weather_data['temperature'],
                'humidity': weather_data['humidity'],
                'pressure': weather_data['pressure'],
                'description': weather_data['description'],
                'wind_speed': round(weather_data['wind_speed'], 1)
            },
            'air_quality': {
                'aqi': aqi,
                'interpretation': get_aqi_interpretation(aqi)
            },
            'uhi_analysis': {
                'level': uhi_level,
                'risk_score': calculate_uhi_risk_score(weather_data['temperature'], aqi, weather_data['humidity'], city_name),
                'temperature_trend': temp_trend
            },
            'adaptation_plan': {
                'recommended_trees': tree_count,
                'budget_estimate': f"₹{budget_estimate} crores",
                'timeline': timeline,
                'measures': recommendations
            },
            'historical_data': historical_data,
            'satellite_imagery': satellite_data,
            'heat_zones': heat_zones,
            'co2_emissions': co2_data,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/cities', methods=['GET'])
def get_cities():
    """Get list of supported Indian cities with coordinates"""
    cities_list = []
    for city_name, city_data in INDIAN_CITIES.items():
        cities_list.append({
            'name': city_name,
            'lat': city_data['lat'],
            'lng': city_data['lng'],
            'population': city_data['population'],
            'area': city_data['area']
        })
    return jsonify({'cities': cities_list})

@app.route('/api/historical-data/<city_name>', methods=['GET'])
def get_historical_data(city_name):
    """Get historical temperature data for a city"""
    if city_name not in INDIAN_CITIES:
        return jsonify({'error': 'City not found'}), 404
    
    years = request.args.get('years', 5, type=int)
    historical_data = get_historical_temperature_data(city_name, years)
    
    return jsonify({
        'city': city_name,
        'historical_data': historical_data,
        'years_analyzed': years
    })

@app.route('/api/satellite-imagery/<city_name>', methods=['GET'])
def get_satellite_data(city_name):
    """Get satellite imagery data for a city"""
    if city_name not in INDIAN_CITIES:
        return jsonify({'error': 'City not found'}), 404
    
    satellite_data = get_satellite_imagery_data(city_name)
    return jsonify({
        'city': city_name,
        'satellite_data': satellite_data
    })

@app.route('/api/heat-zones/<city_name>', methods=['GET'])
def get_heat_zones(city_name):
    """Get heat zone analysis for a city"""
    if city_name not in INDIAN_CITIES:
        return jsonify({'error': 'City not found'}), 404
    
    city_data = INDIAN_CITIES[city_name]
    heat_zones = get_heat_zone_analysis(city_name, city_data)
    
    return jsonify({
        'city': city_name,
        'heat_zones': heat_zones
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

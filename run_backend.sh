#!/bin/bash

# Urban Heat Island Detector - Backend Startup Script

echo "🌡️ Starting Urban Heat Island Detector Backend..."

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "Creating virtual environment..."
    cd backend
    python -m venv venv
    cd ..
fi

# Activate virtual environment
echo "Activating virtual environment..."
source backend/venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
cd backend
pip install -r requirements.txt

# Start the Flask server
echo "Starting Flask server on http://localhost:5000"
echo "Press Ctrl+C to stop the server"
python app.py

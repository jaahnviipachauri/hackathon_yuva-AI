#!/bin/bash

# Urban Heat Island Detector - Frontend Startup Script

echo "🌡️ Starting Urban Heat Island Detector Frontend..."

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Start the React development server
echo "Starting React development server on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
cd frontend
npm start

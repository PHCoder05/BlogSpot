#!/bin/bash

# BlogSpot Deployment Script
# This script builds and deploys your app with both frontend and backend

echo "🚀 Starting BlogSpot deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your Gmail credentials:"
    echo "GMAIL_USER=your-email@gmail.com"
    echo "GMAIL_APP_PASSWORD=your-16-character-app-password"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the React app
echo "🔨 Building React app..."
npm run build

# Start production server
echo "🚀 Starting production server..."
echo "Your app is now running at: http://localhost:3000"
echo "API endpoints available at: http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop the server"

# Start the production server
npm run start:prod

// Deployment Configuration for BlogSpot with Email Server
// This file explains how to deploy your app with both frontend and backend

export const deploymentConfig = {
  // Development Commands
  development: {
    // Single command to start both servers
    start: "npm start",
    // Or start them separately
    frontend: "npm run dev",
    backend: "npm run server"
  },

  // Production Commands
  production: {
    // Build and start production server (serves both frontend and API)
    buildAndStart: "npm run build:prod",
    // Or build first, then start
    build: "npm run build",
    start: "npm run start:prod"
  },

  // Environment Variables Required
  environmentVariables: {
    required: [
      "GMAIL_USER",
      "GMAIL_APP_PASSWORD"
    ],
    optional: [
      "PORT",
      "NODE_ENV",
      "VITE_API_URL"
    ]
  },

  // Deployment Platforms
  platforms: {
    // Vercel (Frontend only - needs separate backend)
    vercel: {
      buildCommand: "npm run build",
      outputDirectory: "dist",
      installCommand: "npm install"
    },

    // Railway (Full-stack - recommended)
    railway: {
      buildCommand: "npm run build:prod",
      startCommand: "npm run start:prod",
      installCommand: "npm install"
    },

    // Render (Full-stack)
    render: {
      buildCommand: "npm run build:prod",
      startCommand: "npm run start:prod",
      installCommand: "npm install"
    },

    // Heroku (Full-stack)
    heroku: {
      buildCommand: "npm run build:prod",
      startCommand: "npm run start:prod",
      installCommand: "npm install"
    },

    // DigitalOcean App Platform (Full-stack)
    digitalocean: {
      buildCommand: "npm run build:prod",
      startCommand: "npm run start:prod",
      installCommand: "npm install"
    }
  }
};

// Quick Start Guide:
// 1. Development: npm start (runs both servers)
// 2. Production: npm run build:prod (builds and starts production server)
// 3. The production server serves both the React app and API endpoints
// 4. No need to run separate frontend/backend servers in production

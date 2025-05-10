#!/bin/bash

# Food Truck Menu Application Setup Script

echo "Setting up Food Truck Menu Application..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create public directory for assets if it doesn't exist
mkdir -p public/videos

echo "Setup complete!"
echo "To start the development server, run: npm run dev"
echo "To build for production, run: npm run build"

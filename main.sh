#!/bin/bash

# Check if yarn exists, if not install it
if ! command -v yarn &> /dev/null; then
    echo "Yarn not found. Installing yarn..."
    npm install -g yarn
    if [ $? -ne 0 ]; then
        echo "Failed to install yarn. Please install it manually."
        exit 1
    fi
    echo "Yarn installed successfully."
else
    echo "Yarn is already installed."
fi

# Install packages using yarn
echo "Installing packages..."
yarn install
if [ $? -ne 0 ]; then
    echo "Failed to install packages."
    exit 1
fi

# Build the project
echo "Building the project..."
yarn build
if [ $? -ne 0 ]; then
    echo "Build failed."
    exit 1
fi

# Start the application
echo "Starting the application..."
yarn start
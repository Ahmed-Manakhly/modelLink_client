# Frontend Dockerfile for modelLink
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
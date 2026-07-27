# Frontend Dockerfile for modelLink
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Build args
ARG NODE_ENV=production
ARG REACT_APP_ENV
ARG REACT_APP_BASE_API_DEV
ARG REACT_APP_FILES_BASE_API_DEV
ARG REACT_APP_CLIENT_URL_DEV
ARG REACT_APP_BASE_API_PROD
ARG REACT_APP_FILES_BASE_API_PROD
ARG REACT_APP_CLIENT_URL_PROD
ARG REACT_APP_STRIPE_PUBLIC_KEY

ENV NODE_ENV=$NODE_ENV
ENV REACT_APP_ENV=$REACT_APP_ENV
ENV REACT_APP_BASE_API_DEV=$REACT_APP_BASE_API_DEV
ENV REACT_APP_FILES_BASE_API_DEV=$REACT_APP_FILES_BASE_API_DEV
ENV REACT_APP_CLIENT_URL_DEV=$REACT_APP_CLIENT_URL_DEV
ENV REACT_APP_BASE_API_PROD=$REACT_APP_BASE_API_PROD
ENV REACT_APP_FILES_BASE_API_PROD=$REACT_APP_FILES_BASE_API_PROD
ENV REACT_APP_CLIENT_URL_PROD=$REACT_APP_CLIENT_URL_PROD
ENV REACT_APP_STRIPE_PUBLIC_KEY=$REACT_APP_STRIPE_PUBLIC_KEY

# Build the app
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactjs

# Install serve to run the build output
RUN npm install -g serve

# Copy built assets
COPY --from=builder --chown=reactjs:nodejs /app/build ./build

USER reactjs

EXPOSE 3000

ENV PORT 3000

# Run the application
CMD ["serve", "-s", "build", "-l", "3000"]
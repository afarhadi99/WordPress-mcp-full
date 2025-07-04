FROM node:22-slim

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port (optional, but good practice)
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]
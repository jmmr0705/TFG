# Dockerfile for the Node.js server
FROM node:14

# Set working directory
WORKDIR /server

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the server runs on
EXPOSE 3001

# Set the environment variable for production
ENV PORT=3001

# Start the Node.js server
CMD ["node", "index.js"]

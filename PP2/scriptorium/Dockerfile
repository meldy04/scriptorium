# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Docker CLI and dependencies
RUN apk add --no-cache docker openrc bash

# Copy the rest of the application's source code
COPY . .

# Generate the prisma database
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on (default: 3000)
EXPOSE 3000

# Start Docker daemon when the container runs
ENTRYPOINT ["sh", "-c", "dockerd & npm run dev"]

# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on (default: 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]

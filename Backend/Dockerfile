FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy only package files first
COPY package*.json ./

# Install dependencies (bcrypt will compile here for Linux)
RUN npm install

# Now copy the rest of the source code
COPY . .

# Expose app port
EXPOSE 3000

# Run the app (corrected path)
CMD ["node", "src/app.js"]

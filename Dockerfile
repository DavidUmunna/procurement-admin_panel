FROM node:17-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application files
COPY . .

RUN npm run build


FROM nginx:alpine AS production


# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to the Nginx HTML directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html


ENV PORT=3001
# Expose the port the app runs on

EXPOSE 80

# Command to run the application
CMD ["nginx", "-g","daemon off;"]
# Use the official Nginx image
FROM nginx:1.25.3-alpine-slim

# Copy the frontend files to the Nginx HTML directory
COPY . /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
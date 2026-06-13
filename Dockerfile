# Stage 1: Use nginx to serve the static files
FROM nginx:alpine

# Copy all project files into nginx's web root
COPY . /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run requires 8080)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

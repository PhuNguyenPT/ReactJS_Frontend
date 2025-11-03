# Multi-stage build for React + Vite frontend
FROM node:lts-trixie-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm ci --ignore-scripts

# Copy source code
COPY src ./src
COPY public ./public

# Copy config files
COPY tsconfig.app.json tsconfig.json tsconfig.node.json tsconfig.test.json vite.config.ts index.html .nvmrc .env.production ./

# Type check and build
RUN npm run type-check && npm run build

# Production image
FROM nginx:1.29-trixie AS runner

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html/admission.edu.vn

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
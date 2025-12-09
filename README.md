# React + Vite Frontend

A modern, production-ready React application built with Vite, TypeScript, and comprehensive security features including HTTPS/TLS support for development and production environments.

## 🚀 Features

- **React 19** - Latest React version with modern features
- **Vite** - Lightning-fast build tool and development server with HMR
- **TypeScript** - Type-safe JavaScript development
- **ESLint** - Comprehensive linting with React-specific rules
- **HTTPS/TLS Support** - Secure development environment with mTLS
- **Docker Support** - Production and staging containerization
- **Testing** - Built-in test configuration
- **Hot Module Replacement (HMR)** - Instant updates during development
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality

## 📋 Prerequisites

- **Node.js** 22.x or higher (see `.nvmrc`)
- **npm** 11.x or higher (comes with Node.js)
- **Docker** (optional, for containerized deployment)
- **OpenSSL** (for TLS certificate management)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/PhuNguyenPT/ReactJS_Frontend.git
cd ReactJS_Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to create your environment file:

```bash
# For local development
cp .env.example .env

# Or create specific environment files
cp .env.example .env.development
cp .env.example .env.production
cp .env.example .env.staging
```

Then edit the created file(s) to match your environment:

```bash
# For HTTP backend (default)
VITE_USE_HTTPS_BACKEND=false
VITE_BACKEND_HTTP_PORT=3001

# For HTTPS backend with mTLS
VITE_USE_HTTPS_BACKEND=true
VITE_BACKEND_HTTPS_PORT=3443
```

### 4. Set Up TLS Certificates (Optional for HTTPS Development)

If you want to use HTTPS with the backend (`VITE_USE_HTTPS_BACKEND=true`):

```bash
# Generate certificates from backend repository
cd ~/NodejsApp_Backend
./scripts/generate-tls-certs.sh
./scripts/copy-to-frontend.sh

# Return to frontend directory
cd ~/ReactJS_Frontend

# Trust the CA certificate (see ./tls/README.md for detailed instructions)
```

See [./tls/README.md](./tls/README.md) for comprehensive TLS setup instructions.

## ⚙️ Environment Configuration

All environment variables are configured in `.env.example`. Key configurations include:

### Backend Connection

```dotenv
# Toggle between HTTP and HTTPS backend
VITE_USE_HTTPS_BACKEND=false

# Backend ports
VITE_BACKEND_HTTP_PORT=3001
VITE_BACKEND_HTTPS_PORT=3443

# API base path
VITE_API_BASE_URL=/api
```

### Application Settings

```dotenv
# Frontend server ports
VITE_PORT=5173                    # HTTPS port
VITE_HTTP_PORT=5174               # HTTP port (redirects to HTTPS)
VITE_ENABLE_HTTP_REDIRECT=true    # Enable HTTP to HTTPS redirect

# App name
VITE_APP_NAME=My App
```

### TLS Configuration (for HTTPS mode)

```dotenv
# Server certificates
TLS_KEY_PATH=./tls/frontend.key
TLS_CERT_PATH=./tls/frontend.crt
TLS_CA_PATH=./tls/ca.crt

# Client certificates for mTLS
TLS_CLIENT_KEY_PATH=./tls/nginx-client.key
TLS_CLIENT_CERT_PATH=./tls/nginx-client.crt
```

### Form Settings

```dotenv
# Fourth form limits
VITE_MAX_NATIONAL_AWARD_ENTRIES=3
VITE_MAX_INTERNATIONAL_CERT_ENTRIES=3
VITE_MAX_LANGUAGE_CERT_ENTRIES=3

# Fifth form slider
VITE_SLIDER_MIN=1
VITE_SLIDER_MAX=900

# File upload limits
VITE_MAXSIZE_UPLOAD_MB=10485760   # 10 MB

# Third form score limits
VITE_DGNL_LIMIT=3
VITE_VSAT_MIN_LIMIT=3
VITE_VSAT_MAX_LIMIT=8
VITE_NANG_KHIEU_LIMMIT=12
```

### Pagination & Data Settings

```dotenv
# Result pagination
VITE_PAGINATION_DEFAULT_PAGE=1
VITE_PAGINATION_DEFAULT_SIZE=50
VITE_PAGINATION_DEFAULT_SORT=majorName,DESC
VITE_DISPLAY_LIMIT=10

# History pagination
VITE_ITEMS_PER_PAGE=9

# Data caching
VITE_DATA_EXPIRATION_TIME=3600000  # 1 hour
```

### Session Management

```dotenv
# Guest session
VITE_GUEST_INACTIVITY_DURATION=86400000  # 24 hours
VITE_CLEANUP_INTERVAL=600000             # 10 minutes
VITE_THROTTLE_DURATION=60000             # 1 minute
```

### API Retry Configuration

```dotenv
VITE_INITIAL_DELAY=10000              # 10 seconds
VITE_MAX_POLLING_TIME=120000          # 2 minutes
VITE_MAX_ATTEMPS=20
VITE_RETRY_DELAY=10000
VITE_USE_EXPONENTIAL_BACKOFF=true
VITE_MAX_BACKOFF_DELAYS=10000
```

See `.env.example` for the complete list of available configuration options.

## 🏃‍♂️ Development

### Standard HTTP Development (Default)

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### HTTPS Development (Secure)

1. Set `VITE_USE_HTTPS_BACKEND=true` in your `.env` file
2. Ensure TLS certificates are configured (see step 4 in Installation)
3. Start the development server:

```bash
npm run dev
```

The application will be available at:

- **HTTPS**: `https://localhost:5173`
- **HTTP Redirect**: `http://localhost:5174` (automatically redirects to HTTPS)

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

The optimized build files will be in the `dist/` directory.

### Preview Production Build Locally

```bash
npm run preview
```

### Docker Deployment

#### Production Deployment

```bash
# Build and run production container
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop containers
docker-compose -f docker-compose.prod.yml down
```

#### Staging Deployment

```bash
# Build and run staging container
docker-compose -f docker-compose.staging.yml up -d

# View logs
docker-compose -f docker-compose.staging.yml logs -f

# Stop containers
docker-compose -f docker-compose.staging.yml down
```

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

## 🧹 Code Quality

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

Auto-fix linting issues:

```bash
npm run lint -- --fix
```

### Formatting

Format code with Prettier:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

## 📁 Project Structure

```
ReactJS_Frontend/
├── src/                          # Source code
│   ├── components/              # React components
│   ├── assets/                  # Static assets (images, fonts, etc.)
│   ├── App.tsx                  # Main App component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── public/                       # Public static files
├── tls/                         # TLS certificates for HTTPS development
│   ├── README.md                # Comprehensive TLS documentation
│   ├── ca.crt                   # Root CA certificate
│   ├── frontend.crt             # Frontend server certificate
│   ├── frontend.key             # Frontend server private key
│   ├── nginx-client.crt         # Client certificate for mTLS
│   └── nginx-client.key         # Client private key
├── dist/                        # Production build output (generated)
├── scripts/                     # Utility scripts
├── test/                        # Test files and configuration
├── etc/                         # Additional configuration files
├── .github/                     # GitHub workflows and configuration
├── .husky/                      # Git hooks
├── .vscode/                     # VS Code settings
├── node_modules/                # Dependencies (generated)
├── .dockerignore               # Docker ignore patterns
├── .env.example                # Environment variables template (commit to git)
├── .env                        # Local environment variables (git ignored)
├── .gitignore                  # Git ignore patterns
├── .nvmrc                      # Node.js version specification
├── .prettierrc                 # Prettier configuration
├── .prettierignore             # Prettier ignore patterns
├── docker-compose.prod.yml     # Production Docker configuration
├── docker-compose.staging.yml  # Staging Docker configuration
├── Dockerfile                  # Docker image definition
├── index.html                  # HTML entry point
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── tsconfig.json               # TypeScript base configuration
├── tsconfig.app.json           # TypeScript app-specific config
├── tsconfig.node.json          # TypeScript Node.js config
├── tsconfig.test.json          # TypeScript test config
├── vite.config.ts              # Vite configuration
├── vite-env.d.ts               # Vite environment types
├── eslint.config.js            # ESLint configuration
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## 🔄 Available Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start development server         |
| `npm run build`        | Build for production             |
| `npm run preview`      | Preview production build locally |
| `npm run lint`         | Run ESLint code quality checks   |
| `npm run format`       | Format code with Prettier        |
| `npm run format:check` | Check code formatting            |
| `npm run test`         | Run test suite                   |

## 🔐 Security Features

### HTTPS/TLS Support

- Self-signed certificates for development
- Mutual TLS (mTLS) authentication with backend
- Automatic HTTP to HTTPS redirection
- Certificate-based client authentication

See [./tls/README.md](./tls/README.md) for detailed security configuration.

### Security Best Practices

- Private keys excluded from version control (`.gitignore`)
- **Only `.env.example` is committed** - actual `.env` files are git-ignored
- Environment variables for sensitive configuration
- Proper file permissions for certificates (600 for keys, 644 for certs)
- Secure Docker configurations for production
- Git hooks for pre-commit validation

## 🔧 Configuration Files

### Vite Configuration (`vite.config.ts`)

Configure Vite build tool, dev server, HTTPS/TLS settings, and proxy configuration for backend API.

### TypeScript Configurations

- `tsconfig.json` - Base TypeScript configuration
- `tsconfig.app.json` - Application-specific settings
- `tsconfig.node.json` - Node.js/build tool settings
- `tsconfig.test.json` - Test environment settings

### ESLint Configuration (`eslint.config.js`)

Linting rules for code quality and consistency.

### Prettier Configuration (`.prettierrc`)

Code formatting rules for consistent style.

### Docker Configuration

- `Dockerfile` - Multi-stage build for optimized production images
- `docker-compose.prod.yml` - Production environment setup
- `docker-compose.staging.yml` - Staging environment setup

## 🐛 Troubleshooting

### Development Server Won't Start

1. Check if port 5173 is already in use:
   ```bash
   lsof -i :5173
   # or
   netstat -tuln | grep 5173
   ```
2. Verify Node.js version matches `.nvmrc` (18+)
3. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### HTTPS Certificate Issues

See [./tls/README.md](./tls/README.md) troubleshooting section for:

- `ERR_CERT_AUTHORITY_INVALID` - CA certificate not trusted
- Socket hang up errors - mTLS authentication issues
- Certificate expiration - Need to regenerate certificates
- Wrong certificate usage - Using wrong cert/key pair

### Backend Connection Issues

1. Verify backend is running:

   ```bash
   # For HTTP backend
   curl http://localhost:3001/api/health

   # For HTTPS backend
   curl --cacert ./tls/ca.crt https://localhost:3443/api/health
   ```

2. Check environment variables:
   - `VITE_USE_HTTPS_BACKEND` matches backend configuration
   - `VITE_BACKEND_HTTP_PORT` or `VITE_BACKEND_HTTPS_PORT` are correct
   - `VITE_API_BASE_URL` is properly set

3. Verify proxy configuration in `vite.config.ts`

### Build Errors

1. Clear Vite cache:

   ```bash
   rm -rf node_modules/.vite
   ```

2. Verify all dependencies are installed:

   ```bash
   npm install
   ```

3. Check TypeScript errors:
   ```bash
   npm run build -- --mode development
   ```

### Docker Issues

```bash
# Rebuild containers from scratch
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d

# Check container logs
docker-compose -f docker-compose.prod.yml logs -f

# Inspect container
docker-compose -f docker-compose.prod.yml exec web sh
```

### Environment Variable Issues

1. Ensure you've created your `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` to match your environment (HTTP vs HTTPS backend)

3. Verify Vite can read environment variables (they must start with `VITE_`)

4. Restart development server after changing `.env`

**Note**: `.env` files (except `.env.example`) are git-ignored and should never be committed.

## 🌐 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style (enforced by ESLint and Prettier)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use Husky git hooks for pre-commit validation

## 📚 Additional Resources

### Documentation

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [TLS Setup Guide](./tls/README.md)

### Project-Specific

- [Environment Variables](./.env.example) - All available configuration options
- [TLS Certificates](./tls/README.md) - HTTPS and mTLS setup
- [Docker Setup](./Dockerfile) - Containerization details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **PhuNguyenPT** - [GitHub Profile](https://github.com/PhuNguyenPT)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [./tls/README.md](./tls/README.md) for TLS-related issues
3. Check environment variable configuration in `.env.example`
4. Open an issue in the [GitHub repository](https://github.com/PhuNguyenPT/ReactJS_Frontend/issues)

## 🔄 Changelog

### Latest Version

- React 19 support
- HTTPS/TLS development environment with mTLS
- Docker support for production and staging
- Comprehensive TypeScript configuration
- Modern ESLint setup
- Prettier code formatting
- Husky git hooks
- Multiple environment configurations
- Session management and API retry logic
- Form validation and upload limits

---

**Built with ❤️ using React, Vite, and TypeScript**

**Last Updated**: December 9, 2025

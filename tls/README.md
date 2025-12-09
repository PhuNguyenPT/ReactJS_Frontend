# TLS Certificates for Frontend Development

This directory contains TLS certificates for secure HTTPS development with the Vite dev server.

## 📁 Certificate Files

### Server Certificates (Frontend HTTPS Server)

- **`frontend.crt`** - Frontend server certificate
- **`frontend.key`** - Frontend server private key (⚠️ Keep secure!)
- **Purpose**: Used by Vite to serve the frontend over HTTPS on port 5173

### Client Certificates (mTLS Authentication)

- **`nginx-client.crt`** - Client certificate for backend authentication
- **`nginx-client.key`** - Client private key (⚠️ Keep secure!)
- **Purpose**: Used by Vite proxy to authenticate with the backend's HTTPS API

### Certificate Authority

- **`ca.crt`** - Root CA certificate
- **Purpose**: Trust anchor for all certificates in the development environment

### Reference

- **`backend.crt`** - Backend server certificate (reference only)
- **Purpose**: Can be used to verify backend certificate details

## 🔐 Certificate Roles

```
┌─────────────────────────────────────────────────────────┐
│                    Development Setup                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Browser                  Frontend (Vite)     Backend   │
│    │                           │                 │       │
│    │  1. HTTPS Connection      │                 │       │
│    │ ─────────────────────────>│                 │       │
│    │  (trusts: ca.crt)         │                 │       │
│    │  (validates: frontend.crt)│                 │       │
│    │                           │                 │       │
│    │                           │  2. mTLS Proxy  │       │
│    │                           │ ───────────────>│       │
│    │                           │ (auth with:     │       │
│    │                           │  nginx-client   │       │
│    │                           │  .crt/.key)     │       │
│    │                           │                 │       │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Generate Certificates

Certificates are generated from the backend repository:

```bash
cd ~/NodejsApp_Backend
./scripts/generate-tls-certs.sh
./scripts/copy-to-frontend.sh
```

### 2. Trust the CA Certificate

#### Linux

```bash
sudo cp ./ca.crt /usr/local/share/ca-certificates/my-dev-ca.crt
sudo update-ca-certificates
```

#### macOS

```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./ca.crt
```

#### Windows

```powershell
certutil -addstore -f "ROOT" ca.crt
```

#### Browser-Specific (Alternative)

**Chrome/Edge:**

1. Go to `chrome://settings/certificates`
2. Click "Authorities" tab
3. Import `ca.crt`
4. Check "Trust this certificate for identifying websites"

**Firefox:**

1. Go to `about:preferences#privacy`
2. Scroll to "Certificates" → "View Certificates"
3. Click "Authorities" tab → "Import"
4. Select `ca.crt` and trust for websites

### 3. Configure Environment Variables

Ensure your `.env` has:

```dotenv
# Frontend Server Certificates
TLS_KEY_PATH=./tls/frontend.key
TLS_CERT_PATH=./tls/frontend.crt
TLS_CA_PATH=./tls/ca.crt

# Client Certificates for Backend mTLS
TLS_CLIENT_KEY_PATH=./tls/nginx-client.key
TLS_CLIENT_CERT_PATH=./tls/nginx-client.crt

# Backend Configuration
VITE_USE_HTTPS_BACKEND=true
VITE_BACKEND_HTTPS_PORT=3443
```

### 4. Start Development Server

```bash
npm run dev
```

Access your application at:

- **HTTPS**: https://localhost:5173
- **HTTP Redirect**: http://localhost:5174 (automatically redirects to HTTPS)

## 🔍 Verify Certificates

### Check Certificate Details

```bash
# View frontend certificate
openssl x509 -in frontend.crt -text -noout

# View client certificate
openssl x509 -in nginx-client.crt -text -noout

# Verify certificate chain
openssl verify -CAfile ca.crt frontend.crt
openssl verify -CAfile ca.crt nginx-client.crt
```

### Check Certificate Validity

```bash
# Check expiry date
openssl x509 -in frontend.crt -noout -enddate
openssl x509 -in nginx-client.crt -noout -enddate
```

### Test HTTPS Connection

```bash
# Test frontend server
curl -v --cacert ca.crt https://localhost:5173

# Test backend with client certificate
curl -v --cacert ca.crt \
     --cert nginx-client.crt \
     --key nginx-client.key \
     https://localhost:3443/api/health
```

## 📋 Certificate Properties

### Frontend Server Certificate (`frontend.crt`)

- **Subject CN**: localhost
- **SANs**: localhost, \*.localhost, 127.0.0.1, ::1
- **Extended Key Usage**: TLS Web Server Authentication
- **Key Usage**: Digital Signature, Key Encipherment, Data Encipherment
- **Validity**: 10 years
- **Issuer**: Internal CA

### Client Certificate (`nginx-client.crt`)

- **Subject CN**: nginx-client
- **Extended Key Usage**: TLS Web Client Authentication
- **Key Usage**: Digital Signature, Key Encipherment
- **Validity**: 10 years
- **Issuer**: Internal CA

## 🔒 Security Notes

### Development Only

⚠️ **These certificates are for development/internal use only!**

- Self-signed certificates
- Not suitable for production
- Should never be deployed to public-facing servers

### Keep Private Keys Secure

🔑 **Never commit private keys to version control!**

The `.gitignore` should exclude:

```gitignore
# TLS private keys
tls/*.key
```

### File Permissions

Ensure proper permissions:

```bash
chmod 600 tls/*.key  # Private keys (read/write for owner only)
chmod 644 tls/*.crt  # Certificates (read for all, write for owner)
```

## 🔧 Configuration in `vite.config.ts`

### Frontend HTTPS Server

```typescript
const tlsConfig = {
  key: fs.readFileSync("./tls/frontend.key"),
  cert: fs.readFileSync("./tls/frontend.crt"),
  ca: fs.readFileSync("./tls/ca.crt"),
};

server: {
  https: tlsConfig;
}
```

### Backend Proxy with mTLS

```typescript
proxy: {
  '/api': {
    target: 'https://localhost:3443',
    agent: new https.Agent({
      key: fs.readFileSync('./tls/nginx-client.key'),
      cert: fs.readFileSync('./tls/nginx-client.crt'),
      ca: fs.readFileSync('./tls/ca.crt'),
      rejectUnauthorized: false
    })
  }
}
```

## 🐛 Troubleshooting

### ERR_CERT_AUTHORITY_INVALID

**Problem**: Browser doesn't trust the certificate

**Solution**: Trust the CA certificate in your system/browser (see step 2 above)

### socket hang up (Proxy Error)

**Problem**: mTLS authentication failing with backend

**Solutions**:

1. Ensure `nginx-client.crt` and `nginx-client.key` exist
2. Verify backend is running on HTTPS (port 3443)
3. Check backend accepts the client certificate:
   ```bash
   openssl s_client -connect localhost:3443 \
     -cert tls/nginx-client.crt \
     -key tls/nginx-client.key \
     -CAfile tls/ca.crt
   ```

### Certificate Expired

**Problem**: Certificate has expired

**Solution**: Regenerate certificates:

```bash
cd ~/NodejsApp_Backend
./scripts/generate-tls-certs.sh
./scripts/copy-to-frontend.sh
```

### Wrong Certificate Usage

**Problem**: Using wrong certificate for wrong purpose

**Solution**:

- Use `frontend.crt/key` for Vite HTTPS server
- Use `nginx-client.crt/key` for proxy mTLS authentication
- Don't mix them up!

## 📚 Additional Resources

### OpenSSL Commands

- [OpenSSL Certificate Verification](https://www.openssl.org/docs/man1.1.1/man1/verify.html)
- [OpenSSL x509 Command](https://www.openssl.org/docs/man1.1.1/man1/x509.html)

### Vite Configuration

- [Vite Server Options](https://vitejs.dev/config/server-options.html)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)

### mTLS Resources

- [Mutual TLS Authentication](https://en.wikipedia.org/wiki/Mutual_authentication)
- [Node.js HTTPS Agent](https://nodejs.org/api/https.html#https_class_https_agent)

## 🔄 Certificate Renewal

Certificates are valid for 10 years. To renew before expiration:

```bash
# 1. Generate new certificates in backend
cd ~/NodejsApp_Backend
./scripts/generate-tls-certs.sh

# 2. Copy to frontend
./scripts/copy-to-frontend.sh

# 3. Restart development servers
# Backend: Ctrl+C then npm run dev
# Frontend: Ctrl+C then npm run dev

# 4. May need to re-trust CA certificate in browser
```

## 📝 Notes

- All certificates are signed by the same internal CA
- The CA certificate must be trusted for all certificates to be valid
- Certificate validation is disabled in development (`rejectUnauthorized: false`)
- For production, use certificates from a trusted Certificate Authority (Let's Encrypt, DigiCert, etc.)

---

**Last Updated**: December 9, 2025  
**Certificate Validity**: Until December 7, 2035

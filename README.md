# Secure Stack App

This project is a simple full-stack web application built with a **React**
frontend and an **Express.js** backend. It demonstrates core concepts of secure
application development by integrating OAuth for authentication, generating a
Software Bill of Materials (SBOM), and implementing vulnerability scanning with
Snyk. Additionally, a Certificate Authority (CA) is used to ensure secure
communication within the application.

## Project Structure

```plaintext
backend/
├── keys/
├── models/
├── routes/
├── backend.js
├── config.env
├── package.json
├── sbom.json

frontend/
├── cert/
├── public/
├── src/
│   ├── App.js
│   ├── index.js
│   ├── pages/
│       ├── Home.js
│       └── Landing.js
├── package.json
├── sbom.json
```

## Key Features

### 1. Frontend (React)
The frontend, built with React, includes:
- **Registration Page**: OAuth-based login and registration for secure access.
- **Landing and Home Pages**: Core pages for user interaction.
- **Security Integration**: CA certificates ensure HTTPS-secured API
  communication.

### 2. Backend (Express.js)
The backend, powered by Express.js, offers API endpoints and services:
- **OAuth**: Integrates third-party providers for secure user authentication.
- **User Data Management**: Models and services for managing users. MongoDB
  database for storing user data.
- **Snyk Integration**: Snyk scans for and reports on vulnerabilities in dependencies.

### 3. Security and Compliance
- **OAuth Authentication**: Secure login with third-party OAuth providers.
- **CA Implementation**: Certificates are applied to secure communication channels.
- **SBOM Generation**: Lists project dependencies to aid in vulnerability
  tracking in frontend and backend.
- **Snyk Scans**: Identifies and remediates known vulnerabilities.
- **JWT Tokens**: After successful authentication, the backend generates JWT
  (JSON Web Tokens) to manage user sessions securely. Passed between the client
  and server to validate and authorize requests. Sessions stored in cookies.

# QuantumBallot Backend

## Executive Summary

The QuantumBallot Backend is a secure, enterprise-grade blockchain-based voting system built with Node.js, TypeScript, and Express. Designed for American elections, this backend provides immutable vote recording through a custom blockchain implementation, end-to-end encryption for voter privacy, and comprehensive administrative controls. The system ensures vote integrity through cryptographic verification, proof-of-work consensus, and smart contract automation for result computation.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Installation and Setup](#installation-and-setup)
6. [Development Guidelines](#development-guidelines)
7. [Testing Framework](#testing-framework)
8. [Build and Deployment](#build-and-deployment)
9. [Security Considerations](#security-considerations)
10. [API Documentation](#api-documentation)
11. [Database Schema](#database-schema)
12. [Support and Maintenance](#support-and-maintenance)

---

## System Architecture

### Application Overview

| Component            | Description           | Responsibility                           |
| -------------------- | --------------------- | ---------------------------------------- |
| API Layer            | Express.js Routes     | HTTP request handling and routing        |
| Service Layer        | Committee, Blockchain | Business logic and blockchain operations |
| Smart Contract Layer | SmartContract Class   | Vote tallying and result computation     |
| Cryptography Layer   | CryptoBlockchain      | AES-256 encryption/decryption            |
| Database Layer       | LevelDB               | Persistent key-value storage             |
| Middleware Layer     | JWT Verification      | Authentication and authorization         |

### Data Flow Architecture

| Stage             | Process                      | Technology       |
| ----------------- | ---------------------------- | ---------------- |
| Request Reception | HTTP request handling        | Express.js       |
| Authentication    | JWT token verification       | jsonwebtoken     |
| Business Logic    | Committee operations         | Committee Class  |
| Blockchain        | Transaction/block processing | BlockChain Class |
| Encryption        | Data encryption/decryption   | AES-256-CBC      |
| Persistence       | Data storage/retrieval       | LevelDB          |

### Blockchain Architecture

| Component        | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| Block Structure  | Block header with hash, previous hash, Merkle root, timestamp, nonce |
| Transaction Pool | Pending transactions awaiting mining                                 |
| Proof of Work    | Difficulty target-based nonce discovery                              |
| Merkle Tree      | Transaction hash aggregation                                         |
| Chain Validation | Integrity verification through hash linkage                          |

---

## Technology Stack

### Core Framework

| Technology | Version | Purpose                                |
| ---------- | ------- | -------------------------------------- |
| Node.js    | 16+     | Runtime Environment                    |
| TypeScript | 5.4.5   | Type Safety and Development Experience |
| Express.js | 4.18.2  | Web Framework                          |
| ts-node    | 10.9.2  | TypeScript Execution                   |

### Blockchain and Cryptography

| Technology       | Version  | Purpose                |
| ---------------- | -------- | ---------------------- |
| crypto-js        | 4.1.1    | SHA-256 Hashing        |
| crypto (Node.js) | Built-in | AES-256-CBC Encryption |
| bcrypt           | 5.1.0    | Password Hashing       |

### Database

| Technology | Version | Purpose                  |
| ---------- | ------- | ------------------------ |
| LevelDB    | 8.0.0   | Embedded Key-Value Store |

### Authentication and Security

| Technology    | Version | Purpose                        |
| ------------- | ------- | ------------------------------ |
| jsonwebtoken  | 9.0.0   | JWT Token Management           |
| speakeasy     | 2.0.0   | TOTP Two-Factor Authentication |
| cors          | 2.8.5   | Cross-Origin Resource Sharing  |
| cookie-parser | 1.4.6   | Cookie Parsing                 |

### Communication

| Technology | Version | Purpose                 |
| ---------- | ------- | ----------------------- |
| axios      | 1.6.0   | HTTP Client             |
| nodemailer | 6.9.13  | Email Sending           |
| socket.io  | 4.7.5   | Real-time Communication |
| qrcode     | 1.5.3   | QR Code Generation      |

### Development Tools

| Technology | Version | Purpose                 |
| ---------- | ------- | ----------------------- |
| Jest       | 29.5.0  | Test Framework          |
| ts-jest    | 29.1.2  | TypeScript Jest Support |
| supertest  | 6.3.3   | HTTP Testing            |
| nodemon    | 3.1.0   | Auto-reload Development |
| ESLint     | Latest  | Code Linting            |

---

## Project Structure

### Directory Organization

| Directory | File Count | Description                |
| --------- | ---------- | -------------------------- |
| src/      | 28 files   | Main source code directory |
| tests/    | 9 files    | Test files and mocks       |
| data/     | Generated  | LevelDB database files     |
| dist/     | Generated  | Compiled JavaScript output |

### Source Code Structure

| Directory           | Purpose              | Key Contents                            |
| ------------------- | -------------------- | --------------------------------------- |
| src/api/            | API Routes           | Express route handlers                  |
| src/api/routes/     | Route Definitions    | blockchain.route.ts, committee.route.ts |
| src/blockchain/     | Blockchain Core      | BlockChain class, data types            |
| src/committee/      | Committee Management | Committee class, citizen/user types     |
| src/config/         | Configuration        | CORS settings, allowed origins          |
| src/crypto/         | Cryptography         | AES-256 encryption utilities            |
| src/email_center/   | Email Service        | Nodemailer integration                  |
| src/leveldb/        | Database             | LevelDB operations and wrappers         |
| src/middleware/     | Middleware           | JWT verification, credentials           |
| src/network/        | P2P Network          | Network communication                   |
| src/smart_contract/ | Smart Contracts      | Vote tallying logic                     |

### Key Files

| File                                 | Purpose                        |
| ------------------------------------ | ------------------------------ |
| src/index.ts                         | Application entry point        |
| src/blockchain/blockchain.ts         | Core blockchain implementation |
| src/blockchain/data_types.ts         | Block, Transaction interfaces  |
| src/committee/committee.ts           | Committee management logic     |
| src/committee/data_types.ts          | Citizen, User interfaces       |
| src/smart_contract/smart_contract.ts | Vote tallying and results      |
| src/crypto/cryptoBlockchain.ts       | Encryption/decryption          |
| src/leveldb/index.ts                 | Database operations            |

---

## Core Features

### Blockchain Features

| Feature          | Description                      | Implementation             |
| ---------------- | -------------------------------- | -------------------------- |
| Block Creation   | Genesis and new block generation | BlockChain.createBlock     |
| Proof of Work    | Difficulty-based mining          | BlockChain.proofOfWork     |
| Merkle Tree      | Transaction hash aggregation     | BlockChain.createMarkle    |
| Chain Validation | Integrity verification           | BlockChain.isValidChain    |
| Transaction Pool | Pending transaction management   | BlockChain.transactionPool |
| Block Mining     | Mine new blocks with nonce       | BlockChain.mineBlock       |

### Smart Contract Features

| Feature                  | Description                 | Implementation                    |
| ------------------------ | --------------------------- | --------------------------------- |
| Vote Processing          | Tally votes from blockchain | SmartContract.processVotes        |
| Result Computation       | Calculate election results  | SmartContract.getResults          |
| Winner Determination     | Identify winning candidate  | SmartContract.winningCandidate    |
| Province Statistics      | Per-region vote tracking    | SmartContract.statsPerProvince    |
| Election Time Validation | Check voting window         | SmartContract.isValidElectionTime |

### Committee Management

| Feature              | Description                | Implementation                  |
| -------------------- | -------------------------- | ------------------------------- |
| Citizen Registration | Register eligible voters   | Committee.addCitzen             |
| Candidate Management | Add election candidates    | Committee.addCandidateCommittee |
| Voter Generation     | Generate voter identifiers | Committee.generateIdentifiers   |
| User Management      | Admin user operations      | Committee.addUser               |
| OTP Generation       | Two-factor authentication  | Committee.generateOtp           |
| QR Code Generation   | Certificate QR codes       | Committee.generateQRCode        |

### Authentication Features

| Feature               | Description                | Implementation           |
| --------------------- | -------------------------- | ------------------------ |
| Mobile Authentication | Voter login (Electoral ID) | Committee.authMobile     |
| Web Authentication    | Admin login (Username)     | Committee.authWeb        |
| JWT Token Management  | Access and refresh tokens  | verifyJWT, verifyJWTWeb  |
| Token Refresh         | Extend session validity    | /refresh-token endpoints |
| Logout                | Session termination        | /log-out endpoints       |

### Security Features

| Feature                   | Description                    | Implementation   |
| ------------------------- | ------------------------------ | ---------------- |
| AES-256 Encryption        | Vote and identifier encryption | CryptoBlockchain |
| Password Hashing          | Bcrypt password storage        | bcrypt           |
| Two-Factor Authentication | TOTP verification              | speakeasy        |
| JWT Protection            | Token-based access control     | jsonwebtoken     |
| CORS Configuration        | Origin-based access            | cors middleware  |

---

## Installation and Setup

### Prerequisites

| Requirement | Minimum Version | Recommended Version |
| ----------- | --------------- | ------------------- |
| Node.js     | 16.0.0          | 18.x LTS            |
| npm         | 7.0.0           | 9.x                 |
| Git         | 2.30.0          | Latest              |

### Installation Methods

| Method    | Command       | Description                    |
| --------- | ------------- | ------------------------------ |
| Automated | `./setup.sh`  | Full automated setup           |
| Manual    | `npm install` | Manual dependency installation |
| Makefile  | `make setup`  | Makefile-based setup           |

### Setup Steps

| Step | Command                  | Description                   |
| ---- | ------------------------ | ----------------------------- |
| 1    | `cd backend`             | Navigate to backend directory |
| 2    | `npm install`            | Install dependencies          |
| 3    | `cp .env.example .env`   | Create environment file       |
| 4    | Generate encryption keys | Update .env with secrets      |
| 5    | `npm run build`          | Compile TypeScript            |
| 6    | `npm start`              | Start server                  |

### Environment Variables

| Variable              | Description                | Example                 |
| --------------------- | -------------------------- | ----------------------- |
| PORT                  | Server port                | 3000                    |
| NODE_ENV              | Environment mode           | development             |
| JWT_SECRET            | JWT signing secret         | 32+ characters          |
| ACCESS_TOKEN_SECRET   | Access token secret        | 32+ characters          |
| REFRESH_TOKEN_SECRET  | Refresh token secret       | 32+ characters          |
| DB_PATH               | Database directory         | ./data/QuantumBallot_db |
| SECRET_KEY_IDENTIFIER | 64-char hex encryption key | Generated               |
| SECRET_IV_IDENTIFIER  | 32-char hex IV             | Generated               |
| SECRET_KEY_VOTES      | 64-char hex vote key       | Generated               |
| SECRET_IV_VOTES       | 32-char hex vote IV        | Generated               |
| MAILER_SERVICE        | Email service              | gmail                   |
| MAILER_HOST           | SMTP host                  | smtp.gmail.com          |
| MAILER_PORT           | SMTP port                  | 587                     |
| MAILER_USER           | Email address              | user@example.com        |
| MAILER_PASS           | Email password             | app_password            |

### Key Generation

| Key Type               | Command                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| 64-char hex (32 bytes) | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| 32-char hex (16 bytes) | `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"` |

---

## Development Guidelines

### Code Organization

| Principle        | Implementation                           |
| ---------------- | ---------------------------------------- |
| Module Structure | Feature-based directory organization     |
| Type Safety      | TypeScript interfaces for all data types |
| Error Handling   | Try-catch with graceful degradation      |
| Async/Await      | Promise-based asynchronous operations    |

### Naming Conventions

| Element    | Convention              | Example            |
| ---------- | ----------------------- | ------------------ |
| Classes    | PascalCase              | BlockChain         |
| Interfaces | PascalCase              | Block, Transaction |
| Methods    | camelCase               | mineBlock          |
| Variables  | camelCase               | transactionPool    |
| Constants  | UPPER_SNAKE_CASE        | DIFFICULTY_TARGET  |
| Files      | camelCase or PascalCase | blockchain.ts      |

### Available Scripts

| Command                 | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `npm run build`         | Compile TypeScript to JavaScript          |
| `npm start`             | Start production server                   |
| `npm run dev`           | Start development server with auto-reload |
| `npm test`              | Run test suite                            |
| `npm run test:coverage` | Run tests with coverage                   |
| `npm run test:watch`    | Run tests in watch mode                   |

### Makefile Commands

| Command        | Purpose                                       |
| -------------- | --------------------------------------------- |
| `make setup`   | Full setup (install, generate secrets, build) |
| `make install` | Install dependencies                          |
| `make build`   | Build TypeScript                              |
| `make start`   | Start production server                       |
| `make dev`     | Start development server                      |
| `make test`    | Run tests                                     |
| `make clean`   | Clean build artifacts and database            |

---

## Testing Framework

### Test Structure

| Category             | Location                 | Count   |
| -------------------- | ------------------------ | ------- |
| Blockchain Tests     | tests/blockchain.test.js | 1 file  |
| Committee Tests      | tests/committee.test.js  | 1 file  |
| Crypto Tests         | tests/crypto.test.js     | 1 file  |
| Middleware Tests     | tests/middleware.test.js | 1 file  |
| API Tests            | tests/api.test.js        | 1 file  |
| Smart Contract Tests | tests/smart_contract/    | 2 files |
| Mocks                | tests/mocks/             | 2 files |

### Test Commands

| Command                 | Purpose                  |
| ----------------------- | ------------------------ |
| `npm test`              | Run all tests            |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:watch`    | Run tests in watch mode  |

### Coverage Thresholds

| Metric     | Threshold |
| ---------- | --------- |
| Branches   | 70%       |
| Functions  | 80%       |
| Lines      | 80%       |
| Statements | 80%       |

---

## Build and Deployment

### Build Configuration

| Setting          | Value    | Description               |
| ---------------- | -------- | ------------------------- |
| Target           | ES2019   | JavaScript target version |
| Output Directory | dist/    | Compiled output location  |
| Source Directory | src/     | TypeScript source         |
| Module System    | CommonJS | Module format             |

### Docker Deployment

| Configuration     | Value                 |
| ----------------- | --------------------- |
| Base Image        | node:21-alpine        |
| Exposed Port      | 3000                  |
| Working Directory | /usr/app              |
| Build Command     | npm run build         |
| Start Command     | node build/network.js |

### Production Deployment

| Step | Action                            |
| ---- | --------------------------------- |
| 1    | Set NODE_ENV=production           |
| 2    | Configure reverse proxy (nginx)   |
| 3    | Enable HTTPS with SSL certificate |
| 4    | Use process manager (PM2)         |
| 5    | Configure firewall rules          |

### PM2 Configuration

| Command                                                | Purpose                |
| ------------------------------------------------------ | ---------------------- |
| `pm2 start dist/index.js --name quantumballot-backend` | Start application      |
| `pm2 save`                                             | Save PM2 configuration |
| `pm2 startup`                                          | Configure auto-start   |

---

## Security Considerations

### Encryption

| Component             | Algorithm   | Key Size  |
| --------------------- | ----------- | --------- |
| Vote Encryption       | AES-256-CBC | 256 bits  |
| Identifier Encryption | AES-256-CBC | 256 bits  |
| Password Hashing      | bcrypt      | 10 rounds |
| Block Hashing         | SHA-256     | 256 bits  |

### Authentication

| Feature         | Implementation               |
| --------------- | ---------------------------- |
| Access Tokens   | JWT with 10-60 minute expiry |
| Refresh Tokens  | JWT with 5-day expiry        |
| Cookie Security | httpOnly, secure, sameSite   |
| Two-Factor Auth | TOTP with 5-minute window    |

### API Security

| Feature          | Implementation           |
| ---------------- | ------------------------ |
| CORS             | Origin whitelist         |
| JWT Verification | Bearer token validation  |
| Input Validation | Request body validation  |
| Error Handling   | Sanitized error messages |

### Best Practices

| Practice              | Implementation                  |
| --------------------- | ------------------------------- |
| Environment Variables | .env file (not in git)          |
| Secret Generation     | cryptographically secure random |
| HTTPS                 | Required in production          |
| Rate Limiting         | Recommended for production      |

---

## API Documentation

### Core Endpoints

| Endpoint | Method | Description            |
| -------- | ------ | ---------------------- |
| /        | GET    | API status and version |
| /health  | GET    | Health check           |

### Blockchain API (/api/blockchain)

#### Public Endpoints

| Endpoint              | Method | Description                   |
| --------------------- | ------ | ----------------------------- |
| /                     | GET    | Get full blockchain state     |
| /chain                | GET    | Get blockchain                |
| /blocks               | GET    | Get all blocks                |
| /block-detail/:id     | GET    | Get specific block by hash    |
| /transactions         | GET    | Get all transactions          |
| /pending-transactions | GET    | Get pending transactions      |
| /voters               | GET    | Get voters list               |
| /candidates           | GET    | Get candidates list           |
| /get-results-computed | GET    | Get computed results (cached) |

#### Protected Endpoints (JWT Required)

| Endpoint               | Method | Description               |
| ---------------------- | ------ | ------------------------- |
| /transaction           | POST   | Submit voting transaction |
| /transaction/broadcast | POST   | Broadcast transaction     |
| /mine                  | GET    | Mine new block            |
| /deploy-voters         | GET    | Deploy generated voters   |
| /deploy-candidates     | GET    | Deploy candidates         |
| /get-results           | GET    | Compute fresh results     |
| /clear-voters          | GET    | Clear voters (admin)      |
| /clear-results         | GET    | Clear results (admin)     |
| /clear-chains          | GET    | Clear blockchain (admin)  |

### Committee API (/api/committee)

#### Public Endpoints

| Endpoint        | Method | Description               |
| --------------- | ------ | ------------------------- |
| /registers      | GET    | Get citizen registers     |
| /candidates     | GET    | Get candidates            |
| /announcement   | GET    | Get election announcement |
| /register-voter | POST   | Register new voter        |
| /send-email     | POST   | Send OTP email            |

#### Authentication Endpoints

| Endpoint           | Method | Description                   |
| ------------------ | ------ | ----------------------------- |
| /auth-mobile       | POST   | Mobile authentication         |
| /auth-web          | POST   | Web authentication            |
| /verify-otp        | POST   | Verify OTP code               |
| /refresh-token     | GET    | Refresh access token (mobile) |
| /refresh-token-web | GET    | Refresh access token (web)    |
| /log-out           | GET    | Logout (mobile)               |
| /log-out-web       | GET    | Logout (web)                  |

#### Admin Endpoints (JWT Required)

| Endpoint              | Method | Description                  |
| --------------------- | ------ | ---------------------------- |
| /add-candidate        | POST   | Add new candidate            |
| /add-user             | POST   | Add committee user           |
| /update-citizen       | POST   | Update citizen information   |
| /update-user          | POST   | Update user information      |
| /delete-register      | POST   | Delete citizen register      |
| /delete-user          | POST   | Delete committee user        |
| /deploy-announcement  | POST   | Deploy election announcement |
| /generate-identifiers | GET    | Generate voter identifiers   |
| /users                | GET    | Get committee users          |
| /voter-identifiers    | GET    | Get generated identifiers    |
| /clear-candidates     | GET    | Clear candidates             |
| /clear-registers      | GET    | Clear citizen registers      |
| /clear-users          | GET    | Clear committee users        |

---

## Database Schema

### LevelDB Sublevels

| Sublevel               | Purpose               | Key Type       |
| ---------------------- | --------------------- | -------------- |
| block                  | Individual blocks     | Block hash     |
| chain                  | Full blockchain       | Fixed key      |
| citizens               | Registered citizens   | Electoral ID   |
| candidates             | Election candidates   | Candidate code |
| voters                 | Generated voters      | Identifier     |
| voters_generated       | Pre-generated voters  | Identifier     |
| user_committee         | Committee users       | Username       |
| announcement           | Election announcement | Fixed key      |
| results                | Computed results      | Fixed key      |
| voter_citizen_relation | Electoral ID mapping  | Encrypted ID   |

### Data Types

| Type         | Location                 | Fields                                |
| ------------ | ------------------------ | ------------------------------------- |
| Block        | blockchain/data_types.ts | blockIndex, blockHeader, transactions |
| Transaction  | blockchain/data_types.ts | data (Voter), transactionHash         |
| Voter        | blockchain/data_types.ts | identifier, electoralId, choiceCode   |
| Candidate    | blockchain/data_types.ts | name, code, party, num_votes          |
| Citizen      | committee/data_types.ts  | electoralId, name, email, province    |
| User         | committee/data_types.ts  | username, password, role              |
| Announcement | committee/data_types.ts  | startTime, endTime, numOfVoters       |

---

## Support and Maintenance

### Development Team

| Role               | Responsibility                    |
| ------------------ | --------------------------------- |
| Backend Developers | API and blockchain implementation |
| Security Engineers | Cryptography and authentication   |
| DevOps Engineers   | Deployment and infrastructure     |
| QA Engineers       | Testing and quality assurance     |

### Maintenance Schedule

| Activity           | Frequency |
| ------------------ | --------- |
| Dependency Updates | Monthly   |
| Security Patches   | As needed |
| Performance Review | Quarterly |
| Code Review        | Per PR    |

### Troubleshooting

| Issue                | Solution                                |
| -------------------- | --------------------------------------- |
| Database lock errors | Ensure single instance running          |
| Port already in use  | Change PORT in .env or kill process     |
| TypeScript errors    | Run `npm run build` to check            |
| Email not sending    | Verify MAILER\_\* environment variables |
| Module not found     | Delete node_modules and reinstall       |

### Common Error Codes

| Code | Description  | Solution                         |
| ---- | ------------ | -------------------------------- |
| 400  | Bad Request  | Check request body format        |
| 401  | Unauthorized | Re-authenticate with valid token |
| 403  | Forbidden    | Invalid or expired token         |
| 404  | Not Found    | Resource does not exist          |
| 409  | Conflict     | Duplicate vote or resource       |
| 500  | Server Error | Check server logs                |

### Health Check Endpoints

| Endpoint | Expected Response                         |
| -------- | ----------------------------------------- |
| /health  | `{ status: "ok", timestamp, uptime }`     |
| /        | `{ message, version, status, timestamp }` |

---

## License

This project is licensed under the terms specified in the root LICENSE file.

---

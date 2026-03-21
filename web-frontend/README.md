# QuantumBallot Web Frontend

## Executive Summary

The QuantumBallot Web Frontend is a secure, enterprise-grade administrative interface for blockchain-based election management. Built with React, TypeScript, and modern web technologies, this application provides election committee members and system administrators with comprehensive tools for election monitoring, blockchain transaction tracking, and administrative control. The platform ensures transparency, security, and real-time data visualization for electoral processes.

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
10. [Browser Compatibility](#browser-compatibility)
11. [API Integration](#api-integration)
12. [Support and Maintenance](#support-and-maintenance)

---

## System Architecture

### Application Overview

| Component          | Description                        | Responsibility                                           |
| ------------------ | ---------------------------------- | -------------------------------------------------------- |
| Presentation Layer | React Components, UI Library       | User interface rendering and interaction handling        |
| State Management   | React Context, TanStack Query      | Global state management and server state synchronization |
| Service Layer      | API Services, Firebase Integration | External communication and data persistence              |
| Validation Layer   | Zod Schemas                        | Input validation and type safety                         |
| Utility Layer      | Helper Functions, Custom Hooks     | Reusable logic and cross-cutting concerns                |

### Data Flow Architecture

| Stage        | Process                              | Technology                      |
| ------------ | ------------------------------------ | ------------------------------- |
| User Input   | Form submission, button clicks       | React Hook Form, Event Handlers |
| Validation   | Schema-based validation              | Zod Validation Library          |
| API Request  | HTTP requests with authentication    | Axios, JWT Tokens               |
| State Update | Local and server state updates       | TanStack Query, React Context   |
| UI Rendering | Component re-rendering with new data | React Virtual DOM               |

---

## Technology Stack

### Core Framework

| Technology | Version | Purpose                                |
| ---------- | ------- | -------------------------------------- |
| React      | 18.2.0  | UI Component Library                   |
| TypeScript | 5.2.2   | Type Safety and Development Experience |
| Vite       | 5.2.0   | Build Tool and Development Server      |
| Node.js    | 16+     | Runtime Environment                    |

### UI and Styling

| Technology    | Version | Purpose                     |
| ------------- | ------- | --------------------------- |
| Tailwind CSS  | 3.4.3   | Utility-First CSS Framework |
| Radix UI      | Latest  | Headless UI Components      |
| Material UI   | 5.15.15 | Component Library           |
| Chakra UI     | 2.8.2   | Component Library           |
| Framer Motion | 11.0.25 | Animation Library           |
| Lucide React  | 0.364.0 | Icon Library                |

### State Management and Data Fetching

| Technology      | Version | Purpose                 |
| --------------- | ------- | ----------------------- |
| TanStack Query  | 5.32.0  | Server State Management |
| TanStack Table  | 8.15.3  | Data Table Components   |
| React Hook Form | 7.51.3  | Form State Management   |
| Zod             | 3.22.5  | Schema Validation       |

### Backend Integration

| Technology  | Version | Purpose                    |
| ----------- | ------- | -------------------------- |
| Axios       | 1.6.8   | HTTP Client                |
| Firebase    | 10.11.1 | Authentication and Storage |
| Auth0 React | 2.2.4   | Authentication Provider    |

### Testing Framework

| Technology            | Version | Purpose                        |
| --------------------- | ------- | ------------------------------ |
| Vitest                | 1.6.0   | Test Runner                    |
| React Testing Library | 15.0.7  | Component Testing              |
| Jest DOM              | 6.4.5   | DOM Assertions                 |
| jsdom                 | 24.0.0  | Browser Environment Simulation |

### Visualization and Maps

| Technology        | Version | Purpose                    |
| ----------------- | ------- | -------------------------- |
| Recharts          | 2.12.4  | Chart Components           |
| MUI X Charts      | 7.1.0   | Data Visualization         |
| D3 Geo            | 3.1.1   | Geographic Data Processing |
| Google Maps React | 0.8.2   | Map Integration            |

---

## Project Structure

### Directory Organization

| Directory  | File Count | Description                      |
| ---------- | ---------- | -------------------------------- |
| src/       | 302 files  | Main source code directory       |
| **tests**/ | 25 files   | Test files and testing utilities |
| public/    | 14 files   | Static assets and public files   |

### Source Code Structure

| Directory       | Purpose                  | Key Contents                                   |
| --------------- | ------------------------ | ---------------------------------------------- |
| src/assets/     | Static Resources         | Images, icons, SVG files                       |
| src/components/ | Reusable UI Components   | 30+ components including forms, tables, charts |
| src/context/    | State Management         | AuthContext, SecureStore                       |
| src/data_types/ | Type Definitions         | TypeScript interfaces and enums                |
| src/geomap/     | Geographic Components    | Map components, GeoJSON data                   |
| src/global/     | Global Configuration     | Constants, environment variables               |
| src/hooks/      | Custom React Hooks       | useMediaQuery and other custom hooks           |
| src/lib/        | Utility Libraries        | Logger, validations, utilities                 |
| src/pages/      | Page Components          | Route-level page components                    |
| src/screens/    | Main Application Screens | 15+ feature screens                            |
| src/services/   | API Services             | API clients, Firebase integration              |
| src/sounds/     | Audio Assets             | Sound effects and audio files                  |
| src/styles/     | Global Styles            | CSS modules, global stylesheets                |
| src/tables/     | Data Table Components    | 10 table implementations                       |

### Screen Components

| Screen             | File                   | Purpose                              |
| ------------------ | ---------------------- | ------------------------------------ |
| Dashboard          | Dashboard.tsx          | Election monitoring and analytics    |
| Login              | Login.tsx              | User authentication                  |
| Entrance           | Entrance.tsx           | Application entry point with routing |
| Blockchain         | Blockchain.tsx         | Blockchain overview and monitoring   |
| BlockchainDetails  | BlockchainDetails.tsx  | Detailed block information           |
| Candidates         | Candidates.tsx         | Candidate management                 |
| Voters             | Voters.tsx             | Voter registry management            |
| ElectionResults    | ElectionResults.tsx    | Real-time election results           |
| AnnounceElection   | AnnounceElection.tsx   | Election announcement creation       |
| PublicAnnouncement | PublicAnnouncement.tsx | Public election information          |
| PopulationData     | PopulationData.tsx     | Demographic data management          |
| Users              | Users.tsx              | User administration                  |
| EditAccount        | EditAccount.tsx        | Account settings                     |
| NoPage             | NoPage.tsx             | 404 error page                       |

### Data Table Components

| Table                      | Location                    | Purpose                     |
| -------------------------- | --------------------------- | --------------------------- |
| Users Table                | users_table/                | User management interface   |
| Voters Table               | voters_table/               | Voter registry interface    |
| Candidates Table           | candidates_table/           | Candidate listing           |
| Election Results Table     | election_results_table/     | Results display with audio  |
| Blockchain Blocks Table    | blocks_table/               | Block chain visualization   |
| Transactions Table         | transactions_table/         | Transaction history         |
| Pending Transactions Table | pending_transactions_table/ | Pending transaction queue   |
| Population Table           | population_table/           | Citizen demographic data    |
| Block Details Transactions | transactions_block_details/ | Block-specific transactions |

---

## Core Features

### Administrative Dashboard

| Feature                  | Description                                  | Component |
| ------------------------ | -------------------------------------------- | --------- |
| Vote Statistics          | Real-time vote counting and percentages      | Dashboard |
| Geographic Visualization | Interactive map showing regional voting data | GoogleMap |
| Party Rankings           | Top performing parties with vote counts      | Dashboard |
| Provincial Analysis      | Vote distribution by province                | Dashboard |
| Time Analytics           | Average voting time metrics                  | Dashboard |

### Election Management

| Feature               | Description                          | Access Level |
| --------------------- | ------------------------------------ | ------------ |
| Election Announcement | Create and manage election schedules | Admin        |
| Candidate Management  | Add, edit, remove candidates         | Admin        |
| Voter Verification    | Verify and manage voter registration | Admin        |
| Population Data       | Manage citizen demographic records   | Admin        |
| Public Announcements  | Publish election information         | Admin        |

### Blockchain Integration

| Feature             | Description                             | Component                  |
| ------------------- | --------------------------------------- | -------------------------- |
| Block Explorer      | View blockchain blocks and transactions | Blockchain                 |
| Transaction Monitor | Real-time transaction tracking          | BlockchainDetails          |
| Hash Verification   | Verify block integrity                  | BlockchainDetails          |
| Pending Queue       | Monitor pending transactions            | pending_transactions_table |

### User Management

| Feature               | Description                       | Component   |
| --------------------- | --------------------------------- | ----------- |
| Role-Based Access     | Admin and normal user roles       | AuthContext |
| Profile Management    | User profile and settings         | EditAccount |
| Secure Authentication | JWT-based authentication          | AuthContext |
| Session Management    | Login/logout and session handling | Entrance    |

---

## Installation and Setup

### Prerequisites

| Requirement | Minimum Version | Recommended Version |
| ----------- | --------------- | ------------------- |
| Node.js     | 16.0.0          | 18.x LTS            |
| npm         | 8.0.0           | 9.x                 |
| Git         | 2.30.0          | Latest              |
| Browser     | Chrome 124      | Latest Chrome       |

### Installation Steps

| Step | Command                      | Description                    |
| ---- | ---------------------------- | ------------------------------ |
| 1    | `git clone <repository-url>` | Clone the repository           |
| 2    | `cd web-frontend`            | Navigate to frontend directory |
| 3    | `npm install`                | Install dependencies           |
| 4    | `npm run dev`                | Start development server       |
| 5    | Open http://localhost:5173   | Access application             |

### Environment Configuration

| Variable          | Description          | Default               |
| ----------------- | -------------------- | --------------------- |
| VITE_API_BASE_URL | Backend API URL      | http://localhost:3010 |
| VITE_API_TIMEOUT  | API request timeout  | 30000ms               |
| VITE_DEBUG_MODE   | Enable debug logging | false                 |

---

## Development Guidelines

### Code Organization

| Principle           | Implementation                               |
| ------------------- | -------------------------------------------- |
| Component Structure | Functional components with TypeScript        |
| State Management    | React Context for global, useState for local |
| API Calls           | Centralized in services/ directory           |
| Type Safety         | TypeScript interfaces in data_types/         |
| Styling             | Tailwind CSS with consistent class naming    |

### Naming Conventions

| Element    | Convention                | Example            |
| ---------- | ------------------------- | ------------------ |
| Components | PascalCase                | UserManagement.tsx |
| Hooks      | camelCase with use prefix | useMediaQuery.tsx  |
| Utilities  | camelCase                 | formatDate.ts      |
| Constants  | UPPER_SNAKE_CASE          | GLOBAL_VARIABLES   |
| Types      | PascalCase                | User, Candidate    |

### File Organization

| Pattern    | Location           | Example              |
| ---------- | ------------------ | -------------------- |
| Screens    | src/screens/       | Dashboard.tsx        |
| Components | src/components/    | SidebarComponent.tsx |
| Tables     | src/tables/[name]/ | users_table/page.tsx |
| Services   | src/services/      | api.ts, firebase.ts  |
| Hooks      | src/hooks/         | use-media-query.tsx  |

---

## Testing Framework

### Test Structure

| Category          | Location               | Count    |
| ----------------- | ---------------------- | -------- |
| Component Tests   | **tests**/components/  | 2 files  |
| Screen Tests      | **tests**/screens/     | 12 files |
| Context Tests     | **tests**/context/     | 1 file   |
| Integration Tests | **tests**/integration/ | 3 files  |
| Library Tests     | **tests**/lib/         | 2 files  |

### Test Commands

| Command                  | Purpose                  |
| ------------------------ | ------------------------ |
| `npm test`               | Run all tests            |
| `npm test -- --ui`       | Run tests with UI        |
| `npm test -- --coverage` | Generate coverage report |
| `npm test -- --watch`    | Run tests in watch mode  |

### Coverage Areas

| Area                | Coverage Type        |
| ------------------- | -------------------- |
| Component Rendering | Unit Tests           |
| User Interactions   | Integration Tests    |
| State Management    | Context Tests        |
| API Integration     | Mocked Service Tests |
| Error Handling      | Boundary Tests       |

---

## Build and Deployment

### Build Configuration

| Setting            | Value    | Description               |
| ------------------ | -------- | ------------------------- |
| Target             | ES2015   | JavaScript target version |
| Output Directory   | dist/    | Build output location     |
| Minification       | Disabled | For reduced memory usage  |
| Source Maps        | Disabled | For reduced memory usage  |
| Chunk Size Warning | 1000KB   | Bundle size threshold     |

### Build Commands

| Command                    | Output       | Purpose                  |
| -------------------------- | ------------ | ------------------------ |
| `npm run build`            | dist/        | Production build         |
| `npm run build:with-types` | dist/        | Build with type checking |
| `npm run preview`          | Local server | Preview production build |

### Deployment Options

| Method         | Configuration              | Use Case                 |
| -------------- | -------------------------- | ------------------------ |
| Static Hosting | Upload dist/ contents      | Netlify, Vercel, AWS S3  |
| Docker         | Use infrastructure/docker/ | Containerized deployment |
| Self-Hosted    | Configure web server       | On-premises deployment   |

---

## Security Considerations

### Authentication

| Feature            | Implementation          |
| ------------------ | ----------------------- |
| Primary Auth       | Firebase Authentication |
| Secondary Auth     | Auth0 Integration       |
| Token Storage      | SecureStore (encrypted) |
| Session Management | JWT with refresh tokens |

### API Security

| Feature               | Implementation             |
| --------------------- | -------------------------- |
| Request Interceptors  | Automatic token attachment |
| Response Interceptors | 401 error handling         |
| Timeout Protection    | 30-second request timeout  |
| CORS Configuration    | Server-side CORS policies  |

### Data Validation

| Layer           | Technology            |
| --------------- | --------------------- |
| Client-Side     | Zod Schemas           |
| Form Validation | React Hook Form + Zod |
| Type Safety     | TypeScript            |

---

## Browser Compatibility

| Browser         | Minimum Version | Recommended Version | Status          |
| --------------- | --------------- | ------------------- | --------------- |
| Google Chrome   | 124.0.6367.93   | Latest              | Fully Supported |
| Mozilla Firefox | 115.0           | Latest              | Supported       |
| Apple Safari    | 16.0            | Latest              | Supported       |
| Microsoft Edge  | 110.0           | Latest              | Supported       |

---

## API Integration

### API Client Configuration

| Property       | Value                     |
| -------------- | ------------------------- |
| Base URL       | http://localhost:3010/api |
| Timeout        | 30000ms                   |
| Content-Type   | application/json          |
| Authentication | Bearer Token              |

### API Services

| Service     | File                 | Purpose                      |
| ----------- | -------------------- | ---------------------------- |
| Public API  | api.ts               | Unauthenticated requests     |
| Private API | api.ts (api_private) | Authenticated requests       |
| Firebase    | firebase.ts          | Storage and authentication   |
| Speeches    | speeches.ts          | Text-to-speech functionality |

### Key API Endpoints

| Endpoint                             | Method   | Purpose                |
| ------------------------------------ | -------- | ---------------------- |
| /api/blockchain/get-results-computed | GET      | Fetch election results |
| /api/auth/login                      | POST     | User authentication    |
| /api/candidates                      | GET/POST | Candidate management   |
| /api/voters                          | GET/POST | Voter management       |
| /api/blocks                          | GET      | Blockchain data        |

---

## Support and Maintenance

### Development Team

| Role                | Responsibility                |
| ------------------- | ----------------------------- |
| Frontend Developers | UI/UX implementation          |
| Backend Developers  | API integration               |
| QA Engineers        | Testing and quality assurance |
| DevOps Engineers    | Deployment and infrastructure |

### Maintenance Schedule

| Activity           | Frequency |
| ------------------ | --------- |
| Dependency Updates | Monthly   |
| Security Patches   | As needed |
| Performance Review | Quarterly |
| Code Review        | Per PR    |

### Troubleshooting

| Issue          | Solution                                  |
| -------------- | ----------------------------------------- |
| Build failures | Check Node.js version, clear node_modules |
| API errors     | Verify backend is running, check CORS     |
| Test failures  | Update snapshots, check mocks             |
| Memory issues  | Disable sourcemaps, reduce concurrency    |

---

## License

This project is licensed under the terms specified in the root LICENSE file.

---

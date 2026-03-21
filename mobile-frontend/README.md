# QuantumBallot Mobile Frontend

## Executive Summary

The QuantumBallot Mobile Frontend is a secure, enterprise-grade mobile voting application built with React Native and Expo. Designed for American elections using blockchain technology, this application enables eligible voters to cast their votes securely on iOS and Android devices. The platform ensures vote integrity through cryptographic verification, two-factor authentication, and immutable blockchain recording while providing an intuitive and accessible user experience.

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
10. [Platform Compatibility](#platform-compatibility)
11. [API Integration](#api-integration)
12. [Support and Maintenance](#support-and-maintenance)

---

## System Architecture

### Application Overview

| Component          | Description             | Responsibility                                     |
| ------------------ | ----------------------- | -------------------------------------------------- |
| Presentation Layer | React Native Components | Mobile UI rendering and touch interaction handling |
| Navigation Layer   | React Navigation        | Screen routing and navigation state management     |
| State Management   | React Context API       | Global authentication and app state                |
| Service Layer      | API Services, Firebase  | External communication and secure data persistence |
| Storage Layer      | Expo Secure Store       | Encrypted local data storage                       |

### Data Flow Architecture

| Stage             | Process                         | Technology                      |
| ----------------- | ------------------------------- | ------------------------------- |
| User Input        | Form submission, button presses | React Native Event Handlers     |
| Authentication    | JWT token management            | Expo Secure Store, Axios        |
| API Communication | HTTP requests with credentials  | Axios Interceptors              |
| Vote Submission   | Blockchain transaction          | Province-specific API endpoints |
| State Update      | Local and auth state updates    | React Context API               |

---

## Technology Stack

### Core Framework

| Technology   | Version | Purpose                                |
| ------------ | ------- | -------------------------------------- |
| React Native | 0.74.1  | Cross-Platform Mobile Framework        |
| React        | 18.2.0  | UI Component Library                   |
| TypeScript   | 5.1.3   | Type Safety and Development Experience |
| Expo SDK     | 51.0.4  | Development Platform and Tooling       |
| Node.js      | 16+     | Runtime Environment                    |

### Navigation and Routing

| Technology                            | Version | Purpose               |
| ------------------------------------- | ------- | --------------------- |
| React Navigation Native               | 6.1.9   | Navigation Framework  |
| React Navigation Stack                | 6.3.20  | Stack Navigator       |
| React Navigation Material Bottom Tabs | 6.2.19  | Bottom Tab Navigation |

### UI Components and Styling

| Technology                | Version | Purpose                    |
| ------------------------- | ------- | -------------------------- |
| React Native Paper        | 5.12.3  | Material Design Components |
| Phosphor React Native     | 3.0.2   | Icon Library               |
| React Native Vector Icons | 10.0.3  | Additional Icon Sets       |
| React Native Progress     | 5.0.1   | Progress Indicators        |

### Device Integration

| Technology           | Version | Purpose                       |
| -------------------- | ------- | ----------------------------- |
| Expo Camera          | 15.0.5  | Camera Access for QR Scanning |
| Expo Barcode Scanner | 13.0.1  | QR Code Scanning              |
| Expo Secure Store    | 13.0.1  | Encrypted Storage             |
| Expo File System     | 17.0.1  | File Operations               |
| Expo Document Picker | 14.0.8  | Document Selection            |
| Expo AV              | 16.0.8  | Audio/Video Playback          |

### Animation and Gestures

| Technology                   | Version | Purpose                |
| ---------------------------- | ------- | ---------------------- |
| React Native Reanimated      | 3.10.1  | Smooth Animations      |
| React Native Gesture Handler | 2.16.1  | Touch Gesture Handling |

### Backend Integration

| Technology | Version | Purpose               |
| ---------- | ------- | --------------------- |
| Axios      | 1.6.8   | HTTP Client           |
| Firebase   | Latest  | Image Storage Service |

### Testing Framework

| Technology                   | Version | Purpose           |
| ---------------------------- | ------- | ----------------- |
| Jest                         | 29.7.0  | Test Runner       |
| Jest Expo                    | 51.0.0  | Expo Jest Preset  |
| React Native Testing Library | 12.4.3  | Component Testing |
| Jest Native                  | 5.4.3   | Native Assertions |
| MSW                          | 2.2.3   | API Mocking       |

### Development Tools

| Technology | Version | Purpose                |
| ---------- | ------- | ---------------------- |
| ESLint     | 8.56.0  | Code Linting           |
| Prettier   | 3.2.4   | Code Formatting        |
| Babel      | 7.20.0  | JavaScript Compilation |

---

## Project Structure

### Directory Organization

| Directory  | File Count | Description                      |
| ---------- | ---------- | -------------------------------- |
| src/       | 58 files   | Main source code directory       |
| **tests**/ | 15 files   | Test files and testing utilities |
| **mocks**/ | 2 files    | Mock implementations             |
| assets/    | 14 files   | Static assets and images         |

### Source Code Structure

| Directory       | Purpose                | Key Contents                   |
| --------------- | ---------------------- | ------------------------------ |
| src/@types/     | Type Definitions       | TypeScript declaration files   |
| src/api/        | API Configuration      | Axios instance setup           |
| src/assets/     | Static Resources       | Images, fonts, candidate logos |
| src/components/ | Reusable UI Components | 12 reusable components         |
| src/constants/  | Configuration          | API endpoints, storage keys    |
| src/context/    | State Management       | AuthContext provider           |
| src/data_types/ | Type Definitions       | HashMap interface              |
| src/hooks/      | Custom React Hooks     | useImage hook                  |
| src/routes/     | Navigation             | AppRoutes configuration        |
| src/screens/    | Application Screens    | 10 feature screens             |
| src/service/    | Firebase Service       | Image loading utilities        |
| src/services/   | Business Logic         | votingService                  |
| src/theme/      | Styling                | Colors, fonts, sizes           |

### Screen Components

| Screen            | File                       | Purpose                               |
| ----------------- | -------------------------- | ------------------------------------- |
| Login             | Login/index.tsx            | User authentication with Electoral ID |
| Registration      | Registration/index.tsx     | New voter registration                |
| Candidates        | Candidates/index.tsx       | Browse election candidates            |
| Candidate Details | CandidateDetails/index.tsx | Detailed candidate information        |
| Groups            | Groups/index.tsx           | Cast votes (voting screen)            |
| Two Factor        | TwoFactor/index.tsx        | OTP verification for vote submission  |
| Thank Vote        | ThankVote/index.tsx        | Vote confirmation screen              |
| News              | News/index.tsx             | Election news and updates             |
| Credentials       | Credentials/index.tsx      | User credentials and data             |

### Component Library

| Component        | Location                   | Purpose                   |
| ---------------- | -------------------------- | ------------------------- |
| BottomNavigation | BottomNavigation/index.tsx | Main app tab navigation   |
| CandidateItem    | CandidateItem/index.tsx    | Candidate display card    |
| CandidatesList   | CandidatesList/index.tsx   | Scrollable candidate list |
| CameraQR         | CameraQR/index.tsx         | QR code scanner           |
| Header           | Header/index.tsx           | App header component      |
| HeaderElection   | HeaderElection/index.tsx   | Election-specific header  |
| LiveProjection   | LiveProjection/index.tsx   | Live election countdown   |
| Loading          | Loading/index.tsx          | Loading spinner           |
| NewsItem         | NewsItem/index.tsx         | News article card         |
| NumberItem       | NumberItem/index.tsx       | PIN display item          |
| PinItem          | PinItem/index.tsx          | PIN pad button            |
| ProgressHeader   | ProgressHeader/index.tsx   | Progress indicator header |

---

## Core Features

### Voter Authentication

| Feature              | Description                                 | Component   |
| -------------------- | ------------------------------------------- | ----------- |
| Electoral ID Login   | Secure login with Electoral ID and password | Login       |
| JWT Token Management | Automatic token refresh and storage         | AuthContext |
| Session Persistence  | Maintains login across app restarts         | AuthContext |
| Logout               | Secure session termination                  | AuthContext |

### Registration

| Feature                | Description                        | Component    |
| ---------------------- | ---------------------------------- | ------------ |
| New Voter Registration | Collect voter information          | Registration |
| Form Validation        | Input validation before submission | Registration |
| Email Verification     | Verify email address               | Registration |

### Voting Process

| Feature                   | Description                           | Component             |
| ------------------------- | ------------------------------------- | --------------------- |
| Candidate Browsing        | View all candidates and parties       | Candidates            |
| Vote Selection            | Radio button candidate selection      | Groups                |
| Vote Confirmation         | Confirmation dialog before submission | Groups                |
| Two-Factor Authentication | OTP verification for security         | TwoFactor             |
| Vote Submission           | Blockchain transaction recording      | Groups, votingService |
| Transaction Receipt       | Display transaction hash              | ThankVote             |

### Election Information

| Feature             | Description                    | Component        |
| ------------------- | ------------------------------ | ---------------- |
| Live Countdown      | Real-time election timer       | LiveProjection   |
| News Feed           | Election-related news          | News             |
| Candidate Details   | Detailed candidate information | CandidateDetails |
| Voting Status Check | Verify if already voted        | Groups           |

### Security Features

| Feature                   | Description                  | Implementation    |
| ------------------------- | ---------------------------- | ----------------- |
| Encrypted Storage         | JWT tokens in secure storage | Expo Secure Store |
| Two-Factor Authentication | OTP code verification        | TwoFactor screen  |
| QR Code Scanning          | Certificate verification     | CameraQR          |
| Province-Specific Ports   | State-based blockchain nodes | votingService     |
| Vote Integrity Check      | Prevent duplicate voting     | Groups            |

---

## Installation and Setup

### Prerequisites

| Requirement | Minimum Version | Recommended Version |
| ----------- | --------------- | ------------------- |
| Node.js     | 16.0.0          | 18.x LTS            |
| npm         | 8.0.0           | 9.x                 |
| Expo CLI    | Latest          | Latest              |
| Git         | 2.30.0          | Latest              |

### Platform Requirements

| Platform        | Requirement                |
| --------------- | -------------------------- |
| iOS             | macOS with Xcode installed |
| Android         | Android Studio with SDK    |
| Physical Device | Expo Go app installed      |

### Installation Steps

| Step | Command                | Description                   |
| ---- | ---------------------- | ----------------------------- |
| 1    | `cd mobile-frontend`   | Navigate to project directory |
| 2    | `npm install`          | Install dependencies          |
| 3    | `cp .env.example .env` | Create environment file       |
| 4    | Configure API_BASE_URL | Set backend IP address        |
| 5    | `npm start`            | Start Expo development server |

### Environment Configuration

| Variable     | Description      | Example                  |
| ------------ | ---------------- | ------------------------ |
| API_BASE_URL | Backend API URL  | http://192.168.0.38:3010 |
| API_TIMEOUT  | Request timeout  | 30000                    |
| NODE_ENV     | Environment mode | development              |

### Running the Application

| Command           | Platform | Description                       |
| ----------------- | -------- | --------------------------------- |
| `npm start`       | All      | Start Expo dev server             |
| `npm run android` | Android  | Run on Android emulator/device    |
| `npm run ios`     | iOS      | Run on iOS simulator (macOS only) |
| `npm run web`     | Web      | Run in web browser                |

---

## Development Guidelines

### Code Organization

| Principle           | Implementation                        |
| ------------------- | ------------------------------------- |
| Component Structure | Functional components with TypeScript |
| State Management    | React Context for global state        |
| Navigation          | Centralized in routes/ directory      |
| API Calls           | Centralized in api/ and services/     |
| Styling             | StyleSheet for component styles       |

### Naming Conventions

| Element    | Convention                | Example           |
| ---------- | ------------------------- | ----------------- |
| Components | PascalCase                | CandidateItem.tsx |
| Screens    | PascalCase with index.tsx | Login/index.tsx   |
| Hooks      | camelCase with use prefix | useImage.ts       |
| Utilities  | camelCase                 | votingService.ts  |
| Constants  | UPPER_SNAKE_CASE          | STORAGE_KEYS      |

### Path Aliases

| Alias       | Maps To          |
| ----------- | ---------------- |
| @assets     | ./src/assets     |
| @components | ./src/components |
| @screens    | ./src/screens    |
| @routes     | ./src/routes     |
| @utils      | ./src/utils      |
| src         | ./src            |

---

## Testing Framework

### Test Structure

| Category          | Location               | Count   |
| ----------------- | ---------------------- | ------- |
| Screen Tests      | **tests**/screens/     | 7 files |
| Component Tests   | **tests**/components/  | 2 files |
| API Tests         | **tests**/api/         | 1 file  |
| Context Tests     | **tests**/context/     | 1 file  |
| Navigation Tests  | **tests**/navigation/  | 1 file  |
| Integration Tests | **tests**/integration/ | 1 file  |
| E2E Tests         | **tests**/e2e/         | 1 file  |

### Test Commands

| Command                 | Purpose                  |
| ----------------------- | ------------------------ |
| `npm test`              | Run all tests            |
| `npm run test:watch`    | Run tests in watch mode  |
| `npm run test:coverage` | Generate coverage report |

### Coverage Thresholds

| Metric     | Threshold |
| ---------- | --------- |
| Branches   | 70%       |
| Functions  | 70%       |
| Lines      | 70%       |
| Statements | 70%       |

---

## Build and Deployment

### Build Configuration

| Setting         | Value                    | Description           |
| --------------- | ------------------------ | --------------------- |
| iOS Bundle ID   | com.quantumballot.mobile | App Store identifier  |
| Android Package | com.quantumballot.mobile | Play Store identifier |
| Orientation     | Portrait                 | Screen orientation    |
| SDK Version     | 51.0.4                   | Expo SDK version      |

### EAS Build Profiles

| Profile     | Platform    | Distribution   |
| ----------- | ----------- | -------------- |
| development | iOS/Android | Internal       |
| preview     | Android     | APK            |
| preview2    | Android     | Release APK    |
| production  | iOS/Android | Store          |
| web         | Web         | Web deployment |

### Build Commands

| Command                        | Output     | Description   |
| ------------------------------ | ---------- | ------------- |
| `eas build --platform android` | APK/AAB    | Android build |
| `eas build --platform ios`     | IPA        | iOS build     |
| `eas build --platform web`     | Web bundle | Web build     |

---

## Security Considerations

### Authentication Security

| Feature            | Implementation                |
| ------------------ | ----------------------------- |
| Token Storage      | Expo Secure Store (encrypted) |
| Session Management | JWT with automatic refresh    |
| Logout             | Complete token deletion       |
| Credentials        | Never stored in plain text    |

### API Security

| Feature               | Implementation            |
| --------------------- | ------------------------- |
| Request Authorization | Bearer token in headers   |
| Cookie Management     | JWT cookie for session    |
| HTTPS                 | Required in production    |
| Timeout Protection    | 30-second request timeout |

### Vote Security

| Feature                   | Implementation                  |
| ------------------------- | ------------------------------- |
| Two-Factor Authentication | OTP verification                |
| Duplicate Vote Prevention | Blockchain-level check          |
| Province Isolation        | State-specific blockchain nodes |
| Transaction Verification  | Hash confirmation               |

### Data Protection

| Feature              | Implementation         |
| -------------------- | ---------------------- |
| Certificate Export   | Encrypted file export  |
| QR Code Verification | Certificate validation |
| Input Validation     | Form-level validation  |
| Error Handling       | Secure error messages  |

---

## Platform Compatibility

### iOS Support

| Version | Status    | Notes                |
| ------- | --------- | -------------------- |
| iOS 15+ | Supported | Full feature support |
| iOS 14  | Limited   | Basic functionality  |
| iPad    | Supported | Tablet optimized     |

### Android Support

| Version     | Status    | Notes                |
| ----------- | --------- | -------------------- |
| Android 13+ | Supported | Full feature support |
| Android 12  | Supported | Full feature support |
| Android 11  | Supported | Full feature support |
| Android 10  | Limited   | Basic functionality  |

### Required Permissions

| Permission             | Purpose            | Platform |
| ---------------------- | ------------------ | -------- |
| CAMERA                 | QR code scanning   | Android  |
| READ_EXTERNAL_STORAGE  | File access        | Android  |
| WRITE_EXTERNAL_STORAGE | Certificate export | Android  |
| Camera                 | QR code scanning   | iOS      |

---

## API Integration

### API Client Configuration

| Property       | Value                             |
| -------------- | --------------------------------- |
| Base URL       | Configured in constants/config.ts |
| Timeout        | 30000ms                           |
| Content-Type   | application/json                  |
| Authentication | Bearer Token                      |

### Authentication Endpoints

| Endpoint                      | Method | Purpose            |
| ----------------------------- | ------ | ------------------ |
| /api/committee/auth-mobile    | POST   | User login         |
| /api/committee/register-voter | POST   | Voter registration |
| /api/committee/refresh-token  | GET    | Token refresh      |
| /api/committee/log-out        | POST   | User logout        |
| /api/committee/verify-otp     | POST   | OTP verification   |
| /api/committee/send-email     | POST   | Email notification |

### Data Endpoints

| Endpoint                    | Method | Purpose              |
| --------------------------- | ------ | -------------------- |
| /api/committee/candidates   | GET    | Fetch candidates     |
| /api/committee/announcement | GET    | Election information |
| /api/committee/registers    | GET    | Registration data    |

### Blockchain Endpoints

| Endpoint                         | Method | Purpose             |
| -------------------------------- | ------ | ------------------- |
| /api/blockchain/make-transaction | POST   | Submit vote         |
| /api/blockchain/voting-status    | GET    | Check voting status |

### Dynamic Port Configuration

| State             | Port Range     | Description                            |
| ----------------- | -------------- | -------------------------------------- |
| Province-specific | 3010+          | Each state has dedicated port          |
| Port Assignment   | Login response | Assigned based on voter location       |
| Request Routing   | Automatic      | All blockchain calls use assigned port |

---

## Support and Maintenance

### Development Team

| Role               | Responsibility                |
| ------------------ | ----------------------------- |
| Mobile Developers  | iOS/Android implementation    |
| Backend Developers | API integration               |
| QA Engineers       | Testing and quality assurance |
| DevOps Engineers   | Build and deployment          |

### Maintenance Schedule

| Activity           | Frequency |
| ------------------ | --------- |
| Dependency Updates | Monthly   |
| Security Patches   | As needed |
| Performance Review | Quarterly |
| Code Review        | Per PR    |

### Troubleshooting

| Issue                     | Solution                                   |
| ------------------------- | ------------------------------------------ |
| Cannot connect to backend | Verify backend running, check API_BASE_URL |
| Module not found errors   | Clear node_modules, reinstall              |
| App crashes on startup    | Clear Expo cache, reinstall Expo Go        |
| iOS simulator issues      | Ensure Xcode is installed and updated      |
| QR scanning not working   | Check camera permissions                   |

### Common Error Codes

| Code | Description              | Solution                      |
| ---- | ------------------------ | ----------------------------- |
| 401  | Unauthorized             | Re-authenticate               |
| 409  | Conflict (already voted) | Display already voted message |
| 404  | Endpoint not found       | Check backend availability    |
| 500  | Server error             | Contact support               |

---

## License

This project is licensed under the terms specified in the root LICENSE file.

---

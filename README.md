# CodeTogether

> A modern, real-time collaborative code editing platform built with Spring Boot and React

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Configuration](#configuration)
- [Development](#development)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

**CodeTogether** is a real-time collaborative code editing platform that enables multiple developers to work together on the same codebase simultaneously. Built with modern technologies, it provides seamless synchronization, live cursor tracking, integrated chat, and presence awareness.

### Key Highlights

- **Real-time Collaboration**: Multiple users can edit code simultaneously with instant synchronization
- **Live Presence Tracking**: See who's online and what files they're working on
- **Cursor Synchronization**: View other users' cursor positions in real-time
- **Integrated Chat**: Communicate with team members without leaving the editor
- **Secure Authentication**: JWT-based authentication with Spring Security
- **File & Folder Management**: Organize your code with a hierarchical file structure
- **Code Editor**: Powered by CodeMirror with syntax highlighting for multiple languages

## ✨ Features

### Core Features

- 🔐 **User Authentication & Authorization**
  - JWT-based secure authentication
  - User registration and login
  - Protected API endpoints

- 📁 **File & Folder Management**
  - Create, read, update, and delete files and folders
  - Hierarchical folder structure
  - Room-based organization

- 👥 **Real-time Collaboration**
  - Multi-user code editing
  - Operational Transformation for conflict resolution
  - Live code synchronization across all connected clients

- 📍 **Presence & Cursor Tracking**
  - See who's currently in the room
  - Track active users on specific files
  - Real-time cursor position sharing

- 💬 **Integrated Chat**
  - Room-based messaging
  - Real-time message delivery via WebSocket

- 🎨 **Modern Code Editor**
  - Syntax highlighting (JavaScript, Java, and more)
  - Auto-completion
  - Line numbers and code folding

## 🏗️ Architecture

CodeTogether follows a modern **client-server architecture** with real-time communication:

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  React + TypeScript + Redux + CodeMirror + STOMP           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/REST + WebSocket (STOMP)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                        Backend                              │
│   Spring Boot + Spring Security + WebSocket + JWT          │
├─────────────────────────────────────────────────────────────┤
│  Controllers │ Services │ Repositories │ Security           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ JPA/Hibernate
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    PostgreSQL Database                      │
│              (Users, Rooms, Files, Folders)                 │
└─────────────────────────────────────────────────────────────┘
```

### Communication Patterns

- **REST API**: Traditional HTTP endpoints for CRUD operations
- **WebSocket (STOMP)**: Real-time bidirectional communication for:
  - Code synchronization
  - Cursor position updates
  - Chat messages
  - Presence notifications

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 21 | Programming language |
| **Spring Boot** | 3.3.0 | Application framework |
| **Spring Security** | 6.x | Authentication & authorization |
| **Spring WebSocket** | 6.x | Real-time communication |
| **Spring Data JPA** | 3.x | Data persistence |
| **PostgreSQL** | 18 | Relational database |
| **Flyway** | Latest | Database migrations |
| **JWT (jjwt)** | 0.12.6 | Token-based authentication |
| **MapStruct** | 1.6.3 | DTO mapping |
| **Lombok** | Latest | Boilerplate reduction |
| **Maven** | 3.x | Build tool |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5.9.3 | Type-safe JavaScript |
| **Vite** | 6.0.0 | Build tool & dev server |
| **Redux Toolkit** | 2.11.0 | State management |
| **React Router** | 7.9.6 | Client-side routing |
| **CodeMirror** | 4.25.3 | Code editor component |
| **STOMP.js** | 7.2.1 | WebSocket client |
| **Axios** | 1.13.2 | HTTP client |
| **TailwindCSS** | 3.4.17 | Utility-first CSS |
| **Lucide React** | 0.555.0 | Icon library |
| **React Hot Toast** | 2.6.0 | Toast notifications |

### DevOps & Tools

- **Docker** & **Docker Compose**: Containerization
- **pgAdmin**: Database management
- **ESLint**: Code linting
- **PostCSS**: CSS processing

## 📦 Prerequisites

Before running the application, ensure you have the following installed:

- **Java Development Kit (JDK)**: Version 21 or higher
- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher
- **PostgreSQL**: Version 14 or higher (or use Docker)
- **Maven**: Version 3.8 or higher
- **Docker** (optional): For containerized deployment

## 🚀 Getting Started

### Option 1: Local Development Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/Rohith1905/codetogether.git
cd codetogether
```

#### 2. Setup PostgreSQL Database

Create a PostgreSQL database:

```sql
CREATE DATABASE codetogether;
CREATE USER rohith WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE codetogether TO rohith;
```

#### 3. Configure Backend

Update `backend/src/main/resources/application.yml` with your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/codetogether
    username: rohith
    password: rohith19psql
```

#### 4. Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8081`

#### 5. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### Option 2: Docker Deployment

Run the entire stack with Docker Compose:

```bash
cd backend
docker-compose up -d
```

This will start:
- **Backend**: `http://localhost:8081`
- **PostgreSQL**: `localhost:5432`
- **pgAdmin**: `http://localhost:5050`

For the frontend:

```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

### Backend Structure

```
backend/
├── src/main/java/com/codetogether/backend/
│   ├── config/              # Configuration classes (Security, WebSocket, CORS)
│   ├── controller/          # REST & WebSocket controllers
│   ├── dto/                 # Data Transfer Objects
│   ├── exception/           # Custom exceptions & global handler
│   ├── mapper/              # Entity-DTO mappers (MapStruct)
│   ├── model/               # JPA entities (User, Room, File, Folder)
│   ├── repository/          # Spring Data JPA repositories
│   ├── security/            # Security filters & components
│   ├── service/             # Business logic layer
│   │   └── impl/            # Service implementations
│   ├── util/                # Utility classes (JWT, etc.)
│   └── websocket/           # WebSocket configuration & handlers
├── src/main/resources/
│   ├── db/migration/        # Flyway database migrations
│   └── application.yml      # Application configuration
└── pom.xml                  # Maven dependencies
```

### Frontend Structure

```
frontend/
├── src/
│   ├── api/                 # API service layer (Axios)
│   ├── assets/              # Static assets (images, icons)
│   ├── components/          # Reusable React components
│   ├── features/            # Feature-specific modules
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components (Login, Dashboard, Room)
│   ├── store/               # Redux store & slices
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Public assets
├── package.json             # npm dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # TailwindCSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Room Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/rooms` | Get all rooms | Yes |
| POST | `/api/rooms` | Create new room | Yes |
| GET | `/api/rooms/{id}` | Get room by ID | Yes |
| PUT | `/api/rooms/{id}` | Update room | Yes |
| DELETE | `/api/rooms/{id}` | Delete room | Yes |

### File Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/files/room/{roomId}` | Get files in room | Yes |
| POST | `/api/files` | Create new file | Yes |
| PUT | `/api/files/{id}` | Update file | Yes |
| DELETE | `/api/files/{id}` | Delete file | Yes |

### Folder Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/folders/room/{roomId}` | Get folders in room | Yes |
| POST | `/api/folders` | Create new folder | Yes |
| PUT | `/api/folders/{id}` | Update folder | Yes |
| DELETE | `/api/folders/{id}` | Delete folder | Yes |

## 🔌 WebSocket Events

### Connection

```
STOMP Endpoint: ws://localhost:8081/ws
```

### Subscribe Destinations

| Destination | Description |
|-------------|-------------|
| `/topic/room/{roomId}/editor` | Code changes in room |
| `/topic/room/{roomId}/chat` | Chat messages in room |
| `/topic/room/{roomId}/presence` | User presence updates |
| `/topic/room/{roomId}/cursor` | Cursor position updates |

### Send Destinations

| Destination | Payload | Description |
|-------------|---------|-------------|
| `/app/room/{roomId}/edit` | `FileEditRequest` | Send code changes |
| `/app/room/{roomId}/chat` | `ChatMessage` | Send chat message |
| `/app/room/{roomId}/cursor` | `CursorPosition` | Send cursor position |
| `/app/room/{roomId}/presence` | `RoomPresenceRequest` | Update presence |

## ⚙️ Configuration

### Backend Configuration

Key configuration in `application.yml`:

```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/codetogether
    username: rohith
    password: rohith19psql

jwt:
  secret: your-secret-key-here
  expiration: 86400000  # 24 hours

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
```

### Frontend Configuration

Create `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8081
VITE_WS_URL=ws://localhost:8081/ws
```

## 🔧 Development

### Running Tests

**Backend:**
```bash
cd backend
mvn test
```

**Frontend:**
```bash
cd frontend
npm run test
```

### Linting

**Frontend:**
```bash
npm run lint
```

### Building for Production

**Backend:**
```bash
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
npm run build
npm run preview
```

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```bash
cd backend
docker-compose up --build
```

### Access Services

- **Backend API**: http://localhost:8081
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050
  - Email: `admin@codetogether.com`
  - Password: `admin`

---

## 📞 Contact

**CodeTogether Team**
- Email: rohithadiga19@gmail.com
- GitHub: [@Rohith1905](https://github.com/Rohith1905)

---

<div align="center">
  Made with ❤️ by the CodeTogether Team
</div>

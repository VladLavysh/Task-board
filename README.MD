# Task Board

[![NestJS](https://img.shields.io/badge/NestJS-11.0.0-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.0+-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-3.0.0-00DC82?style=flat-square&logo=nuxt.js)](https://nuxt.com/)
[![Pinia](https://img.shields.io/badge/Pinia-2.1.0-ECDB25?style=flat-square&logo=vue.js)](https://pinia.vuejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

Task Board is a modern, full-stack task management application built with a microservices architecture. The application allows users to manage projects and tasks, with features for authentication, authorization, and real-time updates.

![Task Board Screenshot](./docs/images/screenshot.png)

## Features

- **User Authentication**: JWT-based auth with support for Google and GitHub OAuth
- **Role-Based Authorization**: Admin, User, and Guest role tiers
- **Project Management**: Create, read, update, and delete projects
- **Task Management**: Organize tasks within projects with status tracking
- **Kanban Board**: Visual task management with drag-and-drop functionality
- **Microservices Architecture**: Robust and scalable backend with separate services for authentication, users, and projects
- **Modern Frontend**: Responsive UI built with Nuxt.js, Nuxt UI, and Tailwind CSS
- **State Management**: Efficient state handling with Pinia stores and Vue Composition API
- **Comprehensive Error Handling**: Robust error handling and logging throughout the application

## Architecture

The application is built using a microservices architecture with NestJS for the backend and Nuxt.js for the frontend.

### Backend

The backend follows a microservices architecture, with each service responsible for a specific domain:

- **API Gateway**: Acts as a single entry point for all client requests, handling routing to the appropriate microservices, authentication verification, and response formatting
- **Auth Service**: Manages user authentication, JWT token generation/validation, and third-party OAuth integrations
- **Users Service**: Handles user account management, profile updates, and role-based permissions
- **Projects Service**: Manages project CRUD operations and contains a nested Tasks module for task management within projects

Each microservice communicates via TCP transport using NestJS's built-in microservices capabilities, ensuring efficient inter-service communication with proper error handling and retries.

![Architecture Diagram](./docs/images/architecture.png)

### Frontend

The frontend is a modern single-page application built with Nuxt.js 3, featuring:

- **Composable Stores**: Modular state management using Pinia and Vue Composition API
  - `useAuth` - Authentication state and user session management
  - `useProjects` - Project data management and CRUD operations
  - `useTasks` - Task management within projects with status tracking
- **Responsive UI Components**: Built with Nuxt UI and Tailwind CSS

  - Responsive layout that works on mobile, tablet, and desktop devices
  - Dark mode support with consistent theming
  - Accessible UI components with proper ARIA attributes

- **Feature-Rich Pages**:

  - Dashboard with project statistics and activity feeds
  - Projects listing with filtering, sorting, and multiple view options
  - Kanban board for intuitive task management
  - User profile management with security settings

- **Progressive Enhancement**: The application works well even with JavaScript disabled, with server-side rendering ensuring content is always accessible.

### Technology Stack

- **Backend**:

  - NestJS - A progressive Node.js framework for building server-side applications
  - TypeORM - ORM for TypeScript and JavaScript with advanced query capabilities
  - PostgreSQL - Relational database for persistent storage with transaction support
  - Passport.js - Authentication middleware for Node.js
  - JWT - JSON Web Tokens for secure authentication
  - Microservices - TCP transport for inter-service communication
  - Class Validator - Request validation
  - Winston - Advanced logging for production environments

- **Frontend**:
  - Nuxt.js 3 - Vue.js framework for building modern web applications
  - Nuxt UI - Production-ready component library
  - Tailwind CSS - Utility-first CSS framework
  - Pinia - State management with TypeScript support
  - Vue Composition API - Functional approach to component logic
  - Date-fns - Modern JavaScript date utility library
  - Vee-validate - Form validation

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- Docker and Docker Compose (optional, for containerized deployment)

### Development Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/task-board.git
   cd task-board
   ```

2. **Setup environment variables**:
   Create a `.env` file in the `backend` directory with the following variables:

   ```
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=taskboard
   DB_SSL=false

   # JWT
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRATION=1h
   JWT_REFRESH_EXPIRATION=7d

   # OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

   # Microservices
   API_GATEWAY_PORT=3000
   AUTH_SERVICE_PORT=3001
   PROJECTS_SERVICE_PORT=3002
   USER_SERVICE_PORT=3003

   # Frontend
   FRONTEND_URL=http://localhost:8000

   # Logging
   LOG_LEVEL=info
   ```

3. **Start the database**:

   ```bash
   cd backend
   npm run start:db
   ```

4. **Install backend dependencies**:

   ```bash
   npm install
   ```

5. **Start the backend services**:

   ```bash
   # Development mode with live-reload
   npm run start:dev

   # OR run all services individually
   npm run start:all
   ```

6. **Install frontend dependencies**:

   ```bash
   cd ../frontend
   npm install
   ```

7. **Start the frontend**:
   ```bash
   npm run dev
   ```

The application will be available at:

- Frontend: http://localhost:8000
- API Gateway: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs (Swagger UI)

## API Documentation

The API follows RESTful conventions and includes the following main endpoints:

### Authentication

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Sign in with email and password
- `POST /api/auth/logout` - Sign out current user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/github` - GitHub OAuth login
- `GET /api/auth/me` - Get current user profile

### Users

- `GET /api/users` - Get users (admin only)
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account (admin or owner)
- `PATCH /api/users/:id/role` - Update user role (admin only)

### Projects

- `GET /api/projects` - Get all projects (filtered by user access)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create a new project
- `PATCH /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `GET /api/projects/stats` - Get project statistics

### Tasks

- `GET /api/projects/:projectId/tasks` - Get all tasks in a project
- `GET /api/projects/:projectId/tasks/:id` - Get task by ID
- `POST /api/projects/:projectId/tasks` - Create a new task
- `PATCH /api/projects/:projectId/tasks/:id` - Update a task
- `DELETE /api/projects/:projectId/tasks/:id` - Delete a task
- `PATCH /api/projects/:projectId/tasks/:id/status` - Update task status

## Frontend Pages

- **Dashboard**: `/` - Overview of projects and tasks
- **Authentication**:
  - `/auth/login` - User login page
  - `/auth/register` - User registration page
- **Projects**:
  - `/projects` - List all projects with filtering and sorting
  - `/projects/:id` - Project details with Kanban board
  - `/projects/new` - Create new project
- **Profile**: `/profile` - User profile management

## Deployment

### Docker Deployment

The application can be deployed using Docker Compose:

```bash
docker-compose up -d
```

The default `docker-compose.yml` includes:

- PostgreSQL database with persistent volume
- All microservices configured with proper environment variables
- Nginx as a reverse proxy for the frontend and API
- Redis for caching and session management

### Production Considerations

For production deployment, consider:

- Setting up a reverse proxy (Nginx) with proper caching headers
- Configuring SSL certificates with Let's Encrypt
- Implementing a CI/CD pipeline with GitHub Actions or Jenkins
- Using a container orchestration system like Kubernetes for scaling
- Setting up proper monitoring with Prometheus and Grafana
- Database backup strategy with scheduled backups

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [Nuxt.js](https://nuxt.com/) - The Vue.js framework
- [Nuxt UI](https://ui.nuxt.com/) - UI component library
- [TypeORM](https://typeorm.io/) - ORM for TypeScript
- [Passport.js](http://www.passportjs.org/) - Authentication middleware
- [Pinia](https://pinia.vuejs.org/) - State management for Vue
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

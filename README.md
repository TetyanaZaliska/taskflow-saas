# taskflow-saas

# SaaS Task Management Platform

A full-stack SaaS task management application inspired by modern project management tools such as Linear.

The project is built with a separate **Next.js frontend** and **NestJS backend**, with PostgreSQL as the database and Prisma as the ORM.

The main goal of the project is to build a production-oriented SaaS architecture with authentication, team management, role-based access control, projects, tasks, activity tracking, and scalable API design.

---

## 🚀 Features

### Authentication

- User registration and login
- JWT-based authentication
- HTTP cookie-based authentication
- Protected API routes
- Protected frontend routes
- Current user handling
- Authentication guards

### Teams

- Create teams
- View teams available to the current user
- Team member management
- Team membership validation
- Team-specific access control
- Team roles:
  - `ADMIN`
  - `MEMBER`

### Team Members

- Add users to teams
- Prevent duplicate team memberships
- View team members
- Role-based permissions
- Admin-only member management
- Team membership authorization

### Projects

- Create and manage projects
- Projects belong to teams
- Project authorship tracking (who created the project)
- Project-level organization for tasks
- Paginated project lists

### Tasks

- Create and manage tasks
- Assign tasks to team members
- Tasks belong to projects
- Task ownership and assignment
- Task status management (`TODO` / `IN_PROGRESS` / `DONE`)
- Task priority levels (`LOW` / `MEDIUM` / `HIGH`)
- Human-readable, auto-incrementing task keys per project (e.g. `PROJ-1`, `PROJ-2`)
- Kanban board and table views

---

## 🏗️ Architecture

The application is split into two main applications:

```text
┌───────────────────────┐
│      Next.js App      │
│                       │
│  React / App Router   │
│  Server Components   │
│  Server Actions       │
│  shadcn/ui            │
└───────────┬───────────┘
            │
            │ HTTP / JSON
            │ Cookie Auth
            ▼
┌───────────────────────┐
│      NestJS API       │
│                       │
│  Controllers          │
│  Services             │
│  Guards               │
│  DTOs                 │
│  Authentication       │
│  Authorization        │
└───────────┬───────────┘
            │
            │ Prisma
            ▼
┌───────────────────────┐
│      PostgreSQL       │
└───────────────────────┘
```

This separation allows the backend API to remain independent from the frontend and makes it possible to add other clients in the future.

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16+**
- **React**
- **TypeScript**
- **Next.js App Router**
- **Server Components**
- **Server Actions**
- **shadcn/ui**
- **Tailwind CSS**

### Backend

- **NestJS**
- **Node.js**
- **TypeScript**
- **JWT**
- **Passport**
- **class-validator**
- **class-transformer**
- **nestjs-pino**
- **pino-pretty**
- **cookie-parser**
- **@nestjs/config**
- **REST API**

### Database

- **PostgreSQL**
- **Prisma ORM**

### Development & Infrastructure

- **Docker**
- **Docker Compose**
- **Git**
- **ESLint**

---

## 📂 Project Structure

```text
.
├── taskflow-saas/
│   ├── frontend/
│   │   ├── app/
|   |   |   ├── (public)/       # landing, about, blog, contacts
|   |   |   ├── (auth)/         # login, signup, forgot-password, logout
|   |   |   ├── (dashboard)/    # teams, projects, tasks, settings, activity
|   |   |   ├── common/         # constants, interfaces, util
|   |   |   ├── layout.tsx
|   |   |   └── ...
|   |   |
│   │   ├── components/
|   |   |   ├── custom/
|   |   |   ├── public/
|   |   |   ├── theme/
|   |   |   ├── ui/             # shadcn/ui primitives
|   |   |   └── ...
|   |   |
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── proxy.ts
│   │   └── ...
│   │
│   └── backend/
│       ├── src/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── teams/
│       │   ├── team-members/
│       │   ├── project/    (endpoint: /project/:projectSlug)
│       │   ├── projects/   (endpoint: /teams/:teamId/projects)
│       │   ├── tasks/
│       │   ├── decorators/
│       │   ├── guards/
│       │   ├── interfaces/
│       │   ├── permissions/
│       │   ├── prisma/
│       │   └── ...
|       |
│       ├── prisma/
│       │   ├── migrations/
│       │   └── ...
│       └── ...
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🗄️ Database Design

The core domain is built around users, teams, projects and tasks.

```text
User
 │
 └── TeamMember ─── Team
                      │
                      └── Project
                             │
                             └── Task

```

### User

Represents an authenticated application user.

```text
User
├── id
├── email
├── password
├── isActive
└── createdAt
```

### Team

Represents a group of users working together.

```text
Team
├── id
├── name
└── createdAt
```

Each team has a single `owner` (the creator), tracked separately from the `ADMIN`/`MEMBER` roles on `TeamMember`. Ownership determines top-level team management rights, while `ADMIN` grants member-management permissions within the team.

### TeamMember

A many-to-many relationship between users and teams.

```text
TeamMember
├── id
├── userId
├── teamId
├── role
└── createdAt
```

The relationship has a unique constraint:

```text
(userId, teamId)
```

This prevents the same user from being added to the same team multiple times.

Tasks are assigned to a `TeamMember` (not directly to a `User`), which guarantees an assignee is always an active member of the task's team.

---

## 🔐 Authentication & Authorization

Authentication is implemented using JWT tokens stored in HTTP cookies.

Authentication uses Passport's Local strategy for the login flow (email/password) and the JWT strategy for validating protected requests.

The request flow is:

```text
Client
  │
  ▼
JWT Authentication Guard
  │
  ├── Invalid token ──► 401 Unauthorized
  │
  ▼
Authenticated User
  │
  ▼
Controller
```

Team-specific authorization additionally checks the `TeamMember` relationship.

For example, accessing:

```text
GET /teams/:teamId
```

requires the authenticated user to be a member of that team.

Administrative operations such as adding members require the user to have the `ADMIN` role within the specific team.

```text
User
 │
 ▼
TeamMember
 │
 ├── MEMBER
 │
 └── ADMIN
```

This keeps team roles scoped to a team instead of storing them globally on the `User` entity.

On the frontend, protected routes are additionally guarded at the edge using Next.js Proxy (`proxy.ts` — the Next.js 16+ replacement for the deprecated `middleware.ts` convention), which checks for a valid authentication cookie before rendering protected pages and redirects unauthenticated users to the login page.

---

## 🛡️ Role-Based Access Control

The application uses role-based authorization for team operations.

Example:

```text
ADMIN
├── View team
├── View members
├── Add members
├── Remove members
├── Change member roles
└── Manage team

MEMBER
├── View team
├── View members
└── Work with team resources
```

Authorization is enforced on the backend rather than relying only on frontend UI restrictions.

This prevents users from bypassing permissions by directly calling the API.

Permission logic and reusable guards are organized separately (`guards/`, `permissions/`, `interfaces/`) to keep authorization decoupled from business logic in services.

---

## 🌐 API

The backend exposes a REST API.

Example endpoints:

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
```

### Teams

```text
GET    /teams
POST   /teams
GET    /teams/:teamId
```

### Team Members

```text
GET    /teams/:teamId/members
POST   /teams/:teamId/members
```

### Projects

```text
GET    /teams/:teamId/projects
POST   /teams/:teamId/projects
GET    /project/:projectSlug
PATCH  /project/:projectSlug
```

### Tasks

```text
GET    /project/:projectSlug/tasks
POST   /project/:projectSlug/tasks
PATCH  /tasks/:taskId
DELETE /tasks/:taskId
```

Protected endpoints require authentication.

Team-specific endpoints additionally validate team membership and, where necessary, the user's role.

---

## ⚡ Next.js Data Fetching & Caching

The frontend uses Next.js Server Components and Server Actions for server-side data operations.

Data fetching is performed through a small API utility layer:

```text
Next.js Server Component
        │
        ▼
Server Action / API utility
        │
        ▼
NestJS API
        │
        ▼
PostgreSQL
```

Cache tags are used to invalidate stale data after mutations.

For example, after creating a team:

```ts
updateTag("teams");
```

This allows the teams list to be refreshed without manually managing client-side state for every mutation.

---

## 🎨 UI

The UI is built using:

- React
- Tailwind CSS
- shadcn/ui
- accessible UI primitives

Tasks are visualized on a drag-and-drop Kanban board, grouped by status columns (e.g. To Do / In Progress / Done), giving a Linear-like workflow experience.

The application uses reusable components for:

- dialogs
- forms
- tables
- buttons
- navigation
- team/member management

---

## ⚙️ Environment Variables

Create environment files for the frontend and backend.

Example backend configuration:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/saas"
JWT_SECRET="your-secret-key"
PORT=3001
```

Example frontend configuration:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Do not commit `.env` files containing secrets.

---

## 🐘 PostgreSQL

The project uses PostgreSQL as the primary database.

Example Docker Compose service:

```yaml
services:
  postgres:
    image: postgres
    environment:
      POSTGRES_DB: saas
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
```

---

## 🧬 Prisma

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Check migration status:

```bash
npx prisma migrate status
```

For development, Prisma migrations are used to keep the database schema synchronized with the application models.

---

## ▶️ Running Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start PostgreSQL

Using Docker:

```bash
docker compose up -d
```

### 4. Configure environment variables

Create the required `.env` files.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run database migrations

```bash
npx prisma migrate dev
```

### 7. Start the backend

```bash
npm run start:dev
```

### 8. Start the frontend

```bash
npm run dev
```

The frontend should then be available at:

```text
http://localhost:3000
```

and the API at:

```text
http://localhost:3001
```

---

## 🧪 Development

The project uses TypeScript and ESLint to maintain code quality.

Recommended checks before committing:

```bash
npm run lint
npm run build
```

---

## 📸 Screenshots

### Dashboard

_Add screenshot here._

### Teams

_Add screenshot here._

### Team Members

_Add screenshot here._

### Projects

_Add screenshot here._

### Tasks Board (Kanban)

_Add screenshot here._

---

## 🗺️ Roadmap

Planned improvements include:

- [ ] Activity tracking & history
- [ ] User settings
- [ ] Public marketing pages (landing, about, blog, contact) — routes scaffolded
- [ ] Password reset flow _(frontend page scaffolded, backend pending)_
- [ ] Task comments
- [ ] Task labels
- [ ] Task status workflow
- [ ] Project members
- [ ] Team invitations
- [ ] Email invitations
- [ ] Activity feed UI
- [ ] Notifications
- [ ] Search
- [ ] Advanced filtering
- [ ] Automated tests
- [ ] API documentation with Swagger
- [ ] CI/CD pipeline
- [ ] Production deployment

---

## 💡 What This Project Demonstrates

This project is designed to demonstrate practical backend and full-stack engineering skills rather than only CRUD implementation.

### Backend

- NestJS modular architecture
- REST API design
- Dependency injection
- DTO validation
- Pagination & query parameter handling
- Prisma ORM
- PostgreSQL relational modeling
- Database migrations
- JWT authentication
- HTTP cookie authentication
- Authentication guards
- Role-based authorization
- Resource-level permissions
- Many-to-many relationships
- Error handling with NestJS exceptions

### Frontend

- Next.js App Router
- React Server Components
- Server Actions
- Server-side data fetching
- Cache invalidation
- Dynamic routes
- Form handling
- Reusable UI components

### Architecture

- Separation between frontend and backend
- Domain-oriented backend modules
- API abstraction
- Database constraints
- Authorization at the API level
- Scalable team-based permission model

---

## 🎯 Project Goals

The primary goal of this project is to build a realistic SaaS application while applying production-oriented development practices.

Rather than treating the application as a simple CRUD project, the architecture focuses on:

- secure authentication
- resource-level authorization
- relational database design
- maintainable NestJS services
- reusable frontend components
- server-side data fetching
- cache invalidation
- clear separation of responsibilities

---

## 📄 License

This project is intended as a portfolio and learning project.

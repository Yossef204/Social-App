# 🚀 Social-App Backend

### Enterprise-Grade Social Media Backend | REST API · GraphQL · WebSockets

A production-oriented, scalable backend for a modern social media platform, built with **Node.js, Express.js, TypeScript, MongoDB, Mongoose, Redis, GraphQL, and Socket.io**.

The system is designed around **clean architecture, separation of concerns, repository abstraction, secure authentication, real-time communication, caching, and scalable business logic**.

It combines **REST APIs, GraphQL, and WebSocket communication** to provide different interaction patterns depending on the client's requirements.

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
│                    Web / Mobile Applications                        │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API / TRANSPORT LAYER                        │
│                                                                     │
│     ┌────────────────┐   ┌────────────────┐   ┌────────────────┐   │
│     │   REST API     │   │    GraphQL     │   │   Socket.io    │   │
│     │   Express.js   │   │     Server     │   │   WebSockets   │   │
│     └────────────────┘   └────────────────┘   └────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SECURITY / MIDDLEWARE LAYER                      │
│                                                                     │
│ Authentication · Authorization · Validation · Rate Limiting        │
│ Centralized Error Handling · Redis-based Temporary State           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BUSINESS / SERVICE LAYER                        │
│                                                                     │
│ Authentication · Users · Friends · Posts · Comments · Reactions    │
│ Notifications · Messaging · Real-Time Event Dispatching            │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    REPOSITORY ABSTRACTION                           │
│                                                                     │
│        Interfaces / Contracts → Concrete Data Implementations       │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                  │
│                                                                     │
│                  MongoDB / Mongoose       Redis                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# ✨ Why This Project?

This project was built to demonstrate how a social media backend can be designed beyond simple CRUD operations.

The implementation focuses on:

* Clean separation between transport, business logic, and persistence.
* Database abstraction using the **Repository Pattern**.
* Secure authentication and authorization.
* Temporary user registration state using **Redis TTL**.
* Real-time communication using **Socket.io**.
* Hybrid API architecture using **REST + GraphQL**.
* Scalable social relationship management.
* Nested comments and threaded discussions.
* Automated cleanup of dependent documents.
* Strong TypeScript typing and strict compiler configuration.
* Centralized error handling and validation.

---

# 🧰 Tech Stack

| Technology       | Purpose                                     |
| ---------------- | ------------------------------------------- |
| **Node.js**      | JavaScript runtime                          |
| **Express.js**   | HTTP server and REST API                    |
| **TypeScript**   | Type-safe application development           |
| **MongoDB**      | Primary database                            |
| **Mongoose**     | MongoDB ODM and schema management           |
| **Redis**        | Temporary state, caching and TTL-based data |
| **GraphQL**      | Flexible query layer                        |
| **Socket.io**    | Real-time WebSocket communication           |
| **JWT**          | Stateless authentication                    |
| **bcrypt**       | Password hashing                            |
| **Nodemailer**   | Email / OTP delivery                        |
| **REST API**     | Conventional HTTP API                       |
| **Git / GitHub** | Version control and source management       |

---

# 🧠 Core Engineering Concepts

## 1. Repository Pattern

The application does not tightly couple business logic to Mongoose operations.

Instead, repositories provide an abstraction between the service layer and the database.

```text
Service
   │
   ▼
Repository Interface
   │
   ▼
Concrete Repository
   │
   ▼
Mongoose
   │
   ▼
MongoDB
```

This provides:

* Separation of concerns
* Easier unit testing
* Mockable persistence layer
* Reduced database coupling
* Cleaner service implementations
* Easier future persistence changes

Example conceptual flow:

```typescript
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
}
```

The service depends on the abstraction rather than directly depending on Mongoose.

---

# ⚡ Redis-Based Registration Flow

Unverified users are not immediately persisted to MongoDB.

Instead:

```text
Client
  │
  │ Signup
  ▼
API
  │
  ▼
Generate OTP
  │
  ├──────────────► Email
  │
  ▼
Redis
  │
  │ Temporary User + OTP
  │ TTL
  ▼
User Verification
  │
  ▼
MongoDB
```

This approach helps prevent unnecessary database records from being created by abandoned or unverified registrations.

### Benefits

* Temporary registration state
* Automatic expiration through TTL
* Reduced database pollution
* OTP expiration
* Better handling of incomplete signup flows

---

# 🔐 Authentication & Security

The authentication system implements a JWT-based authentication flow.

### Signup

```text
POST /api/v1/auth/signup
        │
        ▼
Validate Input
        │
        ▼
Generate OTP
        │
        ▼
Store Temporary Data in Redis
        │
        ▼
Send OTP via Email
```

### Verification

```text
POST /api/v1/auth/verify-otp
        │
        ▼
Validate OTP
        │
        ▼
Retrieve Temporary User
        │
        ▼
Persist User in MongoDB
```

### Login

```text
POST /api/v1/auth/login
        │
        ▼
Validate Credentials
        │
        ▼
Compare Password
        │
        ▼
Generate JWT
        │
        ▼
Authenticated Client
```

Security-related implementation includes:

* JWT authentication
* Password hashing with bcrypt
* OTP verification
* OTP expiration
* Protected routes
* Authentication middleware
* Input validation
* Centralized error handling
* Rate limiting

---

# 👥 Social Relationship System

The friendship system is modeled as a state-based workflow.

```text
             ┌──────────┐
             │  Pending │
             └────┬─────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
   Accepted    Declined   Blocked
```

Supported operations include:

* Send friend request
* Accept request
* Decline request
* Block user
* Track relationship state

The blocking mechanism is designed to prevent blocked users from interacting with each other across relevant social features.

---

# 📝 Posts

Users can create and retrieve posts through the REST API.

### Supported operations

* Create post
* Retrieve paginated posts
* Associate posts with their owners
* Interact with posts
* Add comments
* Add nested replies
* React to posts

Example:

```http
GET /api/v1/posts
POST /api/v1/posts
POST /api/v1/posts/:id/comments
POST /api/v1/posts/:id/react
```

---

# 💬 Comments & Threaded Replies

The application supports nested discussion threads.

```text
Post
 │
 ├── Comment
 │    ├── Reply
 │    │    └── Reply
 │    │
 │    └── Reply
 │
 └── Comment
```

Comments and replies maintain their relationships with the parent entities.

The system also implements automated cleanup through Mongoose deletion hooks to reduce orphaned documents when parent entities are removed.

---

# ❤️ Reactions Engine

Posts support interaction through reactions such as:

* Like
* Love
* Care
* Remove reaction

The reaction workflow is designed around a toggle/update model:

```text
User
 │
 ▼
Check Existing Reaction
 │
 ├── No Reaction ──────► Create
 │
 ├── Same Reaction ────► Remove
 │
 └── Different ────────► Update
```

This prevents duplicate reactions and keeps the user's interaction state consistent.

---

# 💬 Real-Time Chat

The application includes real-time one-to-one communication using **Socket.io**.

```text
Client A
   │
   │ WebSocket
   ▼
Socket.io Server
   │
   │ Event Dispatch
   ▼
Client B
```

### Real-time capabilities

* One-to-one messaging
* Persistent message handling
* Real-time event dispatching
* User-related notifications
* Friend request events
* Friend acceptance events
* Post interaction events

---

# 🔔 Real-Time Events

The WebSocket layer can dispatch events related to user interactions.

Examples:

```text
Friend Request
      │
      ▼
Socket Event
      │
      ▼
Target User

Friend Accepted
      │
      ▼
Socket Event
      │
      ▼
Requester

Post Interaction
      │
      ▼
Socket Event
      │
      ▼
Post Owner
```

This allows clients to receive important events without continuously polling the API.

---

# 🔗 GraphQL

In addition to REST APIs, the application provides a GraphQL layer.

GraphQL is useful for complex data relationships where the client may need multiple related resources in a single request.

For example:

```text
User
 ├── Profile
 ├── Friends
 ├── Posts
 │    ├── Comments
 │    └── Reactions
 └── Relationships
```

Instead of making multiple REST requests, clients can request the exact graph they need.

### REST vs GraphQL

| REST                      | GraphQL                    |
| ------------------------- | -------------------------- |
| Resource-oriented         | Query-oriented             |
| Multiple endpoints        | Single GraphQL endpoint    |
| Fixed response structures | Client-defined selection   |
| Simple CRUD flows         | Complex relational queries |
| Easy HTTP caching         | Flexible data fetching     |

The two approaches coexist rather than replacing one another.

---

# 📂 Project Structure

```text
Social-App/
│
├── src/
│   │
│   ├── config/
│   │   ├── database/
│   │   ├── redis/
│   │   └── environment/
│   │
│   ├── controllers/
│   │   └── REST request handlers
│   │
│   ├── graphql/
│   │   ├── schemas/
│   │   ├── resolvers/
│   │   └── type definitions
│   │
│   ├── middlewares/
│   │   ├── authentication
│   │   ├── validation
│   │   ├── rate limiting
│   │   └── error handling
│   │
│   ├── models/
│   │   └── Mongoose schemas
│   │
│   ├── repositories/
│   │   ├── interfaces/
│   │   └── implementations/
│   │
│   ├── routes/
│   │   └── REST route definitions
│   │
│   ├── services/
│   │   └── business logic
│   │
│   ├── sockets/
│   │   ├── connection handlers
│   │   ├── event handlers
│   │   └── event emitters
│   │
│   ├── types/
│   │   └── shared TypeScript types
│   │
│   ├── utils/
│   │   ├── cryptography
│   │   ├── mailer
│   │   └── helpers
│   │
│   └── app.ts
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🌐 REST API

## Authentication

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| `POST` | `/api/v1/auth/signup`          | Initiate registration           |
| `POST` | `/api/v1/auth/verify-otp`      | Verify OTP and activate account |
| `POST` | `/api/v1/auth/login`           | Authenticate user               |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset OTP      |
| `POST` | `/api/v1/auth/reset-password`  | Reset password                  |

---

## Friends

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| `POST` | `/api/v1/friends/request/:id` | Send friend request    |
| `PUT`  | `/api/v1/friends/accept/:id`  | Accept friend request  |
| `PUT`  | `/api/v1/friends/decline/:id` | Decline friend request |
| `POST` | `/api/v1/friends/block/:id`   | Block user             |

---

## Posts & Interactions

| Method | Endpoint                     | Description                       |
| ------ | ---------------------------- | --------------------------------- |
| `GET`  | `/api/v1/posts`              | Retrieve paginated feed           |
| `POST` | `/api/v1/posts`              | Create a post                     |
| `POST` | `/api/v1/posts/:id/comments` | Add comment or reply              |
| `POST` | `/api/v1/posts/:id/react`    | Create, update or remove reaction |

---

# ⚙️ Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js `18+`
* npm
* MongoDB or MongoDB Atlas
* Redis
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/Yossef204/Social-App.git

cd Social-App
```

---

## 2. Install Dependencies

```bash
npm install
```

---


# 🔄 Application Flow

A typical authenticated request follows this architecture:

```text
Client
  │
  ▼
HTTP Request
  │
  ▼
Route
  │
  ▼
Middleware
  │
  ├── Authentication
  ├── Validation
  └── Rate Limiting
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Repository
  │
  ▼
MongoDB
  │
  ▼
Response
```

For real-time operations:

```text
Client
  │
  ▼
Socket.io
  │
  ▼
Socket Handler
  │
  ▼
Service / Business Logic
  │
  ▼
Event Dispatcher
  │
  ▼
Connected Client
```

---

# 🧪 Testing Strategy

The architecture is designed to make business logic independently testable.

Repository abstraction allows dependencies to be mocked:

```text
Service
   │
   ▼
IRepository
   │
   ├── Real Repository → MongoDB
   │
   └── Mock Repository → Unit Tests
```

This reduces the need for every service test to communicate with a real database.

---

# 📈 Scalability Considerations

The architecture provides several foundations for future horizontal scaling.

### Stateless Authentication

JWT-based authentication allows API instances to remain stateless.

```text
              ┌── API Instance 1
Client ───────┼── API Instance 2
              └── API Instance 3
                       │
                       ▼
                    MongoDB
                       │
                     Redis
```

### Redis

Redis can be used as a shared in-memory layer across multiple application instances.

### Repository Abstraction

Persistence operations are isolated from business logic, making future infrastructure changes easier.

### WebSocket Layer

The real-time architecture can be extended with a shared Socket.io adapter when scaling Socket.io across multiple server instances.

---

# 🔒 Security Considerations

The project follows several backend security practices:

* Password hashing with bcrypt
* JWT-based authentication
* OTP verification
* Temporary OTP expiration
* Authentication middleware
* Request validation
* Rate limiting
* Centralized error handling
* Environment-based secret management
* Authorization checks around user-owned resources

Sensitive configuration should always remain inside environment variables and must never be committed to source control.

---

# 🧩 Design Principles

The project emphasizes:

### Separation of Concerns

Each layer has a clearly defined responsibility.

### Single Responsibility

Controllers handle transport concerns while services handle business rules.

### Dependency Abstraction

Services depend on repository contracts instead of concrete persistence implementations.

### Reusability

Common functionality is isolated into reusable middleware, utilities, services, and repositories.

### Maintainability

The project structure is designed to make features easier to extend without creating tightly coupled modules.

---

# 🚀 Future Improvements

Potential extensions include:

* Docker & Docker Compose
* Redis distributed caching
* BullMQ background jobs
* Message queues
* Automated CI/CD
* Jest integration and unit testing
* API documentation with Swagger / OpenAPI
* Database indexing optimization
* Observability and structured logging
* Prometheus metrics
* Grafana dashboards
* Distributed Socket.io infrastructure
* Cloud deployment
* Horizontal API scaling
* Automated integration testing

---

# 📊 Engineering Highlights

| Area                    | Implementation                |
| ----------------------- | ----------------------------- |
| Language                | TypeScript                    |
| Runtime                 | Node.js                       |
| Framework               | Express.js                    |
| Database                | MongoDB                       |
| ODM                     | Mongoose                      |
| Cache / Temporary State | Redis                         |
| API                     | REST + GraphQL                |
| Real-Time               | Socket.io                     |
| Authentication          | JWT                           |
| Password Security       | bcrypt                        |
| Email                   | Nodemailer                    |
| Architecture            | Layered / Repository-based    |
| Typing                  | TypeScript Strict Mode        |
| Relationships           | Friend / Block / Social Graph |
| Content                 | Posts / Comments / Replies    |
| Interactions            | Reactions                     |
| Communication           | Real-Time Chat                |

---

# 👨‍💻 Author

**Yossef Mohamed**

Backend Software Engineer specializing in:

* Node.js
* TypeScript
* Express.js
* NestJS
* MongoDB
* Mongoose
* Redis
* REST APIs
* GraphQL
* WebSockets

### Links

* GitHub: [Yossef204](https://github.com/Yossef204)
* LinkedIn: Yossef Mohamed

---

# ⭐ Project Goals

This project demonstrates practical backend engineering beyond basic CRUD development.

The main goal was to build a backend that demonstrates:

```text
                    ┌──────────────────────┐
                    │   Scalable Backend   │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
     Architecture          Security            Performance
          │                    │                    │
     Repository             JWT                  Redis
     Services               bcrypt               Caching
     Separation             OTP                  TTL
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                               ▼
                     Real-Time Platform
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
                 GraphQL              Socket.io
                    │                     │
                    └──────────┬──────────┘
                               ▼
                      Social Application
```

---

## 📌 Repository

**GitHub:**
https://github.com/Yossef204/Social-App

---

### Built with TypeScript, Node.js, MongoDB, Redis, GraphQL & Socket.io.

> Designed with a focus on clean architecture, scalability, security, maintainability, and real-world backend engineering.

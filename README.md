# Node.js REST API for Social Media Site

A RESTful API backend for a social media application, built with JavaScript and Node.js. Supports real-time communication via WebSockets alongside standard HTTP endpoints.
> **Note:** Some npm packages may be deprecated and need to be switched for different ones. To my knowledge only "express-validator" could cause problems to this matter. 

## Tech Stack

- **Node.js** — runtime environment
- **Express** — HTTP server and routing
- **Socket.io** — real-time, event-driven communication
- **MongoDB / Mongoose** — database and data modeling (inferred from models layer)

## Project Structure

```
├── app.js              # Entry point — sets up the Express app
├── socket.js           # WebSocket server configuration
├── controllers/        # Route handler logic
├── middleware/         # Custom middleware (e.g. auth, error handling)
├── models/             # Database schemas/models
└── routes/             # API route definitions
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm
- A running MongoDB instance

### Installation

```bash
git clone https://github.com/mateussobucki/nodejs-REST-API-for-social-media-site.git
cd nodejs-REST-API-for-social-media-site
npm install
```

### Running the Server

```bash
node app.js
```

Or with auto-reload during development:

```bash
npx nodemon app.js
```

## Environment Variables

Create a `.env` file in the root directory and configure the following (adjust as needed):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## API Overview

All protected routes require an authorization token (via the `is-auth` middleware).

### Auth (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/auth/signup` | No | Register a new user |
| POST | `/auth/login` | No | Log in and receive a token |
| GET | `/auth/status` | Yes | Get the current user's status |
| PUT | `/auth/status` | Yes | Update the current user's status |

### Feed (`/feed`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/feed/posts` | Yes | Get all posts |
| GET | `/feed/post/:postId` | Yes | Get a single post by ID |
| POST | `/feed/post` | Yes | Create a new post |
| PUT | `/feed/post/:postId` | Yes | Update an existing post |
| DELETE | `/feed/post/:postId` | Yes | Delete a post |

## License

This project is open source. See the repository for details.

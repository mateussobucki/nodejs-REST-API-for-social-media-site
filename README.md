# Node.js REST API for Social Media Site

A RESTful API backend for a social media application, built with JavaScript and Node.js. Supports real-time communication via WebSockets alongside standard HTTP endpoints.
> **Note:** Some npm packages may be deprecated and need to be switched for different ones.

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Log in and receive a token |
| GET | `/auth/status` | Get user status |
| PUT | `/auth/status` | Change user status |
| PUT | `/users/:id` | Update user profile |
| GET | `/feed/posts` | Get all posts |
| POST | `/feed/post` | Create a new post |
| DELETE | `/feed/post/:id` | Delete a post |

> **Note:** Exact endpoints may vary — refer to the `routes/` directory for the full list.

## License

This project is open source. See the repository for details.

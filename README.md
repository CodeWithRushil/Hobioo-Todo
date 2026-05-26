# Hobioo-Todo
> Author: Rushil Sharma

A simple full-stack Todo app built with React, Vite, Express, and MongoDB.

## Requirements

- Node.js installed
- MongoDB connection URI

## Setup

### 1. Install Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
MONGO_URI=your_mongodb_uri
PORT=3000
KEEP_ALIVE_URL=https://your-render-service.onrender.com
KEEP_ALIVE_INTERVAL_MS=840000
```

`KEEP_ALIVE_URL` should point at the backend base URL or the `/health` endpoint. If you use the base URL, the server will append `/health` automatically. When deployed on Render, you can also rely on `RENDER_EXTERNAL_URL` if it is already present in the environment.

Start the backend:

```bash
npm run dev
```

---

### 2. Install Frontend

```bash
cd client
npm install
```

(Optional) Create a `.env` file inside `client/`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

---

## Build for Production

```bash
cd client
npm run build
```

Production files will be generated in `client/dist`.

---

## Common Commands

```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev

# Build frontend
cd client && npm run build
```

---

## Common Issues

- MongoDB not connecting → Check your `MONGO_URI`
- API not working → Make sure backend is running on the correct port

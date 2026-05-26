# Hobioo-Todo

> Fullstack Todo app (React + Vite frontend, Express + MongoDB backend)

## Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node.js)
- A running MongoDB instance (local or hosted) and its connection URI

## Setup

1. Clone the repository and open the project root.
2. Install server dependencies:

```bash
cd server
npm install
```

3. Install client dependencies:

```bash
cd ../client
npm install
```

## Environment Variables

- Server: create a `.env` file inside the `server/` folder with at least:

```env
MONGO_URI=your_mongo_connection_string
# optional
PORT=3000
```

- Client (optional): to change the backend target used by the dev server proxy, create a `.env` file in `client/` with either:

```env
VITE_BACKEND_URL=http://localhost:3000
# or (if you want to override the runtime API base)
VITE_API_URL=http://localhost:3000
```

Notes:
- The client defaults to using `/api` and `vite` is configured to proxy `/api` to the backend (see `client/vite.config.js`).

## Running Locally (Development)

1. Start the backend server:

```bash
cd server
npm run dev
# or: npm start
```

The server will read `MONGO_URI` from `server/.env` and listen on `PORT` (default: 3000).

2. Start the frontend dev server:

```bash
cd client
npm run dev
```

Open the app in your browser at the address printed by Vite (usually http://localhost:5173).

API requests from the client are proxied to the backend as `/api/*`.

## Production / Build

To build the client for production:

```bash
cd client
npm run build
```

Output will be in `client/dist`. Serve those static files with any static server or integrate into a production backend. If you need the client to point at a remote backend in production, set `VITE_BACKEND_URL` (or `VITE_API_URL`) at build time.

## Useful Commands

- Start server: `cd server && npm run dev`
- Start client: `cd client && npm run dev`
- Build client: `cd client && npm run build`
- Lint client: `cd client && npm run lint`

## Troubleshooting

- MongoDB connection errors: verify `MONGO_URI` and that your MongoDB instance is reachable.
- CORS / proxy issues: by default the client proxies `/api` to the backend. If you change ports or host, update `VITE_BACKEND_URL` in `client/.env`.

---

If you'd like, I can also:
- Add an npm root-level script that starts both client and server concurrently,
- Or add a sample `.env.example` in the `server/` folder.

# Advanced Node.js Express Backend API

This backend includes:
- Health check endpoint
- User registration & login (JWT auth)
- Protected user info endpoint
- File upload endpoint
- Example RESTful endpoint
- CORS, logging, and body parsing

## How to Run
```bash
cd backend
npm install express cors morgan body-parser jsonwebtoken multer
node server.js
```

## Endpoints
- `GET /api/health` — Health check
- `POST /api/register` — Register user `{ username, password }`
- `POST /api/login` — Login, returns JWT `{ username, password }`
- `GET /api/me` — Get user info (JWT required)
- `POST /api/upload` — Upload file (JWT required, field: `file`)
- `GET /api/items` — Example RESTful endpoint

## Deployment
- Works on Vercel, Heroku, or any Node.js platform
- Set start command: `node server.js`

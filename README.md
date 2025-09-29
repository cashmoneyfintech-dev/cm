# Node.js Express Backend API for Static Website

This project adds a simple Express backend to your static website for easy deployment on Vercel, Heroku, or similar platforms.

## Features
- Serves static files (HTML, CSS, JS)
- Health check endpoint: `/api/health`

## How to Run Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Visit `http://localhost:3000` for your site and `http://localhost:3000/api/health` for the API health check.

## Deployment
### Vercel
- Push your project to GitHub.
- Import the repo in Vercel.
- Set the build command to `npm install` and the output directory to `.` (root).
- Vercel will auto-detect and run `npm start`.

### Heroku
- Push your project to GitHub.
- Create a new Heroku app and connect your repo.
- Heroku will auto-detect Node.js and run `npm start`.

## API Example
```
GET /api/health
Response: { "status": "ok", "message": "API is running!" }
```

---
For further customization, add more endpoints to `server.js`.

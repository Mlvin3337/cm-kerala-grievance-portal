# Deployment Documentation

## 1. Overview

The CM Kerala Grievance Portal is deployed using three cloud services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend API | Render |
| Database | TiDB Cloud |
| Source Code | GitHub |

## 2. Production URLs

**Frontend:**

https://cm-kerala-grievance-portal-kappa.vercel.app

**Backend API:**

https://cm-kerala-grievance-api.onrender.com

**API Health Check:**

https://cm-kerala-grievance-api.onrender.com/api/health

**GitHub Repository:**

https://github.com/Mlvin3337/cm-kerala-grievance-portal

## 3. Frontend Deployment – Vercel

The React frontend is deployed on Vercel.

### Configuration

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Environment Variable

Configure the following environment variable in Vercel:

```env
VITE_API_URL=https://cm-kerala-grievance-api.onrender.com/api
```

### Deployment Process

1. Push frontend changes to GitHub.
2. Vercel detects the repository update.
3. Vercel installs dependencies.
4. Vercel runs the production build.
5. The generated frontend is deployed.

## 4. Backend Deployment – Render

The Express.js backend is deployed as a Render web service.

### Configuration

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Runtime | Node.js |

Render provides the service port through the `PORT` environment variable.

### Environment Variables

Configure these variables in the Render service dashboard:

| Variable | Purpose |
|---|---|
| `NODE_ENV` | Production environment |
| `DB_HOST` | TiDB database host |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name |
| `DB_PORT` | Database port |
| `DB_SSL` | Enables SSL |
| `DB_SSL_CA` | Database SSL certificate |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token expiration duration |
| `FRONTEND_URL` | Frontend origin |
| `GEMINI_API_KEY` | Gemini API key |
| `GEMINI_MODEL` | Gemini model configuration |

Never publish actual secret values in documentation or source control.

### Deployment Process

1. Push backend changes to GitHub.
2. Render detects the repository update.
3. Render installs backend dependencies.
4. Render starts the Express application.
5. The backend connects to TiDB Cloud.

## 5. Database Deployment – TiDB Cloud

The production database is hosted on TiDB Cloud.

**Database name:** `cm_kerala_grievance`

The backend connects to the database using environment variables and an SSL-secured connection.

The frontend does not access the database directly.

## 6. GitHub Integration

GitHub acts as the central source-code repository.

Repository:

https://github.com/Mlvin3337/cm-kerala-grievance-portal

Deployment updates are triggered by pushing changes to the connected branch.

Typical deployment commands:

```powershell
git add .
git commit -m "Update project"
git push origin main
```

## 7. Post-Deployment Verification

After deployment, verify the following:

- Frontend loads successfully.
- Citizen registration and login work.
- Grievance submission works.
- Grievance tracking works.
- Department officer login and dashboard work.
- CMO dashboard loads correctly.
- Database operations succeed.
- File uploads work.
- AI-assisted grievance analysis works.

## 8. Important Production Considerations

### File Storage

The current backend uses local file uploads. Render's local filesystem is not persistent by default across deployments and service replacements.

For reliable production file storage, integrate a persistent storage provider such as Supabase Storage or another object-storage service.

### Environment Security

- Keep `.env` files out of GitHub.
- Use strong, unique JWT secrets.
- Protect database credentials.
- Regenerate any credentials that have been exposed.
- Store API keys only in backend environment variables.

### Database Backups

Maintain regular database backups and store them securely outside the application repository.

## 9. Deployment Architecture

```text
             GitHub Repository
                     |
          -----------------------
          |                     |
       Vercel                 Render
          |                     |
    React Frontend         Express API
                                |
                       -----------------
                       |               |
                    TiDB Cloud      Gemini API
```

## 10. Production Status

The application has been deployed with its frontend, backend, and cloud database configured.

The production URLs are listed in Section 2.
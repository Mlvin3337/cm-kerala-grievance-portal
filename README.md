# CM Kerala Grievance Portal

A web-based grievance management system designed to help citizens submit, track, and manage public grievances through a centralized digital platform.

**Live Application:** https://cm-kerala-grievance-portal-kappa.vercel.app  
**Backend API:** https://cm-kerala-grievance-api.onrender.com  
**Repository:** https://github.com/Mlvin3337/cm-kerala-grievance-portal

## Overview

The CM Kerala Grievance Portal provides a centralized platform for citizens to raise grievances and monitor their progress. It enables department officers to review and process assigned grievances, while the Chief Minister's Office (CMO) can monitor grievance statistics and oversee the overall process.

The application uses a React frontend, Node.js and Express backend, and a MySQL-compatible TiDB database. It also integrates AI-assisted grievance analysis using Google's Gemini API.

## Key Features

### Citizen Portal
- Citizen registration and authentication.
- Submit grievances through an online form.
- Upload supporting documents and attachments.
- Track grievance reference numbers and status.
- View grievance details and progress.
- Submit feedback.

### Department Officer Portal
- Secure officer login.
- Officer dashboard.
- View and process assigned grievances.
- Update grievance status.
- Record grievance processing information.

### CMO Administration Portal
- CMO authentication.
- Centralized dashboard.
- View grievance statistics.
- Monitor pending and resolved grievances.
- Oversee grievance processing across departments.

### Additional Features
- Role-based access control.
- JWT-based authentication.
- Password hashing.
- Department management.
- Grievance history tracking.
- AI-assisted grievance analysis using Gemini.
- REST API architecture.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, JavaScript, HTML, CSS |
| Styling | Tailwind CSS |
| Routing | React Router |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MySQL / TiDB Cloud |
| Authentication | JWT, bcryptjs |
| File Uploads | Multer |
| Security | Helmet, CORS |
| AI Integration | Google Gemini API |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git, GitHub |

## System Architecture

```text
                 CITIZENS
                     |
                     v
          +----------------------+
          |    React Frontend    |
          |       (Vercel)       |
          +----------------------+
                     |
                  REST API
                     |
                     v
          +----------------------+
          |   Express Backend    |
          |       (Render)       |
          +----------------------+
              |       |       |
              |       |       |
              v       v       v
          +------+ +------+ +---------+
          | TiDB | | JWT  | | Gemini  |
          | DB   | | Auth | | API     |
          +------+ +------+ +---------+
              |
              v
       Grievance Records
       Users and Departments
       Attachments and History
```

## Database Structure

The database contains the following main tables:

| Table | Purpose |
|---|---|
| users | Citizen, officer and administrator accounts |
| departments | Department information |
| grievances | Grievance records |
| attachments | Uploaded grievance attachments |
| grievance_history | Grievance status and activity history |
| department_assignments | Department assignment records |
| citizen_feedback | Citizen feedback |
| contact_enquiries | Contact enquiries |

## Project Structure

```text
cm-kerala-grievance-portal/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   │   └── ai/
│   ├── uploads/
│   ├── server.js
│   ├── createAdmin.js
│   ├── createOfficer.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── citizen/
│   │   │   ├── officer/
│   │   │   ├── cmo/
│   │   │   └── public/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Local Setup

### Prerequisites

- Node.js and npm
- MySQL or a compatible TiDB database
- Git
- Google Gemini API key (for AI functionality)

### 1. Clone the repository

```bash
git clone https://github.com/Mlvin3337/cm-kerala-grievance-portal.git

cd cm-kerala-grievance-portal
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=cm_kerala_grievance
DB_PORT=3306
DB_SSL=false

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d

FRONTEND_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_configured_gemini_model
```

For a TiDB Cloud connection, configure the appropriate database host, port, credentials and SSL settings.

Create and populate the database using your database schema and backup.

### 3. Start the backend

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

API health endpoint:

`http://localhost:5000/api/health`

### 4. Configure the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory.

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the frontend

```bash
npm run dev
```

The frontend runs at:

`http://localhost:5173`

## API Overview

The backend exposes the following API route groups:

| Route | Purpose |
|---|---|
| `/api/auth` | Authentication and user accounts |
| `/api/departments` | Department operations |
| `/api/grievances` | Grievance management |
| `/api/cmo` | CMO dashboard and administration |
| `/api/health` | Backend health check |

All API requests are served through the Express backend.

## Deployment

The application is deployed using the following services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | TiDB Cloud |
| Source Code | GitHub |

### Live URLs

- Frontend: https://cm-kerala-grievance-portal-kappa.vercel.app
- Backend: https://cm-kerala-grievance-api.onrender.com
- Health Check: https://cm-kerala-grievance-api.onrender.com/api/health

Production environment variables must be configured through the hosting provider rather than committed to the repository.

## Security Considerations

- Passwords are hashed using bcryptjs.
- JWT is used for authentication.
- Role-based middleware protects restricted operations.
- Helmet provides HTTP security headers.
- CORS restricts frontend access.
- Environment files and credentials are excluded from Git.
- Database connections support SSL.

## Known Deployment Considerations

- Uploaded grievance files currently use backend local storage. Persistent external storage should be configured before production use.
- Database backups and recovery procedures should be maintained.
- Hosting plan limitations, service availability and file persistence should be considered before public production deployment.

## Documentation

Detailed project documentation is available in the `docs/` directory.

- Architecture: Application architecture and system design.
- Database: Database tables and configuration.
- API Reference: Backend API endpoints and authentication.
- Deployment: Vercel, Render, and TiDB Cloud deployment.
- User Guide: Instructions for citizens, department officers, and CMO administrators.

## Future Enhancements

- Persistent cloud attachment storage.
- Email and SMS notifications.
- Advanced grievance analytics and reporting.
- Improved grievance monitoring and escalation.
- Audit logging and administrative reports.
- Enhanced accessibility and mobile responsiveness.

## Author

**CM Kerala Grievance Portal**

Developed as an MCA full-stack web application project.

## License

This project is currently maintained as an academic and portfolio project. Add an appropriate license before permitting external reuse or redistribution.

# JobTrack – Job Application Tracker

A simple MERN stack application to manage job applications.

## Features
- Add, edit and delete applications
- Dashboard statistics
- Search by company/role
- Filter by status
- MongoDB persistence
- Responsive React UI

## Structure
- `frontend` – React + Vite
- `backend` – Node + Express + MongoDB

## Run

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI to .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

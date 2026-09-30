# HireReady AI

An Intelligent Placement Readiness and Career Analytics Platform built with the
MERN stack and Artificial Intelligence (Course Code: 25CS022).

## Project Structure

```
HireReady-AI/
├── backend/     Node.js + Express + MongoDB (Mongoose) REST API
└── frontend/    React.js (Vite) + Tailwind CSS + Axios + Chart.js
```

## Tech Stack (as per project proposal)

- **Frontend:** React.js, Tailwind CSS, Axios, Chart.js
- **Backend:** Node.js, Express.js, JWT Authentication
- **Database:** MongoDB Atlas
- **AI:** Google Gemini API (resume analysis, AI mock HR interview, personalized roadmap)
- **External APIs:** Judge0 API (code execution), Cloudinary (optional resume storage)

## Getting Started

### 1. Backend

```bash
cd backend
npm install
```

Open `backend/.env` and fill in:
- `MONGODB_URI` — your own MongoDB Atlas connection string (this is where all data — users, resumes, test results, interview feedback, readiness scores, roadmaps — will be saved)
- `GEMINI_API_KEY` — from https://aistudio.google.com/app/apikey
- `JUDGE0_API_KEY` — from https://rapidapi.com/judge0-official/api/judge0-ce

Then run:

```bash
npm run dev
```

The API starts on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173` and talks to the backend URL set in
`frontend/.env` (`VITE_API_URL`).

## Features

- Secure JWT authentication (register/login)
- Resume upload + AI (Gemini) resume analysis with ATS score, strengths, suggestions
- Aptitude tests (Quantitative, Logical, Verbal) — auto evaluated
- Coding assessment with real code execution & scoring via Judge0
- AI Mock HR Interview with Gemini-generated feedback and scoring
- Weighted Placement Readiness Score (Resume 20% · Coding 30% · Aptitude 25% · Interview 25%)
- Personalized AI (Gemini) 4-week learning roadmap
- Career Analytics Dashboard with Chart.js visualizations
- Admin module to monitor students and platform-wide stats

## Notes

- If `MONGODB_URI`, `GEMINI_API_KEY` or `JUDGE0_API_KEY` are left blank, the
  related feature will return a clear error message telling you which key to add.
- Resumes are stored on local disk under `backend/uploads/resumes` by default.
  Add Cloudinary credentials in `backend/.env` if you'd like to move to cloud storage.

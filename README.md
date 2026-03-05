# Internship Finder Capstone

Full-stack internship platform built with React (Vite), Node.js (Express), and MongoDB Atlas.

## Tech Stack
- Frontend: React, React Router, CSS
- Backend: Node.js, Express, Mongoose, Multer
- Database: MongoDB Atlas

## Roles and Features

### Student
- Register and login
- Search and view internships
- Apply for internships
- Update profile (name, email, mobile, password)

### Company
- Register and login
- Post internships
- Edit/delete own internship listings
- Manage applications (update status)

### Admin
- Manage users (view, role update, delete)
- Monitor all internship postings
- Delete inappropriate internship postings

## Route Access Rules
- `/dashboard`: student only
- `/company/dashboard`: company only
- `/admin/dashboard`: admin only
- `/details/:id`: student only
- Unauthorized users are redirected to login or their own dashboard.

## Run Locally

### 1) Backend
```bash
cd backend
npm install
npm run dev
```

### 2) Frontend
```bash
cd ..
npm install
npm run dev
```

## Environment

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Use `backend/.env.example` as template.

Create frontend `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

Use root `.env.example` as template.

## Deployment

### Backend on Render
1. Create a new `Web Service` from this repo.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `MONGO_URI`
   - `FRONTEND_URL` = your Vercel domain (for example `https://your-app.vercel.app`)
   - `PORT` is optional on Render
6. Deploy and copy the backend URL, e.g. `https://your-backend.onrender.com`

### Frontend on Vercel
1. Import this repo in Vercel.
2. Framework preset: `Vite`
3. Root directory: project root (not backend)
4. Add environment variable:
   - `VITE_API_BASE_URL` = your Render backend URL
5. Deploy.

### Important Notes
- After deployment, update `FRONTEND_URL` in Render with the exact Vercel URL.
- If you use a custom domain, add that domain to `FRONTEND_URL` (or `FRONTEND_URLS` comma-separated) in Render.

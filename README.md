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
```

Use `backend/.env.example` as template.

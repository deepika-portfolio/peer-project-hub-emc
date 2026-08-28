# Peer Project Hub

A full-stack MERN web app where students can post, discover, review, and bookmark each other's coding projects — built to the "Final Assessment Project" spec (see `emc-project.pdf`).

## ✅ Features implemented

**Stage 1 (MVP)**
- Firebase Authentication (signup/login), token-based sessions
- Full Project CRUD (title, description, tags, GitHub link, live demo link) with **server-side ownership checks**
- Project feed, most-recent-first, click-through to full project details
- Commenting system for authenticated users
- Responsive React + TailwindCSS frontend
- Express/Node/MongoDB backend with structured error handling

**Stage 2 (Nice-to-have, also implemented)**
- Search & filter by keyword/tag, plus sort by recent/most-liked/top-rated
- Bookmarking / Favorites with a dedicated page
- 5-star rating system (running average) + ratings attached to reviews
- User profile pages (bio + their posted projects)
- Project like button
- Pagination on the feed
- Basic analytics page (total projects, total users, most liked, top rated)

## 📁 Project Structure

```
peer-project-hub/
├── server/                # Express + MongoDB API
│   ├── config/            # DB connection, Firebase Admin init
│   ├── middleware/        # Auth verification, error handler
│   ├── models/            # Mongoose schemas
│   ├── controllers/       # Route logic
│   ├── routes/             
│   └── server.js
└── client/                # React + Vite + Tailwind frontend
    ├── src/
    │   ├── api/            # Axios instance with auto-attached auth token
    │   ├── context/        # AuthContext (Firebase auth state)
    │   ├── components/     # Navbar, ProjectCard, CommentSection, etc.
    │   ├── pages/           
    │   └── App.jsx
    └── index.html
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (or local MongoDB)
- A free [Firebase](https://console.firebase.google.com/) project with **Email/Password Authentication** enabled

### 1. Backend setup
```bash
cd server
npm install
cp .env.example .env
```
Fill in `.env`:
- `MONGO_URI` — your MongoDB connection string
- `FIREBASE_SERVICE_ACCOUNT` — paste the full JSON from Firebase Console → Project Settings → Service Accounts → **Generate new private key** (as a single-line string)
- `CLIENT_URL` — `http://localhost:5173` (default Vite port)

Run it:
```bash
npm run dev
```
API runs on `http://localhost:5000`.

### 2. Frontend setup
```bash
cd client
npm install
cp .env.example .env
```
Fill in `.env` with your Firebase **web app** config (Firebase Console → Project Settings → General → Your apps → SDK setup and configuration).

Run it:
```bash
npm run dev
```
App runs on `http://localhost:5173`.

### 3. Enable Firebase Email/Password Auth
In Firebase Console → Authentication → Sign-in method → enable **Email/Password**.

## 🔒 Security notes
- Firebase ID tokens are attached to every API request via an Axios interceptor and verified server-side with `firebase-admin` — nothing is trusted purely from the frontend.
- All update/delete operations re-check `project.ownerUid === req.user.uid` **on the server**, so a user can't edit/delete someone else's project even by calling the API directly.

## 🧭 Suggested next steps (beyond this build)
1. **Testing** — add Jest + Supertest for the API, and React Testing Library for components.
2. **Image uploads** — swap the `thumbnailUrl` text field for direct upload via Firebase Storage or Cloudinary.
3. **Grading rubric / timeline** — if this is being used as a course assessment, pair it with a point-weighted rubric and milestone deadlines.
4. **Deployment** — deploy `server/` to Render/Railway and `client/` to Netlify/Vercel; update `CLIENT_URL` and `VITE_API_URL` accordingly.
5. **Infinite scroll** — pagination is implemented with page numbers; can be swapped for infinite scroll if preferred.

## 📚 Tech Stack
- **Frontend:** React 18, React Router 6, Axios, TailwindCSS, Vite
- **Backend:** Express.js, Node.js
- **Database:** MongoDB + Mongoose
- **Auth:** Firebase Authentication (client SDK + Admin SDK for verification)

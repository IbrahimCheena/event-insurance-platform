# 🛡️ Event Insurance Platform

A simplified web platform that allows users to obtain event insurance quotes and manage them via a user-friendly interface. Built with **React (Vite)** on the frontend and **Express.js** with **MySQL** on the backend. Includes full **Firebase Authentication** and an **Admin Panel** to manage users, quotes, and event types.

---

## 📁 Project Structure

```
event-insurance-platform/
├── client/        # React Frontend with Vite
├── server/        # Express Backend with REST API
├── .gitignore
└── README.md
```

---

## 🚀 Features

### 👤 User Functionality
- Register/Login with Firebase Auth
- Request instant insurance quotes
- View quote history and profile
- Responsive design for all devices

### 👑 Admin Panel
- View all users
- Manage submitted quotes
- Add/delete event types
- Dashboard analytics & charts

---

## 🔧 Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Frontend    | React (Vite), TailwindCSS |
| Backend     | Express.js (Node.js)      |
| Auth        | Firebase Authentication   |
| Database    | MySQL                     |
| Charts      | Chart.js                  |
| Icons       | Lucide React              |

---

## 🛠️ Setup Instructions

### 📦 Prerequisites

Make sure you have these installed globally:

- **Node.js** (v18+)
- **MySQL Server**
- **Git**
- **Firebase Admin SDK credentials** (for server)
- **Firebase Web Config** (for client)

---

## 🔌 Backend Setup (`server/`)

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Create Environment Files

Create a file: `server/firebase-admin-sdk.json`
Put your Firebase Service Account Credentials there.

Also, make sure your `.gitignore` includes this file!

### 3. Create MySQL Database

```sql
CREATE DATABASE event_insurance;

-- Use the schema provided below
```

Import this sample schema:

```sql
-- users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- quotes table
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255),
  event_type VARCHAR(255),
  event_date DATE,
  location VARCHAR(255),
  attendees INT,
  quote_amount DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- event types
CREATE TABLE event_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```

### 4. Update DB Config

Inside `server/db.js`:

```js
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'event_insurance'
});
```

### 5. Start Backend

```bash
npm run dev
```

It will start at: http://localhost:5000

## 🌐 Frontend Setup (`client/`)

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Create .env File

Create `client/.env` and paste:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

(Use the values from your Firebase Console)

Do NOT commit this file. It's already in `.gitignore`.

### 3. Start Frontend

```bash
npm run dev
```

Open your browser at: http://localhost:5173

## 🔐 Admin Login

Use this email to access the admin panel:

```
admin@example.com
```

You can create this user via Firebase Console and log in from UI.

## 🧪 API Endpoints

Some examples (backend must be running):

- POST `/api/quotes` – Generate a quote
- GET `/api/me` – Get user profile
- GET `/api/quotes` – Get all user quotes
- GET `/api/admin/stats` – Admin dashboard stats

## 🧠 Project Highlights

- Secure Firebase token validation
- Admin route protection
- Mobile-first responsive layout
- Randomized quote generation

## 🌍 Deployment

To deploy:

- Use Render.com, Vercel, Netlify, or Firebase Hosting for frontend
- Use Render, Railway, or Heroku for backend
- Use ClearDB or PlanetScale for hosted MySQL

## 📜 License

Feel free to use, modify, and share.

## 👨‍💻 Author

Ibrahim Cheena

🛠️ Built with ❤️ in Node + React

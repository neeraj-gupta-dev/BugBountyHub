# BugBountyHub 🐞

A collaborative bug tracking and bounty platform built with the MERN stack.

## 1. Project Overview
**BugBountyHub** is a platform designed to seamlessly connect Developers, Testers, and Admins in a collaborative environment. 
- **Developers** can post their projects (e.g., web apps, mobile apps, APIs) and offer bounties for discovered vulnerabilities.
- **Testers** (Security Researchers) can explore active projects, report bugs, and earn bounty points for accepted submissions.
- **Admins** oversee the entire ecosystem, track platform analytics, and manage user access.

The platform streamlines the vulnerability reporting process, ensuring that bugs are securely reported, reviewed, and rewarded.

---

## 2. Key Features
- 🔐 **Role-based authentication** (Admin / Developer / Tester) with secure HTTP-only cookies
- 📂 **Project creation & management** for developers to list their applications
- 🐛 **Bug reporting workflow** supporting detailed descriptions and screenshot uploads
- 🔔 **Real-time notifications** using Socket.io to keep users updated on bug statuses and new projects
- 🏆 **Leaderboard & bounty points system** to gamify the testing experience
- 📊 **Admin analytics dashboard** to monitor platform health, projects, and users
- 💻 **Responsive SaaS-style UI** built with Tailwind CSS and animated with modern interactions

---

## 3. Tech Stack

### Frontend:
- **React (Vite)** - Fast, modern frontend framework
- **TailwindCSS** - Utility-first styling for a beautiful, responsive UI
- **Axios** - HTTP client for API requests (configured with `withCredentials`)
- **Recharts** - Composable charting library for dashboard analytics
- **Lucide React** - Clean and consistent iconography

### Backend:
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for handling routing and middleware
- **MongoDB Atlas** - Cloud database for persistent data storage
- **Mongoose** - Elegant MongoDB object modeling for Node.js
- **JWT Authentication** - Secure, stateless session management via cookies
- **Socket.io** - Bi-directional real-time event communication

---

## 4. Folder Structure

The repository is organized into two main directories:

```text
BugBountyHub/
├── backend/               # Node.js + Express backend
│   ├── controllers/       # Route logic and database operations
│   ├── middleware/        # Auth and file upload middlewares
│   ├── models/            # Mongoose database schemas
│   ├── routes/            # API endpoint definitions
│   ├── uploads/           # Directory for uploaded screenshots
│   ├── seed.js            # Script to populate demo data
│   └── server.js          # Entry point for the backend server
│
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── api/           # Axios instance configuration
│   │   ├── components/    # Reusable UI components (Sidebar, TopHeader, etc.)
│   │   ├── context/       # Global state management (AuthContext)
│   │   ├── pages/         # Page-level components (Dashboard, BugHistory, etc.)
│   │   ├── App.jsx        # Main application router
│   │   └── main.jsx       # React DOM rendering entry point
│   └── index.html         # Main HTML template
└── README.md
```

---

## 5. Environment Variables

> [!WARNING]
> **Security Note:** Never commit `.env` files to GitHub. They are intentionally excluded using `.gitignore`.

Create a `.env` file inside the `backend` folder (DO NOT COMMIT THIS FILE).

### Example backend `.env`:
```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_super_secret>
CLIENT_URL=<your_frontend_url>
```

Create a `.env` file inside the `frontend` folder (DO NOT COMMIT THIS FILE).

### Example frontend `.env`:
```env
VITE_API_URL=<your_backend_api_url>
```

---

## 6. How to Run Locally

### Backend Setup:
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (uses nodemon):
   ```bash
   npm run dev
   ```

### Frontend Setup:
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 7. Demo Credentials

The backend includes a `seed.js` script that populates the database with realistic demo data, including users, projects, bug reports, and notifications.

You can log in to the platform at `http://localhost:5173` using any of the following accounts:

- **Admin Account**: `admin@bugbounty.com`
  - *Has access to the Admin Control Center to monitor system analytics and block/unblock users.*
- **Developer Account**: `alice@dev.com`
  - *Can create projects, view bugs reported on their projects, and update bug statuses.*
- **Tester Account**: `charlie@tester.com`
  - *Can view active projects, submit bug reports, earn bounty points, and climb the leaderboard.*

Use the seed script to generate demo users locally.
*(To regenerate the demo data, run `node seed.js` from within the `backend` directory).*

---

## 8. Future Improvements
- **Payment Gateway Integration**: Integrate Stripe to allow developers to fund bounties with real fiat currency.
- **Automated Bug Scanning**: Connect to CI/CD pipelines to automatically verify basic vulnerabilities.
- **Webhooks**: Allow developers to receive bug report notifications directly in Slack or Discord.
- **Advanced Filtering**: Add complex search queries and tagging for larger project repositories.

---

## 9. Author

Built with ❤️ by **Neeraj Gupta**

*SaaS Architecture | MERN Stack | Web Security*

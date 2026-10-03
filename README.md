🩺 CareScope Analytics
AI-ready hospital management & analytics platform

Manage patients, appointments and medical reports from one fast, modern dashboard — with live analytics powered by MongoDB aggregation.
📑 Table of Contents
Overview
Features
Tech Stack
Role-Based Access
Project Structure
Getting Started
Environment Variables
Available Scripts
API Reference
Security
Troubleshooting
Roadmap
License
🔭 Overview

CareScope Analytics is a full-stack hospital management system. Front-desk staff register patients and book appointments, doctors record medical reports and discharge patients, and administrators monitor the whole hospital through live charts and KPIs.

The app is a single Node.js service: an Express REST API backed by MongoDB, plus a lightweight vanilla HTML/CSS/JS frontend served from the same server — no build step required.

<!-- 📸 Add your screenshots here (create a /docs folder and drop the images in): | Dashboard | Patients | |---|---| | ![Dashboard](docs/dashboard.png) | ![Patients](docs/patients.png) | | Appointments | Analytics | |---|---| | ![Appointments](docs/appointments.png) | ![Analytics](docs/analytics.png) | -->
✨ Features
Module	What you can do
🔐 Authentication	JWT login / logout, protected pages and API routes, session expiry handling
📊 Dashboard	Live patient count, today's appointments, recent patients and recent activity feed
🧑‍⚕️ Patients	Register, search, filter by department, view full profile, edit, discharge, export list to CSV
📅 Appointments	Schedule with patient + doctor, list and search, view details, cancel, calendar and "today's schedule" panel
📈 Analytics	Gender, blood-group, appointment-status, monthly-appointment, department and report charts from MongoDB aggregation endpoints
📄 Reports	Create, list and view medical reports (blood test, X-ray, MRI, CT, ECG, prescription and more)
⚙️ Settings	Update profile details and change password
👥 Roles	Admin, Doctor and Receptionist permissions enforced on the server

Note: a few decorative tiles on the dashboard (e.g. ICU occupancy, available beds) are illustrative placeholders and are not yet connected to data.

🧰 Tech Stack

Backend

Node.js + Express 5
MongoDB with Mongoose 9
JWT (jsonwebtoken) + bcryptjs for authentication
helmet, cors, morgan for security and logging
multer for file uploads, nodemailer for email

Frontend

Vanilla HTML5, CSS3 and JavaScript (ES2020)
Chart.js for data visualisation
Font Awesome icons, Inter typeface
GSAP animations on the landing page
🛡️ Role-Based Access

Permissions are enforced by middleware on the API, not just hidden in the UI.

Action	Admin	Doctor	Receptionist
View patients, appointments, reports, analytics	✅	✅	✅
Register / edit patient	✅	✅	✅
Discharge patient	✅	✅	❌
Delete patient	✅	❌	❌
Create / edit / reschedule appointment	✅	✅	✅
Cancel appointment	✅	✅	✅
Mark appointment completed	❌	✅	❌
Delete appointment	✅	❌	❌
Create / edit medical report	✅	✅	❌
Delete report	✅	❌	❌
Manage users, revenue & department statistics	✅	❌	❌
🗂️ Project Structure
CareScope-Analytics/
├── server.js                 # Express app entry point
├── package.json
├── index.html                # Landing page
├── login.html
├── dashboard.html
├── patients.html
├── patient-details.html
├── appointments.html
├── analytics.html
├── reports.html
├── settings.html
├── css/                      # Stylesheets
├── js/                       # Frontend scripts (api client, pages, charts)
├── assets/                   # Images, icons, fonts, logo
├── data/                     # Sample data
└── backend/
    ├── .env                  # Environment configuration (never commit)
    ├── config/               # Database connection
    ├── controllers/          # Request handlers / business logic
    ├── database/seed.js      # Demo data seeder
    ├── middleware/           # Auth, uploads, error handling
    ├── models/               # Mongoose schemas
    ├── routes/               # API route definitions
    ├── services/             # Email, report & prediction services
    └── utils/                # Helpers (token generation, logger)
🚀 Getting Started
Prerequisites
Node.js 20 or newer and npm
MongoDB — either installed locally or a free MongoDB Atlas cluster
Installation
bash
# 1. Install dependencies
npm install

# 2. Configure environment (see the table below)
#    Edit backend/.env — at minimum set MONGO_URI and JWT_SECRET

# 3. Make sure MongoDB is running, then load demo data
npm run seed

# 4. Start the development server
npm run dev

Open http://localhost:5000 in your browser and sign in with a demo account.

After pulling updates, do a hard refresh (Ctrl + F5) so the browser doesn't serve cached JavaScript.

Demo Accounts
Role	Email	Password
Admin	admin@carescope.com	admin123
Doctor	doctor@carescope.com	doctor123
Receptionist	staff@carescope.com	staff123

⚠️ The seed script resets the database collections and recreates the demo data. Do not run it against a database that holds real data, and change or remove these accounts before any real deployment.

🔧 Environment Variables

Create or edit backend/.env:

Variable	Description	Example
PORT	Port the server listens on	5000
NODE_ENV	development or production	development
MONGO_URI	MongoDB connection string	mongodb://127.0.0.1:27017/carescope
JWT_SECRET	Long, random secret used to sign tokens	(generate your own)
JWT_EXPIRE	Token lifetime	7d
EMAIL_HOST	SMTP host	smtp.gmail.com
EMAIL_PORT	SMTP port	587
EMAIL_USER	SMTP username	you@gmail.com
EMAIL_PASS	SMTP password / app password	••••••••
MAX_FILE_SIZE	Upload size limit in bytes	5242880
CLIENT_URL	Frontend URL	http://localhost:5000

MongoDB Atlas: use a connection string like mongodb+srv://<user>:<password>@<cluster>.mongodb.net/carescope.

Generate a strong secret with:

bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
📜 Available Scripts
Command	Description
npm run dev	Start the server with auto-restart (nodemon)
npm start	Start the server in production mode
npm run seed	Load demo users, patients, appointments and reports
npm run check	Syntax-check server.js
🔌 API Reference

Base URL: http://localhost:5000/api

All routes except register, login and health require the header:

Authorization: Bearer <token>
<details> <summary><b>Auth</b> — <code>/api/auth</code></summary>
Method	Endpoint	Description	Access
POST	/register	Register a user	Public
POST	/login	Log in, returns JWT	Public
GET	/profile	Current user profile	Authenticated
PUT	/profile	Update profile	Authenticated
PUT	/change-password	Change password	Authenticated
POST	/logout	Log out	Authenticated
GET	/doctors	List active doctors	Authenticated
GET	/users	List all users	Admin
PUT	/users/:id/role	Change a user's role	Admin
PUT	/users/:id/status	Activate / deactivate user	Admin
DELETE	/users/:id	Delete a user	Admin
</details> <details> <summary><b>Patients</b> — <code>/api/patients</code></summary>
Method	Endpoint	Description	Access
GET	/	List patients (page, limit, search)	Authenticated
GET	/stats	Patient statistics	Authenticated
GET	/:id	Patient details	Authenticated
POST	/	Register a patient	Admin, Doctor, Receptionist
PUT	/:id	Update a patient	Admin, Doctor, Receptionist
PUT	/:id/discharge	Discharge a patient	Admin, Doctor
DELETE	/:id	Delete a patient	Admin
</details> <details> <summary><b>Appointments</b> — <code>/api/appointments</code></summary>
Method	Endpoint	Description	Access
GET	/	List appointments	Authenticated
GET	/today	Today's appointments	Authenticated
GET	/upcoming	Upcoming appointments	Authenticated
GET	/search	Search appointments	Authenticated
GET	/stats	Appointment statistics	Authenticated
GET	/:id	Appointment details	Authenticated
POST	/	Create an appointment	Admin, Doctor, Receptionist
PUT	/:id	Update an appointment	Admin, Doctor, Receptionist
PUT	/:id/reschedule	Reschedule	Admin, Doctor, Receptionist
PUT	/:id/cancel	Cancel	Admin, Doctor, Receptionist
PUT	/:id/complete	Mark completed	Doctor
DELETE	/:id	Delete	Admin
GET	/revenue	Monthly revenue	Admin
GET	/department-stats	Department statistics	Admin
</details> <details> <summary><b>Reports</b> — <code>/api/reports</code></summary>
Method	Endpoint	Description	Access
GET	/	List reports	Authenticated
GET	/stats	Report statistics	Authenticated
GET	/type-stats	Statistics by report type	Authenticated
GET	/recent	Recent reports	Authenticated
GET	/search	Search reports	Authenticated
GET	/patient/:patientId	Reports for a patient	Authenticated
GET	/doctor/:doctorId	Reports by a doctor	Authenticated
GET	/download/:id	Download report file	Authenticated
GET	/:id	Report details	Authenticated
POST	/	Create a report	Admin, Doctor
PUT	/:id	Update a report	Admin, Doctor
DELETE	/:id	Delete a report	Admin
GET	/monthly-analytics	Monthly report analytics	Admin
</details> <details> <summary><b>Analytics</b> — <code>/api/analytics</code></summary>
Method	Endpoint	Description
GET	/dashboard	Headline KPIs (patients, appointments, completion rate, critical cases)
GET	/recent	Recent patients, appointments and reports
GET	/gender	Patients by gender
GET	/blood-groups	Patients by blood group
GET	/appointment-status	Appointments by status
GET	/monthly-appointments	Appointments per month
GET	/monthly-reports	Reports per month
GET	/monthly-revenue	Revenue per month
GET	/patient-departments	Patients per department
GET	/doctor-departments	Doctors per department
</details>

Health check: GET /api/health → { "success": true, "message": "CareScope API is running" }

🔒 Security
Passwords are hashed with bcrypt; sessions use signed JWT tokens.
Every API route is protected by auth middleware, with role checks on sensitive actions.
Helmet sets secure HTTP headers; uploads are restricted by file type and size (5 MB).
The server only exposes public frontend folders (css, js, assets, data) and HTML pages — backend/, .env and package.json are not web-accessible.

Before deploying:

Replace JWT_SECRET with a long random value.
Remove or change the demo accounts.
Make sure backend/.env is listed in .gitignore.
Set NODE_ENV=production and serve over HTTPS.
Restrict cors to your real frontend origin.
🩹 Troubleshooting
Problem	Fix
Cannot connect to CareScope server	Start the app with npm run dev and open http://localhost:5000 (not the HTML file directly).
Server exits with MongoDB connection failed	Start the MongoDB service, or check MONGO_URI in backend/.env.
Login says invalid credentials	Run npm run seed to create the demo accounts.
Buttons or pages behave like an older version	Hard refresh with Ctrl + F5; restart the server after editing backend files.
EADDRINUSE: port already in use	Change PORT in .env, or stop the other process using port 5000.
Redirected to login repeatedly	Your token expired or JWT_SECRET changed — log in again.
Server error: … alert when saving	In development the real cause is shown; the same message appears in the terminal running the server.
🗺️ Roadmap
 Medical History and Treatment Timeline pages
 Live Monitoring (vitals / bed & ICU occupancy)
 Report file upload and download from the UI
 Email notifications for appointments
 Predictive analytics powered by the prediction service
 Dark mode
 Automated tests and CI
📄 License

Distributed under the ISC License. See package.json for details.

<div align="center">

Made with ❤️ for better healthcare analytics.

CareScope Analytics © 2026

</div>

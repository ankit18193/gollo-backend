# Gollo AI – Backend
<img width="400" height="300" alt="{C57E00A5-5817-47DA-9095-B8DED8F01F1A}" src="https://github.com/user-attachments/assets/0a9c100c-eb69-4ffb-bc15-a49c97a9edd9" />
<img width="400" height="300" alt="{2D941FD8-4067-44C5-9235-F2EEE5B5C782}" src="https://github.com/user-attachments/assets/f69553aa-d5e5-4f7c-a30d-73cdf63844ec" />











Backend service for **Gollo AI**, an AI-powered chat application with secure authentication and multi-provider OAuth support.

This backend is built with **Node.js, Express, MongoDB**, and **Passport.js**, and is deployed on **Render**.

---

![Node](https://img.shields.io/badge/Node.js-18-green)
![Express](https://img.shields.io/badge/Express.js-Backend-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
---

---
## 🚀 Features

- 🔐 JWT-based Authentication (Login & Register)
- 🌐 Social Authentication
  - Google OAuth 2.0
  - GitHub OAuth
  - Microsoft OAuth
- 👤 Automatic user creation on first social login
- 🔁 Same endpoint supports **login + registration**
- 🛡️ Secure password hashing with bcrypt
- 📦 RESTful API architecture
- ⚙️ Environment-based configuration (Local & Production)
- 🚀 Production-ready deployment on Render

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** Passport.js + JWT
- **OAuth Providers:** Google, GitHub, Microsoft
- **Deployment:** Render

---

## 📁 Project Structure

Backend/
├── src/
│ ├── config/
│ │ ├── db.config.js
│ │ └── passport.js
│ ├── controllers/
│ │ └── auth.controller.js
│ ├── models/
│ │ └── user.model.js
│ ├── routes/
│ │ └── auth.routes.js
│ ├── app.js
│ └── server.js
├── .env
├── package.json
└── README.md



---

## 🔐 Authentication Flow

### Normal Login / Register
1. User submits email & password
2. Password is hashed using bcrypt
3. JWT token is generated and returned
4. Frontend stores token securely

### Social Authentication (Google / GitHub / Microsoft)
1. Frontend redirects to `/api/auth/:provider`
2. User authenticates with provider
3. Provider redirects to backend callback
4. Backend:
   - Finds or creates user
   - Generates JWT
   - Redirects to frontend with token
5. Frontend completes login automatically

   
   <img width="200" height="300" alt="{72229304-E09B-45CB-89DC-E8FB65F57659}" src="https://github.com/user-attachments/assets/e7603495-53e3-4594-90aa-001102b1c287" />
   <img width="200" height="300" alt="{65A14D1A-44F2-4186-B686-CC827D08532E}" src="https://github.com/user-attachments/assets/e4c4b0d3-2477-438a-93a8-818cedc1c089" />
   <img width="200" height="300" alt="{CC9AE888-094F-4240-87CF-C68E3EAB3301}" src="https://github.com/user-attachments/assets/186de2c2-b92b-462d-b99a-de953bee8ba2" />



   ### Dev Creadibility
   <img width="200" height="300" alt="image" src="https://github.com/user-attachments/assets/fee31054-9fdc-4653-a58e-d37c17e7d5ba" />
   <img width="200" height="300" alt="image" src="https://github.com/user-attachments/assets/14b8c3d7-a543-423b-baef-51854a210d32" />
   <img width="200" height="300" alt="image" src="https://github.com/user-attachments/assets/27245cf4-5491-4437-ae4c-92e5fcfa0b5b" />







---

## 🌍 API Routes

### Auth Routes

| Method | Route | Description |
|------|------|------------|
| POST | `/api/auth/register` | Register with email & password |
| POST | `/api/auth/login` | Login with email & password |
| GET | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/github` | GitHub OAuth |
| GET | `/api/auth/microsoft` | Microsoft OAuth |

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# OAuth
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx

GITHUB_CLIENT_ID=xxxx
GITHUB_CLIENT_SECRET=xxxx

MICROSOFT_CLIENT_ID=xxxx
MICROSOFT_CLIENT_SECRET=xxxx

# URLs
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:3001
```

▶️ Running Locally

git clone https://github.com/your-username/gollo-ai-backend.git
cd Backend
npm install
npm run dev

Server will start on: http://localhost:5000

🚀 Deployment (Render)
Push backend code to GitHub
Create a new Web Service on Render
Add environment variables in Render dashboard
Set start command: npm start

<img width="200" height="300" alt="image" src="https://github.com/user-attachments/assets/0963c4a9-312d-4b05-a36b-a08996c703ce" />
<img width="200" height="300" alt="image" src="https://github.com/user-attachments/assets/c25abf08-70f2-4b02-8d88-f7207fa79443" />




---

🔒 Security Notes

Passwords are never stored in plain text
JWT tokens expire after a defined period
OAuth secrets are stored securely in environment variables
CORS configured for trusted frontend domains only
---
📌 Future Improvements
HTTP-only cookie based authentication
Refresh token support
Role-based access control
Rate limiting on auth endpoints
Audit logging for authentication events
---
👨‍💻 Author

Ankit
Computer Science Engineering Student
Full-Stack Developer (MERN + OAuth)


---



---

## System Design

```md

## 🧠 System Design Overview

Frontend (Vercel)
  ↓
Backend (Render – Express API)
  ↓
MongoDB
  ↓
OAuth Providers (Google, GitHub, Microsoft)

```

## ❓ Why This Architecture?

- Single OAuth callback handler reduces duplication
- Same social flow supports login and registration
- Environment-based URLs avoid hardcoding
- Stateless JWT auth enables horizontal scaling
---
## 🧯 Common Issues
---
### Social login works locally but not in production
Reason: Frontend pointing to localhost backend  
Fix: Use environment-based backend URL
---
### OAuth redirect_uri_mismatch
Reason: Callback URL not added in provider console
---

## 📚 Learning Outcomes

- Implemented multi-provider OAuth authentication
- Managed environment-based configuration
- Debugged real-world production deployment issues
- Designed scalable authentication architecture

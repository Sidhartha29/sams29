# 🚀 Comprehensive Student Achievement & Profile Management System (MERN)

## ✨ Features
✅ **Full MERN Stack** (MongoDB, Express, React, Node.js)  
✅ **JWT Authentication** (Student/Admin roles)  
✅ **Student Profile Management** (CRUD/Search by regNo)  
✅ **Achievement Tracking** (add/view/delete with Cloudinary certs)  
✅ **Document Upload/Verification** (Aadhaar/PAN/Marks - admin verify)  
✅ **AI OCR** (Tesseract.js auto-detects hackathon/internship/etc from cert images)  
✅ **Responsive Dashboard** (TailwindCSS - cards/tables/forms)  
✅ **Admin Panel** (view all students/docs/achievements/verify/search)  

## 📁 Project Structure
```
Hackathon/student_management/
├── backend/          # Node/Express APIs
│   ├── models/       # Student/Achievement/Document
│   ├── controllers/  # Auth/Students/Achievements/Documents/OCR/Stats
│   ├── routes/       # All API routes
│   ├── middleware/   # JWT/protect/adminOnly/multer
│   └── server.js
└── frontend/         # React/Vite/Tailwind UI
    ├── src/pages/    # All pages (Dashboards/Login/Profile/etc)
    ├── src/components/ # Navbar/Sidebar/ProtectedRoute/StatCard
    └── src/services/api.js
```

## 🚀 Quick Start (5 mins)

### 1. Prerequisites
```bash
Node.js 18+
MongoDB Atlas (free) account
Cloudinary (free) account
```

### 2. Clone & Install
```bash
cd Hackathon/student_management

# Backend
cd backend
npm install

# Frontend (new terminal)
cd ../frontend
npm install
```

### 3. Environment Setup
Copy `.env` template:
```bash
# backend/.env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key_here_32chars
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
PORT=5000

# frontend/.env (optional)
VITE_API_URL=http://localhost:5000/api
```

**Get credentials:**
- MongoDB: [Atlas](https://www.mongodb.com/atlas) → Connect → Drivers
- Cloudinary: [cloudinary.com](https://cloudinary.com) → Dashboard

### 4. Run Project
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# http://localhost:5173
```

### 5. Test Flow
```
1. Register student → Login → Dashboard → Add Achievement (try OCR!) → Upload Doc
2. Register admin (role=admin in register form) → Admin Dashboard → Search Students → Verify Docs
```

## 📱 Screenshots
- [Student Dashboard](screenshots/student-dashboard.png)
- [Admin Panel](screenshots/admin-panel.png)
- [AI OCR](screenshots/ocr-demo.png)

## 🛠 Tech Stack
**Backend:** Node/Express/MongoDB/JWT/bcryptjs/Multer/Cloudinary/Tesseract.js  
**Frontend:** React/Vite/TailwindCSS/React Router/Axios  
**Deployment:** Vercel (frontend) + Render (backend) + MongoDB Atlas

## 🔒 API Endpoints
```
POST /api/auth/register    # role=student/admin
POST /api/auth/login
GET  /api/students/all     # admin
GET  /api/students/search?q=...
POST /api/achievements
GET  /api/documents/all    # admin verify
POST /api/ocr/suggest      # AI magic ✨
```

## 🤝 Contributing
1. Fork repo
2. `git checkout -b feature`
3. Commit changes
4. Test thoroughly
5. PR to `main`

## 📄 License
MIT - Free to use/modify/deploy!

**Built for Hackathon29 - Ready to deploy & impress! 🎉**


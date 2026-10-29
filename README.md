# 🔍 CampusFind — Campus Lost & Found Management System

<p align="center">
  A full-stack MERN application that helps students report lost belongings, discover found items, and manage ownership claims in one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
</p>

**GitHub Repository:** [shivamkmishra98/CampusFind](https://github.com/shivamkmishra98/CampusFind)

---

## 📌 About the Project

CampusFind is a campus-focused Lost & Found web application designed to make it easier for students to reconnect with misplaced belongings.

Students can report lost or found items, browse listings, search by keywords, filter results, and submit claims to verify ownership. Item owners can manage their listings and respond to claims through a personalized dashboard.

The project uses the **MERN stack** with MongoDB Atlas for cloud data storage and JWT-based authentication for protected user operations.

## ✨ Key Features

### 🔐 Authentication & Security
- User registration and login.
- Password hashing with bcrypt.
- JWT-based authentication using HTTP-only cookies.
- Protected routes and authorization middleware.
- Ownership checks for item management.

### 📦 Lost & Found Item Management
- Create lost and found item listings.
- Add item descriptions, categories, locations, and dates.
- Upload item images using Cloudinary.
- Update and delete your own listings.
- Browse item details.

### 🔎 Search & Discovery
- Search listings by keywords.
- Filter by lost or found status.
- Filter items by category.
- Sort listings and navigate paginated results.

### 🤝 Ownership Claims
- Submit a claim with a supporting message.
- View claims received on your listings.
- Approve or reject incoming claims.
- Track the status of submitted claims.

### 📊 User Dashboard
- View personal item listings.
- Manage posted items.
- Review received claims.
- Track submitted claims and their status.
- View dashboard statistics.

### 📱 Responsive Interface
- React-based user interface.
- Responsive layouts for desktop, tablet, and mobile.
- Client-side routing.
- Form validation and loading states.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Forms & Validation | React Hook Form, Zod |
| HTTP Requests | Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas |
| Data Modeling | Mongoose |
| Authentication | JWT, bcryptjs, HTTP-only cookies |
| Image Storage | Cloudinary |
| File Uploads | Multer |
| Security | Helmet |

## 🏗️ System Architecture

```text
┌──────────────────────────┐
│       React Client       │
│     Vite + Tailwind CSS  │
└────────────┬─────────────┘
             │ HTTP / REST API
             ▼
┌──────────────────────────┐
│     Express Backend      │
│ Authentication & Logic   │
└─────────┬────────┬───────┘
          │        │
          ▼        ▼
┌──────────────┐ ┌──────────────┐
│ MongoDB Atlas│ │  Cloudinary  │
│ Application  │ │ Item Images  │
│    Data      │ │              │
└──────────────┘ └──────────────┘
```

## 🚀 Getting Started

Follow these instructions to run CampusFind locally.

### Prerequisites

Install the following before starting:

- [Node.js](https://nodejs.org/) — version 20 or higher.
- npm — installed with Node.js.
- [MongoDB Atlas](https://www.mongodb.com/atlas) account and database.
- [Cloudinary](https://cloudinary.com/) account for image uploads.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/shivamkmishra98/CampusFind.git
cd CampusFind
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

Open another terminal from the project root, then run:

```bash
cd client
npm install
```

### 4. Configure Environment Variables

Create a `server/.env` file using the variable names expected by the backend configuration:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_long_random_secret
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CLIENT_URL=http://localhost:5173
```

**Important:** Check the backend source code for the exact environment variable names required by your current version. If your code uses a different name, use the one defined in the source.

Never commit real database credentials, API secrets, or private keys to GitHub.

### 5. Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend is expected to run on:

```text
http://localhost:5000
```

If the development script is unavailable, check `server/package.json` for the configured start command.

### 6. Start the Frontend

From the `client` directory in a separate terminal:

```bash
npm run dev
```

Open the local URL printed by Vite, normally:

```text
http://localhost:5173
```

Your local CampusFind application should now be ready to test.

## 📡 API Overview

The following endpoints are documented by the project.

Base URL:

```text
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Log in |
| POST | `/auth/logout` | Log out |
| GET | `/auth/me` | Get the current user |

### Items

| Method | Endpoint | Description |
|---|---|---|
| GET | `/items` | Browse, search, and filter items |
| GET | `/items/:id` | Get item details |
| POST | `/items` | Create an item listing |
| PUT | `/items/:id` | Update your listing |
| DELETE | `/items/:id` | Delete your listing |
| GET | `/items/my-items` | Get your listings |

### Claims

| Method | Endpoint | Description |
|---|---|---|
| POST | `/claims` | Submit a claim |
| GET | `/claims/received` | View claims on your items |
| GET | `/claims/sent` | View your submitted claims |
| PATCH | `/claims/:id/respond` | Respond to a claim |

### User Profile & Dashboard

| Method | Endpoint | Description |
|---|---|---|
| PUT | `/users/profile` | Update your profile |
| GET | `/users/stats` | Retrieve dashboard statistics |

Protected endpoints require the authentication mechanism configured by the backend.

## 📁 Project Structure

```text
CampusFind/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🗄️ Database Design

MongoDB stores the application's core data using collections for:

- **Users:** Account and profile information.
- **Items:** Lost and found listings, descriptions, categories, and image references.
- **Claims:** Ownership claim messages, status, and relationships to users and items.

Mongoose provides the data models and database interaction layer. Refer to the model files in `server/models/` for the exact schema definitions.

## 🔒 Security Notes

- Passwords should be stored as hashes rather than plain text.
- Authentication tokens should be handled securely.
- HTTP-only cookies help prevent JavaScript from reading authentication cookies.
- Protected routes should verify user authorization.
- Environment files containing secrets must remain out of version control.
- Database access should be restricted through appropriate MongoDB Atlas network and database-user settings.

## 🌐 Deployment

CampusFind can be adapted for deployment using services such as:

- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Image hosting:** [Cloudinary](https://cloudinary.com/)

Before deployment, configure production environment variables, frontend API URLs, CORS settings, and cookie security options. Test authentication and image uploads in the deployed environment.

*Deployment has to be configured separately; the repository link alone does not mean the application is live.*

## 🔮 Future Enhancements

- Email notifications for claim updates.
- Admin dashboard and moderation tools.
- Item status tracking for resolved cases.
- Campus-specific access and verification.
- Improved accessibility and automated tests.
- Optional real-time notifications.

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feat/your-feature
   ```

3. Commit your changes:

   ```bash
   git commit -m "feat: describe your change"
   ```

4. Push the branch:

   ```bash
   git push origin feat/your-feature
   ```

5. Open a Pull Request.

## 👨‍💻 Author

**Shivam Kumar Mishra**

GitHub: [@shivamkmishra98](https://github.com/shivamkmishra98)

Project: [CampusFind](https://github.com/shivamkmishra98/CampusFind)

---

<p align="center">
  Built with ❤️ to help campus communities reconnect with their belongings.
</p>

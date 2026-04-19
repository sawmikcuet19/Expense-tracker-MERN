# Expense Tracker (MERN Stack)

> **Note**: This project was built by following a YouTube tutorial as a learning exercise. It is an individual project created for educational purposes.

A full-stack expense tracking application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: JWT-based login/signup with persistent sessions
- **Dashboard**: Visual overview of income vs expenses with charts
- **Income Management**: Add, edit, delete, and view income records
- **Expense Management**: Add, edit, delete, and view expense records
- **Data Export**: Export transactions to Excel format
- **Responsive UI**: Built with Tailwind CSS

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Recharts (for data visualization)
- Framer Motion (animations)
- Axios (API calls)
- React Toastify (notifications)
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (authentication)
- bcryptjs (password hashing)
- CORS

## Project Structure

```
track-expense/
├── backend/           # Express server
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Auth middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   └── index.js       # Entry point
├── frontend/          # React application
│   ├── src/
│   │   ├── components/# Reusable components
│   │   ├── pages/     # Page components
│   │   ├── utils/     # Utility functions
│   │   └── App.jsx    # Main app component
│   └── index.html
└── README.md
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=4000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/user/register | User registration |
| POST | /api/user/login | User login |
| GET | /api/income | Get all income records |
| POST | /api/income | Add new income |
| PUT | /api/income/:id | Update income |
| DELETE | /api/income/:id | Delete income |
| GET | /api/expense | Get all expense records |
| POST | /api/expense | Add new expense |
| PUT | /api/expense/:id | Update expense |
| DELETE | /api/expense/:id | Delete expense |
| GET | /api/dashboard | Get dashboard stats |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Disclaimer**: This is a personal learning project created by following online tutorials. It is not intended for production use without additional security review and testing.

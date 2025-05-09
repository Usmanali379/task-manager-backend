# Task Manager Backend

A robust backend for the Task Manager application, built with Node.js, Express, and MongoDB. This backend provides secure RESTful APIs for user authentication, task management, and analytics, with best practices for validation and security.


## 🚀 Live Demo

Check out the live app here:  
[https://task-management-frontend-rouge-ten.vercel.app](https://task-management-frontend-rouge-ten.vercel.app)


## Features

- **RESTful API**: Endpoints for tasks, users, and analytics
- **Authentication**: JWT-based user authentication and protected routes
- **MongoDB**: Data storage with Mongoose models
- **Task Management**: Create, read, update, delete tasks
- **Analytics Endpoints**: Task stats, completion trends, and more
- **Input Validation**: Robust validation with express-validator
- **Security**: Helmet.js, CORS, password hashing (bcrypt)
- **Pagination, Filtering, Sorting**: For efficient data access
- **Error Handling**: Consistent and clear API errors
- **Environment Config**: Uses dotenv for environment variables

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update values:
     - `MONGODB_URI` - MongoDB connection string
     - `JWT_SECRET` - Secret for JWT signing
     - `PORT` - (optional) Port to run the server

4. **Run the backend server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The API will be available at [http://localhost:5000](http://localhost:5000) (or your configured port)

## Project Structure

- `src/` - Main source code
  - `controllers/` - Route controllers (tasks, users, analytics)
  - `models/` - Mongoose models (User, Task)
  - `routes/` - Express route definitions
  - `middleware/` - Auth, validation, error handling, security
  - `utils/` - Utility functions (JWT, hashing, etc)
  - `config/` - Database and app config
  - `app.js` - Express app setup
  - `server.js` - Entry point

## Customization
- Add more analytics endpoints or business logic as needed
- Adjust validation, security, or error handling to your requirements

## License

This project is for educational/demo purposes. Please add your own license if using in production.

## API Documentation

### Authentication

#### Register
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "username": "yourname",
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "token": "<jwt-token>",
    "user": { "_id": "...", "username": "...", "email": "..." }
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "token": "<jwt-token>",
    "user": { "_id": "...", "username": "...", "email": "..." }
  }
  ```

### Tasks (Protected: Requires `Authorization: Bearer <token>` header)

#### Get All Tasks
- **GET** `/api/tasks`
- **Query Params:** `page`, `limit`, `search`, `status`, `priority`, `sortBy`, `sortOrder`
- **Response:**
  ```json
  {
    "tasks": [ { "_id": "...", "title": "...", ... } ],
    "pagination": { "total": 20, "page": 1, "pages": 2 }
  }
  ```

#### Create Task
- **POST** `/api/tasks`
- **Body:**
  ```json
  {
    "title": "Task title",
    "description": "Optional description",
    "dueDate": "2024-06-01",
    "priority": "High",
    "status": "Pending"
  }
  ```
- **Response:** Task object

#### Update Task
- **PUT** `/api/tasks/:id`
- **Body:** (any updatable fields)
- **Response:** Updated task object

#### Delete Task
- **DELETE** `/api/tasks/:id`
- **Response:** `{ "message": "Task deleted" }`

### Analytics (Protected)

#### Task Stats
- **GET** `/api/analytics/summary`
- **Response:**
  ```json
  {
    "totalTasks": 10,
    "completed": 5,
    "pending": 5,
    "byPriority": { "High": 2, "Medium": 5, "Low": 3 }
  }
  ```

#### Completion Trends
- **GET** `/api/analytics/completion-trends`
- **Response:**
  ```json
  [
    { "date": "2024-06-01", "completed": 2 },
    { "date": "2024-06-02", "completed": 1 }
  ]
  ```

---

For all protected routes, include the JWT token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

For more details, see the source code in the `routes/` and `controllers/` directories. 

# HyperBrain — Fullstack Quiz Platform
## Project Overview
HyperBrain — is my web-application for creating and passing interactive and diverse quizes. My project demonstrates ability to build-up RESTful API, work with NoSQL databases such as MongoDB using Mongoose, and realisation of protection systems of authentification and authorisation.
## Project Structure (Modular Architecture)
Project is organised in the way of principle of modularity(First Requirement):
- `server.js` - Entry point, Middleware setup and route connection.
- `/models` - Mongoose-schemes (User, Quiz).
- `/routes` - separate routes for Auth, Users and Quizzes.
- `/middleware` - authorization logic (JWT) and global error handler.
- `/public` - frontend part (HTML/CSS/JS).
- `.env` - storing sensitive data (keys, database links).
## Tech Stack and Requirements Coverage
### 1. Database and Models 
- I chose **MongoDB** using library **Mongoose**.
- **User Collection:** Stores user data and the total count.
- **Quiz Collection:** Stores questions, answer options, and creator ID.
### 2. API Endpoints 
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Registering a new user | Public |
| POST | `/api/auth/login` | Login and get JWT | Public |
| GET | `/api/users/profile` | Obtaining profile data | Private |
| PUT | `/api/users/profile` | Profile update | Private |
| GET | `/api/quizzes` | All quizes (+ search using `?search=`) | Public |
| POST | `/api/quizzes` | Quiz creation | Private |
| PUT | `/api/quizzes/:id` | Editing of quiz | Private |
| DELETE | `/api/quizzes/:id` | Deletion of quiz | Private |
### 3. Authentication and Security 
- Password is hashed using **bcryptjs**.
- Endpoint protection is implemented using **JWT** (JSON Web Token).
- Custom created `authMiddleware.js` for token verification.
### 4. Validation and Error Handling 
- Input data (Email, Password, Quiz title) are validated using library **Joi**.
- Implemented **Global Error Handler** in `server.js` to return status codes (400, 401, 404, 500).
## Setup and Installation
1. Install dependencies: `npm install express mongoose jsonwebtoken bcryptjs joi dotenv cors`
2. Take a look into `.env`:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/quiz_db
   JWT_SECRET=SUPER_DUPER_MEGA_KEY2026
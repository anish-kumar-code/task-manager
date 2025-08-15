# 📝 Todo App – MERN Stack

## 🚀 How to Run the App

### 1️⃣ Backend Setup
```bash
# Clone the repository
git clone https://github.com/anish-kumar-code/task-manager/tree/main/backend
cd backend

# Install dependencies
npm install

# Create a `.env` file with:
MONGO_URI=<your-mongodb-uri>
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET="Thisismysupersecretaccesstokenandimadethisfortodoappassignment"
ACCESS_TOKEN_EXPIRY="1d"
REFRESH_TOKEN_SECRET="Thisismysupersecretrefreshtokenandimadethisfortodoappassignment"
REFRESH_TOKEN_EXPIRY="10d"
PORT=7979

# Start the server
npm run dev
```
### 1️⃣ Frontend Setup
```
# Clone the frontend repository
git clone https://github.com/anish-kumar-code/task-manager/tree/main/frontend
cd frontend

# Install dependencies
npm install

# Create a `.env` file with:
VITE_API_BASE_URL=http://localhost:7979

# Start the frontend
npm run dev
```

📡 API Endpoints

Base URL:
Local: http://localhost:7979
Live: https://project-manager-si7k.onrender.com

| Method | Endpoint                 | Description          |
| ------ | ------------------------ | -------------------- |
| POST   | `/api/v1/users/register` | Register a new user  |
| POST   | `/api/v1/users/login`    | Login user & get JWT |


| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| POST   | `/api/v1/tasks`     | Create a new task  |
| GET    | `/api/v1/tasks`     | Get all tasks      |
| PATCH  | `/api/v1/tasks/:id` | Update task status |
| DELETE | `/api/v1/tasks/:id` | Delete a task      |

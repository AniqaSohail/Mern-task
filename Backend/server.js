import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';

const app = express();

// Connect Database
connectDB();



// Middleware
app.use(cors(mern-task-eight.vercel.app));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes); // <-- ✅ Mount todo routes at /api/todos


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
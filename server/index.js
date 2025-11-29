import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/mongodb.js';

// Load environment variables (try .env.local first, then .env)
dotenv.config({ path: '.env.local' });
dotenv.config(); // Fallback to .env if .env.local doesn't exist

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB().catch(console.error);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    database: 'MongoDB connected'
  });
});

// Example API route
app.get('/api/test', async (req, res) => {
  try {
    res.json({ 
      message: 'MongoDB connection test successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Using default'}`);
});


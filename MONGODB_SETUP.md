# MongoDB Setup Guide

## Prerequisites

1. **MongoDB Installation Options:**
   - **Local MongoDB**: Install MongoDB Community Edition on your machine
   - **MongoDB Atlas**: Free cloud MongoDB database (recommended for production)

## Setup Instructions

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/projectflow?retryWrites=true&w=majority`)

### Option 2: Local MongoDB

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

## Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection String
# For local: mongodb://localhost:27017/projectflow
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/projectflow?retryWrites=true&w=majority
MONGODB_URI=mongodb://localhost:27017/projectflow

# Server Port
PORT=5000

# Frontend API URL (for Vite)
VITE_API_URL=http://localhost:5000/api
```

## Running the Server

1. **Start the MongoDB server** (if using local MongoDB)

2. **Start the backend server:**
   ```bash
   npm run server
   ```
   
   Or with auto-reload:
   ```bash
   npm run dev:server
   ```

3. **Start the frontend** (in a separate terminal):
   ```bash
   npm run dev
   ```

## Testing the Connection

1. The server will automatically connect to MongoDB on startup
2. Visit `http://localhost:5000/api/health` to check server status
3. Visit `http://localhost:5000/api/test` to test MongoDB connection

## Using MongoDB in Your Frontend

Import the MongoDB client utility:

```javascript
import { checkHealth, testConnection, createItem, getItems } from './utils/mongodbClient';

// Check server health
const health = await checkHealth();

// Test MongoDB connection
const test = await testConnection();

// Create an item
const newItem = await createItem('projects', {
  title: 'My Project',
  description: 'Project description'
});

// Get all items
const items = await getItems('projects');
```

## Project Structure

```
projectflow/
├── server/
│   ├── index.js          # Express server
│   └── db/
│       └── mongodb.js     # MongoDB connection utility
├── src/
│   └── utils/
│       └── mongodbClient.js  # Frontend MongoDB API client
└── .env                   # Environment variables (create this)
```

## Next Steps

1. Create MongoDB models/schemas in `server/models/`
2. Add API routes in `server/routes/`
3. Update the frontend to use MongoDB instead of Supabase (if desired)


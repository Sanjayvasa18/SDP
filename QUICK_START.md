# Quick Start Guide - Fix "Network Error"

## The Problem
You're seeing: "Network error: Unable to connect to the server. Please check your internet connection and make sure the backend server is running."

This means your **backend server is not running**.

## Solution: Start the Backend Server

### Step 1: Open a New Terminal
Keep your frontend terminal running, and open a **new terminal window**.

### Step 2: Navigate to Project Directory
```bash
cd C:\Users\HP\projectflow
```

### Step 3: Start the Backend Server
```bash
npm run server
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
📊 MongoDB URI: Configured
```

### Step 4: Keep Both Terminals Running
- **Terminal 1:** Backend server (`npm run server`)
- **Terminal 2:** Frontend (`npm run dev`)

## Alternative: Use Auto-Reload for Backend

If you want the backend to auto-reload on changes:
```bash
npm run dev:server
```

## Verify It's Working

1. **Check backend is running:**
   - You should see the server logs in the backend terminal
   - Visit `http://localhost:5000/api/health` in your browser
   - Should return: `{"status":"ok","message":"Server is running","database":"MongoDB connected"}`

2. **Check frontend can connect:**
   - Go back to your app
   - Try signing up again
   - The error should be gone!

## Troubleshooting

### "MongoDB connection error"
- Check your `.env.local` file has `MONGODB_URI` set correctly
- Verify MongoDB Atlas allows connections from your IP

### "Port 5000 already in use"
- Another process is using port 5000
- Change `PORT=5001` in `.env.local` and update `VITE_API_URL=http://localhost:5001/api`

### Still getting network error?
- Make sure both servers are running
- Check browser console for detailed error messages
- Verify `VITE_API_URL` in `.env.local` matches your backend port

## Quick Commands Summary

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

That's it! Both should be running simultaneously. 🚀


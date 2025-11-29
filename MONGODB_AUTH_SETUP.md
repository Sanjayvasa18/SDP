# MongoDB Authentication Setup Guide

## ✅ What's Been Done

Your application has been successfully migrated from Supabase to MongoDB for authentication!

### Backend (MongoDB)
- ✅ User model with password hashing (bcrypt)
- ✅ Authentication API routes (`/api/auth/signup`, `/api/auth/login`, `/api/auth/me`)
- ✅ JWT token-based authentication
- ✅ User management endpoints

### Frontend
- ✅ Updated AuthContext to use MongoDB API
- ✅ New API client for backend communication
- ✅ Token management in localStorage

## 🚀 Running the Application

### 1. Start the Backend Server

```bash
npm run server
```

Or with auto-reload:
```bash
npm run dev:server
```

The server will run on `http://localhost:5000`

### 2. Start the Frontend

In a separate terminal:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or similar)

## 📝 Environment Variables

Make sure your `.env.local` file contains:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://projectuser:Srivathsav%4027@cluster0.abcd123.mongodb.net/sdpproject?retryWrites=true&w=majority&appName=Cluster0

# Server Configuration
PORT=5000

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend API URL
VITE_API_URL=http://localhost:5000/api
```

## 🌐 Vercel Deployment

### Option 1: Deploy Backend Separately (Recommended)

1. **Deploy backend to a service like:**
   - Railway
   - Render
   - Heroku
   - DigitalOcean App Platform

2. **Update `VITE_API_URL` in Vercel** to point to your backend URL

### Option 2: Use Vercel Serverless Functions

You can convert the Express routes to Vercel serverless functions. Let me know if you want help with this!

### Environment Variables for Vercel

Add these in your Vercel project settings:

```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
VITE_API_URL=https://your-backend-url.com/api
```

## 🔐 API Endpoints

### Signup
```
POST /api/auth/signup
Body: { name, email, password, role }
Response: { success, user, token }
```

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { success, user, token }
```

### Get Current User
```
GET /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: { success, user }
```

### Get All Users
```
GET /api/auth/users
Headers: { Authorization: Bearer <token> }
Response: { success, users: [...] }
```

## 🧪 Testing

1. **Start the backend server:**
   ```bash
   npm run server
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Test signup:**
   - Go to the signup page
   - Fill in the form
   - Submit and verify it works

4. **Test login:**
   - Use the credentials you just created
   - Verify login works

## 🔧 Troubleshooting

### "Network error: Unable to connect to the server"
- Make sure the backend server is running on port 5000
- Check that `VITE_API_URL` is set correctly
- Verify MongoDB connection is working

### "Database not configured" error
- Check that `MONGODB_URI` is set in `.env.local`
- Verify MongoDB Atlas network access allows your IP

### Authentication not working
- Check browser console for errors
- Verify JWT token is being stored in localStorage
- Check backend server logs for errors

## 📦 What Changed

- **Removed:** Supabase dependency from authentication
- **Added:** MongoDB User model with bcrypt password hashing
- **Added:** JWT-based authentication
- **Added:** Express API routes for auth
- **Updated:** Frontend to use MongoDB API instead of Supabase

## 🎉 Next Steps

1. Test the authentication flow locally
2. Deploy the backend server
3. Update Vercel environment variables
4. Test the deployed application

Your authentication is now fully powered by MongoDB! 🚀


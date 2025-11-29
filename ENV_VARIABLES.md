# Environment Variables Guide

## Local Development (.env.local)

Your `.env.local` file is configured with:

```env
MONGODB_URI=mongodb+srv://projectuser:Srivathsav%4027@cluster0.abcd123.mongodb.net/sdpproject?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=IgXWj8L1PEOivR3kHwVmnMr4JZ5Yq9ABb0elhauUSofyK6xNt7CFzQDp2TGcds
VITE_API_URL=http://localhost:5000/api
```

## Vercel Environment Variables

When deploying to Vercel, add these environment variables in your project settings:

### Required Variables:

1. **MONGODB_URI**
   ```
   mongodb+srv://projectuser:Srivathsav%4027@cluster0.abcd123.mongodb.net/sdpproject?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **JWT_SECRET**
   ```
   IgXWj8L1PEOivR3kHwVmnMr4JZ5Yq9ABb0elhauUSofyK6xNt7CFzQDp2TGcds
   ```
   ⚠️ **Important:** Generate a new, unique JWT_SECRET for production! Don't use the same one as development.

3. **VITE_API_URL**
   ```
   https://your-backend-url.com/api
   ```
   Replace `your-backend-url.com` with your actual backend server URL.

### How to Add in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add each variable:
   - **Name:** `MONGODB_URI`
   - **Value:** Your MongoDB connection string
   - **Environment:** Select all (Production, Preview, Development)
5. Repeat for `JWT_SECRET` and `VITE_API_URL`
6. Click **Save**

## Backend Server Deployment

Since Vercel is for frontend only, you need to deploy your backend server separately.

### Option 1: Railway (Recommended - Easy & Free)

1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT=5000` (Railway will auto-assign, but you can set it)
5. Railway will auto-detect and deploy your Express server
6. Copy the deployed URL and use it for `VITE_API_URL` in Vercel

### Option 2: Render

1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `node server/index.js`
6. Add environment variables
7. Deploy and copy the URL

### Option 3: DigitalOcean App Platform

Similar process to Render.

## Example VITE_API_URL Values

### Local Development:
```
VITE_API_URL=http://localhost:5000/api
```

### Production (after deploying backend):
```
VITE_API_URL=https://your-app-name.railway.app/api
```
or
```
VITE_API_URL=https://your-app-name.onrender.com/api
```

## Security Notes

- ✅ Never commit `.env.local` to git (it's in `.gitignore`)
- ✅ Use different JWT_SECRET for production
- ✅ Keep your MongoDB connection string secure
- ✅ Use HTTPS in production (most hosting platforms provide this automatically)

## Testing

After setting up environment variables:

1. **Local:** Start backend with `npm run server`, frontend with `npm run dev`
2. **Production:** Deploy backend first, then update `VITE_API_URL` in Vercel, then redeploy frontend


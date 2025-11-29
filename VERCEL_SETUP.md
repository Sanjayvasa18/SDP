# Vercel Environment Variables Setup Guide

## Fix "Database not configured" Error

This error occurs because Supabase environment variables are not set in your Vercel deployment.

## Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Sign in or create a free account
3. Create a new project (or select an existing one)
4. Go to **Settings** → **API**
5. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")

## Step 2: Add Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`sdp-project-35` or similar)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add the following variables:

   **Variable 1:**
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** Your Supabase Project URL (e.g., `https://xxxxx.supabase.co`)
   - **Environment:** Select all (Production, Preview, Development)

   **Variable 2:**
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon/public key
   - **Environment:** Select all (Production, Preview, Development)

6. Click **Save** for each variable

## Step 3: Redeploy

1. After adding the environment variables, go to **Deployments**
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

## Step 4: Verify

After redeployment, try signing up again. The error should be gone!

---

## Alternative: Use MongoDB Instead

If you prefer to use MongoDB (which you already have set up), we can switch the authentication system to use MongoDB instead of Supabase. Let me know if you'd like to do this!

---

## Troubleshooting

- **Still seeing the error?** Make sure you selected all environments (Production, Preview, Development) when adding variables
- **Variables not working?** Try redeploying after adding them
- **Need help?** Check that your Supabase project is active and the keys are correct


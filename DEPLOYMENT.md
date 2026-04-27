# Deployment Guide - Render

This guide will help you deploy your Digital Ad Bird project to Render.

## Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Render Account** - Create a free account at [render.com](https://render.com)
3. **MongoDB Atlas Account** - Already configured (you're using `mongodb+srv://`)
4. **Redis** - Will be provisioned on Render

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
cd c:\Users\Ketan Dixit\OneDrive\Desktop\HCL Assessment2
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

### 1.2 Create/Update .env Files
Make sure you have `.env.example` files in both `backend/` and `frontend/` directories. These are already created for you.

**Do NOT commit `.env` files** - only commit `.env.example` files.

## Step 2: Push to GitHub

1. Create a new repository on GitHub at [github.com/new](https://github.com/new)
   - Repository name: `digital-ad-bird` (or your preferred name)
   - Make it **Public** (for free tier on Render)
   - Do NOT initialize with README (you already have one)

2. In your terminal, add the GitHub remote and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/digital-ad-bird.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Render

### Option A: Deploy from GitHub (Recommended)

1. **Connect GitHub to Render:**
   - Go to [render.com](https://render.com) and sign in
   - Click "Connect GitHub" and authorize Render to access your repositories

2. **Create Backend Service:**
   - Click "New +" → "Web Service"
   - Select your GitHub repository
   - **Settings:**
     - Name: `digital-ad-bird-backend`
     - Runtime: `Docker`
     - Build Command: (leave empty - uses Dockerfile)
     - Start Command: (leave empty - uses Dockerfile)
     - Plan: **Free** (or Paid for production)
     - Region: `Oregon` (or nearest to your users)

3. **Add Environment Variables (Backend):**
   - In the Environment section, add:
     ```
     PORT=5000
     NODE_ENV=production
     MONGO_URI=mongodb+srv://ketandixit192:ketan123@hclproject.9vb5zi4.mongodb.net/?appName=hclproject
     REDIS_URL=redis://<your-redis-url>
     JWT_ACCESS_SECRET=<generate-secure-random-string>
     JWT_REFRESH_SECRET=<generate-secure-random-string>
     FRONTEND_URL=https://<your-frontend-url>.onrender.com
     STRIPE_SECRET_KEY=<your-stripe-key>
     ```
   - Save and Deploy

4. **Create Redis Service:**
   - Click "New +" → "Redis"
   - **Settings:**
     - Name: `digital-ad-bird-redis`
     - Plan: **Free**
     - Region: `Oregon`
   - Once created, copy the Internal Database URL from the connections tab
   - Update the backend `REDIS_URL` with this URL

5. **Create Frontend Service:**
   - Click "New +" → "Web Service"
   - Select your GitHub repository
   - **Settings:**
     - Name: `digital-ad-bird-frontend`
     - Runtime: `Docker`
     - Root Directory: `./frontend` (optional - helps with deployment)
     - Plan: **Free**
     - Region: `Oregon`

6. **Add Environment Variables (Frontend):**
   - In the Environment section, add:
     ```
     NEXT_PUBLIC_API_URL=https://<your-backend-service>.onrender.com/api
     ```
   - Save and Deploy

### Option B: Using render.yaml (Advanced)

If you want to deploy everything at once using the `render.yaml` configuration:

1. Push your code to GitHub with the `render.yaml` file included
2. Go to [render.com/new/multiple](https://render.com/new/multiple)
3. Select your repository
4. Render will automatically use the `render.yaml` configuration
5. Review and customize environment variables
6. Deploy

## Step 4: Get Your Live Links

Once deployment is complete:

- **Backend URL:** `https://digital-ad-bird-backend.onrender.com`
- **Frontend URL:** `https://digital-ad-bird-frontend.onrender.com`

### Update your frontend to use the backend URL:
```
NEXT_PUBLIC_API_URL=https://digital-ad-bird-backend.onrender.com/api
```

## Step 5: Verify Deployment

1. **Check Backend:**
   ```
   https://your-backend-url.onrender.com/api/health
   ```

2. **Check Frontend:**
   - Open your frontend URL in the browser
   - Open DevTools Console (F12)
   - Check for any API errors

## Troubleshooting

### Backend won't start
- Check logs on Render dashboard
- Ensure MongoDB URI is correct
- Verify Redis connection string
- Check for missing environment variables

### Frontend shows blank page
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Clear browser cache (Ctrl+Shift+Del)
- Check browser console for errors

### Slow cold starts on free tier
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep may take 30 seconds
- Upgrade to Starter/Pro plan for production

## Cost Considerations

- **Free Tier:** Includes some free usage, shared resources, auto-sleep
- **Starter:** $7/month - Always on, dedicated resources
- **Pro:** $12/month - More resources, better performance

## Security Notes

1. **Never commit `.env` files** - use `.env.example` only
2. Change default JWT secrets to strong random values
3. Use separate MongoDB credentials for production
4. Enable 2FA on GitHub and Render accounts
5. Rotate API keys regularly

## Next Steps

- Set up custom domain (optional)
- Configure backup strategies for MongoDB
- Set up monitoring and alerts
- Implement CI/CD for automatic deployments

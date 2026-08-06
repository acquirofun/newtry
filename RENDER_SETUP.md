# Render Deployment Setup Guide for DebateP2P

## Step-by-Step Instructions

### 1. Prepare Your Repository

Your repository is already set up with:
- ✅ `render.yaml` configuration file
- ✅ `package.json` with dependencies
- ✅ `server.js` backend with Socket.io
- ✅ `index.html` frontend
- ✅ All necessary files committed to Git

### 2. Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended) or email
4. Verify your email address

### 3. Connect GitHub Repository

1. After logging in, click "New +" button
2. Select "Web Service"
3. Click "Connect GitHub" (if not already connected)
4. Authorize Render to access your GitHub repositories
5. Find and select your `newtry` repository
6. Click "Connect"

### 4. Configure Web Service

Render will automatically detect your `render.yaml` file and pre-fill most settings:

**Basic Settings:**
- **Name:** debatep2p (or your preferred name)
- **Region:** Oregon (or closest to your users)
- **Branch:** master (or main)
- **Runtime:** Node (auto-detected)
- **Build Command:** `npm install` (auto-detected from render.yaml)
- **Start Command:** `node server.js` (auto-detected from render.yaml)

**Environment Variables:**
- `PORT: 3000` (already set in render.yaml)
- `NODE_ENV: production` (already set in render.yaml)

**Instance Type:**
- **Free** (recommended for testing)
  - 512 MB RAM
  - 0.1 CPU
  - Sleeps after 15 minutes of inactivity
  - Spins up in ~30 seconds

- **Starter ($7/month)** (for production)
  - 512 MB RAM
  - 0.5 CPU
  - Always running
  - Faster startup

### 5. Deploy

1. Review all settings
2. Click "Create Web Service"
3. Render will start building your application
4. Watch the build logs in the dashboard
5. Wait for deployment to complete (2-5 minutes)

### 6. Access Your Deployed App

Once deployment is complete:
- Your app will be available at: `https://debatep2p.onrender.com`
- Or your custom URL if you chose a different name
- SSL/HTTPS is automatically enabled

### 7. Test Your Deployment

1. Open your deployed URL in a browser
2. Test the create room functionality
3. Test the join room functionality (open in second tab)
4. Test WebRTC video connection
5. Test motion generation and coin toss
6. Test preparation timer

### 8. Important Notes for Free Tier

**Free Tier Limitations:**
- Apps sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Limited to 512 MB RAM and 0.1 CPU
- 750 hours/month usage limit

**Tips for Free Tier:**
- Your app will work perfectly for testing
- For production, consider upgrading to Starter plan
- WebSocket connections work on free tier
- Socket.io is fully supported

### 9. Custom Domain (Optional)

If you want a custom domain:

1. Go to your web service settings in Render
2. Click "Domains"
3. Click "Add Domain"
4. Enter your domain (e.g., `debate.yourdomain.com`)
5. Update your DNS records as instructed
6. SSL certificate is automatically provisioned

### 10. Monitoring and Logs

**View Logs:**
- Go to your web service dashboard
- Click "Logs" tab
- View real-time logs and build history

**Metrics:**
- CPU usage
- Memory usage
- Response times
- Error rates

### 11. Environment Variables (Additional)

If you need to add more environment variables:

1. Go to your web service settings
2. Scroll to "Environment" section
3. Click "Add Environment Variable"
4. Add key-value pairs
5. Click "Save Changes"
6. Trigger a new deployment

### 12. Troubleshooting

**Common Issues:**

**Build Fails:**
- Check build logs for errors
- Ensure `package.json` is correct
- Verify all dependencies are listed

**App Won't Start:**
- Check `startCommand` in render.yaml
- Verify `server.js` exists and is correct
- Check logs for startup errors

**WebSocket Connection Issues:**
- Socket.io is fully supported on Render
- Ensure PORT environment variable is set to 3000
- Check firewall/security settings

**Free Tier Sleep Issues:**
- Normal behavior for free tier
- Upgrade to Starter plan for always-on
- Or use a "keep-alive" service (not recommended)

### 13. Update Deployments

**Automatic Deployments:**
- Render automatically deploys when you push to GitHub
- You can enable/disable this in settings

**Manual Deployments:**
- Go to your web service dashboard
- Click "Manual Deploy"
- Select branch and commit
- Click "Deploy"

### 14. Rollback

If something goes wrong:

1. Go to your web service dashboard
2. Click "Deployments" tab
3. Find a previous successful deployment
4. Click "Rollback" 
5. Confirm rollback

### 15. Scaling

**Vertical Scaling:**
- Upgrade instance type in settings
- Options: Free → Starter → Standard → Pro

**Horizontal Scaling:**
- Create multiple instances
- Use load balancer (requires custom setup)

## Summary

Your DebateP2P app is ready for Render deployment with:
- ✅ Proper `render.yaml` configuration
- ✅ Socket.io support
- ✅ WebRTC video streaming
- ✅ All dependencies listed
- ✅ Environment variables configured

**Next Steps:**
1. Create Render account
2. Connect GitHub repository
3. Deploy with one click
4. Test functionality
5. Share URL with users

## Support

- **Render Documentation:** https://render.com/docs
- **Render Support:** support@render.com
- **Community:** https://community.render.com

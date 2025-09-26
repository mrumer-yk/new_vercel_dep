# Deployment Instructions for Vercel

## Environment Variables Setup

### 1. In your Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variable:
   - **Name**: `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value**: Your Clerk publishable key (starts with `pk_test_` or `pk_live_`)
   - **Environment**: Production, Preview, Development (select all)

### 2. Clerk Dashboard Setup:
1. Go to your Clerk dashboard
2. Navigate to "Domains" in the sidebar
3. Add your Vercel domain (e.g., `your-app.vercel.app`)
4. Make sure both HTTP and HTTPS are allowed if needed

## Common Issues and Solutions

### Issue 1: "Missing Clerk Publishable Key" Error
- **Cause**: Environment variable not set in Vercel
- **Solution**: Add `VITE_CLERK_PUBLISHABLE_KEY` in Vercel dashboard

### Issue 2: Authentication Modal Not Opening
- **Cause**: Clerk not initialized properly
- **Solution**: Check browser console for errors, ensure domain is added to Clerk

### Issue 3: CORS Errors
- **Cause**: Domain not whitelisted in Clerk
- **Solution**: Add your Vercel domain to Clerk's allowed domains

### Issue 4: Build Errors
- **Cause**: Async/await issues in modules
- **Solution**: The code has been updated to handle async initialization properly

## Verification Steps

1. Deploy to Vercel
2. Open browser developer tools
3. Check console for "Clerk initialized successfully" message
4. Test login/signup functionality
5. Verify authentication state persists on page refresh

## Debugging

If authentication still doesn't work:

1. Check Vercel function logs
2. Verify environment variables are set
3. Check Clerk dashboard for domain configuration
4. Test with a fresh incognito/private browser window

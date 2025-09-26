# CodeMaster Pro - Landing Page with Clerk Authentication

A modern landing page built with Vite and Clerk authentication for CodeMaster Pro.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Update the `.env` file with your complete Clerk publishable key:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_complete_clerk_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:8080` to see your application.

## 🔧 Clerk Setup Instructions

### 1. Create Clerk Account
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose your authentication methods:
   - ✅ Email/Password
   - ✅ Google OAuth

### 2. Configure Authentication Methods
In your Clerk dashboard:
- Go to "User & Authentication" → "Email, Phone, Username"
- Enable Email addresses
- Go to "User & Authentication" → "Social Connections"
- Enable Google and configure OAuth credentials

### 3. Set Domain Configuration
- Add `localhost:8080` for development
- Add your production domain when deploying

### 4. Get Your Keys
- Copy your **Publishable Key** from the API Keys page
- Update the `.env` file with the complete key

## 📁 Project Structure

```
web3d/
├── index.html          # Main HTML file
├── main.js            # Main JavaScript entry point
├── auth.js            # Clerk authentication logic
├── styles.css         # All CSS styles
├── package.json       # Dependencies and scripts
├── vite.config.js     # Vite configuration
├── .env              # Environment variables
├── privacy.html      # Privacy policy page
├── terms.html        # Terms of service page
└── README.md         # This file
```

## 🎯 Features

- ✅ Modern Vite-based build system
- ✅ Clerk authentication with Google OAuth
- ✅ Protected download functionality
- ✅ Responsive design
- ✅ Legal pages (Privacy, Terms)
- ✅ Interactive UI components
- ✅ 3D hover effects
- ✅ Professional styling

## 🔐 Authentication Flow

1. **Unauthenticated users** see "Login to Download" button
2. **Clicking download** shows authentication modal
3. **Users can sign in** with email/password or Google
4. **After authentication** download becomes available
5. **User menu** shows avatar and logout option

## 🛠 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📝 Customization

### Update Clerk Key
Replace the key in `.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### Customize Download Logic
Edit the `initiateDownload()` method in `auth.js`:
```javascript
initiateDownload() {
  // Add your download logic here
  window.location.href = '/download/your-installer.exe'
}
```

### Styling
All styles are in `styles.css` with CSS custom properties for easy theming.

## 🚨 Troubleshooting

### Clerk Not Loading
- Check that your publishable key is complete and correct
- Verify domain is added to Clerk dashboard
- Check browser console for error messages

### Authentication Issues
- Ensure Google OAuth is properly configured
- Check that redirect URLs are set correctly
- Verify email authentication is enabled

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Check that Node.js version is 16+ 
- Clear `node_modules` and reinstall if needed

## 📞 Support

For issues with:
- **Clerk Authentication**: Check [Clerk Documentation](https://clerk.com/docs)
- **Vite Build**: Check [Vite Documentation](https://vitejs.dev)
- **Project Setup**: Check browser console for error messages

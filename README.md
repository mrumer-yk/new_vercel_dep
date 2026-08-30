# CodeMaster — Learn to Code

A clean, fast landing site for a coding education platform. Blog, structured learning paths, roadmaps, and free resources — built with Vite + Firebase.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:8080`.

## 📁 Project Structure

```
├── index.html        # Landing page (hero, topics, blog, learn, roadmaps, resources, newsletter, FAQ)
├── main.js           # UI: FAQ, mobile nav, reveal, newsletter, smooth scroll
├── auth.js           # Firebase Auth (email/password + Google) + Firestore newsletter storage
├── styles.css        # Design system & responsive layout
├── vite.config.js    # Vite config (port 8080)
├── package.json
├── vercel.json       # Security headers
└── html/             # privacy.html, terms.html, price.html (legacy)
```

## ✨ Features

- Responsive, accessible layout
- Blog with featured + grid cards
- Learning paths (Foundations → Frontend → Full-Stack)
- Visual roadmaps
- Resources & cheat sheets section
- Newsletter signup (Firestore with localStorage fallback)
- Firebase Auth with Google OAuth
- FAQ accordion, reveal-on-scroll, mobile nav

## 🔧 Firebase Setup

1. Create a project at [firebase.google.com](https://firebase.google.com)
2. Enable **Authentication → Email/Password** and **Google**
3. Create a **Firestore** database
4. Update `firebaseConfig` in `auth.js` with your project keys
5. For local dev, add `localhost` to authorized domains in Firebase Console

> Note: `firebaseConfig` is currently inlined for demo. For production, move keys to env (`import.meta.env.VITE_FIREBASE_…`) and add `.env` to `.gitignore`.

## 🛠 Build

```bash
npm run build   # → dist/
npm run preview # preview production build
```

## 🎨 Customization

- **Colors / radius / shadows**: edit `:root` in `styles.css`
- **Blog posts**: duplicate `.blog-card` in `#blog`
- **Learning paths**: edit `.learn-card` in `#learn`
- **Newsletter collection**: change `prelaunch-registrations` in `auth.js` → `saveRegistrationToFirebase`

## 📝 License

All content is educational. Adapt freely for your own learning platform.

---
Deployed on [Vercel](https://vercel.com).


// Firebase Authentication Setup
console.log('🚀 Setting up Firebase authentication...');

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8L5H1jq0cSKfrssMiArb_eCMYu9xsrPk",
    authDomain: "thecodemaster-1b1fb.firebaseapp.com",
    projectId: "thecodemaster-1b1fb",
    storageBucket: "thecodemaster-1b1fb.firebasestorage.app",
    messagingSenderId: "341191155963",
    appId: "1:341191155963:web:ae8981559b1e13e9b3d05e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

class AuthManager {
  constructor() {
    this.auth = auth;
    this.isSignedIn = false;
    this.currentUser = null;
    this.isInitialized = false;
    this.init();
  }

  async init() {
    try {
      console.log('⏳ Initializing Firebase authentication...');
      
      // Set up auth state listener
      this.setupAuthListeners();
      
      // Set up event listeners for buttons
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('🎉 Firebase authentication fully initialized!');
      
    } catch (error) {
      console.error('❌ Firebase failed to initialize:', error);
      this.setupFallbackAuth();
    }
  }

  setupAuthListeners() {
    onAuthStateChanged(this.auth, (user) => {
      console.log('👤 Auth state changed:', !!user);
      this.currentUser = user;
      this.isSignedIn = !!user;
      this.updateUI();
    });
  }

  setupEventListeners() {
    console.log('🔗 Setting up button listeners...');
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      console.log('✅ Login button found');
      loginBtn.addEventListener('click', () => {
        console.log('🔘 Login clicked');
        if (this.isSignedIn) {
          this.signOutUser();
        } else {
          this.signIn();
        }
      });
    }

    // Signup button  
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
      console.log('✅ Signup button found');
      signupBtn.addEventListener('click', () => {
        console.log('🔘 Signup clicked');
        this.signUp();
      });
    }

    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      console.log('✅ Download button found');
      downloadBtn.addEventListener('click', () => {
        console.log('🔘 Download clicked');
        this.handleDownload();
      });
    }

    // Auth modal buttons
    const emailSignInBtn = document.getElementById('emailSignInBtn');
    if (emailSignInBtn) {
      emailSignInBtn.addEventListener('click', () => {
        this.showEmailSignIn();
        this.closeAuthModal();
      });
    }

    const googleSignInBtn = document.getElementById('googleSignInBtn');
    if (googleSignInBtn) {
      googleSignInBtn.addEventListener('click', () => {
        this.signInWithGoogle();
        this.closeAuthModal();
      });
    }

    // Modal close handlers
    const closeAuthModal = document.getElementById('closeAuthModal');
    if (closeAuthModal) {
      closeAuthModal.addEventListener('click', () => this.closeAuthModal());
    }

    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target.id === 'authModal') {
          this.closeAuthModal();
        }
      });
    }
  }

  async signIn() {
    if (!this.isInitialized) {
      console.warn('⚠️ Auth not ready yet');
      return;
    }
    
    try {
      console.log('🔓 Opening sign in modal...');
      this.showAuthModal();
    } catch (error) {
      console.error('❌ Sign in error:', error);
      this.showFallbackModal('signin');
    }
  }

  async signUp() {
    if (!this.isInitialized) {
      console.warn('⚠️ Auth not ready yet');
      return;
    }
    
    try {
      console.log('📝 Opening sign up modal...');
      this.showAuthModal();
    } catch (error) {
      console.error('❌ Sign up error:', error);
      this.showFallbackModal('signup');
    }
  }

  async signInWithGoogle() {
    try {
      console.log('🔓 Signing in with Google...');
      const result = await signInWithPopup(this.auth, googleProvider);
      console.log('✅ Google sign in successful:', result.user.email);
      this.showSuccess('Successfully signed in with Google!');
    } catch (error) {
      console.error('❌ Google sign in error:', error);
      this.showError('Failed to sign in with Google. Please try again.');
    }
  }

  async showEmailSignIn() {
    // Create a simple email/password form
    const modal = document.createElement('div');
    modal.id = 'email-signin-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
    
    modal.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 400px; width: 90%;">
        <h2 style="margin-bottom: 1rem; color: #333;">Sign In with Email</h2>
        <form id="email-signin-form">
          <input type="email" id="signin-email" placeholder="Email" required 
                 style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 4px;">
          <input type="password" id="signin-password" placeholder="Password" required 
                 style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 4px;">
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button type="submit" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;">
              Sign In
            </button>
            <button type="button" id="close-email-signin" style="background: #6b7280; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;">
              Cancel
            </button>
          </div>
        </form>
        <p style="text-align: center; margin-top: 1rem; font-size: 0.9rem; color: #666;">
          Don't have an account? <a href="#" id="switch-to-signup" style="color: #2563eb;">Sign up here</a>
        </p>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('email-signin-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;
      
      try {
        await signInWithEmailAndPassword(this.auth, email, password);
        console.log('✅ Email sign in successful');
        this.showSuccess('Successfully signed in!');
        document.body.removeChild(modal);
      } catch (error) {
        console.error('❌ Email sign in error:', error);
        this.showError('Invalid email or password. Please try again.');
      }
    });
    
    // Handle close button
    document.getElementById('close-email-signin').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Handle switch to signup
    document.getElementById('switch-to-signup').addEventListener('click', (e) => {
      e.preventDefault();
      document.body.removeChild(modal);
      this.showEmailSignUp();
    });
  }

  async showEmailSignUp() {
    // Create a simple email/password signup form
    const modal = document.createElement('div');
    modal.id = 'email-signup-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
    
    modal.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 400px; width: 90%;">
        <h2 style="margin-bottom: 1rem; color: #333;">Create Account</h2>
        <form id="email-signup-form">
          <input type="email" id="signup-email" placeholder="Email" required 
                 style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 4px;">
          <input type="password" id="signup-password" placeholder="Password (min 6 characters)" required 
                 style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 4px;">
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button type="submit" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;">
              Sign Up
            </button>
            <button type="button" id="close-email-signup" style="background: #6b7280; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;">
              Cancel
            </button>
          </div>
        </form>
        <p style="text-align: center; margin-top: 1rem; font-size: 0.9rem; color: #666;">
          Already have an account? <a href="#" id="switch-to-signin" style="color: #2563eb;">Sign in here</a>
        </p>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('email-signup-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      
      if (password.length < 6) {
        this.showError('Password must be at least 6 characters long.');
        return;
      }
      
      try {
        await createUserWithEmailAndPassword(this.auth, email, password);
        console.log('✅ Email sign up successful');
        this.showSuccess('Account created successfully!');
        document.body.removeChild(modal);
      } catch (error) {
        console.error('❌ Email sign up error:', error);
        this.showError(error.message || 'Failed to create account. Please try again.');
      }
    });
    
    // Handle close button
    document.getElementById('close-email-signup').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Handle switch to signin
    document.getElementById('switch-to-signin').addEventListener('click', (e) => {
      e.preventDefault();
      document.body.removeChild(modal);
      this.showEmailSignIn();
    });
  }

  async signOutUser() {
    try {
      console.log('👋 Signing out...');
      await signOut(this.auth);
      console.log('✅ Sign out successful');
      this.showSuccess('Successfully signed out!');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      this.showError('Failed to sign out. Please try again.');
    }
  }

  handleDownload() {
    if (this.isSignedIn) {
      console.log('✅ Starting download for authenticated user...');
      this.initiateDownload();
    } else {
      console.log('🔒 Need to sign in first');
      this.showAuthModal();
    }
  }

  initiateDownload() {
    // Replace with your actual download logic
    console.log('Download initiated for user:', this.currentUser?.uid);
    this.showSuccess('Download started! Check your downloads folder.');
  }

  // Modal management
  showAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  showFallbackModal(type = 'signin') {
    // Remove any existing modal
    const existing = document.getElementById('fallback-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'fallback-modal';
    modal.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;">
        <div style="background:white;padding:2rem;border-radius:8px;text-align:center;max-width:400px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          <h3 style="margin:0 0 1rem 0;color:#333;">${type === 'signin' ? 'Sign In' : 'Sign Up'}</h3>
          <p style="margin:0 0 1.5rem 0;color:#666;">Authentication service is temporarily unavailable.<br>For demo purposes, you can continue as a guest user.</p>
          <div style="display:flex;gap:1rem;justify-content:center;">
            <button onclick="authManager.demoLogin();document.getElementById('fallback-modal').remove()" 
                    style="background:#2563eb;color:white;border:none;padding:0.75rem 1.5rem;border-radius:4px;cursor:pointer;font-size:14px;">
              Continue as Demo User
            </button>
            <button onclick="document.getElementById('fallback-modal').remove()" 
                    style="background:#6b7280;color:white;border:none;padding:0.75rem 1.5rem;border-radius:4px;cursor:pointer;font-size:14px;">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  demoLogin() {
    console.log('🎭 Demo login activated');
    this.isSignedIn = true;
    this.currentUser = { 
      uid: 'demo-123',
      displayName: 'Demo User',
      email: 'demo@example.com'
    };
    this.updateUI();
    console.log('✅ Demo user signed in successfully');
  }

  updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    console.log('🎨 Updating UI, signed in:', this.isSignedIn);

    if (this.isSignedIn && this.currentUser) {
      // User is signed in
      if (loginBtn) {
        const displayName = this.currentUser.displayName || 
                           this.currentUser.email?.split('@')[0] || 
                           'User';
        loginBtn.textContent = `Hi, ${displayName}!`;
      }
      if (signupBtn) {
        signupBtn.style.display = 'none';
      }
      if (downloadBtn) {
        downloadBtn.textContent = 'Download Now';
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('auth-required');
      }
    } else {
      // User is not signed in
      if (loginBtn) {
        loginBtn.textContent = 'Login';
      }
      if (signupBtn) {
        signupBtn.style.display = 'inline-block';
        signupBtn.textContent = 'Sign Up';
      }
      if (downloadBtn) {
        downloadBtn.textContent = 'Login to Download';
        downloadBtn.disabled = false;
        downloadBtn.classList.add('auth-required');
      }
    }
  }

  setupFallbackAuth() {
    console.log('⚠️ Using fallback authentication mode');
    this.isInitialized = true;
    this.setupEventListeners();
    this.updateUI();
  }

  // Notification methods
  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1001;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Utility methods
  getUserInfo() {
    return {
      isSignedIn: this.isSignedIn,
      user: this.currentUser,
      userId: this.currentUser?.uid,
      email: this.currentUser?.email,
      name: this.currentUser?.displayName || this.currentUser?.email?.split('@')[0]
    };
  }
}

// Initialize authentication
const authManager = new AuthManager();
window.authManager = authManager;

console.log('🔧 Firebase Auth manager created and available globally');

// Firebase registration function
export async function saveRegistrationToFirebase(registrationData) {
  try {
    const docRef = await addDoc(collection(db, 'prelaunch-registrations'), {
      ...registrationData,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
      source: 'website'
    });
    console.log('✅ Registration saved to Firebase with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error saving registration to Firebase: ', error);
    
    // Check if it's a permissions error
    if (error.code === 'permission-denied') {
      console.log('🔧 Firestore permissions need to be configured. Using localStorage fallback.');
      return { success: false, error: 'permissions', fallback: true };
    }
    
    return { success: false, error: error.message };
  }
}

// Export the auth manager
export default authManager;

// Simple DOM setup without 3D background
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Mark that JS is running (used to enable reveal animations without hiding content when JS fails)
document.documentElement.classList.add('js-enabled');

// FAQ toggles
function setupFAQ() {
  const items = document.querySelectorAll('.faq-card');
  items.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    const icon = btn?.querySelector('.toggle');
    if (!btn || !ans) return;
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      ans.hidden = expanded;
      if (icon) icon.textContent = expanded ? '+' : '×';
    });
  });
}

// Testimonials auto-scroll
function setupTestimonials() {
  const scrollContainer = document.querySelector('.testimonials-scroll');
  if (!scrollContainer) return;
  
  let isScrolling = false;
  let scrollDirection = 1;
  
  function autoScroll() {
    if (isScrolling) return;
    
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const currentScroll = scrollContainer.scrollLeft;
    
    if (currentScroll >= maxScroll) {
      scrollDirection = -1;
    } else if (currentScroll <= 0) {
      scrollDirection = 1;
    }
    
    scrollContainer.scrollBy({
      left: scrollDirection * 2,
      behavior: 'smooth'
    });
  }
  
  // Auto-scroll every 50ms when not manually scrolling
  const autoScrollInterval = setInterval(autoScroll, 50);
  
  // Pause auto-scroll when user is manually scrolling
  scrollContainer.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollContainer.scrollTimeout);
    scrollContainer.scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 2000);
  });
  
  // Pause on hover
  scrollContainer.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
  });
  
  scrollContainer.addEventListener('mouseleave', () => {
    setInterval(autoScroll, 50);
  });
}

// Enhanced card hover effects
function setupCardEffects() {
  const cards = document.querySelectorAll('.card, .testimonial-card, .price-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Mobile menu functionality
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!mobileMenuBtn || !mainNav || !mobileNavOverlay) return;
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    const isActive = mainNav.classList.contains('active');
    
    if (isActive) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
  
  // Open mobile menu
  function openMobileMenu() {
    mainNav.classList.add('active');
    mobileMenuBtn.classList.add('active');
    mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Close mobile menu
  function closeMobileMenu() {
    mainNav.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
  
  // Event listeners
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  mobileNavOverlay.addEventListener('click', closeMobileMenu);
  
  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
      
      // Smooth scroll to section
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 300);
        }
      }
    });
  });
  
  // Close menu on window resize if desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}

// Import authentication and Firebase functions
let saveRegistrationToFirebase = null;

import('./auth.js').then((authModule) => {
  console.log('Authentication module loaded successfully');
  saveRegistrationToFirebase = authModule.saveRegistrationToFirebase;
  // The auth manager will initialize itself
}).catch(error => {
  console.error('Failed to load authentication module:', error);
  // Show user-friendly error
  const authButtons = document.getElementById('auth-buttons');

  if (authButtons) {
    authButtons.innerHTML = '<span style="color: #ef4444; font-size: 14px;">Auth service unavailable</span>';
  }
});

setupFAQ();
setupTestimonials();
setupCardEffects();
setupMobileMenu();
setupPrelaunchForm();
setupCountdown();

// Section reveal animations
function setupSectionReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

setupSectionReveals();

// Prelaunch registration form
function setupPrelaunchForm() {
  const form = document.getElementById('prelaunchForm');
  const successMessage = document.getElementById('successMessage');
  const registrationCount = document.getElementById('registrationCount');
  
  if (!form) return;
  
  // Animate registration count
  let count = 247;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 3) + 1;
    if (registrationCount) {
      registrationCount.textContent = count;
    }
  }, 30000); // Update every 30 seconds
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      userType: formData.get('userType'),
      experience: formData.get('experience'),
      newsletter: formData.get('newsletter') === 'on',
      timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = document.getElementById('registerBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '🔄 Registering...';
    submitBtn.disabled = true;
    
    try {
      // Save to Firebase
      if (saveRegistrationToFirebase) {
        const result = await saveRegistrationToFirebase(data);

        if (result.success) {
          // Show success message
          form.style.display = 'none';
          successMessage.style.display = 'block';

          // Update count
          count++;
          if (registrationCount) {
            registrationCount.textContent = count;
          }

          console.log('Registration successful:', data);
        } else {
          throw new Error(result.error || 'Failed to save registration');
        }
      } else {
        // Fallback to localStorage if Firebase not available
        const registrations = JSON.parse(localStorage.getItem('prelaunchRegistrations') || '[]');
        registrations.push(data);
        localStorage.setItem('prelaunchRegistrations', JSON.stringify(registrations));

        // Show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';

        // Update count
        count++;
        if (registrationCount) {
          registrationCount.textContent = count;
        }

        console.log('Registration saved locally:', data);
      }
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Show user-friendly error message
      const errorMsg = error.message.includes('Firebase') ? 
        'Registration failed. Please check your connection and try again.' :
        'Registration failed. Please try again.';
      
      alert(errorMsg);
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Countdown timer
function setupCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  
  // Set launch date (7 days from now)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 7);
  launchDate.setHours(12, 0, 0, 0); // Launch at noon
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate.getTime() - now;
    
    if (distance < 0) {
      // Launch day reached
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      
      // Update the section title
      const sectionTitle = document.querySelector('#register .section-title');
      if (sectionTitle) {
        sectionTitle.textContent = '🎉 We\'re Live!';
      }
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }
  
  // Update immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Social sharing functions
function shareOnTwitter() {
  const text = "🚀 Just registered for early access to CodeMaster Pro - the AI-powered development assistant that's launching soon! Get 50% off as an early bird. #CodeMasterPro #AI #Development";
  const url = window.location.href;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

function shareOnLinkedIn() {
  const url = window.location.href;
  const title = "CodeMaster Pro - AI-Powered Development Assistant";
  const summary = "Revolutionary AI tool for developers launching soon with 50% early bird discount!";
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`, '_blank');
}

// Make functions globally available
window.shareOnTwitter = shareOnTwitter;
window.shareOnLinkedIn = shareOnLinkedIn;

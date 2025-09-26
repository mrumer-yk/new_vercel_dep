// Simple test to verify auth.js can be imported without errors
import('./auth.js').then(() => {
  console.log('✅ Auth module loads successfully');
}).catch(error => {
  console.error('❌ Auth module failed to load:', error);
});

console.log('Testing build compatibility...');

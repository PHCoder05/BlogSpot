// Test script to send welcome email
// Run with: node test-email.js

import EmailService from './src/utils/emailService.js';

async function testWelcomeEmail() {
  console.log('🧪 Testing welcome email to pankajhadole4@gmail.com...');
  
  try {
    const result = await EmailService.sendWelcomeEmail('pankajhadole4@gmail.com');
    
    if (result) {
      console.log('✅ Welcome email sent successfully!');
      console.log('📧 Check your inbox (and spam folder) for the email');
      console.log('📧 From: phcoder.blog@gmail.com');
      console.log('📧 Subject: 🎉 Welcome to PHcoder Newsletter!');
    } else {
      console.log('❌ Failed to send welcome email');
    }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
}

// Run the test
testWelcomeEmail(); 
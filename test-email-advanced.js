// Advanced Email Test Script
// Run this script to send test emails to pankajhadole24@gmail.com

import EmailService from './src/utils/emailService.js';

const testEmail = 'pankajhadole24@gmail.com';

// Mock blog data for testing
const mockBlogData = {
  id: 'test-blog-post-advanced',
  blogs: {
    title: 'Advanced React Hooks: useEffect, useMemo, and useCallback Deep Dive',
    content: `
      <h2>Master Advanced React Hooks</h2>
      <p>React Hooks have revolutionized how we write React applications. In this comprehensive guide, we'll dive deep into the most powerful hooks that every React developer should master.</p>
      
      <h3>useEffect Hook</h3>
      <p>The useEffect hook allows you to perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined in React class components.</p>
      
      <h3>useMemo Hook</h3>
      <p>useMemo is used to optimize performance by memoizing expensive calculations. It only recalculates the memoized value when one of the dependencies has changed.</p>
      
      <h3>useCallback Hook</h3>
      <p>useCallback returns a memoized callback function. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.</p>
      
      <p>By the end of this tutorial, you'll have a solid understanding of when and how to use these advanced hooks to build performant React applications.</p>
    `,
    category: 'Programming',
    tags: ['React', 'JavaScript', 'Frontend', 'Performance', 'Hooks'],
    time: new Date()
  }
};

async function sendTestEmails() {
  console.log('🧪 Starting Advanced Email Test...');
  console.log('📧 Target Email:', testEmail);
  console.log('=' .repeat(50));

  try {
    // Test 1: Welcome Email
    console.log('\n📬 Test 1: Sending Welcome Email...');
    const welcomeResult = await EmailService.sendWelcomeEmail(testEmail);
    
    if (welcomeResult) {
      console.log('✅ Welcome email sent successfully!');
    } else {
      console.log('❌ Welcome email failed!');
    }

    // Wait 2 seconds between emails
    console.log('⏳ Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Blog Notification Email
    console.log('\n📝 Test 2: Sending Blog Notification Email...');
    console.log('📄 Blog Title:', mockBlogData.blogs.title);
    console.log('🏷️ Category:', mockBlogData.blogs.category);
    console.log('🔖 Tags:', mockBlogData.blogs.tags.join(', '));
    
    const blogResult = await EmailService.sendBlogNotification(testEmail, mockBlogData);
    
    if (blogResult) {
      console.log('✅ Blog notification email sent successfully!');
    } else {
      console.log('❌ Blog notification email failed!');
    }

    // Wait 2 seconds between emails
    console.log('⏳ Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Unsubscribe Email
    console.log('\n👋 Test 3: Sending Unsubscribe Email...');
    const unsubscribeResult = await EmailService.sendUnsubscribeEmail(testEmail);
    
    if (unsubscribeResult) {
      console.log('✅ Unsubscribe email sent successfully!');
    } else {
      console.log('❌ Unsubscribe email failed!');
    }

    // Summary
    console.log('\n' + '=' .repeat(50));
    console.log('📊 Test Summary:');
    console.log(`📬 Welcome Email: ${welcomeResult ? '✅ Success' : '❌ Failed'}`);
    console.log(`📝 Blog Notification: ${blogResult ? '✅ Success' : '❌ Failed'}`);
    console.log(`👋 Unsubscribe Email: ${unsubscribeResult ? '✅ Success' : '❌ Failed'}`);
    
    const successCount = [welcomeResult, blogResult, unsubscribeResult].filter(Boolean).length;
    console.log(`\n🎯 Overall Success Rate: ${successCount}/3 (${Math.round(successCount/3*100)}%)`);
    
    if (successCount === 3) {
      console.log('\n🎉 All tests passed! Check your email inbox at:', testEmail);
      console.log('💡 Remember to check spam folder if emails are not in inbox');
      console.log('📱 Test emails on different devices and email clients');
    } else {
      console.log('\n⚠️ Some tests failed. Check your email configuration and server logs.');
    }

  } catch (error) {
    console.error('❌ Error during email testing:', error);
  }
}

// Run the tests
sendTestEmails();

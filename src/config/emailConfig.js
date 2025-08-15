// Email Configuration - Centralized email branding and sender information
export const emailConfig = {
  // Branding
  brandName: 'BlogSpot',
  brandNameFull: 'BlogSpot - Technology Blog & Programming Tutorials',
  websiteUrl: 'https://blog-phcoder05.vercel.app',
  
  // Sender Information
  senderName: import.meta.env.VITE_SENDER_NAME || 'BlogSpot Team',
  senderEmail: import.meta.env.VITE_GMAIL_USER || 'your-email@gmail.com',
  senderDisplayName: import.meta.env.VITE_SENDER_DISPLAY_NAME || 'BlogSpot - Tech Blog & Programming Tutorials',
  
  // Email Subjects
  subjects: {
    welcome: '🎉 Welcome to BlogSpot - Your Tech Learning Journey Starts Here!',
    blogNotification: '📝 Fresh Content Alert: {title}',
    unsubscribe: '👋 Successfully Unsubscribed from BlogSpot',
    test: '🧪 Email Test from BlogSpot'
  },
  
  // Email Content
  content: {
    welcome: {
      title: 'Welcome to BlogSpot Community! 🚀',
      greeting: 'Hello and Welcome! 👋',
      subtitle: 'You\'ve just joined thousands of developers and tech enthusiasts!',
      description: 'Thank you for subscribing to BlogSpot newsletter. You\'ve made a great choice! Here\'s what you can expect:',
      benefits: [
        '📝 Instant notifications for new blog posts on Programming, DevOps, and Cloud Computing',
        '💡 Weekly curated content with the best development tips and tutorials',
        '🚀 Exclusive insights into emerging technologies and industry trends',
        '🎯 Practical coding examples and real-world project tutorials',
        '📚 Free resources, templates, and development tools',
        '⚡ Early access to premium content and special announcements'
      ],
      expectation: 'What to Expect Next:',
      nextSteps: [
        '📬 You\'ll receive email notifications whenever we publish new content',
        '🗓️ Weekly newsletter roundup every Sunday with our best content',
        '🎁 Occasional special offers and exclusive content for subscribers only'
      ],
      closing: 'We\'re thrilled to have you on board! Our mission is to help developers like you stay ahead of the curve with practical, actionable content.',
      signature: 'Happy Coding!\nThe BlogSpot Team',
              cta: {
          text: 'Start Reading Our Latest Posts',
          url: 'https://blog-phcoder05.vercel.app'
        }
    },
    blogPost: {
      title: 'New Blog Post Published! 📝',
      greeting: 'Hi there! 👋',
      subtitle: 'We\'ve just published a new article you might find interesting:',
      readTime: 'Estimated reading time',
      published: 'Published on',
      category: 'Category',
      tags: 'Tags',
      cta: {
        text: 'Read Full Article',
        url: '{blogUrl}'
      },
      footer: 'Don\'t miss out on future updates!'
    },
    unsubscribe: {
      title: 'You\'ve Been Unsubscribed 😢',
      message: 'We\'re sorry to see you go! You have been successfully unsubscribed from BlogSpot newsletter.',
      reasons: 'We understand that priorities change. Here are some reasons subscribers leave:',
      reasonsList: [
        'Too many emails (we send max 2-3 per week)',
        'Content not relevant (we cover Programming, DevOps, Cloud)',
        'Found what you were looking for (glad we could help!)',
        'Just cleaning up inbox (totally understandable)'
      ],
      resubscribe: 'Changed your mind? You can always resubscribe by visiting our website and signing up again.',
      thanks: 'Thank you for being part of our community! We wish you the best in your development journey.',
      signature: 'Best regards,\nThe BlogSpot Team',
      feedback: 'We\'d love your feedback on how we can improve!'
    }
  },
  
  // Footer Text
  footer: {
    newsletter: 'You\'re receiving this email because you subscribed to BlogSpot newsletter for programming and technology updates.',
    unsubscribe: 'Unsubscribe from BlogSpot newsletter',
    website: 'Visit BlogSpot Website',
    social: {
      github: 'https://github.com/phcoder05',
      twitter: 'https://twitter.com/yourusername',
      linkedin: 'https://in.linkedin.com/in/pankaj-hadole-722476232'
    }
  },
  
  // Email Styles
  styles: {
    primary: '#3b82f6',
    secondary: '#14b8a6', 
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    dark: '#1f2937',
    light: '#f8fafc',
    gradient: 'linear-gradient(135deg, #14b8a6, #3b82f6)'
  }
};

// Utility function to get formatted sender information
export const getSenderInfo = () => {
  const name = emailConfig.senderName;
  const email = emailConfig.senderEmail;
  return {
    name,
    email,
    displayName: emailConfig.senderDisplayName,
    formatted: `"${name}" <${email}>`,
    formattedLong: `"${emailConfig.senderDisplayName}" <${email}>`
  };
};

export default emailConfig;

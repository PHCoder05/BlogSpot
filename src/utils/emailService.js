// Email Service - Can be integrated with real email providers
// Currently using mock implementation for demonstration

import GmailService from './gmailService';

export class EmailService {
  
  /**
   * Send email notification to subscribers
   * @param {string} to - Recipient email
   * @param {Object} blogData - Blog post data
   * @returns {Promise<boolean>}
   */
  static async sendBlogNotification(to, blogData) {
    try {
      const emailContent = this.generateEmailContent(blogData);
      
      // Priority 1: Gmail SMTP (Good for small blogs - 500 emails/day)
      const gmailUser = process.env.REACT_APP_GMAIL_USER || 'phcoder.blog@gmail.com';
      const gmailPassword = process.env.REACT_APP_GMAIL_APP_PASSWORD;
      
      if (gmailPassword) {
        console.log('📧 Using Gmail SMTP for sending email (Good for small blogs)...');
        const gmailResult = await GmailService.sendEmail(to, emailContent.subject, emailContent.html);
        if (gmailResult) {
          console.log('✅ Email sent successfully via Gmail SMTP');
          return true;
        }
      }
      
      // Priority 2: Mock email sending for development
      console.log('📧 No email service configured, using mock email service (Development mode)...');
      console.log('📧 Sending email to:', to);
      console.log('📧 Subject:', emailContent.subject);
      console.log('📧 Content preview:', emailContent.html.substring(0, 200) + '...');
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Mock email sent successfully (Development mode)');
      console.log('💡 Tip: Set up Gmail SMTP for production emails');
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  /**
   * Generate email content for blog notification
   * @param {Object} blogData - Blog post data
   * @returns {Object} Email content with subject and HTML
   */
  static generateEmailContent(blogData) {
    const blogTitle = blogData.blogs?.title || 'New Blog Post';
    const blogExcerpt = blogData.blogs?.content?.substring(0, 150) + '...' || 'Check out our latest blog post!';
    const blogUrl = `${window.location.origin}/bloginfo/${blogData.id}`;
    const readingTime = blogData.blogs?.readingTime || '5 min read';
    const category = blogData.blogs?.category || 'Technology';
    
    const subject = `📝 New Blog Post: ${blogTitle}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Blog Post</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f8f9fa; 
          }
          .header { 
            background: linear-gradient(135deg, #14b8a6, #3b82f6); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0; 
          }
          .content { 
            background: white; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
          }
          .blog-title { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 15px; 
            color: #1f2937; 
          }
          .blog-excerpt { 
            color: #6b7280; 
            margin-bottom: 20px; 
            line-height: 1.6; 
          }
          .blog-meta { 
            display: flex; 
            gap: 20px; 
            margin-bottom: 25px; 
            font-size: 14px; 
            color: #6b7280; 
          }
          .meta-item { 
            display: flex; 
            align-items: center; 
            gap: 5px; 
          }
          .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #14b8a6, #3b82f6); 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            margin: 20px 0; 
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #e5e7eb; 
            color: #6b7280; 
            font-size: 14px; 
          }
          .unsubscribe { 
            color: #6b7280; 
            text-decoration: none; 
            font-size: 12px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">📝 New Blog Post</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Stay updated with our latest insights</p>
          </div>
          
          <div class="content">
            <div class="blog-title">${blogTitle}</div>
            
            <div class="blog-meta">
              <div class="meta-item">
                <span>📅</span>
                <span>${new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div class="meta-item">
                <span>⏱️</span>
                <span>${readingTime}</span>
              </div>
              <div class="meta-item">
                <span>🏷️</span>
                <span>${category}</span>
              </div>
            </div>
            
            <div class="blog-excerpt">${blogExcerpt}</div>
            
            <a href="${blogUrl}" class="cta-button">Read Full Article →</a>
            
            <div class="footer">
              <p>Thanks for subscribing to our newsletter!</p>
              <p>You're receiving this email because you subscribed to PHcoder updates.</p>
              <a href="#" class="unsubscribe">Unsubscribe</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return { subject, html };
  }

  /**
   * Send welcome email to new subscribers
   * @param {string} to - Recipient email
   * @returns {Promise<boolean>}
   */
  static async sendWelcomeEmail(to) {
    try {
      const subject = '🎉 Welcome to PHcoder Newsletter!';
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Our Newsletter</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              background-color: #f8f9fa; 
            }
            .header { 
              background: linear-gradient(135deg, #14b8a6, #3b82f6); 
              color: white; 
              padding: 30px; 
              text-align: center; 
              border-radius: 10px 10px 0 0; 
            }
            .content { 
              background: white; 
              padding: 30px; 
              border-radius: 0 0 10px 10px; 
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
            }
            .welcome-title { 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 15px; 
              color: #1f2937; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #e5e7eb; 
              color: #6b7280; 
              font-size: 14px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 Welcome!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">You're now part of our community</p>
            </div>
            
            <div class="content">
              <div class="welcome-title">Welcome to PHcoder Newsletter!</div>
              
              <p>Hi there! 👋</p>
              
              <p>Thank you for subscribing to our newsletter! You'll now receive:</p>
              
              <ul>
                <li>📝 Instant notifications when we publish new blog posts</li>
                <li>💡 Weekly digest of our best content</li>
                <li>🚀 Exclusive insights and tips</li>
                <li>🎯 Personalized content recommendations</li>
              </ul>
              
              <p>We're excited to share our knowledge about programming, technology, cloud computing, and software development with you!</p>
              
              <p>Stay tuned for our next update!</p>
              
              <p>Best regards,<br>The PHcoder Team</p>
             
             <div class="footer">
               <p>You can unsubscribe at any time by clicking the link below.</p>
               <a href="#" style="color: #6b7280; text-decoration: none; font-size: 12px;">Unsubscribe</a>
             </div>
           </div>
         </div>
       </body>
       </html>
     `;
     
     console.log('📧 Sending welcome email to:', to);
     
     // Try Gmail SMTP
     const gmailPassword = process.env.REACT_APP_GMAIL_APP_PASSWORD;
     if (gmailPassword) {
       return await GmailService.sendEmail(to, subject, html);
     }
     
     // Fallback to mock for development
     console.log('📧 Using mock email service for welcome email...');
     await new Promise(resolve => setTimeout(resolve, 300));
     console.log('✅ Mock welcome email sent successfully (Development mode)');
     
     return true;
   } catch (error) {
     console.error('Error sending welcome email:', error);
     return false;
   }
 }

  /**
   * Send unsubscribe confirmation email
   * @param {string} to - Recipient email
   * @returns {Promise<boolean>}
   */
  static async sendUnsubscribeEmail(to) {
    try {
      const subject = '👋 You\'ve been unsubscribed';
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Unsubscribed</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              background-color: #f8f9fa; 
            }
            .content { 
              background: white; 
              padding: 30px; 
              border-radius: 10px; 
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
              text-align: center; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #e5e7eb; 
              color: #6b7280; 
              font-size: 14px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h1 style="color: #1f2937; margin-bottom: 20px;">👋 You've been unsubscribed</h1>
              
              <p>We're sorry to see you go! You've been successfully unsubscribed from our newsletter.</p>
              
              <p>If you change your mind, you can always resubscribe by visiting our website.</p>
              
              <p>Thanks for being part of our community!</p>
              
              <div class="footer">
                <p>PHcoder Team</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      
      console.log('📧 Sending unsubscribe email to:', to);
      
      // Try Gmail SMTP
      const gmailPassword = process.env.REACT_APP_GMAIL_APP_PASSWORD;
      if (gmailPassword) {
        return await GmailService.sendEmail(to, subject, html);
      }
      
      // Fallback to mock for development
      console.log('📧 Using mock email service for unsubscribe email...');
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('✅ Mock unsubscribe email sent successfully (Development mode)');
      
      return true;
    } catch (error) {
      console.error('Error sending unsubscribe email:', error);
      return false;
    }
  }
}

export default EmailService; 
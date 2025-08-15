// Email Service - Handles email sending through backend API
// This service will send emails by making API calls to the backend
import { emailConfig } from '../config/emailConfig';

export class EmailService {
  static API_BASE_URL = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api');
  
  /**
   * Send bulk email notifications to multiple subscribers (MUCH FASTER!)
   * @param {Array} subscribers - Array of subscriber objects with email property
   * @param {Object} blogData - Blog post data
   * @returns {Promise<Object>} Bulk send results
   */
  static async sendBulkBlogNotifications(subscribers, blogData) {
    try {
      console.log(`📧 Starting bulk email notification to ${subscribers.length} subscribers...`);
      
      // Generate email content once for all subscribers
      const emailContent = this.generateBlogNotificationContent(blogData, subscribers[0]?.email || '');
      
      // Extract just the email addresses
      const emailAddresses = subscribers.map(subscriber => subscriber.email);
      
      console.log('📧 Sending bulk email through backend API...');
      
      // Send bulk email through backend API
      const response = await fetch(`${EmailService.API_BASE_URL}/email/send-bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: emailAddresses,
          subject: emailContent.subject,
          html: emailContent.html
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log(`✅ Bulk email notification sent successfully!`);
        console.log(`📊 Results: ${result.results.successful} sent, ${result.results.failed} failed`);
        return {
          success: true,
          message: result.message,
          sentCount: result.results.successful,
          failureCount: result.results.failed,
          totalCount: result.results.total,
          details: result.results.details
        };
      } else {
        console.error('❌ Failed to send bulk email notifications:', result.message);
        return {
          success: false,
          message: result.message || 'Failed to send bulk emails',
          sentCount: 0,
          failureCount: emailAddresses.length,
          totalCount: emailAddresses.length
        };
      }
      
    } catch (error) {
      console.error('❌ Error sending bulk email notifications:', error);
      return {
        success: false,
        message: 'Error sending bulk email notifications',
        sentCount: 0,
        failureCount: subscribers.length,
        totalCount: subscribers.length,
        error: error.message
      };
    }
  }
  
  /**
   * Send email notification to subscribers
   * @param {string} to - Recipient email
   * @param {Object} blogData - Blog post data
   * @returns {Promise<boolean>}
   */
  static async sendBlogNotification(to, blogData) {
    try {
      const emailContent = this.generateBlogNotificationContent(blogData, to);
      
      console.log('📧 Sending blog notification email to:', to);
      console.log('📧 Subject:', emailContent.subject);
      
      // Send email through backend API
      const response = await fetch(`${EmailService.API_BASE_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject: emailContent.subject,
          html: emailContent.html
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Blog notification email sent successfully to:', to);
        return true;
      } else {
        console.error('❌ Failed to send blog notification email to:', to, result.message);
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error sending blog notification email:', error);
      return false;
    }
  }

  /**
   * Generate email content for blog notification
   * @param {Object} blogData - Blog post data
   * @param {string} subscriberEmail - Subscriber email for unsubscribe
   * @returns {Object} Email content with subject and HTML
   */
  static generateBlogNotificationContent(blogData, subscriberEmail) {
    const blogTitle = blogData.blogs?.title || blogData.title || 'New Blog Post';
    const blogContent = blogData.blogs?.content || blogData.content || '';
    const blogExcerpt = blogContent.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
    const blogUrl = `${window.location.origin}/bloginfo/${blogData.id}`;
    const category = blogData.blogs?.category || blogData.category || 'Technology';
    const tags = blogData.blogs?.tags || blogData.tags || [];
    const publishDate = new Date(blogData.blogs?.time?.toDate?.() || blogData.time?.toDate?.() || new Date()).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Calculate reading time
    const wordCount = blogContent.replace(/<[^>]*>/g, '').split(' ').length;
    const readingTime = Math.ceil(wordCount / 200);
    
    const unsubscribeUrl = `${window.location.origin}/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`;
    
    const subject = emailConfig.subjects.blogNotification.replace('{title}', blogTitle);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #374151; 
            margin: 0; 
            padding: 0; 
            background-color: #f9fafb;
          }
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: ${emailConfig.styles.gradient}; 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0 0 10px 0; 
            font-size: 28px; 
            font-weight: 700;
          }
          .header p {
            margin: 0; 
            font-size: 16px; 
            opacity: 0.9;
          }
          .content { 
            padding: 35px 30px; 
          }
          .blog-title { 
            font-size: 26px; 
            font-weight: 700; 
            margin-bottom: 20px; 
            color: ${emailConfig.styles.dark}; 
            line-height: 1.3;
          }
          .blog-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 25px;
            padding: 15px;
            background-color: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid ${emailConfig.styles.primary};
          }
          .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #6b7280;
            font-size: 14px;
            font-weight: 500;
          }
          .blog-excerpt { 
            color: #4b5563; 
            margin-bottom: 25px; 
            font-size: 16px;
            line-height: 1.6;
            padding: 20px;
            background-color: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid ${emailConfig.styles.secondary};
          }
          .tags-section {
            margin-bottom: 25px;
          }
          .tag {
            display: inline-block;
            background-color: #e0f2fe;
            color: #0369a1;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            margin: 2px 4px 2px 0;
          }
          .cta-section {
            text-align: center;
            margin: 35px 0;
          }
          .cta-button { 
            display: inline-block; 
            background: ${emailConfig.styles.gradient}; 
            color: white !important; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 50px; 
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          }
          .footer { 
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            padding: 30px;
            text-align: center; 
            color: #6b7280; 
            font-size: 14px; 
          }
          .footer p {
            margin: 8px 0;
          }
          .social-links {
            margin: 20px 0 10px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: ${emailConfig.styles.primary};
            text-decoration: none;
            font-weight: 500;
          }
          .unsubscribe { 
            color: #9ca3af !important; 
            text-decoration: none; 
            font-size: 12px; 
            border-bottom: 1px solid #d1d5db; 
          }
          .unsubscribe:hover { 
            color: ${emailConfig.styles.danger} !important; 
            border-bottom-color: ${emailConfig.styles.danger}; 
          }
          .brand-logo {
            font-size: 20px;
            font-weight: 700;
            color: white;
            margin-bottom: 5px;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              margin: 0 10px;
            }
            .header, .content, .footer {
              padding: 20px;
            }
            .blog-title {
              font-size: 22px;
            }
            .blog-meta {
              flex-direction: column;
              gap: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="brand-logo">${emailConfig.brandName}</div>
            <h1>${emailConfig.content.blogPost.title}</h1>
            <p>${emailConfig.content.blogPost.subtitle}</p>
          </div>
          
          <div class="content">
            <div class="blog-title">${blogTitle}</div>
            
            <div class="blog-meta">
              <div class="meta-item">
                <span>📅</span>
                <span>${emailConfig.content.blogPost.published}: ${publishDate}</span>
              </div>
              <div class="meta-item">
                <span>⏱️</span>
                <span>${emailConfig.content.blogPost.readTime}: ${readingTime} min read</span>
              </div>
              <div class="meta-item">
                <span>🏷️</span>
                <span>${emailConfig.content.blogPost.category}: ${category}</span>
              </div>
            </div>
            
            ${tags.length > 0 ? `
              <div class="tags-section">
                <strong style="color: ${emailConfig.styles.dark}; margin-right: 10px;">${emailConfig.content.blogPost.tags}:</strong>
                ${tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
              </div>
            ` : ''}
            
            <div class="blog-excerpt">${blogExcerpt}</div>
            
            <div class="cta-section">
              <a href="${blogUrl}" class="cta-button">
                ${emailConfig.content.blogPost.cta.text} →
              </a>
            </div>
            
            <div style="text-align: center; margin: 25px 0; padding: 20px; background-color: #fef3c7; border-radius: 8px; color: #92400e;">
              <strong>${emailConfig.content.blogPost.footer}</strong>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Thanks for being part of ${emailConfig.brandNameFull}!</strong></p>
            <p>${emailConfig.footer.newsletter}</p>
            
            <div class="social-links">
              <a href="${emailConfig.footer.social.github}">GitHub</a> |
              <a href="${emailConfig.footer.social.twitter}">Twitter</a> |
              <a href="${emailConfig.footer.social.linkedin}">LinkedIn</a>
            </div>
            
            <p>
              <a href="${emailConfig.websiteUrl}" style="color: ${emailConfig.styles.primary}; text-decoration: none;">${emailConfig.footer.website}</a>
            </p>
            
            <p>
              <a href="${unsubscribeUrl}" class="unsubscribe">${emailConfig.footer.unsubscribe}</a>
            </p>
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
      console.log('📧 Sending welcome email to:', to);
      
      const subject = emailConfig.subjects.welcome;
      const html = this.generateWelcomeEmailHTML(to);
      
      const response = await fetch(`${EmailService.API_BASE_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          html
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Welcome email sent successfully to:', to);
        return true;
      } else {
        console.error('❌ Failed to send welcome email to:', to, result.message);
        return false;
      }
      
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  /**
   * Generate welcome email HTML
   * @param {string} to - Recipient email
   * @returns {string} HTML content
   */
  static generateWelcomeEmailHTML(to) {
    const unsubscribeUrl = `${window.location.origin}/unsubscribe?email=${encodeURIComponent(to)}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailConfig.content.welcome.title}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #374151; 
            margin: 0; 
            padding: 0; 
            background-color: #f9fafb;
          }
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: ${emailConfig.styles.gradient}; 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0 0 10px 0; 
            font-size: 32px; 
            font-weight: 700;
          }
          .header p {
            margin: 0; 
            font-size: 18px; 
            opacity: 0.9;
          }
          .content { 
            padding: 40px 30px; 
          }
          .welcome-title { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 20px; 
            color: ${emailConfig.styles.dark}; 
            text-align: center;
          }
          .subtitle {
            font-size: 18px;
            color: ${emailConfig.styles.primary};
            text-align: center;
            margin-bottom: 30px;
            font-weight: 600;
          }
          .greeting {
            font-size: 20px;
            margin-bottom: 20px;
            color: ${emailConfig.styles.dark};
          }
          .description {
            font-size: 16px;
            margin-bottom: 25px;
            color: #6b7280;
          }
          .benefits-section {
            background-color: #f8fafc;
            border-left: 4px solid ${emailConfig.styles.primary};
            padding: 25px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
          }
          .benefits-title {
            font-size: 18px;
            font-weight: 600;
            color: ${emailConfig.styles.dark};
            margin-bottom: 15px;
          }
          .benefits-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .benefits-list li {
            padding: 8px 0;
            font-size: 15px;
            color: #4b5563;
            border-bottom: 1px solid #e5e7eb;
          }
          .benefits-list li:last-child {
            border-bottom: none;
          }
          .expectations-section {
            background-color: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .expectations-title {
            font-size: 16px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 12px;
          }
          .expectations-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .expectations-list li {
            padding: 5px 0;
            font-size: 14px;
            color: #78350f;
          }
          .cta-section {
            text-align: center;
            margin: 35px 0;
          }
          .cta-button { 
            display: inline-block; 
            background: ${emailConfig.styles.gradient}; 
            color: white !important; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 50px; 
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          }
          .closing {
            font-size: 16px;
            color: #4b5563;
            margin: 25px 0;
            padding: 20px;
            background-color: #f3f4f6;
            border-radius: 8px;
            border-left: 4px solid ${emailConfig.styles.secondary};
          }
          .signature {
            font-size: 16px;
            color: ${emailConfig.styles.dark};
            margin: 25px 0;
            font-weight: 500;
          }
          .footer { 
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            padding: 30px;
            text-align: center; 
            color: #6b7280; 
            font-size: 14px; 
          }
          .footer p {
            margin: 8px 0;
          }
          .social-links {
            margin: 20px 0 10px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: ${emailConfig.styles.primary};
            text-decoration: none;
            font-weight: 500;
          }
          .unsubscribe { 
            color: #9ca3af !important; 
            text-decoration: none; 
            font-size: 12px; 
            border-bottom: 1px solid #d1d5db; 
          }
          .unsubscribe:hover { 
            color: ${emailConfig.styles.danger} !important; 
            border-bottom-color: ${emailConfig.styles.danger}; 
          }
          .brand-logo {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin-bottom: 5px;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              margin: 0 10px;
            }
            .header, .content, .footer {
              padding: 20px;
            }
            .welcome-title {
              font-size: 24px;
            }
            .header h1 {
              font-size: 28px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="brand-logo">${emailConfig.brandName}</div>
            <h1>🎉 Welcome Aboard!</h1>
            <p>${emailConfig.content.welcome.subtitle}</p>
          </div>
          
          <div class="content">
            <div class="welcome-title">${emailConfig.content.welcome.title}</div>
            
            <div class="greeting">${emailConfig.content.welcome.greeting}</div>
            
            <div class="description">${emailConfig.content.welcome.description}</div>
            
            <div class="benefits-section">
              <div class="benefits-title">🚀 What You'll Get:</div>
              <ul class="benefits-list">
                ${emailConfig.content.welcome.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
              </ul>
            </div>

            <div class="expectations-section">
              <div class="expectations-title">${emailConfig.content.welcome.expectation}</div>
              <ul class="expectations-list">
                ${emailConfig.content.welcome.nextSteps.map(step => `<li>${step}</li>`).join('')}
              </ul>
            </div>
            
            <div class="cta-section">
              <a href="${emailConfig.content.welcome.cta.url}" class="cta-button">
                ${emailConfig.content.welcome.cta.text} →
              </a>
            </div>
            
            <div class="closing">${emailConfig.content.welcome.closing}</div>
            
            <div class="signature">${emailConfig.content.welcome.signature.replace('\n', '<br>')}</div>
          </div>
          
          <div class="footer">
            <p><strong>Thanks for joining ${emailConfig.brandNameFull}!</strong></p>
            <p>${emailConfig.footer.newsletter}</p>
            
            <div class="social-links">
              <a href="${emailConfig.footer.social.github}">GitHub</a> |
              <a href="${emailConfig.footer.social.twitter}">Twitter</a> |
              <a href="${emailConfig.footer.social.linkedin}">LinkedIn</a>
            </div>
            
            <p>
              <a href="${emailConfig.websiteUrl}" style="color: ${emailConfig.styles.primary}; text-decoration: none;">${emailConfig.footer.website}</a>
            </p>
            
            <p>
              <a href="${unsubscribeUrl}" class="unsubscribe">${emailConfig.footer.unsubscribe}</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send unsubscribe confirmation email
   * @param {string} to - Recipient email
   * @returns {Promise<boolean>}
   */
  static async sendUnsubscribeEmail(to) {
    try {
      console.log('📧 Sending unsubscribe email to:', to);
      
      const subject = emailConfig.subjects.unsubscribe;
      const html = this.generateUnsubscribeEmailHTML();
      
      const response = await fetch(`${EmailService.API_BASE_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          html
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Unsubscribe email sent successfully to:', to);
        return true;
      } else {
        console.error('❌ Failed to send unsubscribe email to:', to, result.message);
        return false;
      }
      
    } catch (error) {
      console.error('Error sending unsubscribe email:', error);
      return false;
    }
  }

  /**
   * Generate unsubscribe email HTML
   * @returns {string} HTML content
   */
  static generateUnsubscribeEmailHTML() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailConfig.content.unsubscribe.title}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #374151; 
            margin: 0; 
            padding: 0; 
            background-color: #f9fafb;
          }
          .email-container { 
            max-width: 600px; 
            margin: 40px auto; 
            background-color: #ffffff;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #ef4444, #f97316); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .content { 
            padding: 40px 30px; 
            text-align: center;
          }
          .unsubscribe-title {
            font-size: 28px;
            font-weight: 700;
            color: ${emailConfig.styles.dark};
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
          }
          .reasons-section {
            background-color: #fef3c7;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
            text-align: left;
          }
          .reasons-title {
            font-size: 16px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 15px;
          }
          .reasons-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .reasons-list li {
            padding: 5px 0;
            font-size: 14px;
            color: #78350f;
          }
          .resubscribe {
            background-color: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            color: #0c4a6e;
          }
          .footer { 
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            padding: 30px;
            text-align: center; 
            color: #6b7280; 
            font-size: 14px; 
          }
          .brand-logo {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="brand-logo">${emailConfig.brandName}</div>
            <h1 style="margin: 10px 0 0 0; font-size: 32px; font-weight: 700;">👋 Goodbye for now</h1>
          </div>
          
          <div class="content">
            <div class="unsubscribe-title">${emailConfig.content.unsubscribe.title}</div>
            
            <div class="message">${emailConfig.content.unsubscribe.message}</div>

            <div class="reasons-section">
              <div class="reasons-title">${emailConfig.content.unsubscribe.reasons}</div>
              <ul class="reasons-list">
                ${emailConfig.content.unsubscribe.reasonsList.map(reason => `<li>• ${reason}</li>`).join('')}
              </ul>
            </div>
            
            <div class="resubscribe">${emailConfig.content.unsubscribe.resubscribe}</div>
            
            <p style="font-size: 16px; color: #4b5563; margin: 25px 0;">
              ${emailConfig.content.unsubscribe.thanks}
            </p>
            
            <div style="margin: 25px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
              <p style="margin: 0; font-style: italic; color: #6b7280;">
                ${emailConfig.content.unsubscribe.feedback}
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p style="font-weight: 600; margin-bottom: 15px;">${emailConfig.content.unsubscribe.signature}</p>
            <p style="margin: 5px 0;">
              <a href="${emailConfig.websiteUrl}" style="color: ${emailConfig.styles.primary}; text-decoration: none;">${emailConfig.footer.website}</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send test email
   * @param {string} to - Recipient email
   * @param {string} type - Email type ('welcome' or 'blog')
   * @param {Object} blogData - Blog data for blog notification test
   * @returns {Promise<boolean>}
   */
  static async sendTestEmail(to, type = 'welcome', blogData = null) {
    try {
      console.log(`📧 Sending ${type} test email to:`, to);
      
      if (type === 'welcome') {
        return await this.sendWelcomeEmail(to);
      } else if (type === 'blog' && blogData) {
        return await this.sendBlogNotification(to, blogData);
      } else {
        console.error('❌ Invalid test email type or missing blog data');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error sending test email:', error);
      return false;
    }
  }
}

export default EmailService;
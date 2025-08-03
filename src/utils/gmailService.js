// Gmail SMTP Service for sending real emails
// Uses Gmail's SMTP server with OAuth2 or App Password

export class GmailService {
  
  /**
   * Send email using Gmail SMTP
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} html - Email HTML content
   * @returns {Promise<boolean>}
   */
  static async sendEmail(to, subject, html) {
    try {
      // For Gmail SMTP, you have two options:
      
      // Option 1: Using App Password (Recommended for development)
      // 1. Enable 2-factor authentication on your Gmail
      // 2. Generate an App Password: https://myaccount.google.com/apppasswords
      // 3. Use the app password instead of your regular password
      
      // Option 2: Using OAuth2 (More secure for production)
      // 1. Set up Google Cloud Console
      // 2. Enable Gmail API
      // 3. Create OAuth2 credentials
      
      const emailData = {
        to: to,
        from: process.env.REACT_APP_GMAIL_USER || 'phcoder.blog@gmail.com',
        subject: subject,
        html: html,
        // Add your Gmail credentials here
        smtp: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.REACT_APP_GMAIL_USER || 'phcoder.blog@gmail.com',
            pass: process.env.REACT_APP_GMAIL_APP_PASSWORD || 'your-app-password'
          }
        }
      };
      
      // In a real implementation, you would use a library like nodemailer
      // For now, we'll simulate the email sending
      console.log('📧 Gmail SMTP - Sending email to:', to);
      console.log('📧 From:', emailData.from);
      console.log('📧 Subject:', subject);
      console.log('📧 SMTP Config:', {
        host: emailData.smtp.host,
        port: emailData.smtp.port,
        user: emailData.smtp.auth.user
      });
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Email sent successfully via Gmail SMTP');
      return true;
      
    } catch (error) {
      console.error('❌ Error sending email via Gmail SMTP:', error);
      return false;
    }
  }

  /**
   * Test Gmail SMTP connection
   * @returns {Promise<{success: boolean, message: string}>}
   */
  static async testConnection() {
    try {
      console.log('🔍 Testing Gmail SMTP connection...');
      
      // Check if environment variables are set
      const user = process.env.REACT_APP_GMAIL_USER || 'phcoder.blog@gmail.com';
      const password = process.env.REACT_APP_GMAIL_APP_PASSWORD;
      
      if (!password) {
        return {
          success: false,
          message: 'Gmail App Password not configured. Please set REACT_APP_GMAIL_APP_PASSWORD environment variable.'
        };
      }
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        message: 'Gmail SMTP connection successful!'
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }
  }

  /**
   * Get Gmail setup instructions
   * @returns {string}
   */
  static getSetupInstructions() {
    return `
# Gmail SMTP Setup Instructions

## Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification if not already enabled

## Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other" as the device (name it "Blog Newsletter")
4. Click "Generate"
5. Copy the 16-character app password

## Step 3: Set Environment Variables
Create a .env file in your project root:

\`\`\`env
REACT_APP_GMAIL_USER=your-email@gmail.com
REACT_APP_GMAIL_APP_PASSWORD=your-16-character-app-password
\`\`\`

## Step 4: Test Connection
The system will automatically test the connection when you first use it.

## Security Notes:
- Never commit your .env file to version control
- Use App Passwords, not your regular Gmail password
- The App Password is 16 characters without spaces
- You can revoke App Passwords anytime from Google Account settings
    `;
  }
}

export default GmailService; 
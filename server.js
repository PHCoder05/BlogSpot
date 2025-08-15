import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create transporter for Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Test SMTP connection endpoint
app.post('/api/email/test-smtp', async (req, res) => {
  try {
    console.log('🧪 Testing SMTP connection...');
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(400).json({
        success: false,
        message: 'Gmail credentials not configured. Please check your environment variables.',
        error: {
          code: 'MISSING_CREDENTIALS',
          details: 'GMAIL_USER and GMAIL_APP_PASSWORD are required'
        }
      });
    }

    const transporter = createTransporter();
    
    // Verify connection configuration
    await transporter.verify();
    
    console.log('✅ SMTP connection verified successfully');
    
    res.json({
      success: true,
      message: 'SMTP connection test passed! Gmail SMTP is working correctly.',
      error: null
    });
    
  } catch (error) {
    console.error('❌ SMTP connection test failed:', error);
    
    let errorMessage = 'SMTP connection failed';
    let errorDetails = {};
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Please check your Gmail credentials.';
      errorDetails = {
        code: 'AUTH_FAILED',
        message: 'Invalid username or app password',
        suggestion: 'Ensure 2FA is enabled and app password is correct'
      };
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection to Gmail SMTP server failed.';
      errorDetails = {
        code: 'CONNECTION_FAILED',
        message: 'Cannot connect to Gmail SMTP server',
        suggestion: 'Check your internet connection and firewall settings'
      };
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Connection timeout to Gmail SMTP server.';
      errorDetails = {
        code: 'TIMEOUT',
        message: 'Gmail SMTP server did not respond in time',
        suggestion: 'Try again or check your network connection'
      };
    } else {
      errorDetails = {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        stack: error.stack
      };
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: errorDetails
    });
  }
});

// Bulk email sending endpoint for faster performance
app.post('/api/email/send-bulk', async (req, res) => {
  try {
    const { emails, subject, html } = req.body;
    
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: emails (must be an array)',
        error: {
          code: 'MISSING_EMAILS',
          details: 'Emails array is required and must not be empty'
        }
      });
    }
    
    if (!subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: subject, html',
        error: {
          code: 'MISSING_FIELDS',
          details: 'Subject and HTML are required'
        }
      });
    }
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(400).json({
        success: false,
        message: 'Gmail credentials not configured',
        error: {
          code: 'MISSING_CREDENTIALS',
          details: 'GMAIL_USER and GMAIL_APP_PASSWORD are required'
        }
      });
    }
    
    console.log(`📧 Sending bulk emails to ${emails.length} recipients`);
    console.log('📧 Subject:', subject);
    
    const transporter = createTransporter();
    const senderName = process.env.SENDER_NAME || 'BlogSpot - Tech Blog & Programming Tutorials';
    
    // Send emails in parallel for maximum speed
    const emailPromises = emails.map(async (email) => {
      try {
        const mailOptions = {
          from: `"${senderName}" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: subject,
          html: html
        };
        
        const info = await transporter.sendMail(mailOptions);
        return { email, success: true, messageId: info.messageId };
      } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error.message);
        return { email, success: false, error: error.message };
      }
    });
    
    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ Bulk email completed: ${successful} sent, ${failed} failed`);
    
    res.json({
      success: true,
      message: `Bulk email sent to ${successful} recipients. ${failed > 0 ? `${failed} emails failed.` : ''}`,
      results: {
        total: emails.length,
        successful,
        failed,
        details: results
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to send bulk emails:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk emails',
      error: {
        code: 'BULK_SEND_FAILED',
        message: error.message
      }
    });
  }
});

// Send email endpoint
app.post('/api/email/send', async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    
    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, html',
        error: {
          code: 'MISSING_FIELDS',
          details: 'All email fields are required'
        }
      });
    }
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(400).json({
        success: false,
        message: 'Gmail credentials not configured',
        error: {
          code: 'MISSING_CREDENTIALS',
          details: 'GMAIL_USER and GMAIL_APP_PASSWORD are required'
        }
      });
    }
    
    console.log('📧 Sending email to:', to);
    console.log('📧 Subject:', subject);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.SENDER_NAME || 'BlogSpot - Tech Blog & Programming Tutorials'}" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    res.json({
      success: true,
      message: 'Email sent successfully!',
      error: null,
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    
    let errorMessage = 'Failed to send email';
    let errorDetails = {};
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Please check your Gmail credentials.';
      errorDetails = {
        code: 'AUTH_FAILED',
        message: 'Invalid username or app password'
      };
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection to Gmail SMTP server failed.';
      errorDetails = {
        code: 'CONNECTION_FAILED',
        message: 'Cannot connect to Gmail SMTP server'
      };
    } else {
      errorDetails = {
        code: 'SEND_FAILED',
        message: error.message
      };
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: errorDetails
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Email server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email server running on port ${PORT}`);
  console.log(`📧 SMTP Test endpoint: http://localhost:${PORT}/api/email/test-smtp`);
  console.log(`📧 Send Email endpoint: http://localhost:${PORT}/api/email/send`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️  Warning: GMAIL_USER and GMAIL_APP_PASSWORD not configured');
    console.warn('   Please create a .env file with your Gmail credentials');
  }
});

export default app;

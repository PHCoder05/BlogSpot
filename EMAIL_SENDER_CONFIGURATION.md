# Email Sender Configuration Guide

This guide explains how to configure proper email sender names and display information for your BlogSpot application.

## 🔧 Configuration Variables

Add these variables to your `.env` file:

```bash
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Email Sender Configuration
SENDER_NAME=BlogSpot - Tech Blog & Programming Tutorials
SENDER_DISPLAY_NAME=BlogSpot Team

# Frontend Configuration (optional)
VITE_SENDER_NAME=BlogSpot - Tech Blog & Programming Tutorials
VITE_SENDER_DISPLAY_NAME=BlogSpot Team
VITE_GMAIL_USER=your-email@gmail.com
```

## 📧 How Sender Names Appear

### In Email Headers (What recipients see)
```
From: "BlogSpot - Tech Blog & Programming Tutorials" <your-email@gmail.com>
Reply-To: your-email@gmail.com
```

### In Email Content
- **Header**: Shows brand name and professional title
- **Signature**: Shows team name
- **Footer**: Shows full brand information

## 🎯 Sender Name Best Practices

### ✅ Good Examples
```
BlogSpot - Tech Blog & Programming Tutorials
TechInsights - Development & Programming News
CodeMaster - Learn Programming & Web Development
```

### ❌ Avoid These
```
blogspot (too generic)
myemail@gmail.com (just email address)
Blog (too short)
```

## 🔄 Configuration Changes Made

### 1. Server Configuration (`server.js`)
- Updated default sender name to be more descriptive
- Uses `SENDER_NAME` environment variable

### 2. Email Configuration (`src/config/emailConfig.js`)
- Added `senderDisplayName` configuration
- Created `getSenderInfo()` utility function
- Centralized sender information management

### 3. Email Services Updated
- **EmailService**: Uses centralized configuration
- **RealEmailService**: Now uses proper sender info
- **SimpleSmtpService**: Updated sender format
- **NewsletterService**: Already using proper methods

## 🧪 Testing Email Sender Names

### 1. Test SMTP Connection
```bash
curl -X POST http://localhost:3000/api/email/test-smtp
```

### 2. Send Test Email
```javascript
// Frontend test
import { EmailService } from './src/utils/emailService';

await EmailService.sendBlogNotification('test@example.com', {
  blogs: { title: 'Test Post', content: 'Test content' },
  id: 'test123'
});
```

### 3. Check Email Headers
When you receive the test email, check the email headers to verify:
- From field shows your configured sender name
- Reply-To is set correctly
- No "via" or "on behalf of" warnings (if Gmail is configured properly)

## 🔍 Troubleshooting

### Problem: Emails show raw email address
**Solution**: Ensure `SENDER_NAME` is set in your `.env` file

### Problem: "Sent via Gmail" appears
**Solution**: This is normal for Gmail SMTP. To avoid this, use a custom domain email

### Problem: Emails go to spam
**Solutions**:
1. Set up SPF, DKIM, and DMARC records
2. Use a professional sender name
3. Avoid spam trigger words in subject lines

## 🚀 Advanced Configuration

### Custom Domain Setup
For professional emails without "via Gmail":

1. Get a custom domain (e.g., yourdomain.com)
2. Set up email hosting (Google Workspace, etc.)
3. Configure DNS records (SPF, DKIM, DMARC)
4. Update SMTP settings to use custom domain

### Multiple Sender Configurations
For different types of emails:

```javascript
// In emailConfig.js
export const senderConfigs = {
  newsletter: {
    name: 'BlogSpot Newsletter',
    email: 'newsletter@yourdomain.com'
  },
  support: {
    name: 'BlogSpot Support',
    email: 'support@yourdomain.com'
  },
  noreply: {
    name: 'BlogSpot (No Reply)',
    email: 'noreply@yourdomain.com'
  }
};
```

## 📝 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `SENDER_NAME` | Main sender name for emails | `BlogSpot - Tech Blog` |
| `SENDER_DISPLAY_NAME` | Display name in email content | `BlogSpot Team` |
| `GMAIL_USER` | Gmail account for SMTP | `your-email@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail app password | `abcd efgh ijkl mnop` |

## ✅ Verification Checklist

- [ ] `.env` file has proper sender configuration
- [ ] Server restarts after environment changes
- [ ] Test email shows proper sender name
- [ ] Email doesn't go to spam folder
- [ ] Reply-To header is correct
- [ ] Email signature shows team information

## 🆘 Support

If you encounter issues with email sender configuration:

1. Check server logs for SMTP errors
2. Verify Gmail app password is correct
3. Test with a simple email client first
4. Check DNS configuration if using custom domain

---

**Note**: Changes to environment variables require a server restart to take effect.

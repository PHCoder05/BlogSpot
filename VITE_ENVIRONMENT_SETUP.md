# Vite Environment Variables Setup

This guide explains how to set up environment variables for your Vite React app.

## 🔧 **Environment Variables in Vite**

Vite uses `import.meta.env` instead of `process.env` for environment variables.

### **Local Development (.env file):**

Create a `.env` file in your project root:

```env
# Gmail SMTP Configuration
VITE_GMAIL_USER=phcoder.blog@gmail.com
VITE_GMAIL_APP_PASSWORD=your-16-character-app-password
```

### **Vercel Deployment:**

Update your `vercel.json`:

```json
{
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ],
    "env": {
      "VITE_GMAIL_USER": "phcoder.blog@gmail.com",
      "VITE_GMAIL_APP_PASSWORD": "your-app-password"
    }
}
```

## 📝 **Important Notes:**

### **Vite vs React Environment Variables:**

| React (Create React App) | Vite |
|--------------------------|------|
| `process.env.REACT_APP_*` | `import.meta.env.VITE_*` |
| `REACT_APP_GMAIL_USER` | `VITE_GMAIL_USER` |
| `REACT_APP_GMAIL_APP_PASSWORD` | `VITE_GMAIL_APP_PASSWORD` |

### **Environment Variable Rules:**

1. **Must start with `VITE_`** - Only variables with this prefix are exposed to your app
2. **Case sensitive** - `VITE_GMAIL_USER` is different from `VITE_gmail_user`
3. **Restart dev server** - After adding `.env` file, restart your development server

## 🚀 **Testing the Fix:**

After setting up the environment variables:

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test newsletter subscription**:
   - Subscribe with a test email
   - Check browser console for email logs
   - Should see: `✅ Mock welcome email sent successfully (Development mode)`

3. **Test with Gmail SMTP** (if configured):
   - Should see: `✅ Email sent successfully via Gmail SMTP`

## 🔍 **Console Output Examples:**

### **Development Mode (No Gmail configured):**
```
📧 Sending welcome email to: user@example.com
📧 Using mock email service for welcome email...
✅ Mock welcome email sent successfully (Development mode)
```

### **Production Mode (With Gmail configured):**
```
📧 Sending welcome email to: user@example.com
📧 Gmail SMTP - Sending email to: user@example.com
✅ Email sent successfully via Gmail SMTP
```

## 🛠️ **Troubleshooting:**

### **If you still see "process is not defined":**
1. **Check file imports** - Make sure you're using `import.meta.env`
2. **Restart dev server** - After adding `.env` file
3. **Clear browser cache** - Hard refresh the page

### **If environment variables aren't working:**
1. **Check variable names** - Must start with `VITE_`
2. **Check file location** - `.env` must be in project root
3. **Check syntax** - No spaces around `=` in `.env` file

## ✅ **Success Checklist:**

- [ ] **Created `.env` file** with `VITE_` prefix
- [ ] **Updated `vercel.json`** with correct variable names
- [ ] **Restarted dev server** after changes
- [ ] **Tested newsletter subscription** - No more errors
- [ ] **Console shows email logs** - Mock or real emails

Your email system should now work without the "process is not defined" error! 🎉 
# Personal Blog Feature - Access Code Protection

This feature allows you to create personal blog posts that are only accessible through an access code, providing a secure way to share your thoughts and reflections with specific people.

## Features

### 🔐 Access Code Protection
- Personal blogs are protected by access codes
- Default access code: `personal2024`
- Ability to add custom access codes for different users
- Session-based access (stored in localStorage)

### 📝 Personal Blog Creation
- Toggle "Personal Blog" option when creating posts
- Personal blogs are automatically filtered from public view
- Same rich editor and features as regular blogs

### 🎯 Dedicated Personal Blog Page
- Separate `/personal-blogs` route
- Access code verification modal
- Clean, focused interface for personal thoughts
- Search and filter capabilities

### ⚙️ Admin Management
- Access code manager in admin dashboard
- Add/remove custom access codes
- Copy codes to clipboard
- View all active codes

## How to Use

### For Blog Authors

1. **Create a Personal Blog**
   - Go to Admin Dashboard → Create Blog
   - Fill in your blog content as usual
   - Toggle the "Personal Blog (Access Code Protected)" option
   - Publish your blog

2. **Manage Access Codes**
   - Go to Admin Dashboard → Access Codes
   - Add new access codes for specific users
   - Remove codes when access is no longer needed
   - Copy codes to share with users

### For Readers

1. **Access Personal Blogs**
   - Click "Personal Thoughts" in the navigation
   - Enter the access code provided by the author
   - Browse and read personal blog posts

2. **Stay Logged In**
   - Access codes are remembered for the session
   - Click "Logout" to clear access and return to public view

## Technical Details

### Access Code System
- Default code: `personal2024` (hardcoded)
- Custom codes stored in Firebase Firestore
- Session persistence using localStorage
- Secure verification process

### Data Structure
Personal blogs include an `isPersonal: true` field in the database:
```javascript
{
  blogs: {
    title: "My Personal Thoughts",
    content: "...",
    isPersonal: true,
    // ... other fields
  },
  isPersonal: true,
  // ... other fields
}
```

### Filtering
- Public blog lists automatically filter out personal blogs
- Personal blog page only shows blogs with `isPersonal: true`
- Search and filtering work within personal blog scope

## Security Features

- Access codes are not stored in plain text in the database
- Session-based access prevents unauthorized access
- Personal blogs are completely hidden from public views
- Admin-only access to code management

## Default Access Code

The default access code is `personal2024`. This code:
- Is always available
- Cannot be removed
- Provides a fallback for trusted users
- Can be shared with close friends/family

## Custom Access Codes

You can create custom access codes for:
- Different groups of people
- Temporary access
- Specific projects or topics
- Time-limited sharing

## File Structure

```
src/
├── utils/
│   └── accessCodeUtils.js          # Access code verification logic
├── components/
│   └── accessCode/
│       └── AccessCodeModal.jsx     # Access code input modal
├── pages/
│   ├── personalBlogs/
│   │   └── PersonalBlogs.jsx       # Personal blog listing page
│   └── admin/
│       └── accessCodes/
│           └── AccessCodeManager.jsx # Admin access code management
```

## Routes

- `/personal-blogs` - Personal blog listing (requires access code)
- `/access-codes` - Admin access code management (admin only)

## Future Enhancements

- Time-limited access codes
- User-specific access codes
- Access code usage analytics
- Email-based access code delivery
- Multiple access levels (read-only, comment, etc.)

## Troubleshooting

### Access Code Not Working
1. Check if the code is correct (case-sensitive)
2. Try the default code: `personal2024`
3. Contact the blog author for the correct code
4. Clear browser cache and try again

### Personal Blogs Not Showing
1. Ensure you have entered a valid access code
2. Check if the blog was marked as personal during creation
3. Try logging out and logging back in with the access code

### Admin Access Issues
1. Ensure you're logged in as the admin user
2. Check if you have the correct email permissions
3. Clear localStorage and log in again 